import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext, useUser } from './UserContext';

const UserProtectedRoutes = () => {
  const loggedUser = useUser();

  return loggedUser != null && (loggedUser.role === 'ADMIN' || loggedUser.role === 'USER') ? <Outlet/> : <Navigate to='/'/>
};

export default UserProtectedRoutes;