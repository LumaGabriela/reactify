import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import NavMenu from '../../Components/NavMenu'
import MainView from './MainView';
import Stories from './Stories';
import Personas from './Personas';
import Journeys from './Journeys';
import Goals from './Goals';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
const ProjectView = ({projectDB = []}) => {

  const [project, setProject] = useState({...projectDB});
  const [activeMenu, setActiveMenu] = useState('');
  const [menuItems, setMenuItems] = useState([
    { name: 'All', active: false },
    { name: 'Stories', active: true },
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

  useEffect(() => {
    console.log()
  }, [project])

  const renderContent = () => {
    switch (activeMenu) {
      case 'All':
        return <MainView project={project} />;
      case 'Stories':
        return <Stories project={project} setProject={setProject} />
      case 'Personas':
        return <Personas project={project} setProject={setProject} />
      case 'Goals':
        return <Goals project={project} setProject={setProject} />
      case 'Journeys':
        return <Journeys project={project} setProject={setProject} />
      default:
        return null;
    }
  };

  return (
    <div className="project-view flex flex-col items-center justify-start px-2 w-full max-w-6xl">
      <h2 className="text-white text-center w-full my-4 p-0">{project.title}</h2>
      <NavMenu menuItems={menuItems} setMenuItems={setMenuItems} />
      {renderContent()}
    </div>
  );
};
const Project = ({project}) => {
  
  useEffect(() => {

  },[project])
  return (
    <>
      <Head title="Project" />
      <AuthenticatedLayout >
        <ProjectView projectDB={project}/>
      </AuthenticatedLayout>
    </>
  )
}
export default Project