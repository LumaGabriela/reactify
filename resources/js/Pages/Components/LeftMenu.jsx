import React from 'react';
import { Grid, Settings, User, Calendar, Mail, FileText } from 'lucide-react';

const LeftMenu = () => {
  const items = [
    { name: 'Dashboard', url: '#', icon: Grid, active: true },
    { name: 'Reports', url: '#', icon: FileText },
    { name: 'Calendar', url: '#', icon: Calendar },
    { name: 'Email', url: '#', icon: Mail, badge: '20' },
    { name: 'Profil', url: '#', icon: User },
    { name: 'Setting', url: '#', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 w-60 text-gray-300">
      {/* Header */}
      <div className="p-2 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="font-semibold text-white">Projects</h4>
            <div className="flex items-center text-xs">
              <div className="bg-blue-500 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12L3 12M3 12L11 4M3 12L11 20" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-gray-400">Release time</span>
              <span className="bg-green-500 text-white text-xs rounded px-2 ml-2">Oct 28, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
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
                  <div className="grid grid-cols-2 gap-1 mr-3">
                    <div className={`w-2 h-2 rounded-sm ${item.active ? 'bg-indigo-500' : 'bg-indigo-400 group-hover:bg-indigo-500'}`}></div>
                    <div className={`w-2 h-2 rounded-sm ${item.active ? 'bg-indigo-500' : 'bg-indigo-400 group-hover:bg-indigo-500'}`}></div>
                    <div className={`w-2 h-2 rounded-sm ${item.active ? 'bg-indigo-500' : 'bg-indigo-400 group-hover:bg-indigo-500'}`}></div>
                    <div className={`w-2 h-2 rounded-sm ${item.active ? 'bg-indigo-500' : 'bg-indigo-400 group-hover:bg-indigo-500'}`}></div>
                  </div>
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