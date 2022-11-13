import React from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {

  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    const email = e.target[0].value
    const password = e.target[1].value

    try {

      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
      toast.success('Authentication Successful!')

    } catch(err) {
      toast.error('Your Email and Password didn\'t match.')
    }

  }

  return (
    <>
      <div className="form-page">
        <div className="form-container">
          
          <h3>Login to <span>Naive Chat</span></h3>

          <form onSubmit={onSubmitHandler}>
            <input type='email' placeholder='Enter Email' required />
            <input type='password' placeholder='Enter Password' required />
            <button type='submit'>Login</button>
          </form>

          <p>Don't have an account? <Link to='/register'>Register</Link></p>

        </div>
      </div>
    </>
  )
}

export default Login