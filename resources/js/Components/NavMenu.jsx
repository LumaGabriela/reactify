import React from 'react';

const NavMenu = ({ menuItems, setMenuItems }) => {
  const handleItemClick = (index) => {
    const updatedMenuItems = menuItems.map((menuItem, menuItemIndex) => ({
      ...menuItem,
      active: menuItemIndex === index,
    }));
    setMenuItems(updatedMenuItems);
  };

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
              className="absolute left-1/2 w-6 h-6 bg-purple-2 transform -translate-x-8 -translate-y-1/2 rotate-45"
              style={{
                left: `${(index * 20) + 12.5}%`,
              }}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default NavMenu