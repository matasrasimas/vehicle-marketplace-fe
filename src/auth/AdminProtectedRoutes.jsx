import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext, useUser } from './UserContext';

const AdminProtectedRoutes = () => {
  const loggedUser = useUser();

  return loggedUser != null && loggedUser.role === 'ADMIN' ? <Outlet/> : <Navigate to='/'/>
};

export default AdminProtectedRoutes;