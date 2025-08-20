// authService.ts - Servicio de autenticación para NeurAudit

interface LoginData {
  user_type: 'eps' | 'pss';
  username: string;
  password: string;
  nit?: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    user_type: string;
    role: string;
    full_name: string;
    email?: string;
    nit?: string;
    pss_name?: string;
    permissions: string[];
    session_id: string;
  };
}

interface UserData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id: string;
  username: string;
  userType: string;
  role: string;
  fullName: string;
  email?: string;
  nit?: string;
  pssName?: string;
  permissions: string[];
  sessionId: string;
}

class AuthService {
  private readonly API_URL = '/api/auth';

  async login(data: LoginData): Promise<UserData> {
    try {
      const response = await fetch(`${this.API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(this.getErrorMessage(result));
      }

      // Transformar la respuesta al formato esperado
      const userData: UserData = {
        access_token: result.access,
        refresh_token: result.refresh,
        expires_in: result.expires_in,
        id: result.user.id,
        username: result.user.username,
        userType: result.user.user_type,
        role: result.user.role,
        fullName: result.user.full_name,
        email: result.user.email,
        nit: result.user.nit,
        pssName: result.user.pss_name,
        permissions: result.user.permissions,
        sessionId: result.user.session_id,
      };

      return userData;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    const token = this.getAccessToken();
    if (!token) return;

    try {
      await fetch(`${this.API_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } finally {
      this.clearAuthData();
    }
  }

  async validateToken(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.API_URL}/validate/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.clearAuthData();
        return false;
      }

      return true;
    } catch {
      this.clearAuthData();
      return false;
    }
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.API_URL}/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        this.clearAuthData();
        return null;
      }

      const result = await response.json();
      this.setAccessToken(result.access);
      return result.access;
    } catch {
      this.clearAuthData();
      return null;
    }
  }

  saveAuthData(userData: UserData, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('neuraudit_user', JSON.stringify(userData));
    storage.setItem('neuraudit_access_token', userData.access_token);
    storage.setItem('neuraudit_refresh_token', userData.refresh_token);
  }

  clearAuthData(): void {
    localStorage.removeItem('neuraudit_user');
    localStorage.removeItem('neuraudit_access_token');
    localStorage.removeItem('neuraudit_refresh_token');
    sessionStorage.removeItem('neuraudit_user');
    sessionStorage.removeItem('neuraudit_access_token');
    sessionStorage.removeItem('neuraudit_refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('neuraudit_access_token') || 
           sessionStorage.getItem('neuraudit_access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('neuraudit_refresh_token') || 
           sessionStorage.getItem('neuraudit_refresh_token');
  }

  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem('neuraudit_user') || 
                   sessionStorage.getItem('neuraudit_user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private setAccessToken(token: string): void {
    if (localStorage.getItem('neuraudit_access_token')) {
      localStorage.setItem('neuraudit_access_token', token);
    } else if (sessionStorage.getItem('neuraudit_access_token')) {
      sessionStorage.setItem('neuraudit_access_token', token);
    }
  }

  private getErrorMessage(data: any): string {
    const errorMap: { [key: string]: string } = {
      'MISSING_CREDENTIALS': 'Usuario y contraseña son obligatorios',
      'MISSING_NIT': 'El NIT del prestador es obligatorio',
      'INVALID_PSS_CREDENTIALS': 'Credenciales inválidas para PSS/PTS',
      'INVALID_EPS_CREDENTIALS': 'Credenciales inválidas para EPS',
      'INVALID_PASSWORD': 'Credenciales inválidas',
    };

    if (data.code && errorMap[data.code]) {
      return errorMap[data.code];
    }

    return data.error || 'Error de conexión. Intente nuevamente.';
  }
}

export default new AuthService();