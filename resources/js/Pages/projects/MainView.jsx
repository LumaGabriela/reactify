import React from 'react'
import ProgressIcon from '../../Components/ProgressIcon'

const MainView = ({project}) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-row'>
        <ProgressIcon label='Stories' value={project?.stories.length}/>
        <ProgressIcon label='Personas'value={project?.personas.length}/>
        <ProgressIcon label='Goals' value={project?.goalSketches.length}/>
        <ProgressIcon label='Journeys' value={project?.journeys.length}/>
      </div>
      <div className='grid grid-cols-2 gap-4 mt-4 min-h-65 w-3xl px-4'>
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className=' bg-purple-gradient rounded cursor-pointer'>
            <p className='text-white text-sm text-shadow p-2'>
            Texto texto texto texto Texto texto texto texto 
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