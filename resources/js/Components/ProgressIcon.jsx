import React, { useState } from 'react';

const ProgressIcon = ({ 
  value = 0, 
  max = 100,
  color = "#806dff", 
  label = "Journeys",
  link = "#",
  icon: IconComponent
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calcular a porcentagem para o progresso circular
  const percentage = max === 0 ? 0 : Math.min(Math.round((value / max) * 100), 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Se não houver ícone definido, usar um placeholder visual
  const IconDisplay = () => {
    if (IconComponent) {
      return <IconComponent size={24} color={color} className="mb-1" />;
    }
    return null;
  };
  
  return (
    <div 
      className={`flex flex-col items-center mx-2 w-32 h-min cursor-pointer transition-all duration-200 ${isHovered ? 'scale-105' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = link}
    >
      <div className="relative flex items-center justify-center w-24 h-24 mb-2">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="45" fill="none" 
            stroke="#374151" strokeWidth="10"
          />
          <circle 
            cx="50" cy="50" r="45" fill="none" 
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <span className="text-2xl font-bold text-white">{value}</span>

        </div>
      </div>
      
      <div 
        className="w-full px-2 py-1 text-center text-white text-sm font-semibold bg-gray-700 rounded-md shadow-md"
        style={{ borderTop: `3px solid ${color}` }}
      >
        {label}
      </div>
    </div>
  );
};

export default ProgressIcon;