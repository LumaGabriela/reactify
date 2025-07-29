const BusinessRules = () => {
  const businessRules = {
    id: 'US10',
    description: 'Esta é uma User Story',
    userStories: [
      {
        id_rn: 'RN01',
        title:
          'Esta é uma regra de negócio identificada através da User Story US10.',
        id_us: 'US10',
      },
      {
        id_rn: 'RN02',
        title:
          'Esta é outra regra de negócio identificada através da User Story US10',
        id_us: 'US10',
      },
    ],
  }

  return (
    <div className="p-4">
      <div className="bg-card border border-primary rounded-lg p-4 mb-6 shadow-lg">
        <h3 className="text-sm font-bold text-primary mb-2">
          {businessRules.id}
        </h3>
        <p className="text-foreground text-sm">{businessRules.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessRules.userStories.map((story, index) => (
          <div
            key={story.id_rn}
            className="bg-muted rounded-lg p-4 border border-border"
          >
            <h4 className="font-semibold text-foreground mb-1 text-sm">
              {story.id_rn}
            </h4>
            <p className="text-sm text-muted-foreground">{story.title}</p>
            <br></br>
            <h4 className="font-semibold text-foreground mb-1 text-sm">
              {story.id_us}
            </h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BusinessRules
