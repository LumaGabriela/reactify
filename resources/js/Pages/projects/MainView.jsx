import React from 'react'
import ProgressIcon from '../Components/ProgressIcon'

const MainView = () => {
  return (
    <div>
      <div className='flex col'>
        <ProgressIcon />
        <ProgressIcon />
        <ProgressIcon />
        <ProgressIcon />
      </div>
      <div className='grid grid-cols-2 gap-4 mt-4 min-h-65 w-3xl px-4'>
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className=' bg-purple-gradient rounded cursor-pointer hover:motion-safe:animate-spin'>
            <p className='text-white text-sm text-shadow p-2'>Texto texto texto texto Texto texto texto texto 
            Texto texto texto texto Texto texto texto texto 
            Texto texto texto texto Texto texto texto texto 
            Texto texto texto texto Texto texto texto texto </p>
            
          </div>
        ))}
      </div>
    </div>

  )
}

export default MainView