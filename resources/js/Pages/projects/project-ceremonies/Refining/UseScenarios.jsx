const UseScenarios = () => {
  const scenarios = [
    {
      id: 'US14',
      userStory:
        'Eu como Leon Cardoso quero uma opção de exclusão de filmes do catálogo da plataforma no painel de controle administrativo para remover um filme do catálogo.',
      scenario: {
        title: 'Administrador quer excluir um filme do catálogo',
        given:
          'que o Administrador está autenticado no painel de controle administrativo da plataforma.',
        when: 'o Administrador seleciona a opção de exclusão para um filme do catálogo.',
        then1:
          'o sistema exibe uma mensagem de confirmação solicitando a confirmação da exclusão.',
        and: 'o Administrador Cardoso confirma a exclusão.',
        then2:
          'uma mensagem de é exibida indicando que o filme foi removido com sucesso.',
      },
    },
  ]

  return (
    <div className="p-4">
      {scenarios.map((scenarioData) => (
        <div
          key={scenarioData.id}
          className="bg-card border border-border rounded-lg p-4 mb-6 shadow-lg"
        >
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-semibold text-sm text-primary">
              {scenarioData.id}
            </p>
            <p className="font-semibold text-sm">{scenarioData.userStory}</p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem
              value="item-1"
              className="border bg-muted text-muted-foreground rounded-lg px-4"
            >
              <AccordionTrigger className="font-semibold text-sm">
                AS: {scenarioData.scenario.title}
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <ul className="list-disc pl-5 space-y-2 text-sm text-left">
                  <li>
                    <span className="font-semibold">GIVEN</span>{' '}
                    {scenarioData.scenario.given}
                  </li>
                  <li>
                    <span className="font-semibold">WHEN</span>{' '}
                    {scenarioData.scenario.when}
                  </li>
                  <li>
                    <span className="font-semibold">THEN</span>{' '}
                    {scenarioData.scenario.then1}
                  </li>
                  <li>
                    <span className="font-semibold">AND</span>{' '}
                    {scenarioData.scenario.and}
                  </li>
                  <li>
                    <span className="font-semibold">THEN</span>{' '}
                    {scenarioData.scenario.then2}
                  </li>
                </ul>
                <div className="text-right text-sm font-semibold mt-4">
                  {scenarioData.id}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  )
}

export default UseScenarios
