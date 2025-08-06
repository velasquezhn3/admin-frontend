/**
 * Optimizaciones Frontend - Lazy Loading y Performance
 * Bot VJ - Sistema de Reservas Villas Julie
 */

import React, { lazy, Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy loading de componentes pesados
const CabinGallery = lazy(() => import('./CabinGallery'));
const ReservationCalendar = lazy(() => import('./ReservationCalendar'));
const PaymentForm = lazy(() => import('./PaymentForm'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// Hook personalizado para lazy loading con cache
const useLazyLoad = (componentName) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Precargar componente en idle time
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import(`./components/${componentName}`)
          .then(() => setIsLoaded(true))
          .catch(setError);
      });
    }
  }, [componentName]);

  return { isLoaded, error };
};

// Componente de Loading optimizado
const LoadingSpinner = React.memo(({ size = 'medium', message = 'Cargando...' }) => (
  <div className={`loading-spinner loading-${size}`} role="status" aria-label={message}>
    <div className="spinner-circle"></div>
    <p>{message}</p>
  </div>
));

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-fallback" role="alert">
    <h2>🚨 Algo salió mal</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>🔄 Intentar nuevamente</button>
  </div>
);

// Hook para optimización de imágenes
const useImageOptimization = () => {
  const [isWebPSupported, setIsWebPSupported] = useState(false);

  useEffect(() => {
    // Detectar soporte WebP
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      setIsWebPSupported(webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, []);

  const getOptimizedImageUrl = useCallback((url, width, height) => {
    if (!url) return '';
    
    const format = isWebPSupported ? 'webp' : 'jpg';
    const quality = 85;
    
    // Si es una URL de imagen local, agregar parámetros de optimización
    if (url.startsWith('/images/')) {
      return `${url}?w=${width}&h=${height}&f=${format}&q=${quality}`;
    }
    
    return url;
  }, [isWebPSupported]);

  return { getOptimizedImageUrl, isWebPSupported };
};

// Hook para intersection observer (lazy loading de imágenes)
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [element, options]);

  return [setElement, isIntersecting];
};

// Componente de imagen optimizada con lazy loading
const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  placeholder = '/images/placeholder.jpg'
}) => {
  const { getOptimizedImageUrl } = useImageOptimization();
  const [setRef, isVisible] = useIntersectionObserver();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = useMemo(() => 
    getOptimizedImageUrl(src, width, height), 
    [src, width, height, getOptimizedImageUrl]
  );

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div 
      ref={setRef}
      className={`optimized-image-container ${className}`}
      style={{ width, height }}
    >
      {(isVisible || isLoaded) && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
        />
      )}
      
      {(!isVisible || !isLoaded) && !hasError && (
        <img
          src={placeholder}
          alt="Cargando..."
          width={width}
          height={height}
          className="placeholder-image"
        />
      )}
      
      {hasError && (
        <div className="image-error">
          📷 Error cargando imagen
        </div>
      )}
    </div>
  );
});

// Hook para debounce (optimizar búsquedas)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para caché de API
const useApiCache = () => {
  const cache = useMemo(() => new Map(), []);

  const getCachedData = useCallback((key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 min TTL
      return cached.data;
    }
    return null;
  }, [cache]);

  const setCachedData = useCallback((key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [cache]);

  return { getCachedData, setCachedData };
};

// Hook optimizado para fetch con cache
const useOptimizedFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCachedData, setCachedData } = useApiCache();

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache primero
        const cachedData = getCachedData(url);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Guardar en cache
        setCachedData(url, result);
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, options, getCachedData, setCachedData]);

  return { data, loading, error };
};

// Componente principal optimizado
const OptimizedApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Precargar componentes críticos
  useEffect(() => {
    const preloadComponents = async () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(async () => {
          await Promise.all([
            import('./components/CabinGallery'),
            import('./components/ReservationCalendar')
          ]);
        });
      }
    };

    preloadComponents();
  }, []);

  const renderCurrentView = useCallback(() => {
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setCurrentView('home')}
      >
        <Suspense fallback={<LoadingSpinner message="Cargando componente..." />}>
          {currentView === 'cabins' && <CabinGallery searchTerm={debouncedSearch} />}
          {currentView === 'reservations' && <ReservationCalendar />}
          {currentView === 'payment' && <PaymentForm />}
          {currentView === 'admin' && <AdminDashboard />}
        </Suspense>
      </ErrorBoundary>
    );
  }, [currentView, debouncedSearch]);

  return (
    <div className="app-container">
      <header>
        <nav>
          <button onClick={() => setCurrentView('home')}>🏠 Inicio</button>
          <button onClick={() => setCurrentView('cabins')}>🏠 Cabañas</button>
          <button onClick={() => setCurrentView('reservations')}>📅 Reservas</button>
        </nav>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar cabañas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <main>
        {renderCurrentView()}
      </main>

      <footer>
        <p>© 2025 Bot VJ - Villas Julie</p>
      </footer>
    </div>
  );
};

export default OptimizedApp;

// CSS optimizado para performance
export const optimizedStyles = `
  /* Optimizaciones de performance */
  .app-container {
    contain: layout style paint;
    will-change: transform;
  }

  .optimized-image {
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  .optimized-image.loaded {
    opacity: 1;
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .spinner-circle {
    width: 2rem;
    height: 2rem;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Lazy loading placeholders */
  .placeholder-image {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Optimizaciones para mobile */
  @media (max-width: 768px) {
    .app-container {
      font-size: 14px;
    }
    
    .optimized-image-container {
      max-width: 100%;
      height: auto;
    }
  }

  /* Error boundaries */
  .error-fallback {
    text-align: center;
    padding: 2rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    margin: 1rem;
  }

  .error-fallback button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }
`;
