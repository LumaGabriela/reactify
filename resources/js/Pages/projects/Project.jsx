import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import NavMenu from '../../Components/NavMenu'
import MainView from './MainView';
import Stories from './Stories';
import Personas from './Personas';
import Journeys from './Journeys';
import Goals from './Goals';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProjectView = ({ projectDB = [] }) => {
  const props = usePage().props
  const [project, setProject] = useState({ ...projectDB });

  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem('activeMenu') || 'All'
  );
  const [menuItems, setMenuItems] = useState([
    { All: true },
    { Stories: false },
    { Personas: false },
    { Goals: false },
    { Journeys: false }
  ]);

  //
  useEffect(() => {
    //
    if (!window.Echo) {
      console.error('window.Echo is undefined')
      return;
    }

    const channel = window.Echo.private(`project.${project.id}`)


    channel.listen('ProjectUpdated', (e) => {
      console.log('project updated: ', e.project)


      return () => channel.stopListening('ProjectUpdated')
    })

  }, [project.id])
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
    localStorage.setItem('activeMenu', activeMenu)
  }, [activeMenu])

  useEffect(() => {
    console.log(project)
  }, [project])


  const renderContent = () => {
    switch (activeMenu) {
      case 'All':
        return <MainView project={project} setProject={setProject} />;
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