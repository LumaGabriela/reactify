// import { useNavigate } from "react-router"

const ProjectIcon = ({ users, userKey, setProjectKey }) => {
  const user = users.find(user => user.key === userKey)
  const navigate = useNavigate()

  return (
    <div className="project-container mt-5">
      {user?.projects?.map((project) => (
        <div
          key={project.key}
          className={`project-item text-center ${project.key}`}
          onClick={() => {
            setProjectKey(project.key)
            navigate(`/${project.key}/visao-geral/`)
          }}

        >
          <h4>{project.name}</h4>
          {project.visaoGeral}
        </div>
      ))}
    </div>
  )
}


export { ProjectIcon }