import React from "react"
import { Info } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { createPortal } from "react-dom"
const NavMenu = ({ menuItems, setActiveMenu }) => {
  // Calcula o número total de itens para distribuição do indicador
  const totalItems = menuItems.length
  // Função para lidar com o clique em um item
  const handleItemClick = (menuItem) => {
    setActiveMenu(menuItem.label)
    console.log(menuItem)
  }
  return (
    <>
      <div className="flex w-full min-w-full">
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            className={`flex-1 h-12 flex items-center justify-center text-center text-white font-medium text-lg cursor-pointer  
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
            {(document.getElementById("left-nav") && menuItem.value) &&
              createPortal(
                <Card className = "w-full h-content bg-indigo-800 text-white border-0 text-sm">
                  <CardHeader>
                    <CardTitle>Sobre</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{menuItem.tooltip}</p>
                  </CardContent>
                </Card>,
                document.getElementById("left-nav")
              )}
          </div>
        ))}
      </div>

      <div className="relative h-6 w-full">
        {menuItems.map(
          (menuItem, index) =>
            menuItem.value && (
              <div
                key={`indicator-${index}`}
                className="absolute w-6 h-6 bg-purple-2 transform -translate-y-1/2 rotate-45"
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
