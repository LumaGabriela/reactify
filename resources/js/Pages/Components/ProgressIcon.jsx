import React, { useState } from 'react';

const ProgressIcon = ({ 
  value = 20, 
  color = "#806dff", 
  label = "Journeys",
  link = "#"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calcular a porcentagem para o circle progress
  const circumference = 2 * Math.PI * 45; // raio de 45 para um círculo de tamanho 90
  const offset = circumference - (value / 100) * circumference;
  const rotation = value <= 50 ? -180 : 0;
  
  return (
    <div 
      className={`flex flex-col items-center mx-px w-44 h-min cursor-pointer transform transition-transform duration-200 ${isHovered ? 'scale-102' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = link}
    >
      {/* Circular progress indicator */}
      <div className="relative flex items-center justify-center w-17 h-17 mb-2">
        {/* Background circle */}
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#e6e6e6" 
            strokeWidth="10"
          />
          
          {/* Progress circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color} 
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(${rotation}, 50, 50)`}
          />
        </svg>
        
        {/* Value display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl text-md text-white">{value}</span>
        </div>
      </div>
      
      {/* Label */}
      <div 
        className="w-full px-4 py-1 text-center text-md font-semibold bg-white rounded-md shadow-sm"
        style={{ borderTop: `4px solid ${color}` }}
      >
        {label}
      </div>
    </div>
  );
}

export default ProgressIcon