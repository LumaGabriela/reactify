import React from 'react';
import { useEffect } from 'react';
import { AddProjectModal } from './Components/modal/Modals'
import { AddButton } from './Components/button/Buttons'
import { ProjectIcon } from './Components/icons/Icons'
import LeftMenu from './Components/LeftMenu';
import RightMenu from './Components/RightMenu';

const Home = () => {

  return (
    <div className='flex col justify-between h-screen bg-gray-1 w-screen'>
      <LeftMenu />
      <RightMenu />
    </div>
  )
}
export default Home