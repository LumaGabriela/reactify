import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, SendHorizontal, LoaderCircle } from 'lucide-react'
import OpenAI from 'openai'
import ReactMarkdown from 'react-markdown'

const ChatBot = ({ project, currentPage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: 'Olá! 👋 Como posso te ajudar hoje sobre o sistema?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatBodyRef = useRef(null)

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  const toggleChat = () => {
    // Ao abrir, limpa o histórico da sessão anterior.
    // if (!isOpen) {
    //     setMessages([]);
    // }
    setIsOpen((prevState) => !prevState)
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !project.id) return

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      created_at: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputMessage('')
    setIsLoading(true)

    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content')

      const response = await fetch(route('chat.store', project.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          message: userMessage.message,
          page_context: currentPage,
          history: newMessages.map((m) => ({
            sender: m.sender,
            message: m.message,
          })), // Envia o histórico
        }),
      })

      if (!response.ok) {
        throw new Error('A resposta da rede não foi bem-sucedida.')
      }
      const aiMessageId = `ai-${Date.now()}`
      const placeholderMessage = {
        id: aiMessageId,
        message: '',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }
      // const aiResponse = await response.json()

      // const formattedAiResponse = {
      //   ...aiResponse,
      //   text: aiResponse.message,
      // }

      setMessages((prevMessages) => [...prevMessages, placeholderMessage])

      //leitor do corpo da respost
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        console.log(chunk)
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, message: msg.message + chunk }
              : msg,
          ),
        )
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage = {
        id: `temp-error-${Date.now()}`,
        message:
          'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  //usando gpt
  //   const METHODOLOGY_CONTEXT = `
  // As cerimônias do REACT e REACT-M são etapas estruturadas para o desenvolvimento e gerenciamento de requisitos de software. Ambos os métodos buscam entregar um produto de maior qualidade. O REACT foca no desenvolvimento de requisitos, que inclui a elicitação, análise, especificação e validação, enquanto o REACT-M aborda o gerenciamento de requisitos, com foco em mudanças e rastreabilidade. O REACT-M é uma extensão do REACT, compartilhando as mesmas cerimônias e papéis, mas adicionando atividades específicas de gerenciamento.

  // A seguir, a descrição de cada cerimônia e seus artefatos:

  // * **1. Inception**
  //     * **Objetivo**: É a primeira cerimônia, realizada no início do projeto, com o objetivo principal de **estabelecer uma visão de alto nível do produto pretendido**, definindo o que ele é e o que não é, o problema de negócio que busca resolver, suas restrições e seus usuários-chave ou fornecedores de requisitos. Pode ser repetida dependendo das mudanças no projeto ou antes de cada entrega.
  //     * **Artefatos Gerados**: Product Canvas, Goal Sketch, Personas, Journeys.

  // * **2. Story Discovery**
  //     * **Objetivo**: **Elicitar estórias de usuário (requisitos funcionais) e estórias do sistema (requisitos não-funcionais)** a partir dos objetivos das personas e das jornadas de usuário, e das restrições e metas de negócio. Também visa conceber um Overall Model e iniciar a priorização dos requisitos.
  //     * **Artefatos Gerados**: Estórias de Usuário e do Sistema, Overall Model (com CRC Cards), Matriz de Priorização, Product Backlog (Kanban), Team Kanban, Check Card e Inconsistency Card (da Inspection).

  // * **3. Refining**
  //     * **Objetivo**: **Detalhamento e elaboração das estórias mais prioritárias**, refinando-as com suas regras de negócio, decompondo estórias grandes e definindo cenários de aceitação (comportamentos do produto na visão dos usuários finais).
  //     * **Artefatos Gerados**: Estórias refinadas (com suas derivadas), Regras de Negócio, Cenários de Aceitação.

  // * **4. Modeling**
  //     * **Objetivo**: Detalhar as Stories sob a perspectiva de objetos do produto e de seus componentes, refinando o Overall Model com mais detalhes. Também envolve a **representação do funcionamento operacional do produto** e seus componentes usando UI Storyboards.
  //     * **Artefatos Gerados**: Overall Model refinado (CRC Cards com responsabilidades), Interfaces Internas e Externas, UI Storyboards/Protótipos.

  // * **5. Inspection**
  //     * **Objetivo**: É uma cerimônia de **execução contínua**, com o objetivo de **verificar e validar a viabilidade e a qualidade dos requisitos elicitados e artefatos derivados**.
  //     * **Artefatos Gerados**: Check Card e Inconsistency Card, Formulário de Controle de Mudanças (REACT-M).

  // ### Backlog do Produto (Product Backlog)
  // O Backlog do Produto é uma lista de tarefas formada pelas estórias de usuário e do sistema que foram levantadas e priorizadas. O Domain Expert é o responsável por manter esse Backlog atualizado. A priorização é feita com base no valor de negócio e na complexidade.

  // ### Sprints
  // Sprints são ciclos curtos e iterativos de desenvolvimento. As cerimônias de Story Discovery, Refining, Modeling e Inspection acontecem de forma iterativa dentro das sprints. O Team gerencia suas tarefas técnicas usando o Team Kanban e estima o esforço com User Story Points (Planning Poker).

  // ### Tratamento de Mudanças
  // Quando mudanças são identificadas, o Backlog deve ser atualizado e repriorizado. Todo o ciclo de cerimônias do REACT-M deve ser executado novamente para contemplar a mudança.
  // `

  // try {
  //   const apiKey = import.meta.env.VITE_HF_TOKEN
  //   if (!apiKey) {
  //     throw new Error('Chave VITE_HF_TOKEN não encontrada.')
  //   }

  //   const openai = new OpenAI({
  //     baseURL: 'https://router.huggingface.co/v1',
  //     apiKey: apiKey,
  //     dangerouslyAllowBrowser: true,
  //   })

  //   // 1. Mensagem de sistema com a base de conhecimento da metodologia
  //   const systemMessage = {
  //     role: 'system',
  //     content: `Você é um assistente especialista na metodologia de engenharia de requisitos ágil REACT e REACT-M. Sua única fonte de verdade é o texto a seguir. Use APENAS este conhecimento para responder. Seja claro e objetivo.\n\n--- INÍCIO DA BASE DE CONHECIMENTO ---\n${METHODOLOGY_CONTEXT}\n--- FIM DA BASE DE CONHECIMENTO ---`,
  //   }

  //   // 2. Mapeia o histórico da conversa atual
  //   const conversationMessages = newMessages.map((msg) => ({
  //     role: msg.sender === 'user' ? 'user' : 'assistant',
  //     content: msg.message,
  //   }))

  //   // 3. Combina a instrução de sistema com a conversa
  //   const apiMessages = [systemMessage, ...conversationMessages]

  //   const response = await openai.chat.completions.create({
  //     model: 'openai/gpt-oss-120b:cerebras',
  //     messages: apiMessages,
  //   })

  //   const aiResponseContent = response.choices[0].message.content

  //   const aiResponseMessage = {
  //     id: 'ai-' + Date.now(),
  //     sender: 'ai',
  //     message: aiResponseContent,
  //     created_at: new Date().toISOString(),
  //   }

  //   setMessages((prev) => [...prev, aiResponseMessage])
  // } catch (error) {
  //   console.error('Erro ao chamar API da Hugging Face:', error)
  //   const errorMessage = {
  //     id: `temp-error-${Date.now()}`,
  //     text: 'Ocorreu um erro ao enviar sua mensagem. Verifique o console.',
  //     sender: 'ai',
  //     created_at: new Date().toISOString(),
  //   }
  //   setMessages((prevMessages) => [...prevMessages, errorMessage])
  // } finally {
  //   setIsLoading(false)
  // }
  // }
  const cleanAIMarkdown = (text) => {
    if (!text) return ''

    // PASSO 1 (NOVO): Normalizar o "non-breaking space" (o culpado mais provável)
    // O regex /\u00A0/g encontra todas as ocorrências do caractere non-breaking space
    // (código Unicode \u00A0) e o substitui por um espaço normal.
    let correctedText = text.replace(/\u00A0/g, ' ')

    // PASSO 2 (ANTIGO): Corrigir a sintaxe de sub-listas (continua útil)
    correctedText = correctedText.replace(/^\s*\*\s+\*/gm, '  *')

    return correctedText
  }
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-[calc(4.5rem)] right-5 w-96 max-w-md h-[35rem] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-40"
            role="dialog"
          >
            <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-t-lg">
              <h3 id="chat-heading" className="text-base font-semibold">
                Assistente Virtual
              </h3>
              {/* REMOVIDO: Botão de lixeira */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="size-5 hover:bg-primary/80"
              >
                <X className="size-5" />
              </Button>
            </header>

            <main
              ref={chatBodyRef}
              className="flex-1 text-sm font-normal p-4 overflow-y-auto bg-background flex flex-col gap-4"
            >
              {messages.map((message) => {
                const formattedMessage =
                  message.sender !== 'user'
                    ? cleanAIMarkdown(message.message)
                    : message.message
                return (
                  <div
                    key={message.id}
                    className={`flex relative gap-2.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg text-left px-3 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      {/* MODIFICADO: A propriedade 'text' agora é adicionada localmente. A original é 'message' */}
                      <div
                        className={`${message.sender === 'user' ? ' text-primary-foreground' : 'text-secondary-foreground'} prose text-foreground prose-sm`}
                      >
                        <ReactMarkdown>{formattedMessage}</ReactMarkdown>
                      </div>
                    </div>
                    <span
                      style={{
                        clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                      }}
                      className={`absolute bottom-0 size-3 block translate-y-1/2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground -rotate-45 translate-x-1/2' : 'bg-secondary text-secondary-foreground rotate-45 -translate-x-1/2'}`}
                    />
                  </div>
                )
              })}
              {isLoading && (
                <div className="flex items-center gap-2.5 justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 flex items-center">
                    <LoaderCircle className="animate-spin size-4" />
                  </div>
                </div>
              )}
            </main>

            <div className="p-4 border-t border-border bg-card rounded-b-lg">
              <div className="flex items-center space-x-2">
                <Input
                  disabled={isLoading}
                  type="text"
                  placeholder="Digite sua pergunta..."
                  className="flex-1"
                  value={inputMessage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSendMessage()
                    }
                  }}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button
                  disabled={isLoading}
                  size="icon"
                  aria-label="Enviar mensagem"
                  onClick={handleSendMessage}
                >
                  <SendHorizontal className="size-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleChat}
        size="icon"
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full shadow-lg transition-transform transform hover:scale-110 z-50"
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <MessageSquare className="h-8 w-8" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </>
  )
}

export default ChatBot
