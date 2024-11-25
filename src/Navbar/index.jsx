import React, {useEffect, useState} from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faBars } from '@fortawesome/free-solid-svg-icons'
import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import { API_URL } from '../constants';

const Navbar = () => {

  const navigate = useNavigate()

  const [loggedUser, setLoggedUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {

    const getLoggedUser = async() => {
      const jwt = Cookies.get("jwt")
      if(jwt == undefined) return
      try {
        const response = await fetch(`${API_URL}/api/auth`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
          credentials: 'include'
        });
  
        if (response.ok) {
          const user = await response.json()
          setLoggedUser(user)
        }
  
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }
    getLoggedUser()
  }, [])


  const toggleMenu = () => {
    setShowMenu(prev => !prev)
  }

  const handleLogout = () => {
    Cookies.remove("jwt")
    setLoggedUser(null)
    navigate('/')
    window.location.reload();

  }

  return (
    <div className='flex justify-between bg-blue-700 w-full px-6 py-3 text-white font-semibold'>
      <div className='flex justify-start items-end w-1/3'>
        <h2 className='navbar-hdr'>
          <Link to='/'>Vehicle Marketplace</Link>
        </h2>
      </div>

      <div className='flex flex-row justify-center items-center w-1/3'>
        <Link to={loggedUser ? `/profiles/${loggedUser.id}` : ''} className='flex gap-x-2'>         
          <p className='navbar-welcome-label hidden sm:block'>Welcome, {loggedUser ? loggedUser.firstName : 'Guest'}!</p>
          <FontAwesomeIcon icon={faCircleUser} className='navbar-icon' />
        </Link>
      </div>
      <ul className='md:flex flex-row justify-end gap-6 items-center w-2/5 hidden'>

       <li className='navbar-ul-item'>
          <Link to="/categories">Categories</Link>
        </li>

        {loggedUser && loggedUser.role === 'ADMIN' && (
          <li className='navbar-ul-item'>
            <Link to="/profiles">Profiles</Link>
          </li>
        )}

        {loggedUser ? (
          <>
              <li className='navbar-ul-item'>
                <Link onClick={toggleMenu} to={`/profiles/${loggedUser.id}`}>Profile</Link>
              </li>
              <li className='navbar-ul-item'>
                 <p onClick={handleLogout}>Logout</p>
              </li>
          </>
        ) : (
          <>
            <li className='navbar-ul-item'>
              <Link to="/register">Register</Link>
            </li>
            <li className='navbar-ul-item'>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>

      <div className='md:hidden flex items-center justify-end w-1/3'>
        <FontAwesomeIcon icon={faBars} className='navbar-icon' onClick={toggleMenu} />
        {showMenu && (
          <div className='md:hidden flex flex-column fixed right-5 top-11 bg-white opacity-90 z-50 text-black border border-gray-300 rounded p-4'>
            <ul className='flex flex-col'>
              <li className='navbar-ul-item'>
                <Link onClick={toggleMenu} to="/categories">Categories</Link>
              </li>

              {loggedUser && loggedUser.role === 'ADMIN' && (
                <li className='navbar-ul-item'>
                  <Link onClick={toggleMenu} to="/profiles">Profiles</Link>
                </li>
              )}

              {loggedUser ? (
                <>
                  <li className='navbar-ul-item'>
                     <Link onClick={toggleMenu} to={`/profiles/${loggedUser.id}`}>Profile</Link>
                  </li>
                  <li className='navbar-ul-item'>
                     <p onClick={handleLogout}>Logout</p>
                  </li>
                </>
              ) : (
                <>
                  <li className='navbar-ul-item'>
                    <Link onClick={toggleMenu} to="/register">Register</Link>
                  </li>
                  <li className='navbar-ul-item'>
                    <Link onClick={toggleMenu} to="/login">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
export default Navbar;