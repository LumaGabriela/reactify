import React from 'react';

const NavMenu = ({ menuItems, setActiveMenu }) => {
  // Calcula o número total de itens para distribuição do indicador
  const totalItems = menuItems.length;
  // Função para lidar com o clique em um item
  const handleItemClick = (menuItem) => {
    setActiveMenu(Object.keys(menuItem)[0]);
  };
console.log(menuItems)
  return (
    <>
      <div className="flex w-full min-w-full">
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            className={`flex-1 py-2 text-center text-white font-medium text-lg cursor-pointer  
              border-purple-2 border-b-4 slide-in
              ${index === 0 ? "rounded-tl-md rounded-bl-md" : ""}
              ${index === menuItems.length - 1 ? "rounded-tr-md rounded-br-md" : ""}
              ${Object.values(menuItem)[0] ? "bg-purple-2" : "bg-gray-800"
              }`}
            onClick={() => handleItemClick(menuItem)}
          >
            {Object.keys(menuItem)[0]}
          </div>
        ))}
      </div>

      <div className="relative h-6 w-full">
        {menuItems.map((menuItem, index) => (
          Object.values(menuItem)[0] && (
            <div
              key={`indicator-${index}`}
              className="absolute w-6 h-6 bg-purple-2 transform -translate-y-1/2 rotate-45"
              style={{
                left: `calc(${(index + 0.5) * (100 / totalItems)}% - 12px)`,
              }}
            />
          )
        ))}
      </div>
    </>
  );
};

export default NavMenu