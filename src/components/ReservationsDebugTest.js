import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReservationsDebugTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  
  const testEndpoint = async (name, url, method = 'GET', body = null) => {
    try {
      setLoading(true);
      setResults(prev => ({ ...prev, [name]: { loading: true } }));
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
      const data = await response.json();
      
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: true, 
          status: response.status,
          data: data,
          timestamp: new Date().toISOString()
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAll = async () => {
    setResults({});
    const API_URL = process.env.REACT_APP_API_URL;
    await testEndpoint('test', `${API_URL}/test`);
    await testEndpoint('login', `${API_URL}/auth/login`, 'POST', {
      username: 'admin',
      password: 'admin123'
    });
    await testEndpoint('upcoming', `${API_URL}/admin/reservations/upcoming`);
    await testEndpoint('general', `${API_URL}/admin/reservations`);
  };

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔧 Debug Reservas (Test)
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testAll}
            disabled={loading}
            fullWidth
            sx={{ mb: 1 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Probar Todos'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => testEndpoint('upcoming', `${process.env.REACT_APP_API_URL}/admin/reservations/upcoming`)}
            disabled={loading}
            fullWidth
            size="small"
          >
            Solo Upcoming
          </Button>
        </Box>

        {Object.entries(results).map(([name, result]) => (
          <Accordion key={name} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2">
                  {name.toUpperCase()}
                </Typography>
                {result.loading && <CircularProgress size={16} />}
                {result.success === true && (
                  <Typography color="success.main" fontSize="0.75rem">
                    ✅ {result.status}
                  </Typography>
                )}
                {result.success === false && (
                  <Typography color="error.main" fontSize="0.75rem">
                    ❌ Error
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}>
                  {JSON.stringify(result, null, 2)}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        
        {Object.keys(results).length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Haz clic en "Probar Todos" para ejecutar tests
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationsDebugTest;
