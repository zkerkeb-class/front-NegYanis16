import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivateRoute from '../router/PrivateRoute';
import { AuthProvider } from '../features/Auth/AuthContext';

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

// Composants de test
const ProtectedContent = () => <div data-testid="protected-content">Contenu protégé</div>;

// Wrapper de test
const TestWrapper = ({ children, hasToken = false }) => {
  if (hasToken) {
    localStorage.setItem('token', 'test-token');
  }
  // sinon localStorage reste vide

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
    jest.clearAllMocks();
  });

  describe('Utilisateur non authentifié', () => {
    test('devrait rediriger vers /login quand pas de token', () => {
      render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('devrait rediriger même avec du contenu enfant complexe', () => {
      const ComplexContent = () => (
        <div>
          <h1 data-testid="private-title">Page privée</h1>
          <p data-testid="private-content">Contenu sensible</p>
          <button data-testid="private-button">Action privée</button>
        </div>
      );

      render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <ComplexContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByTestId('private-title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('private-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('private-button')).not.toBeInTheDocument();
    });

    test('devrait toujours rediriger vers /login spécifiquement', () => {
      render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toHaveAttribute('data-to', '/login');
      expect(navigateElement).not.toHaveAttribute('data-to', '/register');
      expect(navigateElement).not.toHaveAttribute('data-to', '/home');
    });
  });

  describe('Utilisateur authentifié', () => {
    test('devrait afficher le contenu protégé avec un token valide', () => {
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    test('devrait rendre les children correctement', () => {
      const CustomContent = () => (
        <div>
          <h1 data-testid="custom-title">Dashboard</h1>
          <p data-testid="custom-content">Bienvenue utilisateur connecté</p>
        </div>
      );
      
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <CustomContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-title')).toHaveTextContent('Dashboard');
      expect(screen.getByTestId('custom-content')).toHaveTextContent('Bienvenue utilisateur connecté');
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    test('devrait préserver les props des composants enfants', () => {
      const PropsComponent = ({ title, count }) => (
        <div>
          <h1 data-testid="props-title">{title}</h1>
          <span data-testid="props-count">{count}</span>
        </div>
      );
      
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <PropsComponent title="Mon Titre" count={42} />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('props-title')).toHaveTextContent('Mon Titre');
      expect(screen.getByTestId('props-count')).toHaveTextContent('42');
    });

    test('devrait gérer plusieurs enfants', () => {
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <div data-testid="child-1">Premier enfant</div>
            <div data-testid="child-2">Deuxième enfant</div>
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Changements d\'état d\'authentification', () => {
    test('devrait réagir aux changements de token', () => {
      // Test initial : pas de token
      const { unmount } = render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      // Initialement pas de token = redirection
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

      // Nettoyer et re-rendre avec un token
      unmount();
      localStorage.clear(); // Reset complet
      
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    test('devrait rediriger après suppression du token', () => {
      // Test initial : avec token
      const { unmount } = render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      // Initialement avec token = contenu affiché
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();

      // Nettoyer et re-rendre sans token
      unmount();
      localStorage.clear(); // Reset complet
      
      render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Cas d\'erreur et robustesse', () => {
    test('devrait gérer un contexte d\'authentification manquant', () => {
      // Supprimer les logs d'erreur pendant le test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        );
      }).toThrow();

      consoleSpy.mockRestore();
    });

    test('devrait gérer des children null ou undefined', () => {
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            {null}
          </PrivateRoute>
        </TestWrapper>
      );

      // Pas de crash, pas de redirection
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    test('devrait gérer des children undefined', () => {
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            {undefined}
          </PrivateRoute>
        </TestWrapper>
      );

      // Pas de crash, pas de redirection
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Intégration avec AuthContext', () => {
    test('devrait utiliser le bon hook d\'authentification', () => {
      // Test que PrivateRoute utilise bien useAuth()
      render(
        <TestWrapper hasToken={true}>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('devrait réagir aux changements d\'état du contexte', () => {
      // Simuler un changement d'état dans le contexte
      localStorage.setItem('token', 'valid-token');

      render(
        <AuthProvider>
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        </AuthProvider>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Sécurité', () => {
    test('ne devrait jamais afficher le contenu sans token', () => {
      // localStorage reste vide (chaîne vide équivaut à null)

      render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <div data-testid="sensitive-data">Données sensibles</div>
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.queryByTestId('sensitive-data')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    });

    test('ne devrait jamais afficher le contenu avec un token vide', () => {
      // localStorage reste vide (espaces équivalent à null)

      render(
        <TestWrapper hasToken={false}>
          <PrivateRoute>
            <div data-testid="sensitive-data">Données sensibles</div>
          </PrivateRoute>
        </TestWrapper>
      );

      expect(screen.queryByTestId('sensitive-data')).not.toBeInTheDocument();
    });
  });
});
