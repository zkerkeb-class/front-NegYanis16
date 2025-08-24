import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../features/Auth/AuthContext';

// Données de test
const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  jetons: 5
};
const mockToken = 'mock-jwt-token-123';

// Mock de l'API config
jest.mock('../config/api', () => ({
  AUTH_ENDPOINTS: {
    ME: 'http://localhost:3001/api/auth/me',
  },
  getAuthConfig: (token) => ({
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }),
}));

// Composant de test pour accéder au contexte
const TestComponent = () => {
  const { token, user, isAuthenticated, login, logout, loadingUser, fetchUserProfile } = useAuth();
  
  return (
    <div>
      <div data-testid="token">{token || 'no-token'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="loading">{loadingUser.toString()}</div>
      <div data-testid="jetons">{user ? user.jetons : 0}</div>
      <button onClick={() => login(mockToken)} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
      <button onClick={fetchUserProfile} data-testid="refresh-btn">
        Refresh Profile
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    localStorage.clear();
    fetch.mockClear();
    jest.clearAllMocks();
  });

  describe('État initial', () => {
    test('devrait avoir des valeurs par défaut correctes', () => {
      // localStorage est vide par défaut après localStorage.clear()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('token')).toHaveTextContent('no-token');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('jetons')).toHaveTextContent('0');
    });

    test('devrait charger le token depuis localStorage au démarrage', () => {
      // Simuler un token en localStorage
      localStorage.setItem('token', mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('token')).toHaveTextContent(mockToken);
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  describe('Fonction login', () => {
    test('devrait stocker le token et mettre à jour l\'état', async () => {
      // localStorage est vide par défaut
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginButton);
      });

      // Vérifier que le token est bien stocké (effet observable)
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(screen.getByTestId('token')).toHaveTextContent(mockToken);
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    test('devrait charger le profil utilisateur après login', async () => {
      // localStorage est vide par défaut
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
        expect(screen.getByTestId('jetons')).toHaveTextContent('5');
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  describe('Fonction logout', () => {
    test('devrait supprimer le token et réinitialiser l\'état', async () => {
      // Simuler un utilisateur déjà connecté
      localStorage.setItem('token', mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Attendre que le profil soit chargé
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      const logoutButton = screen.getByTestId('logout-btn');
      
      await act(async () => {
        await userEvent.click(logoutButton);
      });

      // Vérifier que le token est supprimé (effet observable)
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.getByTestId('token')).toHaveTextContent('no-token');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('jetons')).toHaveTextContent('0');
    });
  });

  describe('Chargement du profil utilisateur', () => {
    test('devrait gérer les erreurs API', async () => {
      // localStorage est vide par défaut
      fetch.mockRejectedValueOnce(new Error('API Error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    test('devrait gérer les réponses HTTP d\'erreur', async () => {
      // localStorage est vide par défaut
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    test('devrait afficher l\'état de chargement', async () => {
      // localStorage est vide par défaut
      let resolvePromise;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      fetch.mockReturnValue(promise);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginButton);
      });

      // Vérifier que le loading est true
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
      });

      // Résoudre la promesse
      await act(async () => {
        resolvePromise({
          ok: true,
          json: async () => mockUser,
        });
      });

      // Vérifier que le loading redevient false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
      });
    });

    test('devrait permettre de rafraîchir le profil manuellement', async () => {
      localStorage.setItem('token', mockToken);
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
      });

      // Changer les données mockées
      const updatedUser = { ...mockUser, name: 'Updated User' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedUser,
      });

      const refreshButton = screen.getByTestId('refresh-btn');
      
      await act(async () => {
        await userEvent.click(refreshButton);
      });

      expect(fetch).toHaveBeenCalledTimes(2); // Une fois au mount, une fois au refresh
    });
  });

  describe('Persistance de session', () => {
    test('devrait restaurer la session au refresh avec token valide', async () => {
      localStorage.setItem('token', mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Le token devrait être chargé immédiatement
      expect(screen.getByTestId('token')).toHaveTextContent(mockToken);
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

      // Le profil utilisateur devrait être chargé
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
      });
    });

    test('devrait gérer un token invalide au refresh', async () => {
      localStorage.setItem('token', 'invalid-token');
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Le token est chargé mais l'utilisateur n'est pas récupéré
      expect(screen.getByTestId('token')).toHaveTextContent('invalid-token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });
  });

  describe('Gestion des cas limites', () => {
    test('devrait gérer un contexte utilisé en dehors du provider', () => {
      const TestComponentOutside = () => {
        const { isAuthenticated } = useAuth();
        return <div>{isAuthenticated.toString()}</div>;
      };

      // Supprimer les logs d'erreur React pendant le test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponentOutside />);
      }).toThrow();

      consoleSpy.mockRestore();
    });

    test('devrait gérer des tokens null ou undefined', () => {
      // localStorage est vide par défaut

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('token')).toHaveTextContent('no-token');
    });

    test('devrait gérer les changements de jetons utilisateur', async () => {
      localStorage.setItem('token', mockToken);
      const userWithLowTokens = { ...mockUser, jetons: 0 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => userWithLowTokens,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('jetons')).toHaveTextContent('0');
      });
    });
  });
});
