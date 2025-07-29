const OverallModel = () => {
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

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelData.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg shadow-lg flex flex-col text-muted-foreground"
          >
            <div className="flex justify-between items-center text-foreground bg-muted p-3 rounded-t-lg border-border border-b">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span className="text-sm font-bold ">{item.id}</span>
            </div>
            <div className="flex flex-grow">
              <div className="w-2/3 p-3">
                <ul className="list-disc list-inside text-sm space-y-1">
                  {item.attributes.map((attr, i) => (
                    <li key={i}>{attr}</li>
                  ))}
                </ul>
              </div>
              <div className="w-1/3 bg-muted/50 p-3 border-l border-border rounded-r-lg flex flex-col justify-center">
                <ul className="text-sm space-y-1">
                  {item.relations.map((rel, i) => (
                    <li key={i} className="font-medium">
                      {rel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverallModel
