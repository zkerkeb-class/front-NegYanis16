import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_ENDPOINTS, getAuthConfig } from '../../config/api';

// Création du context
const AuthContext = createContext();

// Hook pour l'utiliser facilement
export const useAuth = () => useContext(AuthContext);

// Provider qui englobe l'app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Charger le token au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fonction pour charger le profil utilisateur
  const fetchUserProfile = async () => {
    if (!token) return;
    setLoadingUser(true);
    try {
      const res = await fetch(AUTH_ENDPOINTS.ME, getAuthConfig(token));
      if (!res.ok) throw new Error('Erreur lors de la récupération du profil');
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // Charger le profil utilisateur quand le token change
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
    // eslint-disable-next-line
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, user, loadingUser, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
