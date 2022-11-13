import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/authContext'

const Search = () => {

  const [email, setEmail] = useState('')
  const [users, setUsers] = useState(null)
  const [isError, setIsError] = useState(false)
  const [check, setCheck] = useState(false)

  const { currentUser } = useContext(AuthContext)

  const searchHandler = async () => {

    setUsers(null)
    const usersRef = collection(db, "users")
    const q = query(usersRef, where('email', "==", email))

    try {
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {
        setUsers(doc.data())
      })

      setCheck(true)
      setEmail('')

    } catch(err) {
      setIsError(true)
    }

  }

  const onKeyDownHandler = (e) => {
    setCheck(false)
    e.code === 'Enter' && searchHandler()
  }

  const addUserToChatList = async () => {
    
    const combinedID = currentUser.uid > users.uid ? currentUser.uid + users.uid : users.uid + currentUser.uid

    try {

      const res = await getDoc(doc(db, 'chats', combinedID))

      if (!res.exists()) {

        await setDoc(doc(db, 'chats', combinedID), { messages: [] })

        await updateDoc(doc(db, 'chatList', currentUser.uid), {
          [combinedID+'.userInfo']: {
            uid: users.uid,
            displayName: users.displayName,
            photoURL: users.photoURL
          },
          [combinedID+'.date']: serverTimestamp()
        })

        await updateDoc(doc(db, 'chatList', users.uid), {
          [combinedID+'.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedID+'.date']: serverTimestamp()
        }) 
      }

    } catch(err) {
      setIsError(true)
    }

    setUsers(null)
    setEmail('')
    setCheck(false)

  }

  return (
    <div className='search'>

      <input type='text' onKeyDown={onKeyDownHandler} onChange={(e) => {setEmail(e.target.value)}} placeholder='Search User by Email. e.g. test@user.com' value={email} />

      {(isError || (check && users === null)) && <span>User not found!</span>}
      
      {users && (
        <div className='user-box' style={{ marginTop: '10px' }} onClick={addUserToChatList} >
          <img src={users.photoURL} alt='Avatar' />

          <div className='user-info'>
            <h5>{users.displayName}</h5>
          </div>
        </div>        
      )}

    </div>
  )
}

export default Search