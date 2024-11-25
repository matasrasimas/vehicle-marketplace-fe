import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext, useUser } from './UserContext';

const GuestProtectedRoutes = () => {
  const loggedUser = useUser();

  return loggedUser == null ? <Outlet/> : <Navigate to='/'/>
};

export default GuestProtectedRoutes;