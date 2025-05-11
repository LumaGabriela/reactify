import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Power, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { ModalConfirmation } from '@/Components/Modals';

const ProjectMenu = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showToggleConfirmation, setShowToggleConfirmation] = useState(false);

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleActive = () => {
    setIsOpen(false);
    setShowToggleConfirmation(true);
  };

  const confirmToggleActive = () => {
    setShowToggleConfirmation(false);
    router.put(route('projects.toggle-active', project.id));
  };

  const deleteProject = () => {
    setIsOpen(false);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    router.delete(route('projects.destroy', project.id));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreVertical size={18} className="text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 py-1 w-48 bg-gray-700 rounded-md shadow-lg z-50">
          <button
            onClick={toggleActive}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 flex items-center gap-2"
          >
            <Power size={16} className={project.active ? "text-green-400" : "text-red-400"} />
            {project.active ? "Desativar projeto" : "Ativar projeto"}
          </button>
          
          <button
            onClick={deleteProject}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 flex items-center gap-2"
          >
            <Trash2 size={16} className="text-red-400" />
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
          message={project.active 
            ? `Deseja desativar o projeto "${project.title}"? (Você poderá ativá-lo novamente)` 
            : `Deseja ativar o projeto "${project.title}"?`}
          onConfirm={confirmToggleActive}
          onCancel={() => setShowToggleConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ProjectMenu;