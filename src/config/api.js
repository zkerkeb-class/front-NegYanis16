/**
 * Configuration centralisée des URLs d'API et constantes
 */

// URLs des services
export const API_URLS = {
  AUTH_SERVICE: process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:3001',
  BDD_SERVICE: process.env.REACT_APP_BDD_SERVICE_URL || 'http://localhost:3002',
  IA_SERVICE: process.env.REACT_APP_IA_SERVICE_URL || 'http://localhost:3003',
  PAYMENT_SERVICE: process.env.REACT_APP_PAYMENT_SERVICE_URL || 'http://localhost:3004',
};

// Endpoints d'authentification
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URLS.AUTH_SERVICE}/api/auth/login`,
  REGISTER: `${API_URLS.AUTH_SERVICE}/api/auth/register`,
  ME: `${API_URLS.AUTH_SERVICE}/api/auth/me`,
  LOGOUT: `${API_URLS.AUTH_SERVICE}/api/auth/logout`,
  GOOGLE_AUTH: `${API_URLS.AUTH_SERVICE}/api/google/google`,
  COMPLETE_PROFILE: `${API_URLS.AUTH_SERVICE}/api/google/complete-profile`,
};

// Endpoints utilisateur
export const USER_ENDPOINTS = {
  PROFILE: `${API_URLS.BDD_SERVICE}/api/users/profile`,
  UPDATE_PROFILE: `${API_URLS.BDD_SERVICE}/api/users/profile`,
  TOKENS: `${API_URLS.BDD_SERVICE}/api/users/tokens`,
  RESULTS: `${API_URLS.BDD_SERVICE}/api/users/results`,
};

// Endpoints quiz
export const QUIZ_ENDPOINTS = {
  GENERATE: `${API_URLS.IA_SERVICE}/api/quiz/generate`,
  SUBMIT: `${API_URLS.IA_SERVICE}/api/quiz/submit`,
  RESULTS: `${API_URLS.BDD_SERVICE}/api/quiz/results`,
  USER_RESULTS: `${API_URLS.BDD_SERVICE}/api/users/results`,
};

// Endpoints paiement (utilise le service de notification pour l'instant)
export const PAYMENT_ENDPOINTS = {
  CREATE_SESSION: `${API_URLS.PAYMENT_SERVICE}/create-checkout-session`,
  GET_SESSION: (sessionId) => `${API_URLS.PAYMENT_SERVICE}/session/${sessionId}`,
};

// Configuration des prix et jetons
export const PRICE_TOKEN_MAPPING = {
  500: parseInt(process.env.REACT_APP_PRICE_MAPPING_500) || 10,
  900: parseInt(process.env.REACT_APP_PRICE_MAPPING_900) || 20,
  1200: parseInt(process.env.REACT_APP_PRICE_MAPPING_1200) || 30,
};

// Configuration générale
export const APP_CONFIG = {
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
};

// Helper pour construire les headers d'autorisation
export const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Helper pour les requêtes GET avec auth
export const getAuthConfig = (token) => ({
  method: 'GET',
  headers: getAuthHeaders(token),
});

// Helper pour les requêtes POST avec auth
export const postAuthConfig = (token, body) => ({
  method: 'POST',
  headers: getAuthHeaders(token),
  body: JSON.stringify(body),
});

// Helper pour les requêtes PUT avec auth
export const putAuthConfig = (token, body) => ({
  method: 'PUT',
  headers: getAuthHeaders(token),
  body: JSON.stringify(body),
});
