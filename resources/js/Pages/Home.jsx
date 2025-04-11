import React from 'react';
import LeftMenu from './Components/LeftMenu';
import RightMenu from './Components/RightMenu';
import Dashboard from './Components/Dashboard';

const Home = () => {

  return (
    <div className='flex col justify-between min-h-screen bg-gray-1 w-screen'>
      <LeftMenu />
      <Dashboard/>
      <RightMenu />
    </div>
  )
}
export default Home