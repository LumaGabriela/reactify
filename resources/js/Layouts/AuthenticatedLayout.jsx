import React, { useState } from 'react';
import LeftMenu from '../Components/LeftMenu';
import RightMenu from '../Components/RightMenu';
import { Link, usePage } from '@inertiajs/react';

const AuthenticatedLayout = ({ header, children }) => {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
  return (
    <div className='flex justify-between min-h-screen bg-gray-1 w-min-full'>
      <LeftMenu />
      {children}      
      <RightMenu />
    </div>

  )
}
export default AuthenticatedLayout