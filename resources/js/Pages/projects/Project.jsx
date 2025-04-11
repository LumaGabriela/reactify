import React, { useEffect, useState } from 'react';
import LeftMenu from '../Components/LeftMenu';
import RightMenu from '../Components/RightMenu';
import ProgressIcon from '../Components/ProgressIcon'
import NavMenu from '../Components/NavMenu'

const ProjectView = () => {
  const [project, setProject] = useState({
    id: 1,
    name: 'Projeto x',
    journeys: []
  })
  // Array de itens do menu com nome e status ativo
  const [currentMenu, setCurrentMenu] = useState('')
  const [menuItems, setMenuItems] = useState([
    { name: 'All', active: true },
    { name: 'Stories', active: false },
    { name: 'Personas', active: false },
    { name: 'Goals', active: false }
  ]);

  useEffect(() => {
    const activeItem = menuItems.find(item => item.active)
    setCurrentMenu(activeItem.name)
  }, [menuItems])

  return (
    <div className='project-view flex row items-start justify-around pt-4'>
      <div>
        <h2 className='text-white text-center mb-4'>{project.name}</h2>
        <NavMenu
          menuItems={menuItems}
          setMenuItems={setMenuItems}
        />
        {/* Condicional para retornar apenas a pagina escolhida  */}
        {(() => {
          switch(currentMenu) {
            case 'All':
              return 
              break
            case 'Stories':
              return <ProgressIcon />
              break
            default: return
          }
        })()}


        <div className='flex col'>
          <ProgressIcon />
          <ProgressIcon />
          <ProgressIcon />
          <ProgressIcon />
        </div>
      </div>

      <div>

      </div>


    </div>
  )

}
const Project = () => {

  return (
    <div className='flex col justify-center min-h-screen bg-gray-1 w-screen'>
      <LeftMenu />
      <ProjectView />
      <RightMenu />
    </div>
  )
}
export default Project