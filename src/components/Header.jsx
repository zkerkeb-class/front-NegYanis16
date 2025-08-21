import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import { AUTH_ENDPOINTS } from '../config/api';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  CubeTransparentIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  PowerIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  HomeIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/solid';

const Header = () => {
  const { isAuthenticated, logout, token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch(AUTH_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Erreur logout:', err);
    }
    logout();
    navigate('/');
  };

  const links = [
    { label: 'Accueil', to: '/', icon: HomeIcon },
    { label: 'Tableau de bord', to: '/dashboard', icon: ChartBarIcon },
    { label: 'Quiz', to: '/select-quiz', icon: AcademicCapIcon },
    { label: 'Jetons', to: '/jetons', icon: CurrencyEuroIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="Retourner à l'accueil - Quiz Pro"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">Quiz</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Navigation principale">
            {isAuthenticated &&
              links.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(to) 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={`Naviguer vers ${label}`}
                  aria-current={isActive(to) ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 ${isActive(to) ? 'text-white' : 'text-gray-500'}`} />
                  <span>{label}</span>
                </Link>
              ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Jetons Display */}
                {/* <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 rounded-xl border border-amber-200">
                  <CurrencyEuroIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">
                    {user?.jetons || 0} jetons
                  </span>
                </div> */}

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.prenom || 'Utilisateur'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.niveau} - {user?.classe}
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                      aria-label={`Accéder au profil de ${user?.prenom || 'l\'utilisateur'}`}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.prenom || 'user'}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                    
                    {/* Profile Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <div className="py-2">
                        <button
                          onClick={() => navigate('/profile')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          aria-label="Accéder à mon profil"
                        >
                          <UserCircleIcon className="h-4 w-4" />
                          <span>Mon Profil</span>
                        </button>
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          aria-label="Accéder au tableau de bord"
                        >
                          <ChartBarIcon className="h-4 w-4" />
                          <span>Tableau de bord</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          aria-label="Se déconnecter de mon compte"
                        >
                          <PowerIcon className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  aria-label="Se connecter à mon compte"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  aria-label="Créer un nouveau compte"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu" aria-label="Menu de navigation mobile">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 rounded-b-2xl shadow-lg">
              {isAuthenticated && (
                <>
                  {/* User Info Mobile */}
                  <div className="px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.prenom || 'user'}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{user?.prenom || 'Utilisateur'}</div>
                        <div className="text-sm text-gray-600">{user?.niveau} - {user?.classe}</div>
                        <div className="flex items-center space-x-1 mt-1" aria-label={`Vous avez ${user?.jetons || 0} jetons disponibles`}>
                          <CurrencyEuroIcon className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">{user?.jetons || 0} jetons</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  {links.map(({ label, to, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive(to) 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      aria-label={`Naviguer vers ${label}`}
                      aria-current={isActive(to) ? 'page' : undefined}
                    >
                      <Icon className={`h-5 w-5 ${isActive(to) ? 'text-white' : 'text-gray-500'}`} />
                      <span>{label}</span>
                    </Link>
                  ))}

                  {/* Mobile Actions */}
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200"
                      aria-label="Accéder à mon profil"
                    >
                      <UserCircleIcon className="h-5 w-5 text-gray-500" />
                      <span>Mon Profil</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium transition-all duration-200"
                      aria-label="Se déconnecter de mon compte"
                    >
                      <PowerIcon className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200"
                    aria-label="Se connecter à mon compte"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-center shadow-md"
                    aria-label="Créer un nouveau compte"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
