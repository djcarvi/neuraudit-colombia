// googleAuthService.ts - Servicio de autenticación con Google
import authService from './authService';

// Configuración de Google OAuth
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Esta es la interfaz para el usuario de Google
interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google User ID
  given_name?: string;
  family_name?: string;
}

// Declaración global para TypeScript
declare global {
  interface Window {
    google: any;
  }
}

class GoogleAuthService {
  private initialized = false;

  // Inicializar Google Sign-In
  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (this.initialized) {
        resolve();
        return;
      }

      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(checkGoogle);
          this.initialized = true;
          resolve();
        }
      }, 100);

      // Timeout después de 5 segundos
      setTimeout(() => {
        clearInterval(checkGoogle);
        resolve();
      }, 5000);
    });
  }

  // Renderizar el botón de Google Sign-In
  async renderButton(buttonElement: HTMLElement, callback: (response: any) => void): Promise<void> {
    await this.initialize();

    if (!window.google) {
      console.error('Google Sign-In no está disponible');
      return;
    }
    
    if (!GOOGLE_CLIENT_ID) {
      console.error('Google Client ID no está configurado. Configure REACT_APP_GOOGLE_CLIENT_ID en el archivo .env');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(
      buttonElement,
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    );
  }

  // Manejar la respuesta de Google
  async handleCredentialResponse(response: any): Promise<any> {
    console.log('Respuesta completa de Google:', response);
    
    try {
      // El response.credential es el ID token JWT de Google
      const idToken = response.credential;
      
      console.log('ID Token extraído:', idToken);
      
      if (!idToken) {
        throw new Error('No se recibió token de Google');
      }
      
      // Decodificar el JWT para obtener la información del usuario
      const payload = this.parseJwt(idToken);
      
      const googleUser: GoogleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };

      // Enviar el token al backend para validar y crear/obtener el usuario
      const backendResponse = await this.authenticateWithBackend(idToken, googleUser);
      
      return backendResponse;
    } catch (error) {
      console.error('Error al procesar la respuesta de Google:', error);
      throw error;
    }
  }

  // Enviar el token de Google al backend
  private async authenticateWithBackend(idToken: string, googleUser: GoogleUser): Promise<any> {
    try {
      const requestBody = {
        id_token: idToken,
        user_data: googleUser
      };
      
      console.log('Enviando al backend:', requestBody);
      
      const response = await fetch('http://localhost:8003/api/auth/google-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error del backend:', error);
        throw new Error(error.error || error.message || 'Error al autenticar con el servidor');
      }

      const result = await response.json();
      
      // Transformar la respuesta al formato esperado por authService
      const userData = {
        access_token: result.access,
        refresh_token: result.refresh,
        expires_in: result.expires_in,
        id: result.user.id,
        username: result.user.username,
        userType: result.user.user_type,
        role: result.user.role,
        fullName: result.user.full_name,
        email: result.user.email,
        permissions: result.user.permissions,
        sessionId: result.user.session_id,
      };

      // Guardar los datos de autenticación
      authService.saveAuthData(userData, true);
      
      return userData;
    } catch (error) {
      throw error;
    }
  }

  // Decodificar JWT
  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  // Cerrar sesión de Google
  async signOut(): Promise<void> {
    await this.initialize();
    
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export default new GoogleAuthService();