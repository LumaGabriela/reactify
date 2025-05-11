import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, CheckCircle, MessageCircle, Users } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { ModalNewProject } from '@/Components/Modals';
import ProjectMenu from '@/Components/ProjectMenu';

const Dashboard = ({projects = []}) => {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(today);

  const props = usePage().props;
  const [showModal, setShowModal] = useState(false);

  const [taskFilters, setTaskFilters] = useState([
    { name: 'All', active: true },
    { name: 'To do', active: false },
    { name: 'In Progress', active: false },
    { name: 'Done', active: false }
  ])

  useEffect(() => { console.log(props) }, [props])

  return (
    <div className=" text-white p-6 rounded w-full mx-auto">
      {/* Header */}
      {showModal && 
      <ModalNewProject 
      message={'Create a new project'}
      onCancel={() => setShowModal(false)} />
      }
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 text-sm">Today</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="search.."
            className="bg-gray-800 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Task Status Summary */}
      <div className="flex items-center justify-center gap-2 mb-8 w-full h-32">
        <div className="flex flex-col bg-gray-2 rounded p-2 w-1/2 max-w-2xl h-full cursor-pointer">
          <p className="font-medium text-lg">You Have 10 Undone Tasks</p>
          <button className="bg-purple-2-hover transition-colors rounded hover:bg-indigo-700 px-6 py-2 text-sm font-medium ">
            Check
          </button>
        </div>
        {/* New Project Card */}
        <button 
        onClick={() => setShowModal(true)}
        className="flex flex-col justify-center items-center bg-purple-2 hover:bg-indigo-700 transition-colors rounded p-2 w-1/2 max-w-2xl h-full cursor-pointer">
          <p className="font-bold text-lg">Create New Project</p>
        </button>
      </div>

      {/* Task Overview */}
      <div className="mb-8">
        <p className="font-semibold text-lg mb-4">Task Overview</p>

        <div className="flex space-x-2 mb-6">
          {taskFilters.map((filter, index) => (
            <button
              onClick={() => setTaskFilters(taskFilters.map((f, i) => i === index ? { ...f, active: true } : { ...f, active: false }))}
              className={`px-4 py-1 rounded transition-colors duration-200 ${filter.active ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              key={index}>
              {filter.name}
            </button>
          ))}
        </div>

        <div className="tasks grid grid-cols-3 gap-4">
          {/* Todo Task */}
          {projects && projects.map((project, index) => {
            let color = null
            const activeFilter = taskFilters?.find(filter => filter.active);

            switch (project.status) {
              case 'In Progress': color = 'bg-orange-500'; break
              case 'Done': color = 'bg-blue-500' ; break
              case 'To do': color = 'bg-red-500'; break
              default: color = 'bg-gray-800'
            }
            if ((project.status === activeFilter?.name) || activeFilter?.name === 'All') return (
            <div key={index} className="bg-gray-800 p-4 rounded-xl cursor-pointer">
              <div className="flex justify-between items-center mb-3">
                <Link 
                  href={route('projects.show', project.id)}
                  className="flex items-center flex-grow"
                >
                  <div className={`h-2 w-2 ${color} rounded-full mr-2` }></div>
                  <p>{project.title}</p>
                </Link>
                
                {/* Substituindo o ícone MoreVertical pelo componente de menu */}
                <ProjectMenu project={project} />
              </div>
              
              <Link 
                href={route('projects.show', project.id)}
                className="block"
              >
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className={`${color} text-white text-xs font-medium py-1 px-4 rounded-full inline-block`}>
                    {project.status}
                  </div>
                  <div className={`${project.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs font-medium py-1 px-2 rounded-md inline-block mb-2`}>
                    {project.active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <MessageCircle size={16} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">{project.members}</span>
                  </div>
                </div>
              </Link>
            </div>
          )})}
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg">My Active Project</p>
          <button className="rounded transition-colors py-2 px-4 text-sm font-medium bg-purple-2-hover"><a href='/projects'>See All</a></button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Project 1 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center mr-3">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium">Taxi online</p>
                <p className="text-gray-400 text-xs">Release time:</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-md mt-2 inline-block">
              Apr 5, 2023
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium">E-movies mobile</p>
                <p className="text-gray-400 text-xs">Release time:</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-md mt-2 inline-block">
              May 15, 2023
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium">Video converter app</p>
                <p className="text-gray-400 text-xs">Release time:</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded-md mt-2 inline-block">
              Feb 3, 2023
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Home = ({projects}) => {
  return (
    <AuthenticatedLayout > 
      <Dashboard projects={projects}/>
    </AuthenticatedLayout>  
  )
}

export default Home