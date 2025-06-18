import { router, usePage } from "@inertiajs/react"
import React, { useState, useRef, useEffect } from "react"
import { MoreVertical, Power, Trash2 } from "lucide-react"

const ModalBackground = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{ height: document.body.scrollHeight }}
    className=" !min-w-full bg-gray-900/60 fixed !top-0 left-0 z-40 transition-colors"
  />
)
const ModalLayout = ({ children, animationStart }) => (
  <div
    className={`fixed !left-1/2 top-1/4 !-translate-x-1/2 !-translate-y-1/2 bg-gray-700 rounded shadow-lg p-3 z-50 flex flex-col items-center gap-2 text-nowrap ${
      animationStart ? "popup-animation" : "popup-close-animation"
    } `}
  >
    {children}
  </div>
)

const ModalConfirmation = ({ onConfirm, onCancel, message }) => {
  const [animationStart, setAnimationStart] = useState(true)
  const handleClick = () => {
    setAnimationStart(false)
    setTimeout(() => onCancel(), 300)
  }
  return (
    // Fundo escuro
    <>
      <ModalBackground onClick={handleClick} />
      {/* Pop up de confirmacao */}
      <ModalLayout animationStart={animationStart}>
        <div className="text-white text-sm mb-2">{message}</div>
        <div className="flex justify-between gap-2 w-full">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded text-center flex-1 transition-colors"
            onClick={onConfirm}
          >
            Sim
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white text-sm py-1 px-2 rounded text-center flex-1 transition-colors"
            onClick={handleClick}
          >
            Não
          </button>
        </div>
      </ModalLayout>
    </>
  )
}

const ModalSelect = ({ onClick, onCancel, types, message }) => {
  const [animationStart, setAnimationStart] = useState(true)
  const closeModal = () => {
    setAnimationStart(false)
    setTimeout(() => onCancel(), 300)
  }
  const handleClick = (type) => {
    setAnimationStart(false)
    setTimeout(() => onClick(type), 300)
  }
  return (
    <>
      {/* fundo escuro */}
      <ModalBackground onClick={closeModal} />
      {/* Popup de selecao  */}
      <ModalLayout animationStart={animationStart}>
        <h1 className="text-white text-sm font-medium">
          {message || "Select"}
        </h1>
        <div className="flex gap-2 w-full">
          {types &&
            types.map((type, index) => (
              <div
                key={index}
                className={`${
                  type.color || "bg-gray-400"
                } text-white text-xs font-medium py-1 px-4 rounded-full cursor-pointer shadow-md`}
                onClick={() => handleClick(type)}
              >
                {type.title.toUpperCase()}
              </div>
            ))}
        </div>
      </ModalLayout>
    </>
  )
}

const ModalNewProject = ({ onCancel, message }) => {
  const { errors } = usePage().props
  const [animationStart, setAnimationStart] = useState(true)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  })
  const handleClick = () => {
    setAnimationStart(false)
    setTimeout(() => onCancel(), 300)
  }
  const onConfirm = () => {
    router.post(route("project.store"), newProject)
  }
  return (
    // Fundo escuro
    <>
      <ModalBackground onClick={handleClick} />
      {/* Pop up de confirmacao */}
      <ModalLayout animationStart={animationStart}>
        <div className="text-white text-sm mb-2">{message}</div>

        <input
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
          type="text"
          placeholder="Nome do projeto"
          className="bg-gray-600 text-white text-sm py-0.5 px-2 rounded text-center flex-1 transition-colors"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        <input
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          type="text"
          placeholder="Descrição do projeto"
          className="bg-gray-600 text-white text-sm py-0.5 px-2 rounded text-center flex-1 transition-colors"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
        <div className="flex justify-between gap-1 w-full">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm py-0.5 px-2 rounded text-center flex-1 transition-colors"
            onClick={onConfirm}
          >
            Sim
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white text-sm py-0.5 px-2 rounded text-center flex-1 transition-colors"
            onClick={handleClick}
          >
            Não
          </button>
        </div>
      </ModalLayout>
    </>
  )
}

const ProjectMenu = ({ project }) => {
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showToggleConfirmation, setShowToggleConfirmation] = useState(false)

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleActive = () => {
    setIsOpen(false)
    setShowToggleConfirmation(true)
  }

  const confirmToggleActive = () => {
    setShowToggleConfirmation(false)
    router.put(route("project.toggle-active", project.id))
  }

  const deleteProject = () => {
    setIsOpen(false)
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    setShowDeleteConfirmation(false)
    router.delete(route("project.destroy", project.id))
  }

  return (
    <div ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreVertical
          size={18}
          className="text-gray-400"
        />
      </button>

      {isOpen && (
        <div className="absolute w-48 bg-gray-700 rounded-md shadow-lg z-50">
          <button
            onClick={toggleActive}
            className="w-full h-1/2 rounded-t-md text-left px-4 py-2 text-sm text-white hover:bg-gray-600 flex items-center gap-2"
          >
            <Power
              size={16}
              className={project.active ? "text-green-400" : "text-red-400"}
            />
            {project.active ? "Desativar projeto" : "Ativar projeto"}
          </button>

          <button
            onClick={deleteProject}
            className="w-full h-1/2 rounded-b-md text-left px-4 py-2 text-sm text-white hover:bg-gray-600 flex items-center gap-2"
          >
            <Trash2
              size={16}
              className="text-red-400"
            />
            Excluir projeto
          </button>
        </div>
      )}

      {/* Modal de confirmação para exclusão */}
      {showDeleteConfirmation && (
        <ModalConfirmation
          message={`Tem certeza que deseja excluir o projeto "${project.title}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      {/* Modal de confirmação para ativar/desativar */}
      {showToggleConfirmation && (
        <ModalConfirmation
          message={
            project.active
              ? `Deseja desativar o projeto "${project.title}"? (Você poderá ativá-lo novamente)`
              : `Deseja ativar o projeto "${project.title}"?`
          }
          onConfirm={confirmToggleActive}
          onCancel={() => setShowToggleConfirmation(false)}
        />
      )}
    </div>
  )
}

export { ModalConfirmation, ModalSelect, ModalNewProject, ProjectMenu }
