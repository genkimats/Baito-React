import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { BaitoContext } from '../context/BaitoProvider';

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(BaitoContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
