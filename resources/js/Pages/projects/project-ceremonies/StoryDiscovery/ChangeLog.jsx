const ChangeLog = ({ project, setProject }) => {
  const mockData = [
    {
      numero: 1,
      dataSolicitacao: '2024-07-26',
      responsavel: 'Ana',
      descricao: 'Implementar login com Google',
      impacto: 'US-101',
      novas: 'US-104, US-105',
      esforco: 5,
    },
    {
      numero: 2,
      dataSolicitacao: '2024-07-25',
      responsavel: 'Carlos',
      descricao: 'Criar página de perfil do usuário',
      impacto: 'US-102',
      novas: '',
      esforco: 8,
    },
    {
      numero: 3,
      dataSolicitacao: '2024-07-24',
      responsavel: 'Beatriz',
      descricao: 'Desenvolver funcionalidade de busca',
      impacto: 'US-103',
      novas: 'US-106',
      esforco: 13,
    },
  ]

  return (
    <div className="p-2">
      <div className="w-full text-center p-4">
        <Button
          variant="link"
          onClick={() =>
            router.get(
              route('project.show', { project: project.id, page: 'backlog' }),
            )
          }
        >
          Go to Product Backlog
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="text-center">
              Número
            </TableHead>
            <TableHead rowSpan={2} className="text-center">
              Data da Solicitação
            </TableHead>
            <TableHead rowSpan={2} className="text-center">
              Responsável
            </TableHead>
            <TableHead rowSpan={2} className="text-center">
              Descrição
            </TableHead>
            <TableHead colSpan={2} className="text-center">
              User Story
            </TableHead>
            <TableHead rowSpan={2} className="text-center">
              Esforço
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center">Impacto</TableHead>
            <TableHead className="text-center">Novas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((item) => (
            <TableRow key={item.numero}>
              <TableCell className="text-center">{item.numero}</TableCell>
              <TableCell className="text-center">
                {item.dataSolicitacao}
              </TableCell>
              <TableCell className="text-center">{item.responsavel}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-center">{item.impacto}</TableCell>
              <TableCell className="text-center">{item.novas}</TableCell>
              <TableCell className="text-center">{item.esforco}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ChangeLog
