import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state?.auth?.signupData);

  if (!user) {
    return <Navigate to="/checkEmailPage" replace />;
  }

  return children;
};

export default PrivateRoute;
