/**
 * Componente de prueba simple para debug del QueueService
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

// Definir el servicio directamente en el componente como fallback
const testQueueService = {
  async getQueueStats() {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch('/api/bot/queue-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo estadísticas de cola:', error);
      throw error;
    }
  }
};

const QueueDashboardTest = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Testing queue connection...');
      
      const result = await testQueueService.getQueueStats();
      console.log('Queue stats result:', result);
      setStats(result);
    } catch (err) {
      console.error('Error testing queue:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Queue Dashboard Test
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        onClick={testConnection}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Test Connection'}
      </Button>
      
      {stats && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">✅ Connection Success!</Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </Box>
      )}
      
      {!stats && !loading && !error && (
        <Alert severity="info">
          Click "Test Connection" to verify the queue service
        </Alert>
      )}
    </Box>
  );
};

export default QueueDashboardTest;
