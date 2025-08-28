import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/neuraudit/authService';

export const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Si no está autenticado, intentar validar el token
        const isValid = await authService.validateToken();
        
        if (!isValid) {
          // Token inválido o no existe, redirigir al login
          navigate('/');
        }
      }
    };

    checkAuth();
  }, [navigate]);
};

export default useAuthGuard;