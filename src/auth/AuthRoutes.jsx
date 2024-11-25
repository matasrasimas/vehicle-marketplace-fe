import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from './UserContext';
import { API_URL } from '../constants';

const AuthRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/auth`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className='flex flex-col items-center w-full'>
               <h1 className='main-header'>Loading...</h1>
           </div>
  }

  return (
    <UserContext.Provider value={user}>
      <Outlet />
    </UserContext.Provider>
  );
};

export default AuthRoutes;