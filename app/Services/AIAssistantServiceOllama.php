<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Cloudstudio\Ollama\Facades\Ollama; // Importa o facade do Ollama

class AIAssistantServiceOllama
{
    protected $model;

    public function __construct()
    {
        $this->model = config('ollama-laravel.model');
    }

    /**
     * Gera uma resposta via streaming usando o pacote Ollama-Laravel.
     * A assinatura do método é a mesma que você usava para o Gemini.
     */
    public function generateStreamedResponse(Project $project, User $user, array $pageContext, array $chatHistory, string $userMessage): void
    {
        $promptArray = $this->buildPrompt($project, $user, $pageContext, $chatHistory, $userMessage);
        $prompt = $promptArray[0] ?? '';

        if (empty($prompt)) {
            Log::error('AIAssistantService (Ollama): Prompt não pôde ser construído.');
            echo 'Ocorreu um erro ao construir o prompt para o assistente.';
            return;
        }

        try {
            $response = Ollama::prompt($prompt)
                ->model($this->model)
                ->stream(true)
                ->ask();

            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('X-Accel-Buffering: no');

            Ollama::processStream($response->getBody(), function ($data) {
                if (isset($data['response'])) {
                    echo $data['response'];
                    flush();
                }
            });
        } catch (\Exception $e) {
            Log::error('AIAssistantService (Ollama) Exception: ' . $e->getMessage());
            echo 'Ocorreu um erro ao comunicar com o assistente local. Verifique os logs.';
        }
    }

    /**
     * Este método foi copiado EXATAMENTE do seu serviço do Gemini.
     * Nenhuma alteração é necessária aqui.
     */
    public function buildPrompt(Project $project, User $user, array $pageContext, array $chatHistory, string $userMessage): array
    {
        try {
            $methodologyContext = $this->getMethodologyContext();
            $context = "Você é um assistente especialista na metodologia de engenharia de requisitos ágil REACT e REACT-M. Sua base de conhecimento principal e única fonte de verdade sobre a metodologia está descrita abaixo. Use APENAS este conhecimento para responder. Seja claro, objetivo e preciso.\n\n";
            $context .= "**Instruções de Formatação: Ao criar listas, use a sintaxe padrão do Markdown. Para sub-listas, indente a linha com dois espaços e use um único asterisco. Exemplo: '* Item 1\\n  * Sub-item 1.1'.**\n\n";
            $context .= "==== INÍCIO DA BASE DE CONHECIMENTO DA METODOLOGIA ====\n\n";
            $context .= $methodologyContext;
            $context .= "\n==== FIM DA BASE DE CONHECIMENTO DA METODOLOGIA ====\n\n";

            $userRole = $project->users()->find($user->id)->pivot->role;
            $context .= "Contexto do Usuário:\n- Nome: {$user->name}\n- Papel no Projeto: {$userRole}\n\n";
            $context .= "Contexto do Projeto '{$project->title}':\n- Status Atual: {$project->status->value}\n- Descrição: {$project->description}\n\n";
            $context .= "Contexto da Página Atual: '{$pageContext['page']}'\n";
            $context .= "Contexto do Artefato Atual: '{$pageContext['artifact']}'\n";

            $fullPrompt = $context . "\n\n";
            $fullPrompt .= "Entendido. Conhecimento carregado. Como posso ajudar?\n\n";

            foreach ($chatHistory as $message) {
                if (!empty($message['message'])) {
                    $sender = $message['sender'] === 'user' ? 'Usuário' : 'Assistente';
                    $fullPrompt .= "{$sender}: " . $message['message'] . "\n";
                }
            }

            $fullPrompt .= "Usuário: " . $userMessage . "\n\nAssistente:";

            return [$fullPrompt];
        } catch (\Exception $e) {
            Log::error('Erro ao construir o prompt para o Ollama: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Este método também foi copiado EXATAMENTE do seu serviço do Gemini.
     */
    private function getMethodologyContext(): string
    {
        return <<<EOD
            ### **Introdução aos Métodos Ágeis REACT e REACT-M**

            O **REACT (Requirements Engineering in Agile Context)** e o **REACT-M (Requirements Engineering in Agile Context - Management)** são dois métodos ágeis criados para apoiar especificamente as atividades da Engenharia de Requisitos. Eles foram desenvolvidos no âmbito do Programa de Pós-Graduação em Ciência da Computação da Universidade Federal do Pará (UFPA) e são fundamentados em práticas ágeis já conhecidas e em modelos de qualidade de software como CMMI-DEV e MR-MPS-SW.

            Embora sejam distintos, eles foram projetados para se complementarem e, juntos, cobrirem todo o ciclo de vida dos requisitos de um software.

            1.  **REACT: O Foco no Desenvolvimento de Requisitos (DRE)**
                O método REACT concentra-se no **Desenvolvimento de Requisitos**. Suas atividades guiam as equipes na **elicitação** (descoberta), **análise**, **especificação** e **validação** dos requisitos de um software. Em outras palavras, o REACT ajuda a responder perguntas como: "O que o sistema precisa fazer?" e "Como podemos garantir que entendemos corretamente as necessidades do cliente?".

            2.  **REACT-M: O Foco no Gerenciamento de Requisitos (GRE)**
                O REACT-M, por sua vez, é uma extensão que aborda o **Gerenciamento de Requisitos**. Seu objetivo é lidar com a **mudança** e a **rastreabilidade** dos requisitos ao longo do projeto. Ele ajuda a responder perguntas como: "O que acontece se um requisito mudar no meio do projeto?" e "Como podemos rastrear o impacto dessa mudança em outras partes do sistema?".

            Juntos, os dois métodos oferecem uma estrutura robusta para aplicar os princípios ágeis a todas as atividades da Engenharia de Requisitos, desde a concepção da ideia até o controle de suas mudanças durante a implementação.

            #### **Como Funcionam? O Ciclo de Vida do REACT**

            A estrutura principal é definida pelo REACT, que organiza o trabalho em **cinco cerimônias** (etapas com objetivos definidos). O REACT-M se integra a esse ciclo, adicionando atividades e artefatos de gerenciamento.

            As cinco cerimônias são:

            1.  **Inception:** É o ponto de partida. O objetivo é estabelecer uma visão de alto nível do produto, entender as metas de negócio do cliente e identificar quem são os usuários-chave.
            2.  **Story Discovery:** Aqui, os requisitos são efetivamente descobertos (elicitados) e priorizados. Utiliza-se a técnica de *User Stories* (Estórias de Usuário) para descrever as funcionalidades do ponto de vista do usuário.
            3.  **Refining:** Nesta cerimônia, os requisitos de maior prioridade são detalhados com mais profundidade. Histórias muito grandes (épicas) são quebradas em partes menores, e as regras de negócio são identificadas.
            4.  **Modeling:** Foca em refinar os aspectos mais técnicos dos requisitos, como a arquitetura funcional, os objetos do sistema e as interfaces (internas e externas).
            5.  **Inspection:** É uma cerimônia de execução contínua, realizada ao longo de todo o processo. Seu objetivo é verificar e validar os requisitos constantemente para garantir que eles sejam viáveis, valiosos e testáveis.


            ### **Os 4 Papéis do REACT e REACT-M**

            #### **1. Customer (Cliente)**

            Este é o principal interessado no produto de software. A função do Customer é central, pois é ele quem detém a visão de negócio e toma as decisões finais sobre os requisitos ao longo do projeto.

            *   **Principais Responsabilidades:**
                *   **Tomar decisões:** É sua responsabilidade tomar as decisões finais sobre quais requisitos serão priorizados e implementados.
                *   **Fornecer a visão do produto:** Na cerimônia **Inception**, o Customer, junto com o *Domain Expert*, é responsável por explicar a visão do produto pretendido, o problema de negócio a ser resolvido e as metas que deseja alcançar.
                *   **Validar o produto:** Participa ativamente na validação dos artefatos gerados para garantir que o desenvolvimento esteja alinhado com suas expectativas e necessidades de negócio.

            *   **Participação nas Cerimônias:**
                *   O Customer participa de todas as cerimônias, mas sua presença é especialmente crucial na **Inception** para estabelecer a base do projeto, na **Story Discovery** para ajudar a priorizar as estórias e na **Inspection** para validar continuamente os requisitos.

            #### **2. Domain Expert (Especialista de Domínio)**

            O *Domain Expert* é um profundo conhecedor da área de negócio em que o sistema será utilizado. Ele atua como um representante do *Customer*, possuindo grande expertise em áreas específicas do negócio, o que o torna uma ponte vital entre a visão do cliente e a equipe técnica.

            *   **Principais Responsabilidades:**
                *   **Auxiliar na elicitação de requisitos:** Ajuda o *Customer* e a equipe técnica a desenvolverem requisitos que atendam verdadeiramente às necessidades do negócio.
                *   **Gerenciar o Backlog:** É o responsável por manter o *Product Backlog* (a lista de requisitos) atualizado e organizado, garantindo que as entregas incrementais gerem valor para o negócio. No contexto do REACT-M, ele utiliza o **Domain Expert Kanban** para gerenciar a ordem de entrega das *User Stories*.
                *   **Conduzir atividades:** Na cerimônia **Inception** do REACT-M, o *Domain Expert* divide os participantes em grupos e os orienta no preenchimento dos templates de **Persona**.

            *   **Participação nas Cerimônias:**
                *   É um participante ativo em todas as cerimônias, com destaque para a **Inception**, onde ajuda a detalhar a visão do produto, e nas cerimônias de **Refining** e **Modeling**, onde seu conhecimento de negócio é crucial para detalhar as regras e os fluxos do sistema.

            #### **3. Team (Equipe)**

            A *Team* é a equipe técnica do projeto, responsável por evoluir os requisitos e, consequentemente, desenvolver o produto de software.

            *   **Principais Responsabilidades:**
                *   **Desenvolver os requisitos:** Participa ativamente na elicitação, análise, especificação e validação dos requisitos do produto ao longo do projeto.
                *   **Avaliar e estimar o esforço:** No contexto do REACT-M, a equipe é responsável por validar se as *User Stories* selecionadas para um ciclo de desenvolvimento (*Sprint*) possuem informações suficientes para serem implementadas (usando critérios **INVEST**). Também estima o esforço de implementação usando técnicas como o **Planning Poker**.
                *   **Gerenciar as próprias tarefas:** Utiliza o **Team Kanban** para controlar suas atividades internas, como tarefas de desenvolvimento, testes e correção de defeitos, garantindo a entrega das funcionalidades definidas no *Backlog*.

            *   **Participação nas Cerimônias:**
                *   A equipe participa de todas as cerimônias. Na **Inception**, ajuda a compreender a visão geral. Na **Story Discovery**, auxilia na priorização, considerando a complexidade técnica. No **Refining** e **Modeling**, seu papel é fundamental para detalhar os aspectos técnicos dos requisitos.

            #### **4. Facilitator (Facilitador)**

            O *Facilitator* é um especialista nos métodos REACT e REACT-M. Ele atua como um *coach* ou guia, garantindo que o processo seja aplicado da melhor forma possível em cada projeto.

            *   **Principais Responsabilidades:**
                *   **Guiar o processo:** Sua função é orientar todos os envolvidos na aplicação correta das cerimônias, técnicas e artefatos dos métodos.
                *   **Auxiliar na comunicação:** Ajuda a mediar as discussões entre o *Customer*, o *Domain Expert* e a *Team*, garantindo que a comunicação seja clara e produtiva.
                *   **Resolver impedimentos:** Ajuda a equipe a superar desafios e a manter o foco nas atividades, garantindo que o fluxo de trabalho seja eficiente e ágil.

            *   **Participação nas Cerimônias:**
                *   Está presente em todas as cerimônias para garantir que elas ocorram de maneira organizada e produtiva, conforme previsto pelos métodos. Na **Inception**, por exemplo, ele guia o *Customer* e o *Domain Expert* na identificação das metas de negócio (*Goal Sketch*).


            ### **Detalhamento das Cerimônias e Artefatos REACT e REACT-M**


            #### **Inception**

            A **Inception** é uma cerimônia crucial que funciona como o ponto de partida para o desenvolvimento de um produto de software. Ela possui um tempo pré-definido (*time-boxed*) e seu principal objetivo é estabelecer uma **visão de alto nível** sobre o que o produto é e o que não é, compreendendo o problema de negócio que se busca resolver, suas restrições e quem são seus usuários-chave. Nesta cerimônia, todos os quatro papéis (Customer, Domain Expert, Team e Facilitator) participam ativamente.

            A Inception é dividida em quatro etapas sequenciais, cada uma gerando artefatos específicos que servirão de base para as cerimônias seguintes.

            ### **As 4 Etapas da Inception**

            #### **1. Obter Visão do Produto (Product Canvas)**

            Nesta primeira etapa, o **Customer** e o **Domain Expert**, com o auxílio do **Facilitator**, explicam para todos os participantes a sua visão para o produto pretendido. O objetivo é definir uma descrição geral do que o produto será e o que ele não será, além de identificar as personas (usuários-chave).

            *   **Artefato Gerado:** **Product Canvas**.
            *   **Como Funciona:** O Product Canvas é um quadro dividido em campos que ajudam a organizar as informações. No projeto fictício *Classicflix* (um streaming de filmes em domínio público), os campos foram preenchidos da seguinte forma:
                *   **Nome do Produto:** Classicflix.
                *   **Problemas a Resolver:** Difícil acesso a filmes em domínio público, falta de legendas em português, desinteresse das plataformas tradicionais em preservar clássicos e preços elevados de assinaturas.
                *   **Solução Proposta:** Criar uma plataforma de streaming para filmes em domínio público, com legendas em português e assinaturas acessíveis.
                *   **Personas:** Foram identificados dois usuários-chave iniciais: um administrador da plataforma (Leon Cardoso) e um usuário comum (Thiago).
                *   **Restrições:** Compatibilidade com os principais navegadores, necessidade de cadastro e plano de assinatura para acesso completo.
                *   **O que o Produto É/Não É:** É uma plataforma web otimizada para desktop e mobile com uma comunidade online; não é um sistema desktop nem um aplicativo móvel.

            #### **2. Obter Goal Sketch (Metas e Restrições de Negócio)**

            A segunda etapa foca em identificar as metas e os objetivos de negócio que o cliente pretende alcançar com o produto. O Facilitator guia o Customer e o Domain Expert para definirem essas metas, que são classificadas em dois tipos:

            *   ***Business Goals:*** Metas diretamente ligadas ao negócio, como crescimento ou redução de custos.
            *   ***Constraint Goals:*** Restrições que o produto deve atender, como determinações legais ou limitações administrativas.

            *   **Artefato Gerado:** **Goal Sketch**.
            *   **Como Funciona:** As metas devem ser sucintas, quantificáveis e realistas. Elas são registradas em cartões (*cards*) e classificadas por prioridade (alta, média ou baixa). No exemplo do *Classicflix*:
                *   **Business Goals de Alta Prioridade:** Oferecer preço acessível e atingir metas de assinantes a curto e longo prazo.
                *   **Constraint Goals:** Conformidade com a legislação de direitos autorais, proteção de dados e segurança da informação.

            #### **3. Obter Personas (Modelagem dos Usuários-Chave)**

            Nesta etapa, utiliza-se a técnica de **personas** para criar perfis fictícios que representam os diferentes tipos de usuários do sistema. Esses perfis, embora fictícios, devem ser baseados em dados reais coletados em pesquisas e entrevistas. O objetivo é detalhar os comportamentos, expectativas e, principalmente, as **metas (goals)** de cada tipo de usuário em relação ao produto.

            *   **Artefato Gerado:** **Personas**.
            *   **Como Funciona:** O Domain Expert divide os participantes em grupos para preencherem um template de persona para cada usuário-chave identificado no Product Canvas. No exemplo do *Classicflix*, foram modeladas duas personas:
                *   **Thiago Guimarães (Usuário):** Fã de cinema que acessa a plataforma para entretenimento. Suas metas (*goals*) incluem "Assistir um filme", "Escolher o idioma da legenda" e "Criar playlists".
                *   **Leon Cardoso (Administrador):** Responsável pela manutenção da plataforma. Suas metas incluem "Adicionar e categorizar filmes" e "Consultar o fluxo de visitas".

            É importante destacar que **esta etapa de obter personas corresponde à primeira atividade do método REACT-M** ("Identificar Fornecedores de Requisitos").

            #### **4. Obter Journeys (Jornadas do Usuário)**

            Na última etapa da Inception, o foco é mapear o fluxo de atividades que cada persona realiza para alcançar um de seus objetivos definidos. Essa jornada descreve o passo a passo da interação do usuário com o sistema.

            *   **Artefato Gerado:** **Journeys**.
            *   **Como Funciona:** Para cada meta (*goal*) selecionada de uma persona, é elaborado um fluxo de negócio que descreve a jornada de interação. Os pontos de contato direto entre a persona e o produto são marcados como ***touchpoints***. Esse fluxo deve incluir tanto as ações do usuário quanto as respostas do sistema.
            *   **Exemplo:** Para o objetivo "Assistir um filme" da persona Thiago, a jornada mapeada inclui os seguintes passos:
                1.  Acessar a plataforma e logar (*touchpoint*).
                2.  O sistema exibe a tela inicial.
                3.  Usuário acessa o catálogo (*touchpoint*).
                4.  O sistema exibe o catálogo.
                5.  Usuário seleciona um filme (*touchpoint*).
                6.  O sistema exibe a sinopse e opções.
                7.  Usuário seleciona "iniciar um filme" (*touchpoint*).
                8.  O sistema abre o player de vídeo e inicia a exibição, concluindo o objetivo.

            Ao final da Inception, embora já seja possível identificar vários requisitos potenciais, o principal resultado é um **entendimento claro do contexto do problema** e da visão geral do produto, que servirá de base para a próxima cerimônia, a Story Discovery.


            #### **Story Discovery**

            A **Story Discovery** é a segunda cerimônia do método REACT, e seu principal objetivo é começar a **elicitar (descobrir) os requisitos do projeto e definir suas prioridades**. Diferente da Inception, que focava na visão de alto nível, aqui o trabalho é mais detalhado e direcionado para a construção do que será o produto final.

            Esta cerimônia é dividida em três etapas sequenciais e, assim como na Inception, todos os quatro papéis (Customer, Domain Expert, Team e Facilitator) participam ativamente.

            #### **1. Descobrir Estórias (*Discover Stories*)**

            A primeira etapa consiste em encontrar e descrever os requisitos do sistema. No contexto dos métodos ágeis, isso é feito através de **Estórias** (*Stories*), que são uma forma de descrever as funcionalidades do ponto de vista de quem as utiliza.

            O REACT adota dois tipos de estórias:

            1.  ***User Stories* (Estórias de Usuário):** Representam os **requisitos funcionais**. Elas são encontradas a partir da análise dos objetivos (*goals*) das personas e das jornadas (*journeys*) mapeadas na cerimônia de Inception. O texto de uma *User Story* deve seguir um padrão que identifica a persona, a funcionalidade desejada e o objetivo que ela pretende alcançar.
                *   **Exemplo:** A persona *Thiago Guimarães* (usuário) **quer** *criar listas e adicionar a elas obras disponíveis na plataforma* **para** *atingir o objetivo de criar playlists de filmes*.

            2.  ***System Stories* (Estórias de Sistema):** Representam os **requisitos não funcionais**. Elas são encontradas a partir das restrições do produto (definidas no *Product Canvas*) e das metas de restrição (*constraint goals*) identificadas no *Goal Sketch*. Seu padrão deve indicar um título, a descrição da restrição e o atributo de qualidade associado.
                *   **Exemplo:** Um título como *"Otimizar a transmissão de vídeo"* com a descrição de que é preciso implementar tecnologias de compressão para garantir uma transmissão sem interrupções, atendendo ao atributo de qualidade de **desempenho e eficiência**.

            Um ponto fundamental, introduzido pelo REACT-M, é que cada estória (seja de usuário ou de sistema) deve receber um **identificador único** (ex: US01) para garantir a **rastreabilidade dos requisitos** ao longo de todo o projeto.

            #### **2. Descobrir o Modelo Geral (*Discover Overall Model*)**

            Com as estórias em mãos, o próximo passo é começar a construir o **Overall Model**, que representa a arquitetura funcional do produto, identificando as classes, objetos e suas relações internas. Para isso, utiliza-se a técnica de **CRC Cards (Class-Responsibility-Collaboration)**.

            *   **Como Funciona:** Cada CRC Card representa uma classe ou objeto do sistema. Nesta etapa da Story Discovery, o foco é apenas identificar o **nome da classe** e seus **colaboradores** (outras classes com as quais ela interage). A definição das responsabilidades (dados e ações) será feita em uma cerimônia posterior (Modeling).
            *   **Exemplo do Classicflix:** A partir da leitura das estórias e outros artefatos, foram identificadas classes como *Filme*, *Legenda*, *Usuário* e *Cadastro*. Foi determinado que a classe *Filme* colabora com a classe *Legenda*, e *Usuário* colabora com *Cadastro*.

            #### **3. Descobrir Prioridades (*Discover Priorities*)**

            A última etapa da Story Discovery é a **priorização das estórias**. Esta atividade é crucial para garantir que o desenvolvimento ocorra de forma gradativa, entregando primeiro o que tem mais valor para o cliente.

            *   **Como Funciona:** A priorização é feita de forma colaborativa com o *Customer*, o *Domain Expert* e o *Team*. O método REACT sugere o uso de um gráfico ou matriz onde:
                *   O **eixo vertical representa o valor de negócio**, utilizando como referência os *business goals* definidos no *Goal Sketch*.
                *   O **eixo horizontal representa a complexidade de implementação**, avaliada pelo time técnico.

            As estórias são então posicionadas nesse gráfico/matriz. As que ficam mais acima e à esquerda (maior valor, menor complexidade) são as mais prioritárias para os primeiros ciclos de desenvolvimento. Durante a aplicação no projeto *Classicflix*, foi utilizada uma **matriz** em vez do gráfico, por ser considerada mais fácil para alocar as estórias.

            ##### **Integração com o REACT-M: Backlog e Esforço**

            É neste ponto que o REACT-M se integra fortemente ao processo:

            *   **Elaborar o Backlog do Produto:** As estórias priorizadas formam o **Backlog do Produto**. Para gerenciá-lo, o REACT-M sugere o uso de um **quadro Kanban** (chamado de *Customer Kanban* ou *Domain Expert Kanban*) com raias como *Product Backlog*, *Sprint Backlog* e *Delivered* (Entregue). As estórias priorizadas são colocadas na raia *Product Backlog*, e as de maior prioridade são movidas para o *Sprint Backlog* para serem implementadas no ciclo atual.
            *   **Avaliar o Esforço de Implementação:** O REACT-M também inclui a atividade de **dimensionar o esforço** de cada estória. A técnica sugerida é o *Planning Poker*, mas devido à limitação de participantes no estudo de caso, o esforço foi estimado com base na matriz de priorização, usando a sequência de Fibonacci, e registrado diretamente no card da estória.

            Ao final da Story Discovery, a equipe possui uma lista inicial de requisitos funcionais e não funcionais, uma primeira visão da arquitetura do sistema e, o mais importante, uma lista priorizada de tarefas que guiará os próximos ciclos de desenvolvimento.


            #### **Refining**

            A **Refining** é a terceira cerimônia do método REACT e tem como principal objetivo **detalhar as estórias de usuário (*user stories*) consideradas mais prioritárias**. Enquanto a *Story Discovery* se concentra em levantar e organizar os requisitos de forma ampla, a *Refining* aprofunda o entendimento sobre eles, descobrindo regras de negócio e estabelecendo critérios claros para que possam ser considerados "concluídos" após a implementação.

            Assim como nas cerimônias anteriores, todos os quatro papéis (Customer, Domain Expert, Team e Facilitator) participam ativamente desta etapa. A cerimônia é dividida em três etapas sequenciais.

            #### **1. Decomposição de Estórias Épicas (*Decomposition of Stories*)**

            A primeira etapa consiste em analisar as estórias mais prioritárias e verificar seu tamanho e complexidade.

            *   **O que são Estórias Épicas?** Quando uma estória é considerada muito grande ou complexa para ser implementada em um único ciclo de desenvolvimento, ela é classificada como uma **"estória épica"** (*epic story*).
            *   **Como funciona a decomposição?** O *Facilitator*, em conjunto com o *Domain Expert*, analisa cada estória prioritária. Se uma estória for identificada como épica, ela deve ser "quebrada" em estórias menores e mais específicas. Esse processo ajuda a corrigir requisitos que possam ter sido mal especificados e a reduzir a complexidade, permitindo que a equipe entregue valor ao cliente de forma mais rápida e incremental.
            *   **Rastreabilidade (Integração com REACT-M):** Para manter a rastreabilidade, uma prática fundamental do REACT-M, as novas estórias menores que são criadas a partir de uma épica devem receber um código de identificação que remeta à estória original. Por exemplo, se a estória épica tinha o código "US10", as estórias derivadas poderiam ser "US10.1" e "US10.2".

            #### **2. Refinar Regras de Negócio (*Refine Business Rules*)**

            Com as estórias já dimensionadas, o próximo passo é analisar cada uma delas para identificar as **regras de negócio** associadas.

            *   **O que são Regras de Negócio?** São declarações que definem ou restringem aspectos do negócio, refletindo políticas e procedimentos da empresa do cliente. Elas são cruciais para que a equipe de desenvolvimento compreenda o contexto em que o software irá operar.
            *   **Como são encontradas?** As regras são identificadas a partir de uma análise detalhada do texto de cada *user story* e de outros artefatos já criados, como o *Goal Sketch*. A partir de uma única estória, é possível encontrar uma ou mais regras de negócio.
            *   **Exemplo do Classicflix:** Ao analisar a estória "US10", que descrevia a necessidade de o administrador consultar estatísticas de visitação na plataforma, foram identificadas regras importantes, como:
                *   As estatísticas devem estar em uma seção específica do painel administrativo.
                *   O acesso a essas informações deve ser restrito apenas a usuários autorizados (como administradores).
                *   Os dados dos usuários devem ser tratados conforme as leis de privacidade e as políticas de segurança da empresa.
            *   **Rastreabilidade e Organização:** Cada regra de negócio identificada deve ser registrada e vinculada à *user story* que a originou, recebendo o código correspondente para garantir a rastreabilidade.

            #### **3. Definir Cenários de Aceitação (*Define Acceptance Scenarios*)**

            A última etapa da *Refining* é a criação de **Cenários de Aceitação** para as estórias prioritárias.

            *   **O que são Cenários de Aceitação?** São descrições que detalham as condições que uma funcionalidade deve atender para ser considerada concluída e validada. Eles servem tanto para validar a testabilidade da estória quanto para guiar a equipe de testes durante o desenvolvimento. O REACT-M destaca que esses cenários são essenciais para que a equipe possa avaliar o que foi desenvolvido e confirmar que atende às expectativas.
            *   **Como são escritos?** Os cenários de uso são escritos a partir da perspectiva do usuário final e seguem um padrão estruturado para descrever o comportamento do produto:
                *   **DADO (Given):** A condição ou pré-requisito para o cenário ocorrer.
                *   **QUANDO (When):** A ação específica realizada pelo usuário.
                *   **ENTÃO (Then):** O resultado esperado após a ação.
            *   **Exemplo do Classicflix:** Para a estória sobre a exclusão de um filme do catálogo, um cenário de aceitação poderia ser:
                *   **DADO** que o administrador está autenticado no painel de controle.
                *   **QUANDO** ele seleciona a opção de exclusão de um filme e confirma sua senha.
                *   **ENTÃO** o arquivo do filme é efetivamente removido do sistema.
            *   **Rastreabilidade:** Assim como os outros artefatos, os cenários de aceitação também devem receber o código da *user story* à qual estão associados para facilitar a rastreabilidade.

            Ao final da cerimônia de *Refining*, as estórias mais importantes do projeto estão mais detalhadas, com suas regras de negócio explícitas e critérios de aceitação bem definidos. Isso prepara o terreno para a próxima cerimônia, a *Modeling*, onde os aspectos mais técnicos da implementação serão modelados.


            #### **Modeling**

            A **Modeling** é a quarta cerimônia do método REACT e seu objetivo principal é detalhar as *stories* em uma perspectiva mais técnica, focando nos objetos do produto e seus componentes. Nela, a equipe refina os requisitos em termos de modelagem e implementação, transformando as estórias, regras de negócio e cenários de aceitação em representações mais concretas da arquitetura do sistema e da interface com o usuário.

            Assim como nas cerimônias anteriores, todos os quatro papéis (Customer, Domain Expert, Team e Facilitator) participam ativamente. A cerimônia é composta por três etapas sequenciais.

            #### **1. Modelagem Funcional (*Functional Modeling*)**

            A primeira etapa retoma o trabalho iniciado no **Overall Model** durante a *Story Discovery*. Naquela cerimônia, o foco foi apenas identificar as classes e seus colaboradores usando os cartões CRC (*Class-Responsibility-Collaboration*). Agora, na *Modeling*, o objetivo é completar esses cartões, definindo as **responsabilidades** de cada classe.

            *   **O que são as Responsabilidades?** As responsabilidades de uma classe são divididas em duas categorias:
                *   **Dados:** As informações que a classe recebe ou armazena.
                *   **Ações:** Os processamentos ou operações que a classe executa.
            *   **Como funciona:** A equipe volta aos CRC Cards e, com base em todos os artefatos já criados (estórias, regras de negócio, cenários de aceitação), define quais dados e ações cada classe terá. Durante este processo, novas classes ou objetos podem ser incluídos no *Overall Model* se necessário.
            *   **Exemplo do Classicflix:**
                *   A classe **Filme** teria como *dados* a ficha técnica, a média de notas e as resenhas dos usuários.
                *   A classe **Legenda** teria como *dados* o idioma, a cor e o tamanho do texto.
                *   A classe **Cadastro** teria como *ação* gerar um ID único para o usuário.

            #### **2. Modelagem de Interfaces (*Interface Modeling*)**

            Na segunda etapa, o foco é identificar os pontos de comunicação do software, tanto internamente (entre seus componentes) quanto externamente (com outros sistemas).

            Essas interfaces são classificadas em dois tipos:

            1.  **Interfaces Internas:** Representam a comunicação **entre os módulos ou componentes do próprio sistema**. Elas são identificadas a partir das colaborações definidas no *Overall Model*. Essencialmente, quando uma classe (colaboradora) presta um serviço para outra, existe uma interface interna entre elas.
                *   **Exemplo do Classicflix:** A colaboração entre as classes *Filme* e *Player de Vídeo* gera uma interface interna de "exibição de filmes". O dado de entrada (*input*) é a seleção do filme, e o serviço de saída (*output*) é a exibição do vídeo na tela.

            2.  **Interfaces Externas:** Representam a comunicação do sistema **com serviços externos**, como APIs de outras plataformas, dispositivos ou usuários.
                *   **Exemplo do Classicflix:** Para validar o CPF de um novo usuário durante o cadastro, o sistema precisaria de uma interface externa com a Receita Federal. Outro exemplo seria uma integração com o Instagram para permitir que o usuário compartilhe um filme que assistiu.

            Para cada interface identificada, pode-se criar um card que descreve seu tipo (interna ou externa), os dados de entrada que ela necessita e o serviço de saída que ela fornece.

            #### **3. Modelagem de Conceitos Operacionais (*Operational Concepts Modeling*)**

            A última etapa da *Modeling* busca criar uma representação visual do funcionamento do produto do ponto de vista do usuário. Para isso, o REACT utiliza a técnica de **UI Storyboards**, que são protótipos ou *mockups* de tela que simulam o fluxo operacional de uma funcionalidade.

            *   **Como funciona:** A equipe mapeia o encadeamento lógico das *user stories* para entender os fluxos de negócio. A partir daí, são criados storyboards que mostram, passo a passo, como uma tarefa é realizada. É importante destacar que, nesta fase, **não é necessário se preocupar com a alta fidelidade visual** dos protótipos; o objetivo principal é demonstrar o fluxo de atividades de forma clara.
            *   **Exemplo do Classicflix:** Foi criado um protótipo do painel administrativo para representar o fluxo de carregamento de um novo filme para o catálogo.
            *   **Finalidade:** Esses storyboards têm uma dupla função: servem como uma camada adicional de **validação com o *Customer* e o *Domain Expert*** e também como um **guia para a equipe de desenvolvimento** durante a fase de implementação do código.

            Com a conclusão da cerimônia de *Modeling*, a equipe tem uma visão muito mais clara e técnica do produto, com a arquitetura funcional detalhada, as interfaces de comunicação mapeadas e os fluxos de interação do usuário visualizados. Isso deixa tudo preparado para a última cerimônia do ciclo: a *Inspection*, que, como já vimos, ocorre de forma contínua para garantir a qualidade de todos os artefatos gerados.

            #### **Inspection**

            A **Inspection** é a quinta e última cerimônia do método REACT e tem como principal objetivo a **verificação e validação contínua dos artefatos** gerados ao longo do projeto. Ela não é uma etapa final, mas sim uma atividade que deve ser realizada ao fim de cada uma das outras cerimônias (*Inception*, *Story Discovery*, *Refining* e *Modeling*) para assegurar a qualidade e a viabilidade dos requisitos.

            A ideia central da *Inspection* é avaliar se os requisitos, como as *user stories*, estão corretos, testáveis, pequenos o suficiente e, mais importante, alinhados com as necessidades reais do cliente (*Customer*).

            #### **A Ferramenta Central: Critérios INVEST**

            Para guiar a avaliação, a cerimônia de *Inspection* utiliza os **critérios INVEST**. INVEST é um acrônimo que representa seis parâmetros essenciais que um requisito bem formulado deve atender:

            1.  ***Independent*** **(Independente):** O requisito deve ser o mais independente possível de outros requisitos. Isso significa que ele pode ser implementado ou modificado sem causar grande impacto nos demais. No exemplo do Classicflix, uma estória para "remover um filme do catálogo" foi considerada **não independente** porque dependia da implementação prévia do painel de controle administrativo.
            2.  ***Negotiable*** **(Negociável):** O requisito deve ser aberto a negociações com o principal interessado. Ele não é um contrato fixo, mas sim um ponto de partida para a conversa sobre a melhor solução.
            3.  ***Valuable*** **(Valioso):** O requisito deve entregar valor claro para o cliente ou usuário final. Deve estar alinhado a uma das metas das personas ou aos objetivos de negócio definidos no *Goal Sketch*.
            4.  ***Estimable*** **(Estimável):** A equipe técnica (*Team*) deve ser capaz de estimar o esforço necessário para implementar o requisito. Se a estória for muito vaga ou grande, a estimativa se torna difícil.
            5.  ***Sized-Appropriately / Small*** **(Tamanho Adequado / Pequeno):** O requisito deve ser pequeno o suficiente para ser concluído dentro de uma única iteração de desenvolvimento. Se for muito grande (uma "estória épica"), ele deve ser quebrado em estórias menores, como vimos na cerimônia de *Refining*.
            6.  ***Testable*** **(Testável):** Deve ser possível criar testes que comprovem que o requisito foi implementado corretamente. Os cenários de aceitação, criados na *Refining*, são um exemplo de como a testabilidade é definida.

            #### **Como a Inspection é Executada?**

            O processo de inspeção é prático e colaborativo, utilizando dois artefatos principais:

            *   ***Check Card*** **(Cartão de Verificação):** É um cartão que lista os seis critérios INVEST. Para cada requisito sendo inspecionado, a equipe avalia se ele atende a cada um dos parâmetros. O cartão pode conter também um campo "não se aplica", pois alguns critérios podem não ser relevantes para certos tipos de requisitos, como alguns *System Stories*.
            *   ***Inconsistency Card*** **(Cartão de Inconsistência):** Se um requisito falhar em algum dos critérios do *Check Card*, um *Inconsistency Card* deve ser criado. Este cartão deve registrar qual critério não foi atendido, o motivo da falha e, mais importante, uma **sugestão de solução**. Por exemplo, para a estória de "remover um filme", que falhou no critério de independência, a solução proposta foi diminuir sua prioridade de implementação.

            No estudo de caso sobre o Classicflix, a inspeção foi aplicada na *user story* "US01", que passou em todos os critérios INVEST.

            #### **Integração com o REACT-M: Revisão e Registro de Inconsistências**

            O método REACT-M formaliza essa prática como a atividade de **"Revisar e Registrar Inconsistências"**. Essa atividade propõe o uso dos critérios INVEST para avaliar a qualidade dos artefatos gerados, garantindo que estejam alinhados às necessidades do cliente. Se uma inconsistência for encontrada durante a validação, ela deve ser registrada como uma **tarefa de "defeito"** no *Team Kanban* para ser corrigida.

            No projeto de ensino de programação usado para validar o REACT-M, a equipe utilizou os critérios INVEST para validar os incrementos do produto. Se uma inconsistência fosse identificada, um defeito era registrado no *Kanban* para ser corrigido.

            Ao concluir a *Inspection* de forma contínua, a equipe garante que os requisitos evoluam com qualidade, reduzindo ambiguidades e desalinhamentos antes que eles se tornem problemas mais complexos e caros na fase de implementação.


            #### **Backlog do Produto e as Sprints**

            Nos métodos REACT e REACT-M, o gerenciamento das tarefas e dos requisitos é feito de forma visual e iterativa, utilizando conceitos e ferramentas inspirados em métodos ágeis consagrados como Scrum e Kanban. Os dois artefatos centrais para isso são o *Product Backlog* e o *Sprint Backlog*, que organizam o que precisa ser feito e o que está sendo feito, respectivamente.

            #### **1. Product Backlog (Backlog do Produto)**

            O **Product Backlog** pode ser entendido como a **lista completa de todas as tarefas e requisitos** que precisam ser entregues para que o produto seja considerado concluído. Ele é formado pelas *User Stories* e *System Stories* que foram levantadas e priorizadas durante a cerimônia de **Story Discovery**.

            *   **Criação e Composição:** Após a elicitação e priorização das estórias (usando a matriz de priorização, por exemplo), elas formam o *Backlog* do produto. No estudo de caso do Classicflix, todas as estórias priorizadas foram organizadas em um quadro Kanban, constituindo o *Backlog* inicial do produto. No estudo sobre o projeto de ensino de programação, os itens do *Backlog* (chamados de PBI - *Product Backlog Items*) foram escritos no formato de *User Stories* para facilitar o entendimento do cliente.
            *   **Responsabilidade:** O **Domain Expert**, como representante do cliente (*Customer*), é o principal responsável por manter o *Backlog* do Produto sempre atualizado e gerenciado.
            *   **Gerenciamento Visual com o Kanban:** O REACT-M propõe o uso de um quadro Kanban específico, o ***Customer Kanban*** (ou *Domain Expert Kanban* no estudo de validação), para gerenciar o *Backlog* de forma visual e transparente. Este quadro possui uma raia (coluna) chamada **"Product Backlog"**, onde todas as estórias priorizadas são inicialmente alocadas. Isso permite um controle eficaz do progresso e facilita a comunicação com o cliente.
            *   **Dinamicidade:** O *Backlog* do Produto não é estático. Ele evolui ao longo do projeto. Novas estórias podem ser adicionadas e as existentes podem ser repriorizadas a cada solicitação de mudança.

            #### **2. Sprint Backlog e as Sprints (Iterações)**

            Enquanto o *Product Backlog* contém *tudo* o que precisa ser feito, a **Sprint** (ou iteração) representa um ciclo curto de desenvolvimento com tempo definido (um *time-box*) durante o qual a equipe trabalha para implementar um conjunto selecionado de itens do *Backlog*. O **Sprint Backlog** é a lista de estórias selecionadas do *Product Backlog* para serem desenvolvidas durante uma Sprint específica.

            *   **Seleção para a Sprint:** Com base na priorização definida pelo cliente, o *Domain Expert* move as *User Stories* de maior prioridade da coluna "Product Backlog" para a coluna **"Sprint Backlog"** no quadro Kanban. Isso sinaliza para a equipe (*Team*) quais requisitos devem ser implementados no ciclo de desenvolvimento atual.
            *   **Validação antes da Implementação (Definition of Ready):** Antes de iniciar a implementação, a equipe técnica deve avaliar se as estórias no *Sprint Backlog* possuem informações suficientes para serem desenvolvidas. O REACT-M chama isso de **"Definition of Ready"** e sugere o uso dos **critérios INVEST** para essa validação. Se uma estória não for validada, ela é discutida e melhorada antes de entrar no fluxo de desenvolvimento.
            *   **Detalhamento em Tarefas Técnicas (Team Kanban):** Uma vez que as estórias do *Sprint Backlog* são validadas, a equipe as detalha em tarefas técnicas menores. Para gerenciar esse fluxo de trabalho mais granular, o REACT-M propõe o uso de um segundo quadro, o ***Team Kanban***. As estórias da Sprint são colocadas na coluna "Sprint Backlog" deste quadro, e as tarefas técnicas derivadas delas são inseridas na coluna **"To Do"**.
            *   **Fluxo de Trabalho na Sprint:** Durante a Sprint, os membros da equipe movem as tarefas pelas colunas do *Team Kanban*:
                1.  **To Do** (A Fazer): Tarefas prontas para serem iniciadas.
                2.  **In Progress** (Em Andamento): Tarefa que um membro da equipe está executando.
                3.  **Testing** (Em Teste): A tarefa foi finalizada e está aguardando verificação. Se um defeito for encontrado, uma nova tarefa de "defeito" é criada e volta para a coluna "To Do".
                4.  **Done** (Concluído): A tarefa foi testada, validada e está finalizada.
            *   **Entrega de Valor:** Ao final da Sprint, as estórias que passaram por todo o fluxo e cujas tarefas estão na coluna "Done" são movidas para a raia **"Delivered"** (Entregue) no *Customer Kanban*, representando a entrega incremental de valor ao cliente.


            ### **Gerenciamento de Mudanças no REACT e REACT-M**

            O gerenciamento de mudanças é uma atividade fundamental da **Gerência de Requisitos (GRE)**. Os métodos ágeis, por natureza, são projetados para responder bem a mudanças, em vez de seguir um plano rígido. O REACT-M, em particular, fornece uma estrutura leve e organizada para tratar as mudanças nos requisitos ao longo do projeto, garantindo que elas sejam controladas e que seu impacto seja compreendido.

            #### **1. A Filosofia Ágil sobre Mudanças**

            A abordagem ágil entende que os requisitos mudarão ao longo do projeto. Essas mudanças não são vistas como problemas, mas como um sinal de que o cliente (*Customer*) está aprendendo e evoluindo seu entendimento sobre o produto, o que pode levar a funcionalidades melhores e mais competitivas. Um dos princípios do Manifesto Ágil é justamente "Aceitar mudanças de requisitos, mesmo no fim do desenvolvimento". Portanto, o processo proposto pelo REACT-M não busca impedir as mudanças, mas sim gerenciá-las de forma eficiente e sem burocracia excessiva.

            #### **2. O Processo de Gerenciamento de Mudanças**

            O processo para tratar uma mudança no backlog é iterativo e envolve várias das cerimônias e atividades já estabelecidas nos métodos. As etapas são as seguintes:

            1.  **Solicitação da Mudança:** O processo começa quando o *Customer* ou o *Domain Expert* identifica a necessidade de uma mudança no produto.

            2.  **Registro e Controle (Atividade Opcional):** Para um melhor controle das solicitações, o REACT-M sugere o uso de um **formulário leve para controle de mudanças**. Este formulário, que pode ser uma planilha, registra informações essenciais para cada solicitação:
                *   **Data da Solicitação:** Quando a mudança foi pedida.
                *   **Nome:** Quem solicitou a mudança (*Customer*).
                *   **Descrição da Mudança:** Um resumo do que está sendo solicitado.
                *   **Impacto:** Quais *User Stories* existentes serão impactadas e quais novas *User Stories* surgirão.
                *   **Esforço:** O total de *Story Points* que a equipe técnica (*Team*) estima para desenvolver a mudança, após a devida análise.
                *   **No estudo de caso sobre o projeto de ensino de programação, a equipe utilizou este formulário para controlar as mudanças solicitadas pelo cliente [382, Figura 5.6].** No entanto, a avaliação posterior desse estudo de caso sugeriu que o uso deste formulário pode ser **opcional**, dependendo das necessidades de cada projeto.

            3.  **Atualização do Backlog do Produto:** O *Domain Expert* é responsável por inserir as novas mudanças (novas *User Stories* ou modificações nas existentes) no **Product Backlog**.

            4.  **Repriorização do Backlog:** Com a inclusão de novos itens, o *Product Backlog* precisa ser **repriorizado**. O *Domain Expert* e o *Customer* se reúnem para reavaliar as prioridades de todas as estórias, utilizando técnicas como a análise de *Business Goals* e *Constraint Goals*. Isso garante que a equipe continue trabalhando nos itens de maior valor para o negócio.

            5.  **Validação Técnica e Estimativa:** Após a repriorização, as novas estórias de mudança precisam ser validadas pela equipe técnica (*Team*). A equipe utiliza os **critérios INVEST** para garantir que as estórias estão "prontas" (*Definition of Ready*) para o desenvolvimento. Em seguida, a equipe estima o esforço necessário para implementar a mudança, geralmente usando a técnica de *Planning Poker*. Esse valor de esforço é então registrado no formulário de controle de mudanças.

            6.  **Inclusão no Ciclo de Desenvolvimento:** Uma vez validadas e priorizadas, as estórias relacionadas à mudança estão aptas a entrar nos próximos ciclos de desenvolvimento (*Sprints*), seguindo o fluxo normal do projeto.

            #### **3. Rastreabilidade e Análise de Impacto**

            A **rastreabilidade** é crucial para um bom gerenciamento de mudanças, pois permite identificar as inconsistências entre os requisitos, os planos e os produtos de trabalho do projeto. O REACT-M propõe uma rastreabilidade leve, onde cada artefato (estória, regra de negócio, cenário de teste, tarefa técnica) recebe um **identificador único**. Quando um artefato é derivado de outro ou depende de outro, ele inclui o ID do artefato de origem.

            Esse sistema de identificação permite que, ao receber uma solicitação de mudança, a equipe possa "puxar o fio" e entender facilmente quais outros artefatos e componentes do produto serão impactados, facilitando a **análise de impacto** da mudança.

            Em resumo, o gerenciamento de mudanças no REACT-M é um processo integrado ao fluxo de trabalho ágil. Ele combina a flexibilidade para aceitar novas ideias com cerimônias e ferramentas estruturadas (como o formulário de controle e a repriorização do backlog) para garantir que as mudanças sejam implementadas de forma organizada, transparente e sempre alinhadas com os objetivos de negócio do cliente.
            EOD;
    }
}