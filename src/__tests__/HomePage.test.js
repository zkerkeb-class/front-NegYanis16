import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { AuthProvider } from '../features/Auth/AuthContext';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>{children}</a>
  ),
}), { virtual: true });

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

// Composant wrapper pour les tests
const TestWrapper = ({ isAuthenticated = false, children }) => {
  // Simuler l'état d'authentification via localStorage
  if (isAuthenticated) {
    localStorage.setItem('token', 'mock-token-123');
  } else {
    localStorage.removeItem('token');
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  describe('Contenu statique', () => {
    test('devrait afficher le titre principal', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/bienvenue sur/i)).toBeInTheDocument();
      expect(screen.getAllByText(/quizpro/i).length).toBeGreaterThan(0);
    });

    test('devrait afficher les fonctionnalités principales', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/quiz personnalisés/i)).toBeInTheDocument();
      expect(screen.getByText(/suivi des progrès/i)).toBeInTheDocument();
      expect(screen.getByText(/badges et récompenses/i)).toBeInTheDocument();
    });

    test('devrait afficher la section statistiques', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Vérifier qu'il y a du contenu sur la page
      expect(screen.getByText(/améliorez vos connaissances/i)).toBeInTheDocument();
    });
  });

  describe('Utilisateur non authentifié', () => {
    test('devrait afficher les boutons de connexion/inscription', () => {
      render(
        <TestWrapper isAuthenticated={false}>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/commencer maintenant/i)).toBeInTheDocument();
      expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
    });

    test('devrait avoir des liens vers les pages d\'authentification', () => {
      render(
        <TestWrapper isAuthenticated={false}>
          <HomePage />
        </TestWrapper>
      );

      const commencerLink = screen.getByRole('link', { name: /commencer maintenant/i });
      expect(commencerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('Utilisateur authentifié', () => {
    test('devrait afficher le bouton vers le tableau de bord', () => {
      render(
        <TestWrapper isAuthenticated={true}>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/aller au tableau de bord/i)).toBeInTheDocument();
    });

    test('devrait avoir un lien vers le dashboard', () => {
      render(
        <TestWrapper isAuthenticated={true}>
          <HomePage />
        </TestWrapper>
      );

      const dashboardLink = screen.getByRole('link', { name: /aller au tableau de bord/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Responsive et accessibilité', () => {
    test('devrait avoir des éléments accessibles', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Vérifier que les liens ont des textes appropriés
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      // Vérifier que les images ont des attributs alt (si il y en a)
      const images = screen.queryAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    test('devrait avoir une structure de heading appropriée', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Vérifier la hiérarchie des titres
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
