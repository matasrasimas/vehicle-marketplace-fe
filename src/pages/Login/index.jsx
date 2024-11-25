import React, { useEffect, useState } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { API_URL } from '../../constants';

const Login = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {

    e.preventDefault();


    const data = {
      username,
      password
    }

    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }


    try {
      const response = await fetch(`${API_URL}/api/login`, requestOptions)

      if(!response.ok) {
        const result = await response.json()
        setErrorMessage(result.message)
        return
      }

      const result = await response.json();
      const jwt = result.jwt;
  
      Cookies.set('jwt', jwt);

      setErrorMessage('')
      navigate('/')
      window.location.reload()

    } catch(error) {
      console.error('Request failed: ', error.message)
    }
  }


  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex items-center mt-6'>
          <h1 className='main-header'>Login</h1>
          <Link to='/' className='absolute left-10 top-15 text-2xl'>
              <FontAwesomeIcon icon={faArrowLeft}/>
            </Link>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-2/3 gap-4 m-5 '>

        <div className='flex flex-col gap-0.5 w-full items-center content-center'>
          <div className='flex flex-col'>
            <label htmlFor="username" className='input-label'>Username</label> 
            <input
              type="text"
              name='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${errorMessage != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
          </div>
        </div>

        <div className='flex flex-col gap-0.5 w-4/5 items-center'>
          <div className='flex flex-col relative w-56'>
            <label htmlFor="password" className='input-label'>Password</label> 
            <input
              type={`${showPassword ? 'text' : 'password'}`}
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-56 bg-neutral-300 h-8 rounded-md border-2 pl-3 font-semibold ${errorMessage != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className='absolute right-1 bottom-2 cursor-pointer'
              onClick={() => setShowPassword(prev => !prev)} />
          </div>
          {errorMessage != '' && <p className='text-red-500 text-center'>{errorMessage}</p>}
        </div>

        <button type='submit' className='submit-btn'>Login</button>
      </form>
    </div>

  );
}
export default Login;