import React from 'react';
import { useEffect } from 'react';
import { AddProjectModal } from './Components/modal/Modals'
import { AddButton } from './Components/button/Buttons'
import { ProjectIcon } from './Components/icons/Icons'


const Home = () => {

  useEffect(() => {
    console.log()
  }, [])

  return (
    <div>
 
      {/* <AddProjectModal
        modal={modal}
        handleRemove={handleRemove}
        userKey={userKey}
        users={users}
        setUsers={setUsers}
      />


      <ProjectIcon
        userKey={userKey}
        users={users}
        setProjectKey={setProjectKey}
        handleRemove={handleRemove}
      />      
      <AddButton
        type={'project'}
        handleRemove={handleRemove}
      /> */}
    </div>
  )
}
export default Home