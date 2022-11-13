import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, storage, db } from '../firebase'
import toast from 'react-hot-toast';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

import Avatar from '../images/avatar-upload.png'

const Register = () => {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState(null)

  const [avatarImg, setAvatarImg] = useState(null)
  
  const getImageName = (e) => {
    setAvatar(e.target.files[0])
    if (e.target.files.length > 0) {
      setAvatarImg(e.target.files[0].name)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Password does not matched.')
      return
    }

    if (!avatar) {
      toast.error('You did not choose any avatar.')
      return
    }

    try {

      toast.success('Registering...')
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const storageRef = await ref(storage, name + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, avatar);

      uploadTask.on(

        (error) => {
          toast.error('Something went wrong!')
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {

            await updateProfile(res.user, {
              displayName: name,
              photoURL: downloadURL
            })

            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName: name,
              email,
              photoURL: downloadURL
            })

            await setDoc(doc(db, 'chatList', res.user.uid), {})

            toast.success('Congrats! Account created successfully!')            
            navigate('/')

          });
        }
      );

    } catch(err) {
      toast.error('Something went wrong!')
    }

    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setAvatar(null)

  }

  return (
    <>
      <div className="form-page">
        <div className="form-container">
          
          <h3>Register to <span>Naive Chat</span></h3>

          <form onSubmit={onSubmitHandler}>
            <input type="text" required placeholder='Enter Full Name' onChange={(e) => setName(e.target.value)} />
            <input type='email' required placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
            <input type='password' required placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} />
            <input type='password' required placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} />
            <input type="file" required id='avatar' style={{ display: 'none' }} onChange={getImageName} />            
            <label htmlFor='avatar'><img src={Avatar} alt="Upload Avatar" /> {avatarImg ? (<strong>{avatarImg}</strong>) : 'Upload Avatar'}</label>
            <button type='submit'>Register Now</button>
          </form>

          <p>Already have an account? <Link to='/login'>Login</Link></p>

        </div>
      </div>
    </>
  )
}

export default Register