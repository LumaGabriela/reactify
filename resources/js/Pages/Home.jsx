import React from 'react';
import LeftMenu from './Components/LeftMenu';
import RightMenu from './Components/RightMenu';
import Dashboard from './Components/Dashboard';

const Home = () => {

  return (
    <div className='flex  justify-between min-h-screen bg-gray-1 w-min-full'>
      <LeftMenu />
      <Dashboard/>
      <RightMenu />
    </div>
  )
}
export default Home