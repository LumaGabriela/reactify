import React, { useState } from 'react'
import { Info } from 'lucide-react'
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
            className={`flex-1 z-20 h-9 flex items-center justify-evenly text-center text-foreground font-medium text-lg cursor-pointer
              border-primary border-b-4 slide-in
              ${index === 0 ? 'rounded-tl-md rounded-bl-md' : ''}
              ${
                index === menuItems.length - 1
                  ? 'rounded-tr-md rounded-br-md'
                  : ''
              }
              ${menuItem.value ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => handleItemClick(menuItem)}
          >
            {menuItem.label}
            <Popover>
              <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                <Info
                  className={`${
                    !menuItem.value ? 'text-foreground' : 'text-background'
                  }`}
                  size={15}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-background text-white ">
                {menuItem.tooltip}
                <PopoverArrow className="fill-background" />
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
                className="absolute w-6 h-6 bg-primary transform -translate-y-5 rotate-45"
                style={{
                  left: `calc(${(index + 0.5) * (100 / totalItems)}% - 12px)`,
                }}
              />
            ),
        )}
      </div>
    </>
  )
}

export default NavMenu
