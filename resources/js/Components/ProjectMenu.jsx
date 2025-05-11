import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Power, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

const ProjectMenu = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);


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
    router.put(route('projects.toggle-active', project.id), {}, {
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };


  const deleteProject = () => {
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.title}"?`)) {
      router.delete(route('projects.destroy', project.id), {
        onSuccess: () => {
          setIsOpen(false);
        }
      });
    }
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
    </div>
  );
};

export default ProjectMenu;