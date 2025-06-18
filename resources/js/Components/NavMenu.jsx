import React, { useState } from "react"
import { Info } from "lucide-react"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
const NavMenu = ({ menuItems, setActiveMenu }) => {
  const [open, setOpen] = useState(false)
  // Calcula o número total de itens para distribuição do indicador
  const totalItems = menuItems.length
  // Função para lidar com o clique em um item
  const handleItemClick = (menuItem) => setActiveMenu(menuItem.label)

  return (
    <>
      <div className="flex w-full">
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            className={`flex-1 z-20 h-12 flex items-center justify-evenly text-center text-white font-medium text-lg cursor-pointer  
              border-purple-2 border-b-4 slide-in
              ${index === 0 ? "rounded-tl-md rounded-bl-md" : ""}
              ${
                index === menuItems.length - 1
                  ? "rounded-tr-md rounded-br-md"
                  : ""
              }
              ${menuItem.value ? "bg-purple-2" : "bg-gray-800"}`}
            onClick={() => handleItemClick(menuItem)}
          >
            {menuItem.label}
            <Popover>
              <PopoverTrigger>
                <Info
                  className={`${
                    menuItem.value ? "text-indigo-800" : "text-gray-500"
                  }`}
                  size={15}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-gray-800 text-white ">
                {menuItem.tooltip}
                <PopoverArrow className="fill-gray-800" />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>

      <div className="relative h-0 w-full">
        {menuItems.map(
          (menuItem, index) =>
            menuItem.value && (
              <div
                key={`indicator-${index}`}
                className="absolute w-6 h-6 bg-purple-2 transform -translate-y-5 rotate-45"
                style={{
                  left: `calc(${(index + 0.5) * (100 / totalItems)}% - 12px)`,
                }}
              />
            )
        )}
      </div>
    </>
  )
}

export default NavMenu
