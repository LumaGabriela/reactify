import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, CheckCircle, MessageCircle, Users } from 'lucide-react';
import {Link} from '@inertiajs/react';

const Dashboard = () => {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(today);

  const projects = [
    { name: 'Project 1', id: 1, status: 'In Progress', members: 5 },
    { name: 'Project 2', id: 2, status: 'Done', members: 3 },
    { name: 'Project 3', id: 3, status: 'To do', members: 4 },
    { name: 'Project 4', id: 4, status: 'Done', members: 2 },
    { name: 'Project 5', id: 5, status: 'To do', members: 6 }
  ]

  const [taskFilters, setTaskFilters] = useState([
    { name: 'All', active: true },
    { name: 'To do', active: false },
    { name: 'In Progress', active: false },
    { name: 'Done', active: false }
  ])

  useEffect(() => {  }, [taskFilters])
  return (
    <div className=" text-white p-6 rounded w-full mx-auto">
      {/* Header */}
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
      <div className="flex items-center justify-between mb-8 w-full h-52">

        <div className="bg-gray-2 rounded p-6 w-2/5 max-w-2xl h-full cursor-pointer">
          <div className="flex items-center">
            <div>
              <p className="font-medium text-lg">You Have 10 Undone Tasks</p>
              <p className="text-gray-400 text-sm">2 Tasks are in progress</p>
              <button className="bg-purple-2-hover transition-colors rounded hover:bg-indigo-700 px-6 py-2 mt-4 text-sm font-medium ">
                Check
              </button>
            </div>
          </div>
        </div>

        {/* Sprint Progress Card */}
        <div className="bg-purple-2 rounded p-6 w-2/5 max-w-2xl h-full cursor-pointer">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-lg">1st Sprint</p>
              <p className="text-sm mt-2">3 Task</p>
              <p className="text-sm">5 Done Task</p>
              <p className="text-sm">2 Undone Task</p>
            </div>
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-400 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-bold">30 %</p>
                  <p className="text-xs">Completed</p>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-300 rounded-full border-t-transparent transform rotate-45"></div>
            </div>
          </div>
        </div>
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
          {projects.map((project, index) => {
            let color = null
            const activeFilter = taskFilters?.find(filter => filter.active);

            switch (project.status) {
              case 'In Progress': color = 'bg-orange-500'; break
              case 'Done': color = 'bg-blue-500' ; break
              case 'To do': color = 'bg-red-500'; break
              default: color = 'bg-gray-800'
            }
            if ((project.status === activeFilter?.name) || activeFilter?.name === 'All') return (
            <Link 
            href={`/projects/1`}
             as='div'
             key={index} 
             className="bg-gray-800 p-4 rounded-xl cursor-pointer">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className={`h-2 w-2 ${color} rounded-full mr-2` }></div>
                  <p>{project.name}</p>
                </div>
                <MoreVertical size={18} className="text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm mb-4">Due in 2 days</p>
              <div className={`${color} text-white text-xs font-medium py-1 px-4 rounded-full inline-block mb-4`}>
                {project.status}
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

export default Dashboard;