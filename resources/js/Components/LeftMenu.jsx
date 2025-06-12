import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Grid, Settings, User, Calendar, Mail, FileText, LayoutDashboard, Squirrel, LogOut } from 'lucide-react';

const LeftMenu = ({}) => {
  const items = [
    { name: 'My Projects', url: 'projects.index', icon: Grid},
    { name: 'Profile', url: 'profile.edit', icon: User },
    // { name: 'Settings', url: 'config', icon: Settings },
    { name: 'Logout', url:'logout', icon: LogOut },
  ];
  const currentRoute = route().current()

  return (
    <div className="flex flex-col min-h-screen bg-gray-2 min-w-[17rem] max-w-[17rem] text-gray-300 ">
      {/* Header */}
      <Link 
        as='div' 
        className="px-2 py-3 h-20 flex items-center justify-evenly cursor-pointer border-b border-gray-700"
        href={route('projects.index')}
      >
        <div className="bg-blue-800 rounded-full p-2"><Squirrel /></div>
        <div className='flex flex-col items-start justify-center w-full h-full ml-3'>
          <span className="font-semibold text-white text-sm whitespace-nowrap h-1/2">Sistema Reactify</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav id='left-nav' className="flex-1 p-2 space-y-1">
        {items.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <Link 
              as='button'
              href={route(item.url)}
              key={index}
              className={`flex items-center px-4 py-2 my-1 w-full rounded-md transition-colors duration-200 cursor-pointer [text-decoration:none!important]
                ${item.url.includes(currentRoute) ? 'bg-indigo-900' : 'hover:bg-indigo-900'}`
              }
              {...(item.name === 'Logout' && { method: 'post'})}
            >
              <div className="flex items-center">
                {index === 0 ? (
                  <LayoutDashboard className={`w-5 h-5 mr-3 ${item.url.includes(currentRoute) ? 'text-indigo-400' : 'text-gray-400 hover:text-indigo-400'}`} />
                ) : (
                  <IconComponent className={`w-5 h-5 mr-3 ${item.url.includes(currentRoute) ? 'text-indigo-400' : 'text-gray-400 hover:text-indigo-400'}`} />
                )}
                <span className={`${item.url.includes(currentRoute) ? 'text-white no-underline' : 'text-gray-300 hover:text-white  no-underline'}`}>{item.name}</span>
              </div>

              {item.badge && (
                <div className="ml-auto bg-green-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default LeftMenu;