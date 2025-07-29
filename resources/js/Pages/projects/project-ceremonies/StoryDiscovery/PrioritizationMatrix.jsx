import { router } from '@inertiajs/react'

const PrioritizationMatrix = ({ project, setProject }) => (
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
)

export default PrioritizationMatrix
