import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import CabinsPage from './pages/CabinsPage';
import ReservationsPage from './pages/ReservationsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ConversationStatesPage from './pages/ConversationStatesPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
      <Route path="/cabins" element={<PrivateRoute><CabinsPage /></PrivateRoute>} />
      <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
      <Route path="/activities" element={<PrivateRoute><ActivitiesPage /></PrivateRoute>} />
      <Route path="/conversation-states" element={<PrivateRoute><ConversationStatesPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
