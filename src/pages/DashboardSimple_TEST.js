import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import DashboardLayout from '../components/Layout/DashboardLayout';
import TestComponent from '../components/TestComponent';

const DashboardSimple = () => {
  return (
    <DashboardLayout title="Dashboard Principal">
      <Box sx={{ mb: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              Diagnóstico del Sistema 🔧
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Probando la conectividad y funcionalidad del backend
            </Typography>
          </Box>
        </Box>

        {/* Test Component */}
        <TestComponent />
      </Box>
    </DashboardLayout>
  );
};

export default DashboardSimple;
