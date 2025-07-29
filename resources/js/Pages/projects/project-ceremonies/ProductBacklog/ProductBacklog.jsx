const ProductBacklog = () => {
  const initialBoard = {
    productBacklog: [
      {
        id: 'US03',
        title: 'Ordenar Livros',
        cd: 'US02',
      },
      {
        id: 'US04',
        title: 'Leitor de Livros',
        cd: 'US02',
      },
      {
        id: 'US05',
        title: 'Disponibilizar opções de Personalização',
        cd: 'US04',
      },
      {
        id: 'US06',
        title: 'Comprar Livros',
      },
    ],
    sprintBacklog: [
      {
        id: 'US02',
        title: 'Apresentar Lista de Livros Pessoais',
        cd: 'US01',
      },
    ],
    delivered: [
      {
        id: 'US01',
        title: 'Upload de Livro Digital',
      },
    ],
  }

  const [board, setBoard] = useState(initialBoard)

  const columnTitles = {
    productBacklog: 'Product Backlog',
    sprintBacklog: 'Sprint Backlog',
    delivered: 'Delivered',
  }

  return (
    <div className="flex space-x-4 p-4 min-h-[500px]">
      {Object.keys(board).map((columnId) => (
        <div
          key={columnId}
          className="w-1/3 bg-muted rounded-lg p-3 flex flex-col"
        >
          <h2 className="text-lg font-bold mb-4 text-foreground px-1">
            {columnTitles[columnId]}
          </h2>
          <div className="space-y-3">
            {board[columnId].map((card) => (
              <div
                key={card.id}
                className="bg-card p-3 rounded-md shadow-sm text-foreground text-sm"
              >
                <p className="font-semibold">{card.id}</p>
                <p>{card.title}</p>
                {card.cd && (
                  <p className="text-sm text-muted-foreground">Cd: {card.cd}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductBacklog
