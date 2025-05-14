import React from 'react';

const NavMenu = ({ menuItems, setMenuItems }) => {
  const handleItemClick = (index) => {
    const updatedMenuItems = menuItems.map((menuItem, menuItemIndex) => ({
      ...menuItem,
      active: menuItemIndex === index,
    }));
    setMenuItems(updatedMenuItems);
  };

  // Calcula o número total de itens para distribuição do indicador
  const totalItems = menuItems.length;


  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full min-w-full">
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            dusk={`btn-${menuItem.name.toLowerCase()}`}
            className={`flex-1 py-2 text-center text-white font-medium text-lg cursor-pointer ${
              menuItem.active ? "bg-purple-2" : "bg-gray-800"
            }`}
            onClick={() => handleItemClick(index)}
          >
            {menuItem.name}
          </div>
        ))}
      </div>

      <div className="relative h-6 w-full border-t border-purple-2">
        {menuItems.map((menuItem, index) => (
          menuItem.active && (
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
    </div>
  );
};

export default NavMenu