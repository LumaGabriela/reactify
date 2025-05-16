import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import NavMenu from '../../Components/NavMenu'
import MainView from './MainView';
import Stories from './Stories';
import Personas from './Personas';
import Journeys from './Journeys';
import Goals from './Goals';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
const ProjectView = ({ projectDB = [] }) => {

  const [project, setProject] = useState({ ...projectDB });
  const [activeMenu, setActiveMenu] = useState('Goals');
  const [menuItems, setMenuItems] = useState([
    { All: true },
    { Stories: false },
    { Personas: false },
    { Goals: false },
    { Journeys: false }
  ]);

//Altera o menu ativo
  useEffect(() => {
    const updatedMenuItems = menuItems.map((item, i) => {
      if (Object.keys(item)[0] === activeMenu) {
        return {
          ...item,
          [Object.keys(item)[0]]: true,
        };
      }
      return {
        ...item,
        [Object.keys(item)[0]]: false,
      };

    })
    setMenuItems(updatedMenuItems)

  }, [activeMenu])

  useEffect(() => {
    // console.log(project?.goal_sketches)
    console.log(route().current(), activeMenu)
  }, [activeMenu])

  const renderContent = () => {
    switch (activeMenu) {
      case 'All':
        return <MainView project={project} />;
      case 'Stories':
        return <Stories project={project} setProject={setProject} />
      case 'Personas':
        return <Personas project={project} setProject={setProject} />
      case 'Goals':
        return <Goals project={project} setProject={setProject} setActiveMenu={setActiveMenu} />
      case 'Journeys':
        return <Journeys project={project} setProject={setProject} />
      default:
        return null;
    }
  };

  return (
    <div className="project-view flex flex-col items-center justify-start px-2 w-full max-w-6xl">
      <h2 className="text-white text-center w-full my-4 p-0">{project.title}</h2>
      <NavMenu menuItems={menuItems} setActiveMenu={setActiveMenu} />
      {renderContent()}
    </div>
  );
};
const Project = ({ project }) => {

  return (
    <>
      <Head title="Project" />
      <AuthenticatedLayout >
        <ProjectView projectDB={project} />
      </AuthenticatedLayout>
    </>
  )
}
export default Project