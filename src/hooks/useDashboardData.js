import { useState, useEffect, useCallback, useRef } from 'react';
import dashboardService from '../services/dashboardService';

/**
 * Hook personalizado para gestionar datos del dashboard en tiempo real
 */
const useDashboardData = ({ 
  autoRefresh = true, 
  refreshInterval = 60000, // 1 minuto por defecto
  onError,
  onDataUpdate 
} = {}) => {
  
  // Estados principales
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Referencias para cleanup
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  
  // Función para cargar datos
  const loadData = useCallback(async (showLoading = true) => {
    if (!mountedRef.current) return;
    
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      setError(null);
      
      const result = await dashboardService.getAllDashboardData();
      
      if (!mountedRef.current) return;
      
      setData(result);
      setLastUpdated(new Date());
      
      // Callback para notificar actualización
      if (onDataUpdate) {
        onDataUpdate(result);
      }
      
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('Error loading dashboard data:', err);
      const errorMessage = err.message || 'Error al cargar los datos del dashboard';
      setError(errorMessage);
      
      // Callback para manejar errores
      if (onError) {
        onError(err);
      }
      
      // Datos de respaldo en caso de error crítico
      if (!data) {
        setData(getBackupData());
      }
      
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [data, onDataUpdate, onError]);
  
  // Función para obtener datos de respaldo
  const getBackupData = () => ({
    metrics: {
      totalUsers: 1247,
      totalReservations: 348,
      totalRevenue: 87500,
      activeReservations: 23,
      occupancyRate: 78.5,
      averageReservationValue: 2850,
      newUsersThisMonth: 47,
      revenueGrowth: 12.3
    },
    revenueData: {
      data: [
        { period: 'Ene', revenue: 45000, reservations: 25 },
        { period: 'Feb', revenue: 52000, reservations: 28 },
        { period: 'Mar', revenue: 48000, reservations: 26 },
        { period: 'Abr', revenue: 65000, reservations: 32 },
        { period: 'May', revenue: 58000, reservations: 29 },
        { period: 'Jun', revenue: 72000, reservations: 35 }
      ]
    },
    occupancyData: {
      cabins: [
        { name: 'Cabaña Bosque', occupancy: 85, revenue: 25000 },
        { name: 'Cabaña Lago', occupancy: 72, revenue: 22000 },
        { name: 'Cabaña Vista', occupancy: 90, revenue: 28000 },
        { name: 'Cabaña Pino', occupancy: 65, revenue: 18000 }
      ]
    },
    recentActivity: [
      {
        id: 1,
        type: 'reservation',
        message: 'Nueva reserva de Juan Pérez',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'confirmada'
      },
      {
        id: 2,
        type: 'checkin',
        message: 'Check-in realizado por María García',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'completado'
      },
      {
        id: 3,
        type: 'payment',
        message: 'Pago recibido de Carlos López',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'aprobado'
      }
    ],
    systemMetrics: {
      status: 'operational',
      uptime: Date.now() - (Date.now() % (24 * 60 * 60 * 1000)),
      memory: { used: 75, total: 512 },
      database: { status: 'connected', responseTime: 25 },
      requests: { total: 7500, errors: 12, avgResponseTime: 120 }
    },
    systemAlerts: [],
    lastUpdated: new Date().toISOString()
  });
  
  // Función para actualizar manualmente
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);
  
  // Función para limpiar cache
  const clearCache = useCallback(() => {
    dashboardService.clearCache();
    loadData();
  }, [loadData]);
  
  // Configurar auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    // Limpiar intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Configurar nuevo intervalo
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        loadData(false); // No mostrar loading en actualizaciones automáticas
      }
    }, refreshInterval);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, loadData]);
  
  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Funciones de utilidad
  const isDataStale = useCallback(() => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated.getTime() > refreshInterval * 2;
  }, [lastUpdated, refreshInterval]);
  
  const getDataAge = useCallback(() => {
    if (!lastUpdated) return null;
    return Date.now() - lastUpdated.getTime();
  }, [lastUpdated]);
  
  const formatLastUpdated = useCallback(() => {
    if (!lastUpdated) return 'Nunca';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - lastUpdated) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes === 1) return 'hace 1 minuto';
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return 'hace 1 hora';
    if (diffInHours < 24) return `hace ${diffInHours} horas`;
    
    return lastUpdated.toLocaleDateString();
  }, [lastUpdated]);
  
  return {
    // Datos
    data,
    loading,
    error,
    lastUpdated,
    refreshing,
    
    // Acciones
    refresh,
    clearCache,
    
    // Utilidades
    isDataStale: isDataStale(),
    dataAge: getDataAge(),
    lastUpdatedFormatted: formatLastUpdated(),
    
    // Estados específicos
    hasError: !!error,
    hasData: !!data,
    isLoading: loading && !data,
    isRefreshing: refreshing,
    
    // Métricas específicas (shortcuts)
    metrics: data?.metrics,
    revenueData: data?.revenueData,
    occupancyData: data?.occupancyData,
    recentActivity: data?.recentActivity,
    systemMetrics: data?.systemMetrics,
    systemAlerts: data?.systemAlerts
  };
};

export default useDashboardData;
