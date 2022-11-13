import React from 'react'

const Profile = ({ user }) => {

  return (
    <div className='profile'>

      <img className='avatar' src={user.photoURL} alt='' />
      <h3>{user.displayName}</h3>

    </div>
  )
}

export default Profile