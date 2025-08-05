import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert
} from '@mui/material';
import UpcomingReservationsTest from '../components/UpcomingReservationsTest';
import ReservationsDebugTest from '../components/ReservationsDebugTest';

const TestDashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        🧪 Dashboard de Prueba
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        Esta es una versión de prueba del dashboard que no requiere autenticación.
        Funciona con el servidor simple que creamos.
      </Alert>

      <Grid container spacing={3}>
        {/* Reservas Inminentes */}
        <Grid item xs={12} lg={8}>
          <UpcomingReservationsTest />
        </Grid>
        
        {/* Test de Conectividad */}
        <Grid item xs={12} lg={4}>
          <ReservationsDebugTest />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestDashboard;
