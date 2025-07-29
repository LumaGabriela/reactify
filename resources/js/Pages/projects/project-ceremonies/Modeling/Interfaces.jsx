const Interfaces = () => {
  const modelData = [
    {
      id: 'C01',
      title: 'Filme',
      attributes: [
        'Ficha Técnica',
        'Média de notas dos usuários',
        'Resenhas e comentários dos usuários',
      ],
      relations: ['Categoria de Filme', 'Legenda'],
    },
    {
      id: 'C02',
      title: 'Legenda',
      attributes: ['Idioma', 'Cor', 'Tamanho'],
      relations: ['Filme', 'Player de Vídeo'],
    },
    {
      id: 'C03',
      title: 'Player de Vídeo',
      attributes: [
        'Controle de resolução',
        'Controle de volume',
        'Botão iniciar/pausar',
        'Botão avançar vídeo',
        'Botão retroceder vídeo',
        'Botão tela cheia',
      ],
      relations: ['Filme', 'Legenda'],
    },
    {
      id: 'C04',
      title: 'Categoria de Filme',
      attributes: [
        'Gênero de filme',
        'Ano de lançamento',
        'Mais assistidos',
        'Maiores notas',
      ],
      relations: ['Filme', 'Administrador'],
    },
    {
      id: 'C05',
      title: 'Usuário',
      attributes: [
        'Editar perfil',
        'Seguir usuário',
        'Fazer requisição',
        'ID de usuário',
        'Playlists',
        'Resenhas',
        'Notas',
        'Seguidores',
      ],
      relations: ['Cadastro', 'Perfil de Usuário', 'Assinatura', 'Doação'],
    },
    {
      id: 'C06',
      title: 'Perfil de Usuário',
      attributes: [
        'Foto de perfil',
        'Nome de usuário',
        'ID usuário',
        'Biografia do usuário',
        'Últimos filmes assistidos',
        'Filmes favoritos',
        'Últimas resenhas ou comentários',
      ],
      relations: ['Usuário', 'Cadastro'],
    },
    {
      id: 'C07',
      title: 'Cadastro',
      attributes: [
        'E-mail',
        'Senha',
        'CPF',
        'Nome de usuário',
        'ID de usuário',
      ],
      relations: ['Usuário'],
    },
    {
      id: 'C08',
      title: 'Assinatura',
      attributes: ['Plano', 'Forma de Pagamento'],
      relations: ['Usuário', 'Cadastro'],
    },
  ]
  const internalInterfaces = [
    {
      title: 'Interface de Exibição de Filmes',
      input: 'seleção de exibição de um filme do catálogo',
      output: 'exibição do filme',
      id: 'INTERFACE INTERNA 01',
      relations: 'C01-C03',
    },
  ]

  const externalInterfaces = [
    {
      title: 'Interface de Integração com Instagram',
      input: 'permissão de acesso à conta de usuário.',
      output:
        'publicação de “story” no perfil do usuário, publicação de “post” no perfil do usuário.',
      id: 'INTERFACE EXTERNA 01',
    },
    {
      title: 'Interface de Integração com a Receita Federal',
      input: 'CPF do usuário.',
      output: 'validação do CPF, validação de dados pessoais.',
      id: 'INTERFACE EXTERNA 02',
    },
    {
      title: 'Interface de Integração com os Correios',
      input: 'CEP do usuário.',
      output: 'endereço do usuário.',
      id: 'INTERFACE EXTERNA 03',
    },
  ]

  const InterfaceCard = ({ data }) => {
    const relationIds = data.relations ? data.relations.split('-') : []
    const relatedClasses = relationIds
      .map((id) => modelData.find((item) => item.id === id))
      .filter(Boolean)

    return (
      <div className="border border-border bg-card text-card-foreground rounded-lg shadow-md p-4 flex flex-col justify-between text-left">
        <div>
          <h4 className="font-bold text-sm mb-2">{data.title}</h4>
          <p>
            <span className="font-bold text-sm">Input: </span>
            <span className="text-sm text-muted-foreground ">
              {' '}
              {data.input}
            </span>
          </p>
          <p>
            <span className="font-bold text-sm">Output: </span>
            <span className="text-sm text-muted-foreground ">
              {' '}
              {data.output}{' '}
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button variant="secondary" className="">
            {data.id}
          </Button>
          {data.relations && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-sm font-semibold">
                  {data.relations}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Classes Relacionadas</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  {relatedClasses.map((classData) => (
                    <div key={classData.id} className="border p-4 rounded-lg">
                      <h4 className="font-bold">
                        {classData.id}: {classData.title}
                      </h4>
                      <ul className="list-disc list-inside mt-2">
                        {classData.attributes.map((attr, i) => (
                          <li key={i}>{attr}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Interfaces Internas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {internalInterfaces.map((item, index) => (
          <InterfaceCard key={index} data={item} />
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-4">Interfaces Externas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {externalInterfaces.map((item, index) => (
          <InterfaceCard key={index} data={item} />
        ))}
      </div>
    </div>
  )
}

export default Interfaces
