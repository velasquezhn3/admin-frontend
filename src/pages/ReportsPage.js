import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  Tab,
  Tabs,
  IconButton,
  Menu,
  Divider,
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  EventNote as ReservationsIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  MoreVert,
  PictureAsPdf,
  TableChart,
  Share,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import DashboardLayout from '../components/Layout/DashboardLayout';
import MetricCard from '../components/Common/MetricCard';

// Datos de ejemplo para reportes
const monthlyData = [
  { mes: 'Ene', reservas: 45, ingresos: 73500, ocupacion: 78, gastos: 26500 },
  { mes: 'Feb', reservas: 52, ingresos: 83500, ocupacion: 82, gastos: 28200 },
  { mes: 'Mar', reservas: 48, ingresos: 81200, ocupacion: 79, gastos: 30600 },
  { mes: 'Abr', reservas: 61, ingresos: 98800, ocupacion: 89, gastos: 32400 },
  { mes: 'May', reservas: 55, ingresos: 91200, ocupacion: 85, gastos: 30000 },
  { mes: 'Jun', reservas: 67, ingresos: 108800, ocupacion: 92, gastos: 34100 },
  { mes: 'Jul', reservas: 73, ingresos: 120600, ocupacion: 95, gastos: 36500 },
];

const cabinPerformance = [
  { cabana: 'Cabaña Bosque', reservas: 28, ingresos: 41200, ocupacion: 87 },
  { cabana: 'Cabaña Lago', reservas: 32, ingresos: 65900, ocupacion: 94 },
  { cabana: 'Cabaña Vista', reservas: 25, ingresos: 66200, ocupacion: 83 },
  { cabana: 'Cabaña Pino', reservas: 20, ingresos: 29400, ocupacion: 71 },
];

const customerSegments = [
  { name: 'Familias', value: 45, color: '#2563eb' },
  { name: 'Parejas', value: 35, color: '#10b981' },
  { name: 'Grupos', value: 15, color: '#f59e0b' },
  { name: 'Empresarial', value: 5, color: '#8b5cf6' },
];

const dailyOccupancy = [
  { dia: 'Lun', ocupacion: 65 },
  { dia: 'Mar', ocupacion: 72 },
  { dia: 'Mié', ocupacion: 85 },
  { dia: 'Jue', ocupacion: 90 },
  { dia: 'Vie', ocupacion: 95 },
  { dia: 'Sáb', ocupacion: 98 },
  { dia: 'Dom', ocupacion: 88 },
];

const ReportsPage = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1), // Enero 1, 2025
    to: new Date(2025, 6, 31), // Julio 31, 2025
  });
  const [period, setPeriod] = useState('monthly');
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Métricas calculadas
  const totalReservas = monthlyData.reduce((sum, month) => sum + month.reservas, 0);
  const totalIngresos = monthlyData.reduce((sum, month) => sum + month.ingresos, 0);
  const promedioOcupacion = Math.round(
    monthlyData.reduce((sum, month) => sum + month.ocupacion, 0) / monthlyData.length
  );
  const totalGastos = monthlyData.reduce((sum, month) => sum + month.gastos, 0);
  const gananciaTotal = totalIngresos - totalGastos;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'white',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.name.includes('Ingresos') || entry.name.includes('Gastos') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const handleExport = (format) => {
    console.log(`Exportando reporte en formato ${format}`);
    setMenuAnchor(null);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <DashboardLayout title="Reportes y Análisis">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Reportes
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={period}
                  label="Período"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="daily">Diario</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                  <MenuItem value="monthly">Mensual</MenuItem>
                  <MenuItem value="yearly">Anual</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => handleExport('pdf')}>
                  <PictureAsPdf sx={{ mr: 1 }} />
                  Exportar PDF
                </MenuItem>
                <MenuItem onClick={() => handleExport('excel')}>
                  <TableChart sx={{ mr: 1 }} />
                  Exportar Excel
                </MenuItem>
                <MenuItem onClick={() => handleExport('share')}>
                  <Share sx={{ mr: 1 }} />
                  Compartir
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Filtros de fecha */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <DatePicker
                  label="Desde"
                  value={dateRange.from}
                  onChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                <DatePicker
                  label="Hasta"
                  value={dateRange.to}
                  onChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
                <Button variant="contained" sx={{ borderRadius: 2 }}>
                  Aplicar Filtros
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Métricas resumen */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Reservas"
                value={totalReservas}
                change="+15%"
                changeType="positive"
                icon={<ReservationsIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Ingresos Totales"
                value={formatCurrency(totalIngresos)}
                change="+22%"
                changeType="positive"
                icon={<MoneyIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Ocupación Promedio"
                value={`${promedioOcupacion}%`}
                change="+8%"
                changeType="positive"
                icon={<HomeIcon />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Ganancia Neta"
                value={formatCurrency(gananciaTotal)}
                change="+18%"
                changeType="positive"
                icon={<TrendingUpIcon />}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Tabs de reportes */}
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                aria-label="report tabs"
              >
                <Tab label="Ingresos" />
                <Tab label="Ocupación" />
                <Tab label="Cabañas" />
                <Tab label="Clientes" />
              </Tabs>
            </Box>

            {/* Panel 1: Ingresos */}
            <TabPanel value={currentTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Tendencia de Ingresos y Gastos
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="mes" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="ingresos"
                          fill="#2563eb"
                          fillOpacity={0.3}
                          stroke="#2563eb"
                          strokeWidth={3}
                          name="Ingresos"
                        />
                        <Bar
                          dataKey="gastos"
                          fill="#ef4444"
                          name="Gastos"
                        />
                        <Line
                          type="monotone"
                          dataKey="reservas"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                          name="Reservas"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Card sx={{ p: 3, height: 'fit-content' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Distribución de Ingresos
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Ingresos Brutos</Typography>
                        <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {formatCurrency(totalIngresos)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Gastos Operativos</Typography>
                        <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                          {formatCurrency(totalGastos)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Ganancia Neta</Typography>
                        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                          {formatCurrency(gananciaTotal)}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        bgcolor: gananciaTotal > 0 ? 'success.light' : 'error.light',
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: gananciaTotal > 0 ? 'success.dark' : 'error.dark',
                          fontWeight: 600
                        }}>
                          Margen: {((gananciaTotal / totalIngresos) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Panel 2: Ocupación */}
            <TabPanel value={currentTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Tendencia de Ocupación Mensual
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorOcupacion" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="mes" stroke="#666" />
                        <YAxis stroke="#666" domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="ocupacion"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorOcupacion)"
                          strokeWidth={3}
                          name="Ocupación %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Ocupación por Día de la Semana
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dailyOccupancy}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="dia" stroke="#666" />
                        <YAxis stroke="#666" domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="ocupacion"
                          fill="#06b6d4"
                          radius={[4, 4, 0, 0]}
                          name="Ocupación %"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Estadísticas de Ocupación
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Promedio</Typography>
                        <Chip label={`${promedioOcupacion}%`} color="primary" size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Máximo</Typography>
                        <Chip label="98%" color="success" size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Mínimo</Typography>
                        <Chip label="65%" color="warning" size="small" />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Panel 3: Rendimiento por Cabañas */}
            <TabPanel value={currentTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Rendimiento por Cabaña
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={cabinPerformance} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" stroke="#666" />
                        <YAxis dataKey="cabana" type="category" stroke="#666" width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="reservas" fill="#2563eb" name="Reservas" />
                        <Bar dataKey="ocupacion" fill="#10b981" name="Ocupación %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Ranking de Cabañas
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {cabinPerformance
                        .sort((a, b) => b.ingresos - a.ingresos)
                        .map((cabin, index) => (
                          <Box key={cabin.cabana} sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 2,
                            bgcolor: index === 0 ? 'success.light' : 'grey.50',
                            borderRadius: 2
                          }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                #{index + 1} {cabin.cabana}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {cabin.reservas} reservas | {cabin.ocupacion}% ocupación
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {formatCurrency(cabin.ingresos)}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Panel 4: Análisis de Clientes */}
            <TabPanel value={currentTab} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Segmentación de Clientes
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={customerSegments}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={150}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {customerSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Estadísticas de Clientes
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            1,247
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Clientes
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            89%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Clientes Recurrentes
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                            4.8
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Calificación Promedio
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                            3.2
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Estadía Promedio (días)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Distribución por Tipo
                      </Typography>
                      {customerSegments.map((segment) => (
                        <Box key={segment.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: 1, 
                              bgcolor: segment.color,
                              mr: 2 
                            }} 
                          />
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {segment.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {segment.value}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Box>
      </LocalizationProvider>
    </DashboardLayout>
  );
};

export default ReportsPage;
