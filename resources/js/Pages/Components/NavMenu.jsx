import React, { useState } from 'react';

const NavMenu = ({menuItems, setMenuItems}) => {

  
  // Função para alternar item ativo
  const setActiveItem = (clickedIndex) => {
    const updatedItems = menuItems.map((item, index) => ({
      ...item,
      active: index === clickedIndex
    }));
    setMenuItems(updatedItems);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Barra de navegação */}
      <div className="flex w-full">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            className={`flex-1 py-2 text-center text-white font-medium text-lg cursor-pointer ${
              item.active ? 'bg-red-500' : 'bg-gray-800'
            }`}
            onClick={() => setActiveItem(index)}
          >
            {item.name}
          </div>
        ))}
      </div>
      
      {/* Indicador de triangulo */}
      <div className="relative h-6 w-full border-t border-red-500">
        {menuItems.map((item, index) => (
          item.active && (
            <div 
              key={`indicator-${index}`} 
              className="absolute left-1/2 w-6 h-6 bg-red-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45"
              style={{ 
                left: `${(index * 25) + 12.5}%`,
              }}
            />
          )
        ))}
      </div>
    </div>
  );
}

export default NavMenu