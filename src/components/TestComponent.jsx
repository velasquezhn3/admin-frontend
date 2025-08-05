import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Paper } from '@mui/material';

const TestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    const results = {};
    
    try {
      // Test básico de conectividad
      try {
        const basicTest = await fetch('/admin/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        results.connectivity = `Status: ${basicTest.status}`;
      } catch (err) {
        results.connectivity = `ERROR: ${err.message}`;
      }

      // Test de login
      try {
        const loginResponse = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123'
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('adminToken', loginData.data.token);
          results.login = 'OK: Token obtenido y guardado';
        } else {
          const errorData = await loginResponse.json();
          results.login = `ERROR: ${errorData.message}`;
        }
      } catch (err) {
        results.login = `ERROR: ${err.message}`;
      }

      // Test con token
      const token = localStorage.getItem('adminToken');
      if (token) {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Test dashboard
        try {
          const dashboardRes = await fetch('/admin/dashboard', { headers });
          if (dashboardRes.ok) {
            const dashboardData = await dashboardRes.json();
            results.dashboard = `OK: ${JSON.stringify(dashboardData.data.totalUsers || 'No data')}`;
          } else {
            const errorData = await dashboardRes.json();
            results.dashboard = `ERROR: ${errorData.message}`;
          }
        } catch (err) {
          results.dashboard = `ERROR: ${err.message}`;
        }

        // Test revenue con período válido
        try {
          const revenueRes = await fetch('/admin/dashboard/revenue?period=monthly&months=12', { headers });
          if (revenueRes.ok) {
            const revenueData = await revenueRes.json();
            results.revenue = `OK: ${revenueData.data?.data?.length || 0} entries`;
          } else {
            const errorData = await revenueRes.json();
            results.revenue = `ERROR: ${errorData.message}`;
          }
        } catch (err) {
          results.revenue = `ERROR: ${err.message}`;
        }
      }

    } catch (error) {
      results.general = `ERROR: ${error.message}`;
    }
    
    setTestResults(results);
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Diagnóstico del Sistema
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testAPI} 
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? 'Probando...' : 'Probar APIs'}
      </Button>

      {Object.keys(testResults).length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resultados de las Pruebas:
          </Typography>
          {Object.entries(testResults).map(([key, value]) => (
            <Alert 
              key={key}
              severity={value.includes('OK') ? 'success' : 'error'}
              sx={{ mb: 1 }}
            >
              <strong>{key}:</strong> {value}
            </Alert>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default TestComponent;
