import React, { useState, useEffect } from 'react';
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
import apiService from '../services/apiService';

const ReservationsDebugComponent = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  
  const testEndpoint = async (name, endpoint, params = {}) => {
    try {
      setLoading(true);
      setResults(prev => ({ ...prev, [name]: { loading: true } }));
      
      let response;
      if (endpoint === 'getUpcomingReservations') {
        response = await apiService.getUpcomingReservations();
      } else if (endpoint === 'getReservations') {
        response = await apiService.getReservations(params);
      } else {
        // Llamada directa al endpoint
        response = await apiService.request(endpoint);
      }
      
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: true, 
          data: response,
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
    await testEndpoint('upcoming', 'getUpcomingReservations');
    await testEndpoint('general', 'getReservations', { limit: 10, offset: 0 });
    await testEndpoint('direct_upcoming', '/admin/reservations/upcoming');
    await testEndpoint('direct_general', '/admin/reservations?limit=10&offset=0');
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🔧 Debug de Reservas
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testAll}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Probar Todos los Endpoints'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => testEndpoint('upcoming', 'getUpcomingReservations')}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Solo Upcoming
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => testEndpoint('general', 'getReservations', { limit: 5 })}
            disabled={loading}
          >
            Solo General
          </Button>
        </Box>

        {Object.entries(results).map(([name, result]) => (
          <Accordion key={name} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">
                  {name.replace('_', ' ').toUpperCase()}
                </Typography>
                {result.loading && <CircularProgress size={20} />}
                {result.success && (
                  <Alert severity="success" sx={{ py: 0 }}>
                    ✅ Éxito - {Array.isArray(result.data) ? result.data.length : 
                      result.data?.data?.length || 'N/A'} items
                  </Alert>
                )}
                {result.success === false && (
                  <Alert severity="error" sx={{ py: 0 }}>
                    ❌ Error
                  </Alert>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(result, null, 2)}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        
        {Object.keys(results).length === 0 && (
          <Alert severity="info">
            Haz clic en "Probar Todos los Endpoints" para ejecutar las pruebas
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationsDebugComponent;
