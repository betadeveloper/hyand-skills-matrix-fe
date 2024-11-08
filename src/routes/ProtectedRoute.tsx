import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type ProtectedRouteProps = {
  element: React.ReactNode;
  path: string;
};

const validateToken = (token: string): boolean => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = window.atob(payload);
    const parsedClaims = JSON.parse(decodedPayload);

    const currentTime = Date.now() / 1000;
    if (parsedClaims.exp && parsedClaims.exp < currentTime) {
      console.error('JWT token expired');
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const isAuthenticated = token ? validateToken(token) : false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return element;
};

export default ProtectedRoute;