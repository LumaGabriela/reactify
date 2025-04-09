import React from 'react';
import { Grid, Settings, User, Calendar, Mail, FileText, LayoutDashboard, Squirrel } from 'lucide-react';

const LeftMenu = () => {
  const items = [
    { name: 'Dashboard', url: '#', icon: Grid, active: true },
    { name: 'Reports', url: '#', icon: FileText },
    { name: 'Calendar', url: '#', icon: Calendar },
    { name: 'Email', url: '#', icon: Mail, badge: '20' },
    { name: 'Profile', url: '#', icon: User },
    { name: 'Settings', url: '#', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-2 w-60 text-gray-300">
      {/* Header */}
      <div className="p-2 h-20 flex items-center justify-evenly gap-3">
          <div className="bg-blue-800 rounded-full p-2">
          <Squirrel />
          </div>
          <div className='flex flex-col w-full h-4/5'>
            <span className="font-semibold text-white  whitespace-nowrap">Sistema Reactify</span>
            <div className='flex col items-center justify-between'>
              <span className="text-gray-400 text-xs whitespace-nowrap text-center">Release time</span>
              <span className="bg-green-500 text-white text-xs rounded px-2 text-center">Oct 28, 2024</span>
            </div>
         
        </div>
      </div>
      {/* Divider */}
      <div className={`w-full h-px bg-gray-700 my-1`}></div>


      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <a
              href={item.url}
              key={index}
              className={`flex items-center px-4 py-2 my-1 rounded-md transition-colors duration-200  [text-decoration:none!important]
                ${item.active ? 'bg-indigo-900' : 'hover:bg-indigo-900'}`}
            >
              <div className="flex items-center">
                {index === 0 ? (
                  <LayoutDashboard className={`w-5 h-5 mr-3 ${item.active ? 'text-indigo-400' : 'text-gray-400 hover:text-indigo-400'}`}/>
                ) : (
                  <IconComponent className={`w-5 h-5 mr-3 ${item.active ? 'text-indigo-400' : 'text-gray-400 hover:text-indigo-400'}`} />
                )}
                <span className={`${item.active ? 'text-white  no-underline' : 'text-gray-300 hover:text-white  no-underline'}`}>{item.name}</span>
              </div>

              {item.badge && (
                <div className="ml-auto bg-green-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </a>
          );
        })}
      </nav>

    </div>
  );
}

export default LeftMenu;