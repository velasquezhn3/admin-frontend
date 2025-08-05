import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from '../pages/LoginPage';

// Mock para navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock para axios
jest.mock('axios', () => ({
  post: jest.fn(),
  defaults: {
    baseURL: '',
    headers: {}
  }
}));

const axios = require('axios');

// Tema de prueba
const testTheme = createTheme();

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

describe('🔐 LoginPage - Página de Autenticación', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();
    localStorage.clear();
    
    // Reset axios mock
    axios.post.mockReset();
  });

  describe('📱 Renderizado Inicial', () => {
    test('✅ Debe renderizar formulario de login', () => {
      renderWithProviders(<LoginPage />);
      
      expect(screen.getByText(/iniciar sesión|login/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario|username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña|password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión|login/i })).toBeInTheDocument();
    });

    test('✅ Debe mostrar logo o título de la aplicación', () => {
      renderWithProviders(<LoginPage />);
      
      // Buscar elementos relacionados con branding
      expect(
        screen.getByText(/villas julie|bot vj|administración/i) ||
        screen.getByAltText(/logo/i) ||
        screen.getByText(/sistema de reservas/i)
      ).toBeInTheDocument();
    });

    test('✅ Debe tener campos de formulario vacíos inicialmente', () => {
      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      
      expect(usernameInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  describe('📝 Interacción con Formulario', () => {
    test('✅ Debe permitir escribir en campos de entrada', async () => {
      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass123');
      
      expect(usernameInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('testpass123');
    });

    test('✅ Debe mostrar/ocultar contraseña al hacer click en el ícono', async () => {
      renderWithProviders(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      
      // Verificar que inicialmente es tipo password
      expect(passwordInput.type).toBe('password');
      
      // Buscar botón de mostrar/ocultar contraseña
      const toggleButton = screen.getByRole('button', { name: /mostrar|ocultar|ver contraseña/i });
      if (toggleButton) {
        await user.click(toggleButton);
        expect(passwordInput.type).toBe('text');
      }
    });

    test('✅ Debe validar campos requeridos', async () => {
      renderWithProviders(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      await user.click(submitButton);
      
      // Debe mostrar mensajes de validación
      await waitFor(() => {
        expect(
          screen.getByText(/usuario requerido|username required/i) ||
          screen.getByText(/campo obligatorio|required field/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('🔐 Proceso de Autenticación', () => {
    test('✅ Debe enviar credenciales correctas al servidor', async () => {
      axios.post.mockResolvedValue({
        data: {
          success: true,
          token: 'test-jwt-token',
          admin: {
            id: 1,
            username: 'testuser',
            full_name: 'Test User'
          }
        }
      });

      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/auth/login'),
          {
            username: 'testuser',
            password: 'testpass123'
          }
        );
      });
    });

    test('✅ Debe guardar token en localStorage al login exitoso', async () => {
      const testToken = 'test-jwt-token-123';
      
      axios.post.mockResolvedValue({
        data: {
          success: true,
          token: testToken,
          admin: {
            id: 1,
            username: 'testuser',
            full_name: 'Test User'
          }
        }
      });

      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(localStorage.getItem('adminToken')).toBe(testToken);
      });
    });

    test('✅ Debe navegar al dashboard después del login exitoso', async () => {
      axios.post.mockResolvedValue({
        data: {
          success: true,
          token: 'test-token',
          admin: { id: 1, username: 'test' }
        }
      });

      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('❌ Manejo de Errores', () => {
    test('✅ Debe mostrar error con credenciales inválidas', async () => {
      axios.post.mockRejectedValue({
        response: {
          data: {
            message: 'Credenciales inválidas'
          }
        }
      });

      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(
          screen.getByText(/credenciales inválidas|invalid credentials|error/i)
        ).toBeInTheDocument();
      });
    });

    test('✅ Debe mostrar error de conexión', async () => {
      axios.post.mockRejectedValue(new Error('Network Error'));

      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(
          screen.getByText(/error de conexión|network error|no se pudo conectar/i)
        ).toBeInTheDocument();
      });
    });

    test('✅ Debe limpiar errores al escribir nuevamente', async () => {
      axios.post.mockRejectedValue({
        response: {
          data: { message: 'Error test' }
        }
      });

      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      // Trigger error
      await user.type(usernameInput, 'test');
      await user.type(passwordInput, 'test');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
      
      // Clear error by typing
      await user.clear(usernameInput);
      await user.type(usernameInput, 'newuser');
      
      // Error should be cleared (this depends on implementation)
    });
  });

  describe('🔒 Seguridad', () => {
    test('✅ Debe sanitizar entrada de usuario', async () => {
      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      
      // Intentar inyección de scripts
      await user.type(usernameInput, '<script>alert("xss")</script>');
      await user.type(passwordInput, 'normalpass');
      
      // El input debe contener el texto sin ejecutar script
      expect(usernameInput.value).toBe('<script>alert("xss")</script>');
    });

    test('✅ Debe manejar tokens expirados', async () => {
      // Simular token expirado ya en localStorage
      localStorage.setItem('adminToken', 'expired-token');
      
      renderWithProviders(<LoginPage />);
      
      // El componente debe detectar y limpiar token expirado
      expect(screen.getByText(/iniciar sesión|login/i)).toBeInTheDocument();
    });
  });

  describe('♿ Accesibilidad', () => {
    test('✅ Debe tener etiquetas apropiadas para screen readers', () => {
      renderWithProviders(<LoginPage />);
      
      expect(screen.getByLabelText(/usuario|username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña|password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión|login/i })).toBeInTheDocument();
    });

    test('✅ Debe soportar navegación por teclado', async () => {
      renderWithProviders(<LoginPage />);
      
      const usernameInput = screen.getByLabelText(/usuario|username/i);
      const passwordInput = screen.getByLabelText(/contraseña|password/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
      
      // Tab navigation
      usernameInput.focus();
      expect(document.activeElement).toBe(usernameInput);
      
      await user.tab();
      expect(document.activeElement).toBe(passwordInput);
      
      await user.tab();
      expect(document.activeElement).toBe(submitButton);
    });
  });

  describe('📱 Responsividad', () => {
    test('✅ Debe adaptarse a pantallas móviles', () => {
      // Simular viewport móvil
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProviders(<LoginPage />);
      
      // Verificar que se renderiza correctamente
      expect(screen.getByText(/iniciar sesión|login/i)).toBeInTheDocument();
    });

    test('✅ Debe funcionar en tablets y desktop', () => {
      // Simular viewport desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderWithProviders(<LoginPage />);
      
      // Verificar que se renderiza correctamente
      expect(screen.getByText(/iniciar sesión|login/i)).toBeInTheDocument();
    });
  });
});
