import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const auth = useAuth();

  // Handle case where AuthContext is null (provider not yet mounted)
  if (!auth) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  const { user, loading } = auth;

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;