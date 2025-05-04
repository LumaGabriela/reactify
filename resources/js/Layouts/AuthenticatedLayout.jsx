import React from 'react';
import LeftMenu from '../Components/LeftMenu';
import RightMenu from '../Components/RightMenu';

const AuthenticatedLayout = ({ children }) => {

  return (
    <div className='flex justify-between min-h-screen bg-gray-1 w-min-full'>
      <LeftMenu />
      {children}
      <RightMenu />
    </div>

  )
}
export default AuthenticatedLayout