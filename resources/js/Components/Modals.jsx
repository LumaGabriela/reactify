import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
const ModalConfirmation = ({ onConfirm, onCancel, message }) => {
  const [animationStart, setAnimationStart] = useState(true);
  const handleClick =() => {
    setAnimationStart(false);
    setTimeout(() =>  onCancel(), 300);
  }
    return (
      // Fundo escuro
        <>
        <div
            onClick={handleClick}
            style={{ height: document.body.scrollHeight }}
            className="h-screen min-w-full bg-gray-900/60 fixed top-0 left-0  z-10 transition-colors"/>
          {/* Pop up de confirmacao */}
            <div 
            className={`absolute left-1/2 top-1/4 !-translate-x-1/2 !-translate-y-1/2 bg-gray-700 rounded shadow-lg p-3 z-10 min-w-40 ${animationStart ? 'popup-animation' : 'popup-close-animation'} `}>
                <div className="text-white text-xs mb-2">
                    {message}
                </div>
                <div className="flex justify-between gap-1">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={onConfirm}
                    >
                        Sim
                    </button>
                    <button
                        className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={handleClick}
                    >
                        Não
                    </button>
                </div>
            </div>
        </>
    );
}

const ModalSelect = ({ onClick, onCancel, types }) => {
    const [animationStart, setAnimationStart] = useState(true);
  const closeModal = () => {
    setAnimationStart(false);
    setTimeout(() => onCancel(), 300);
  }
  const handleClick = (type) => {
    setAnimationStart(false);
    setTimeout(() =>  onClick(type), 300);
  }
  return (
    <>
    {/* fundo escuro */}
    <div 
      onClick={closeModal} 
      style={{ height: document.body.scrollHeight }}
      className="h-screen min-w-full bg-gray-900/60 fixed top-0 left-0 z-10 transition-colors"
    />
    {/* Popup de selecao  */}
    <div 
        className={`select-container flex flex-col items-center justify-center absolute -translate-y-[3rem] z-20 bg-gray-700 rounded shadow-lg p-2 shadow-md ${animationStart ? 'popup-animation' : 'popup-close-animation'}`}

        onClick={(e) => e.stopPropagation()} // Evita que o clique no container feche o popup
      >
        <h1 className="text-white text-sm font-medium">Select type</h1>
        <div className="flex gap-2">
          {types && types.map((type, index) => (
            <div 
              key={index} 
              className={`${type.color || 'bg-gray-400'} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer shadow-md`}
              onClick={() => handleClick(type)}
            >
              {type.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const ModalNewProject = ({ onCancel, message}) => {
  const [animationStart, setAnimationStart] = useState(true);
    const [newProject, setNewProject] = useState({
      title: '',
      description: '',
    });
  const handleClick =() => {
    setAnimationStart(false);
    console.log(newProject)
    setTimeout(() =>  onCancel(), 300);
  }
  const onConfirm = () => {
    router.post(route('projects.store'), newProject)
  }
    return (
      // Fundo escuro
        <>
        <div
            onClick={handleClick}
            style={{ height: document.body.scrollHeight }}
            className="h-screen min-w-full bg-gray-900/60 fixed top-0 left-0  z-10 transition-colors"/>
          {/* Pop up de confirmacao */}
            <div 
            className={`absolute left-1/2 top-1/4 !-translate-x-1/2 !-translate-y-1/2 bg-gray-700 rounded shadow-lg p-3 z-10 min-w-40 ${animationStart ? 'popup-animation' : 'popup-close-animation'} flex flex-col gap-2`}>
                <div className="text-white text-xs mb-2">
                    {message}
                </div>

                <input 
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value})}
                type="text" 
                placeholder="Nome do projeto" 
                className="bg-gray-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1" />

                <input 
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value})}
                type="text" 
                placeholder="Descrição do projeto" 
                className="bg-gray-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1" />

                <div className="flex justify-between gap-1">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={onConfirm}
                    >
                        Sim
                    </button>
                    <button
                        className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={handleClick}
                    >
                        Não
                    </button>
                </div>
            </div>
        </>
    );
}

export { ModalConfirmation, ModalSelect, ModalNewProject };