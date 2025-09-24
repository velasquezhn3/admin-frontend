import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Box,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';

const ConnectionTest = () => {
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setTests(prev => ({ ...prev, [testName]: { status: 'running' } }));
    
    try {
      const result = await testFunction();
      setTests(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'success', 
          data: result,
          timestamp: new Date().toISOString()
        } 
      }));
    } catch (error) {
      setTests(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'error', 
          error: error.message,
          timestamp: new Date().toISOString()
        } 
      }));
    }
  };

  const testDirectBackend = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/test`);
    const data = await response.json();
    return data;
  };

  const testProxyBackend = async () => {
    const response = await fetch('/test');
    const data = await response.json();
    return data;
  };

  const testLogin = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    const data = await response.json();
    return data;
  };

  const testReservations = async () => {
    // Primero hacer login para obtener token
  const loginResponse = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('No se pudo obtener token de autenticación');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    // Ahora hacer la consulta de reservas con el token
  const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/reservations/upcoming`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  };

  const testAllReservations = async () => {
    // Primero hacer login para obtener token
  const loginResponse = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('No se pudo obtener token de autenticación');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    // Consultar todas las reservas
  const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/reservations?limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  };

  const testDashboard = async () => {
    // Primero hacer login para obtener token
  const loginResponse = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('No se pudo obtener token de autenticación');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    // Consultar dashboard
  const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  };

  const runAllTests = async () => {
    setLoading(true);
    setTests({});
    
    await runTest('direct_backend', testDirectBackend);
    await runTest('proxy_backend', testProxyBackend);
    await runTest('login', testLogin);
    await runTest('reservations', testReservations);
    await runTest('all_reservations', testAllReservations);
    await runTest('dashboard', testDashboard);
    
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'running': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return '✅ Éxito';
      case 'error': return '❌ Error';
      case 'running': return '🔄 Ejecutando';
      default: return '⏳ Pendiente';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        🔧 Test de Conectividad - Base de Datos Real
      </Typography>
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={runAllTests}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Ejecutar Todos los Tests'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {[
          {
            key: 'direct_backend',
            title: 'Backend Directo',
            description: `${process.env.REACT_APP_API_URL}/test`,
            test: testDirectBackend
          },
          {
            key: 'proxy_backend',
            title: 'Backend vía Proxy',
            description: '/test (proxy de React)',
            test: testProxyBackend
          },
          {
            key: 'login',
            title: 'Login',
            description: 'POST /auth/login con admin/admin123',
            test: testLogin
          },
          {
            key: 'reservations',
            title: 'Reservas Próximas',
            description: 'GET /admin/reservations/upcoming (con token)',
            test: testReservations
          },
          {
            key: 'all_reservations',
            title: 'Todas las Reservas',
            description: 'GET /admin/reservations (con token)',
            test: testAllReservations
          },
          {
            key: 'dashboard',
            title: 'Dashboard',
            description: 'GET /admin/dashboard (con token)',
            test: testDashboard
          }
        ].map(({ key, title, description, test }) => (
          <Grid item xs={12} md={6} key={key}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{title}</Typography>
                  <Chip
                    label={getStatusText(tests[key]?.status)}
                    color={getStatusColor(tests[key]?.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {description}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => runTest(key, test)}
                  disabled={tests[key]?.status === 'running'}
                  sx={{ mb: 2 }}
                >
                  Probar Solo Este
                </Button>

                {tests[key] && (
                  <Box>
                    {tests[key].status === 'success' && (
                      <Alert severity="success" sx={{ mb: 1 }}>
                        <Typography variant="caption" component="pre">
                          {JSON.stringify(tests[key].data, null, 2)}
                        </Typography>
                      </Alert>
                    )}
                    
                    {tests[key].status === 'error' && (
                      <Alert severity="error">
                        <Typography variant="body2">
                          {tests[key].error}
                        </Typography>
                      </Alert>
                    )}
                    
                    {tests[key].timestamp && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {tests[key].timestamp}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="h6">💡 Cómo interpretar los resultados:</Typography>
          <ul>
            <li><strong>Backend Directo:</strong> Debe funcionar si el servidor backend está ejecutándose</li>
            <li><strong>Backend vía Proxy:</strong> Debe funcionar si React está proxy-eando correctamente</li>
            <li><strong>Login:</strong> Debe devolver un token si las credenciales admin/admin123 son correctas</li>
            <li><strong>Reservas Próximas:</strong> Debe devolver reservas próximas de la base de datos real</li>
            <li><strong>Todas las Reservas:</strong> Debe devolver todas las reservas con paginación</li>
            <li><strong>Dashboard:</strong> Debe devolver métricas reales del dashboard</li>
          </ul>
        </Alert>
      </Box>
    </Container>
  );
};

export default ConnectionTest;
