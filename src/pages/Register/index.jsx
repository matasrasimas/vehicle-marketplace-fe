import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants';


const Register = () => {

  const navigate = useNavigate()
  const [users, setUsers] = useState([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [repeatPasswordError, setRepeatPasswordError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users`, { method: 'GET' });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(!validateFirstName(firstName) |
    !validateLastName(lastName) |
    !validateUsername(username) |
    !validatePhoneNumber(phoneNumber) |
    !validatePassword(password) |
    !validateRepeatPassword(password, repeatPassword)) {
      console.log('There are errors in registration form')
      return
    }


    const data = {
      firstName,
      lastName,
      username,
      phoneNumber,
      password
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }


    try {
      const response = await fetch(`${API_URL}/api/users`, requestOptions)

      if(!response.ok) {
        console.error('Error: ', response.statusText)
        return
      }
      
      navigate('/login')
    } catch(error) {
      console.error('Request failed: ', error.message)
    }
  }

  const validateFirstName = (firstName) => {
    if (firstName.length < 2) {
      setFirstNameError('First name must be at least 2 characters long!')
      return false
    } else {
      setFirstNameError('')
      return true
    }
  }

  const validateLastName = (lastname) => {
    if(lastName.length < 2) {
      setLastNameError('Last name must be at least 2 characters long!')
      return false
    } else {
      setLastNameError('')
      return true
    }
  }

  const validateUsername = (username) => {
    if(username.length < 3) {
      setUsernameError('Username must be at least 3 characters long!')
      return false
    } 

    if(users.filter(user => user.username.toLowerCase() == username.toLowerCase()).length !== 0) {
      setUsernameError('User with this name already exists!')
      return false
    } else {
      setUsernameError('')
      return true
    }
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/
    if(!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long, contain at least 1 capital letter, 1 digit and 1 special character!')
      return false
    } else {
      setPasswordError('')
      return true
    }
  }

  const validateRepeatPassword = (password, repeatPassword) => {
    if(repeatPassword != password) {
      setRepeatPasswordError('Passwords don\'t match!')
      return false
    } else {
      setRepeatPasswordError('')
      return true
    }
  }

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}$/;
    
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('Invalid phone number format!');
      return false;
    } else {
      setPhoneNumberError('');
      return true;
    }
  }


  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex items-center mt-6'>
          <h1 className='main-header'>Registration</h1>
          <Link to='/' className='absolute left-10 top-15 text-2xl'>
              <FontAwesomeIcon icon={faArrowLeft}/>
            </Link>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-2/3 gap-4 m-5 '>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="first-name" className='input-label'>First name</label> 
            <input
              type="text"
              name='first-name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${firstNameError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>

          </div>
            {firstNameError != '' && <p className='text-red-500'>{firstNameError}</p>}
        </div>

        <div className='flex flex-col w-full justify-center items-center gap-0.5'>
          <div className='flex flex-col'>
            <label htmlFor="last-name" className='input-label'>Last name</label> 
            <input
              type="text"
              name='last-name'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${lastNameError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
          </div>
            {lastNameError != '' && <p className='text-red-500'>{lastNameError}</p>}
        </div>

        <div className='flex flex-col gap-0.5 w-full items-center content-center'>
          <div className='flex flex-col'>
            <label htmlFor="username" className='input-label'>Username</label> 
            <input
              type="text"
              name='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${usernameError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
          </div>
            {usernameError != '' && <p className='text-red-500'>{usernameError}</p>}
        </div>

        <div className='flex flex-col gap-0.5 w-full items-center content-center'>
          <div className='flex flex-col'>
            <label htmlFor="phoneNumber" className='input-label'>Phone number</label> 
            <input
              type="text"
              name='phoneNumber'
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className={`w-56 h-8 rounded-md border-2 pl-3 font-semibold ${phoneNumberError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
          </div>
            {phoneNumberError != '' && <p className='text-red-500'>{phoneNumberError}</p>}
        </div>

        <div className='flex flex-col gap-0.5 w-4/5 items-center'>
          <div className='flex flex-col relative w-56'>
            <label htmlFor="password" className='input-label'>Password</label> 
            <input
              type={`${showPassword ? 'text' : 'password'}`}
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-56 bg-neutral-300 h-8 rounded-md border-2 pl-3 font-semibold ${passwordError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className='absolute right-1 bottom-2 cursor-pointer'
              onClick={() => setShowPassword(prev => !prev)} />
          </div>
          {passwordError != '' && <p className='text-red-500 text-center'>{passwordError}</p>}
        </div>

        <div className='flex flex-col gap-0.5 w-4/5 items-center'>
          <div className='flex flex-col relative'>
            <label htmlFor="repeat-password" className='input-label'>Repeat password</label> 
            <input
              type={`${showRepeatPassword ? 'text' : 'password'}`}
              name='repeat-password'
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              className={`w-56 bg-neutral-300 h-8 rounded-md border-2 pl-3 font-semibold ${repeatPasswordError != '' ? 'border-red-600 bg-red-200' : 'border-slate-900 bg-neutral-300'}`}/>
              <FontAwesomeIcon
                icon={showRepeatPassword ? faEyeSlash : faEye}
                className='absolute right-1 bottom-2 cursor-pointer'
                onClick={() => setShowRepeatPassword(prev => !prev)} />
          </div>
          {repeatPasswordError != '' && <p className='text-red-500 text-center'>{repeatPasswordError}</p>}
        </div>

        <button type='submit' className='submit-btn'>Create Account</button>
      </form>
    </div>

  );
}
export default Register;