import React, { useEffect, useState } from 'react';
import LeftMenu from '../Components/LeftMenu';
import RightMenu from '../Components/RightMenu';
import NavMenu from '../Components/NavMenu'
import MainView from './MainView';
const ProjectView = () => {
  const [project, setProject] = useState({
    id: 1,
    name: 'Project X',
    journeys: []
  });

  const [activeMenu, setActiveMenu] = useState('');
  const [menuItems, setMenuItems] = useState([
    { name: 'All', active: true },
    { name: 'Stories', active: false },
    { name: 'Personas', active: false },
    { name: 'Goals', active: false },
    { name: 'Journeys', active: false }
  ]);

  useEffect(() => {
    const activeItem = menuItems.find(item => item.active);
    if (activeItem) {
      setActiveMenu(activeItem.name);
    }
  }, [menuItems]);

  const renderContent = () => {
    switch (activeMenu) {
      case 'All':
        return <MainView />;;
      case 'Stories':
        return
      case 'Personas':
        return
      case 'Goals':
        return
      case 'Journeys':
        return
      default:
        return null;
    }
  };

  return (
<div className="project-view flex flex-col items-start w-full ">
  <h2 className="text-white text-center w-full my-4 p-0">{project.name}</h2>
  <NavMenu menuItems={menuItems} setMenuItems={setMenuItems} />
  {renderContent()}
</div>
  );
};
const Project = () => {

  return (
    <div className='flex col justify-between min-h-screen bg-gray-1 w-screen'>
      <LeftMenu />
      <ProjectView />
      <RightMenu />
    </div>
  )
}
export default Project