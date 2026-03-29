import { createContext, useContext, useState, useEffect } from 'react';

import { authService } from '../utils/api';
import toast from '../utils/toast';

// Événements globaux
export const CART_REFRESH_EVENT = 'cart-refresh';
export const AUTH_LOGIN_EVENT = 'auth:login';
export const AUTH_LOGOUT_EVENT = 'auth:logout';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const clearSession = ({ emitLogout = false } = {}) => {
        localStorage.removeItem('jwt_token');
        setUser(null);
        setIsAuthenticated(false);

        if (emitLogout) {
            window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            clearSession({ emitLogout: true });
            toast.info('Votre session a expiré. Veuillez vous reconnecter.');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await authService.me();
            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            clearSession();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const { token, user } = response.data.data;
        localStorage.setItem('jwt_token', token);
        setUser(user);
        setIsAuthenticated(true);
        // Déclencher l'événement de connexion pour fusionner le panier local avec le serveur
        window.dispatchEvent(new Event(AUTH_LOGIN_EVENT));
        return user;
    };

    const register = async (data) => {
        const response = await authService.register(data);
        const { token, user } = response.data.data;
        localStorage.setItem('jwt_token', token);
        setUser(user);
        setIsAuthenticated(true);
        // Déclencher l'événement de connexion pour fusionner le panier local avec le serveur
        window.dispatchEvent(new Event(AUTH_LOGIN_EVENT));
        return user;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
        } finally {
            clearSession({ emitLogout: true });
        }
    };

    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                isAdmin,
                login,
                register,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
