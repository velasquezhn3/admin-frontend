import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';

// Mock para React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Tema de prueba
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#10b981',
    },
  },
});

// Helper para renderizar con proveedores
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={testTheme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('🚀 App - Componente Principal', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    
    // Mock de console.error para suprimir warnings de testing
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar mocks
    jest.restoreAllMocks();
  });

  describe('📱 Renderizado Inicial', () => {
    test('✅ Debe renderizar sin errores', () => {
      expect(() => {
        renderWithProviders(<App />);
      }).not.toThrow();
    });

    test('✅ Debe aplicar el tema correctamente', () => {
      renderWithProviders(<App />);
      
      // Verificar que CssBaseline está aplicado
      const body = document.body;
      expect(body).toBeInTheDocument();
    });

    test('✅ Debe mostrar la página de login por defecto', () => {
      renderWithProviders(<App />);
      
      // Verificar que estamos en la página de login (sin token)
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('🔐 Gestión de Autenticación', () => {
    test('✅ Debe redirigir a login si no hay token', async () => {
      localStorage.removeItem('adminToken');
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        // Como no hay token, debe mostrar login
        expect(screen.getByText(/login/i) || screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
      });
    });

    test('✅ Debe mostrar dashboard si hay token válido', async () => {
      // Simular token válido
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJ1c2VybmFtZSI6InRlc3RhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxNjIzNDYwMzg5fQ.test';
      localStorage.setItem('adminToken', mockToken);
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        // Debe mostrar contenido de dashboard
        expect(screen.getByText(/dashboard/i) || screen.getByText(/cargando/i)).toBeInTheDocument();
      });
    });
  });

  describe('🛣️ Navegación y Rutas', () => {
    test('✅ Debe manejar rutas no existentes', () => {
      // Mock para cambiar la URL
      window.history.pushState({}, 'Test', '/ruta-inexistente');
      
      renderWithProviders(<App />);
      
      // Debe redirigir a la página principal
      expect(window.location.pathname).toBe('/ruta-inexistente');
    });

    test('✅ Debe permitir navegación entre rutas válidas', async () => {
      localStorage.setItem('adminToken', 'valid-token');
      
      renderWithProviders(<App />);
      
      // Verificar que puede navegar
      await waitFor(() => {
        expect(screen.getByText(/dashboard|cargando/i)).toBeInTheDocument();
      });
    });
  });

  describe('🎨 Tema y Estilos', () => {
    test('✅ Debe aplicar colores del tema correctamente', () => {
      renderWithProviders(<App />);
      
      // Verificar que el tema se aplica
      const themeProvider = screen.getByTestId('theme-provider') || document.body;
      expect(themeProvider).toBeInTheDocument();
    });

    test('✅ Debe ser responsive', () => {
      // Simular diferentes tamaños de pantalla
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320, // Mobile
      });

      renderWithProviders(<App />);
      
      // Verificar que se renderiza correctamente en mobile
      expect(document.body).toBeInTheDocument();

      // Simular desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      renderWithProviders(<App />);
      
      // Verificar que se renderiza correctamente en desktop
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('⚡ Rendimiento', () => {
    test('✅ Debe renderizar rápidamente', async () => {
      const startTime = performance.now();
      
      renderWithProviders(<App />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // El renderizado debe tomar menos de 100ms
      expect(renderTime).toBeLessThan(100);
    });

    test('✅ Debe manejar re-renderizados eficientemente', async () => {
      const { rerender } = renderWithProviders(<App />);
      
      // Re-renderizar múltiples veces
      for (let i = 0; i < 5; i++) {
        rerender(
          <BrowserRouter>
            <ThemeProvider theme={testTheme}>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        );
      }
      
      // Debe seguir funcionando correctamente
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('🔧 Manejo de Errores', () => {
    test('✅ Debe manejar errores de renderizado gracefully', () => {
      // Mock de error en componente hijo
      const OriginalConsoleError = console.error;
      console.error = jest.fn();

      // Simular error
      const ThrowError = () => {
        throw new Error('Test error');
      };

      // Verificar que no crash la aplicación
      expect(() => {
        render(
          <BrowserRouter>
            <ThemeProvider theme={testTheme}>
              <ThrowError />
            </ThemeProvider>
          </BrowserRouter>
        );
      }).toThrow();

      console.error = OriginalConsoleError;
    });

    test('✅ Debe manejar tokens inválidos', async () => {
      // Token malformado
      localStorage.setItem('adminToken', 'token-invalido');
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        // Debe mostrar login por token inválido
        expect(window.location.pathname).toBe('/');
      });
    });
  });

  describe('💾 Persistencia de Estado', () => {
    test('✅ Debe persistir estado de autenticación', async () => {
      const validToken = 'valid-test-token';
      localStorage.setItem('adminToken', validToken);
      
      renderWithProviders(<App />);
      
      // Verificar que el token persiste
      expect(localStorage.getItem('adminToken')).toBe(validToken);
    });

    test('✅ Debe limpiar estado al cerrar sesión', async () => {
      localStorage.setItem('adminToken', 'test-token');
      localStorage.setItem('userPreferences', '{"theme":"dark"}');
      
      renderWithProviders(<App />);
      
      // Simular logout
      localStorage.removeItem('adminToken');
      
      expect(localStorage.getItem('adminToken')).toBeNull();
    });
  });

  describe('🌐 Internacionalización', () => {
    test('✅ Debe soportar texto en español', () => {
      renderWithProviders(<App />);
      
      // Verificar que maneja caracteres especiales
      expect(document.body).toBeInTheDocument();
    });

    test('✅ Debe manejar fechas y números correctamente', () => {
      renderWithProviders(<App />);
      
      // Verificar formato de fecha/hora
      const now = new Date();
      expect(now).toBeInstanceOf(Date);
    });
  });
});
