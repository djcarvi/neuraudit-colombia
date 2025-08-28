// httpInterceptor.ts - Interceptor HTTP para manejar autenticación automáticamente

import authService from './authService';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

class HttpInterceptor {
  private baseURL = '';

  async request(url: string, config: RequestConfig = {}): Promise<Response> {
    const { skipAuth = false, ...requestConfig } = config;

    // Agregar headers por defecto
    const headers = new Headers(requestConfig.headers);
    
    // Agregar token de autenticación si existe y no se debe saltar
    if (!skipAuth) {
      const token = authService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('Token added to request:', token.substring(0, 20) + '...');
      } else {
        console.warn('No token available for request:', url);
      }
    }

    // Asegurar Content-Type para JSON si no está establecido
    // NO establecer Content-Type para FormData (el navegador lo hace automáticamente con boundary)
    if (!headers.has('Content-Type') && requestConfig.body && typeof requestConfig.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    try {
      // Para rutas que empiezan con /api/, no añadir baseURL porque el proxy de Vite las maneja
      const fullUrl = url.startsWith('/api/') ? url : `${this.baseURL}${url}`;
      console.log('Making request to:', fullUrl);
      const response = await fetch(fullUrl, {
        ...requestConfig,
        headers,
      });
      console.log('Response status:', response.status);

      // Manejar errores de autenticación
      if (response.status === 401 && !skipAuth) {
        // Intentar refrescar el token
        const newToken = await authService.refreshToken();
        
        if (newToken) {
          // Reintentar la petición con el nuevo token
          headers.set('Authorization', `Bearer ${newToken}`);
          return fetch(fullUrl, {
            ...requestConfig,
            headers,
          });
        } else {
          // No se pudo refrescar, limpiar datos y redirigir al login
          authService.clearAuthData();
          window.location.href = '/';
        }
      }

      return response;
    } catch (error) {
      console.error('HTTP request error:', error);
      throw error;
    }
  }

  async get(url: string, config?: RequestConfig): Promise<any> {
    const response = await this.request(url, { ...config, method: 'GET' });
    return this.handleResponse(response);
  }

  async post(url: string, data?: any, config?: RequestConfig): Promise<any> {
    const response = await this.request(url, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    });
    return this.handleResponse(response);
  }

  async put(url: string, data?: any, config?: RequestConfig): Promise<any> {
    const response = await this.request(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse(response);
  }

  async patch(url: string, data?: any, config?: RequestConfig): Promise<any> {
    const response = await this.request(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse(response);
  }

  async delete(url: string, config?: RequestConfig): Promise<any> {
    const response = await this.request(url, { ...config, method: 'DELETE' });
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      
      // Si es un objeto con datos detallados de error, lanzar el objeto completo
      if (typeof errorData === 'object' && (errorData.cross_validation || errorData.errors || errorData.details)) {
        const error = new Error(errorData.message || errorData.error || errorData.detail || `HTTP error! status: ${response.status}`);
        // Adjuntar toda la respuesta al error para que el catch pueda acceder a ella
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }
      
      // Para errores simples, mantener el comportamiento anterior
      const errorMessage = errorData.detail || errorData.message || errorData.error || errorData || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return isJson ? response.json() : response.text();
  }
}

export default new HttpInterceptor();