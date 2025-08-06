import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('adminToken');
      
      // Si no hay token, crear uno temporal para desarrollo
      if (!token) {
        try {
          const response = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: 'admin',
              password: 'admin123'
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.token) {
              token = data.data.token;
              localStorage.setItem('adminToken', token);
              localStorage.setItem('adminUser', JSON.stringify({ username: 'admin', role: 'super_admin' }));
              console.log('🔑 Token de desarrollo creado automáticamente');
            }
          }
        } catch (error) {
          console.error('Error obteniendo token de desarrollo:', error);
        }
      }

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
