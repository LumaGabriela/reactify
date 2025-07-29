const EpicStories = ({ project, setProject }) => {
  const epicStory = {
    id: 'US10',
    title: 'Gerenciamento de Perfil de Usuário',
    description:
      'Eu como Leon Cardoso quero uma seção no painel de controle administrativo que exibe estatísticas, gráficos ou tabelas de visitas à plataforma para consultar o fluxo de visitas à plataforma.',
    userStories: [
      {
        id: 'US10.1',
        title:
          'Eu como Leon Cardoso. quero uma seção no painel de controle administrativo que gere gráficos ou tabelas com os dados do fluxo de visitas à plataforma para consultar o fluxo de visitas à plataforma.',
      },
      {
        id: 'US10.2',
        title:
          'Eu como Leon Cardoso quero uma seção no painel de controle administrativo que exibe o número de acessos totais e uma média aritmética de acessos diários para consultar o fluxo de visitas à plataforma.',
      },
    ],
  }

  return (
    <div className="p-4">
      <div className="bg-card border border-primary rounded-lg p-4 mb-6 shadow-lg">
        <h3 className="text-sm font-bold text-primary mb-2">{epicStory.id}</h3>
        <p className="text-foreground text-sm">{epicStory.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {epicStory.userStories.map((story, index) => (
          <div
            key={story.id}
            className="bg-muted rounded-lg p-4 border border-border"
          >
            <h4 className="font-semibold text-foreground mb-1 text-sm">
              {story.id}
            </h4>
            <p className="text-sm text-muted-foreground">{story.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default EpicStories
