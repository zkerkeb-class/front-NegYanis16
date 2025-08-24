import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { AUTH_ENDPOINTS, getAuthConfig } from '../../config/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // lazy init pour éviter un 1er render inutile
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(() => !!(typeof window !== 'undefined' && localStorage.getItem('token')));

  // Fonction de fetch profil, mémorisée pour stabiliser les deps
  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    const controller = new AbortController();
    setLoadingUser(true);

    try {
      const res = await fetch(AUTH_ENDPOINTS.ME, {
        ...getAuthConfig(token),
        signal: controller.signal,
      });

      if (res.status === 401) {
        // token invalide/expiré -> on nettoie
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        return;
      }

      if (!res.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      // Annulation silencieuse
      if (err?.name !== 'AbortError') {
        // Tu peux logger si besoin
        setUser(null);
      }
    } finally {
      setLoadingUser(false);
    }

    // retourne un cleanup pour annuler si le token change en plein fetch
    return () => controller.abort();
  }, [token]);

  // Charger/rafraîchir le profil quand le token change
  useEffect(() => {
    const cleanupPromise = fetchUserProfile();
    // si fetchUserProfile renvoie une fn de cleanup (selon implémentation)
    return () => {
      if (typeof cleanupPromise === 'function') cleanupPromise();
    };
  }, [fetchUserProfile]);

  // Sync multi-onglets
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loadingUser,
        login,
        logout,
        fetchUserProfile, // exposé si tu veux forcer un refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
