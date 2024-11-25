import React, { useEffect, useState } from 'react';
import './styles.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faIdCard, faRoad, faCircleUser, faPhone, faXmark } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons'
import { useUser } from '../../auth/UserContext';
import Cookies from 'js-cookie';
import { API_URL } from '../../constants';

const Profile = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const loggedUser = useUser()

    const [user, setUser] = useState(null)
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)

    useEffect(() => {
        if(loggedUser.id !== userId && loggedUser.role !== 'ADMIN') {
            navigate('/')
            return
        }

        const fetchData = async () => {
      
          try {
          
                  const usersResponse = await fetch(`${API_URL}/api/users`);
                  if (!usersResponse.ok) throw new Error('Failed to fetch posts');
                  const users = await usersResponse.json();
          
                  const user = users.find(u => u.id === userId);
                  console.log(user)
                  if (!user) {
                    console.error(`User with id ${userId} not found`);
                    navigate('/');
                    return;
                  }

                  if(loggedUser.id !== userId && loggedUser.role !== 'ADMIN') {
                    navigate('/')
                    return
                  }
                  
                  setUser(user)

                } catch (error) {
                        console.error('Error fetching data:', error.message);
                    }
        };
      
        fetchData();
      }, []);


      const handleAccountDeletion = async () => {
        try {
            const jwt = Cookies.get('jwt')
            const response = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                credentials: 'include',
            });

            if (response.ok) {
                if(loggedUser.role == 'ADMIN') {
                    navigate('/profiles')
                    return
                }

                Cookies.remove("jwt")
                navigate('/')
                window.location.reload();

            } else {
                console.error('Error removing post:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing post:', error);
        }
    };


  return (

    <div className='flex flex-col w-full items-center'>
        <button 
          className='absolute left-10 top-15 text-2xl'
          onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      <div className='flex flex-col w-11/12 sm:w-3/5 md:w-2/5 my-8 py-6 gap-8 items-center bg-stone-300 border-2 border-gray-800 rounded-lg shadow-lg shadow-inner'>

        <div className='flex flex-col items-center justify-center gap-5'>
            <div className="w-11/12 flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleUser} className="text-[90px]" />
            </div>
            <h2 className='font-sans font-bold uppercase text-2xl'>{user ? `${user.username}` : ''}</h2> 
        </div>

        <div className='flex flex-col w-full items-center justify-center gap-5'>

            <div className='flex flex-row gap-3 justify-center'>
              <div className='flex flex-row justify-center items-center gap-2'>
              <FontAwesomeIcon icon={faIdCard} className='text-xl text-gray-800 ' />
              <p className='font-sans'>Full name:</p>
              </div>
              {user && <p className='font-sans font-bold'>{user.firstName} {user.lastName}</p>}
            </div>

            <div className='flex flex-row gap-3 justify-center'>
              <div className='flex flex-row justify-center items-center gap-2'>
                <FontAwesomeIcon icon={faPhone} className='text-xl text-gray-800 ' />
                <p className='font-sans'>Phone number:</p>
              </div>
                {user && <p className='font-sans font-bold'>{user.phoneNumber}</p>}
            </div>

        </div>

        {(loggedUser && user && user.role !== 'ADMIN' && (loggedUser.id == userId || loggedUser.role === 'ADMIN')) && (
          <button 
            className='bg-red-700 px-6 py-3 text-white font-semibold border-2 border-black w-40'
            onClick={() => setShowDeleteConfirmationModal(true)}
            >
              Delete account
          </button>
        )}

      </div>

      {showDeleteConfirmationModal && (
            <div className='fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center bg-sky-800 rounded-md w-11/12 sm:w-4/5 md:w-3/5'>
                <div className='flex flex-row justify-between bg-black w-full px-3 py-1 items-center'>
                  <p className='text-white font-bold font-sans tracking-wide'>Confirmation</p>
                  <FontAwesomeIcon icon={faXmark} onClick={() => {setShowDeleteConfirmationModal();}} className='text-white font-bold text-lg cursor-pointer' />
                </div>

                  <div className='flex flex-col gap-5 py-5 w-full items-center text-center'>
                    <p className='font-bold text-white font-sans tracking-wide text-lg'>Are you sure you want to delete {loggedUser.id == user.id ? 'your account' : `account '${user.username}'`}  ?</p>
                    <div className='flex flex-row justify-center gap-10'>
                      <button
                        className='w-20 h-9 bg-red-700 text-white rounded font-bold'
                        onClick={() => {handleAccountDeletion()}}
                      >
                        Yes
                      </button>
                      <button
                        className='w-20 bg-gray-300 text-gray-800 rounded font-bold'
                        onClick={() => setShowDeleteConfirmationModal(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          )}

    </div>


  );
}
export default Profile;