# Dashboard Administrativo Villas Julie

## 🏡 Sistema de Gestión de Cabañas

Dashboard administrativo completo y moderno para la gestión de reservas, usuarios, cabañas y reportes de Villas Julie.

### ✨ Características Principales

#### 🎨 Diseño y Experiencia de Usuario
- **Interfaz moderna** con Material-UI y diseño profesional
- **Responsive design** optimizado para mobile y desktop
- **Paleta de colores profesional**: azules (#2563eb), verdes (#10b981), grises neutros
- **Microinteracciones** y animaciones suaves
- **Dark/Light theme** support (configuración futura)

#### 📊 Dashboard Principal
- **Métricas en tiempo real**: reservas hoy, ocupación, ingresos
- **Gráficos interactivos** con Recharts
- **Notificaciones y alertas** críticas
- **Acciones rápidas** para operaciones comunes

#### 📅 Gestión de Reservas
- **Tabla avanzada** con filtros múltiples
- **Vista calendario** interactiva
- **Detalles completos** en modals deslizables
- **Estados de reserva** con chips visuales
- **Búsqueda en tiempo real**

#### 👥 Gestión de Usuarios
- **CRUD completo** con roles (admin/cliente)
- **Filtros avanzados** por actividad y tipo
- **Historial de reservas** por usuario
- **Perfiles detallados** con métricas

#### 🏠 Gestión de Cabañas
- **Galería visual** con cards atractivas
- **Sistema de disponibilidad** en tiempo real
- **Editor completo** de detalles y servicios
- **Métricas de rendimiento** por cabaña

#### 📈 Reportes y Análisis
- **Gráficos interactivos** de ingresos y ocupación
- **Análisis de rendimiento** por cabaña
- **Segmentación de clientes**
- **Exportación** en PDF y Excel

#### ⚙️ Configuración
- **Configuración general** del sistema
- **Gestión de notificaciones**
- **Políticas de reserva** y pagos
- **Seguridad y respaldos**

### 🚀 Tecnologías Utilizadas

#### Frontend
- **React 18** - Framework principal
- **Material-UI v5** - Biblioteca de componentes
- **React Router v6** - Navegación
- **Recharts** - Gráficos y visualizaciones
- **MUI X Data Grid** - Tablas avanzadas
- **MUI X Date Pickers** - Selectores de fecha
- **Axios** - Cliente HTTP

#### Herramientas de Desarrollo
- **Create React App** - Configuración base
- **ESLint & Prettier** - Calidad de código
- **Git** - Control de versiones

### 📦 Instalación y Configuración

1. **Instalar dependencias**
   ```bash
   cd admin-frontend
   npm install
   ```

2. **Instalar dependencias adicionales**
   ```bash
   npm install @mui/x-data-grid @mui/x-date-pickers @mui/x-charts recharts date-fns
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### 🔧 Configuración del Backend

El frontend está configurado para funcionar con el backend existente:

```json
{
  "proxy": "http://localhost:4000"
}
```

### 📱 Estructura del Proyecto

```
admin-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── DashboardLayout.js
│   │   │   └── Sidebar.js
│   │   ├── Common/
│   │   │   ├── MetricCard.js
│   │   │   ├── StatusChip.js
│   │   │   └── EmptyState.js
│   │   └── PrivateRoute.js
│   ├── pages/
│   │   ├── DashboardNew.js
│   │   ├── ReservationsPageNew.js
│   │   ├── UsersPageNew.js
│   │   ├── CabinsPageNew.js
│   │   ├── CalendarPage.js
│   │   ├── ReportsPage.js
│   │   ├── SettingsPage.js
│   │   └── LoginPage.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

### 🎯 Funcionalidades por Módulo

#### Dashboard Principal
- ✅ Métricas en tiempo real
- ✅ Gráficos de tendencias
- ✅ Actividad reciente
- ✅ Acciones rápidas
- ✅ Notificaciones

#### Reservas
- ✅ Tabla con filtros avanzados
- ✅ Búsqueda en tiempo real
- ✅ Vista detallada
- ✅ Estados visuales
- 🔄 Vista calendario (en desarrollo)

#### Usuarios
- ✅ CRUD completo
- ✅ Roles y permisos
- ✅ Historial de actividad
- ✅ Filtros múltiples
- ✅ Perfiles detallados

#### Cabañas
- ✅ Galería visual
- ✅ Gestión de servicios
- ✅ Métricas de rendimiento
- ✅ Editor completo
- 🔄 Gestión de imágenes

#### Reportes
- ✅ Gráficos interactivos
- ✅ Análisis de ingresos
- ✅ Rendimiento por cabaña
- ✅ Segmentación de clientes
- 🔄 Exportación

#### Configuración
- ✅ Configuración general
- ✅ Notificaciones
- ✅ Políticas de negocio
- ✅ Seguridad
- 🔄 Integración con APIs

### 🎨 Guía de Estilos

#### Colores Principales
- **Primary**: #2563eb (Azul confianza)
- **Success**: #10b981 (Verde éxito)
- **Warning**: #f59e0b (Naranja alerta)
- **Error**: #ef4444 (Rojo error)
- **Info**: #06b6d4 (Cyan información)

#### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800

#### Componentes
- **Bordes**: 8px radius por defecto
- **Sombras**: Suaves y consistentes
- **Spacing**: Sistema de 8px

### 🔐 Autenticación

El sistema utiliza JWT tokens para autenticación:
- Login con email/contraseña
- Token almacenado en localStorage
- Rutas protegidas con PrivateRoute
- Redirección automática

### 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo para demostración:
- Reservas ficticias
- Usuarios de prueba
- Cabañas configuradas
- Métricas simuladas

### 🔄 Próximas Mejoras

#### Funcionalidades
- [ ] Sistema de notificaciones en tiempo real
- [ ] Integración con WhatsApp Bot
- [ ] Gestión de archivos y documentos
- [ ] Sistema de comentarios y notas
- [ ] Integración con pasarelas de pago

#### Técnicas
- [ ] Tests unitarios con Jest
- [ ] Storybook para componentes
- [ ] PWA (Progressive Web App)
- [ ] Optimización de rendimiento
- [ ] Internacionalización (i18n)

### 🐛 Troubleshooting

#### Errores Comunes

1. **Dependencias no instaladas**
   ```bash
   npm install
   ```

2. **Puerto ocupado**
   ```bash
   npm start -- --port 3001
   ```

3. **Proxy no funciona**
   - Verificar que el backend esté en puerto 4000
   - Revisar configuración en package.json

### 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### 📄 Licencia

Este proyecto es privado y propietario de Villas Julie.

### 📞 Soporte

Para soporte técnico o consultas:
- Email: admin@villasjulie.com
- Teléfono: +54 9 11 1234-5678

---

**Villas Julie Dashboard** - Gestión profesional de cabañas y reservas 🏡
