import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { API_URL } from '../../constants';

const Profiles = () => {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                    const response = await fetch(`${API_URL}/api/users`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const users = await response.json();
                        setUsers(users);
                    } else {
                        navigate('/')
                    }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='flex flex-col w-full'>

            <div className='flex self-center items-center mt-6'>
                <h1 className='main-header text-center'>Profiles</h1>
                <button 
                  className='absolute left-10 top-15 text-2xl'
                  onClick={() => navigate(-1)}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </div>

            <div className='grid grid-cols-1 w-7/12 custom1:grid-cols-2 custom1:w-10/12 custom2:grid-cols-3 custom2:w-11/12 gap-6 mx-auto my-5 justify-center items-center'>
                {users.map((user, index) => (
                    <ProfileCard key={index} user={user}/>
                ))}
            </div>

        </div>

    );
};
export default Profiles;