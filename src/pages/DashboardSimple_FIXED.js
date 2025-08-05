import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import DashboardLayout from '../components/Layout/DashboardLayout';
import DashboardAnalyticsRecharts from '../components/DashboardAnalyticsRecharts';

const DashboardSimple = () => {
  return (
    <DashboardLayout title="Dashboard Principal">
      <Box sx={{ mb: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              Dashboard Analytics Avanzado 📊
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema completo de análisis y métricas de negocio
            </Typography>
          </Box>
        </Box>

        {/* Dashboard Analytics Avanzado */}
        <DashboardAnalyticsRecharts />
      </Box>
    </DashboardLayout>
  );
};

export default DashboardSimple;
