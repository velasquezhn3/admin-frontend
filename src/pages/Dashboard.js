import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, Typography, AppBar, Toolbar, Button } from '@mui/material';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Panel de Administración
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: 240, flexShrink: 0, mt: 8, bgcolor: 'background.paper' }}>
        <List>
          <ListItem button component={Link} to="/users">
            <ListItemText primary="Usuarios" />
          </ListItem>
          <ListItem button component={Link} to="/cabins">
            <ListItemText primary="Cabañas" />
          </ListItem>
          <ListItem button component={Link} to="/reservations">
            <ListItemText primary="Reservas" />
          </ListItem>
          <ListItem button component={Link} to="/activities">
            <ListItemText primary="Actividades" />
          </ListItem>
          <ListItem button component={Link} to="/conversation-states">
            <ListItemText primary="Estados de Conversación" />
          </ListItem>
        </List>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
