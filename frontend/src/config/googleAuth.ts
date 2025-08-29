// Configuración de Google OAuth
// IMPORTANTE: Configurar REACT_APP_GOOGLE_CLIENT_ID en el archivo .env
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Esta es la interfaz para el usuario de Google
export interface GoogleUser {
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

// Exportación explícita para evitar problemas con el módulo
export type { GoogleUser };
export { GOOGLE_CLIENT_ID };