import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import { AUTH_ENDPOINTS} from '../config/api';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    niveau: '',
    classe: ''
  });

  // Définition des classes par niveau
  const classesParNiveau = {
    'collège': ['6ème', '5ème', '4ème', '3ème'],
    'lycée': ['2nd', '1ère', 'Terminale']
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl && !token) {
      // Si on a un token dans l'URL mais pas dans le contexte, on le sauvegarde
      login(tokenFromUrl);
    }
  }, [searchParams, token, login]);

  // Empêcher la navigation vers d'autres pages
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Vous devez compléter votre profil avant de quitter cette page.';
      return 'Vous devez compléter votre profil avant de quitter cette page.';
    };

    const handlePopState = (e) => {
      e.preventDefault();
      alert('Vous devez compléter votre profil avant de naviguer ailleurs.');
      window.history.pushState(null, '', window.location.href);
    };

    // Empêcher de quitter la page
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Empêcher la navigation avec les boutons précédent/suivant
    window.addEventListener('popstate', handlePopState);
    
    // Empêcher la navigation initiale
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si le niveau change, mettre à jour la classe par défaut
    if (name === 'niveau') {
      const nouvellesClasses = classesParNiveau[value];
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        classe: nouvellesClasses[0] // Première classe du niveau sélectionné
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug: Afficher les données envoyées
    console.log('🔍 Données envoyées:', formData);

    try {
      const currentToken = token || searchParams.get('token');
      const response = await fetch(AUTH_ENDPOINTS.COMPLETE_PROFILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la complétion du profil');
      }

      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('🔍 Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complétez votre profil
          </h1>
          <p className="text-gray-600">
            Sélectionnez votre niveau et classe pour personnaliser votre expérience
          </p>
          <p className="text-sm text-orange-600 mt-2 font-medium">
            ⚠️ Vous devez compléter votre profil avant de continuer
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Niveau et Classe */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="niveau" className="block text-sm font-semibold text-gray-700 mb-3">
                  Niveau *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select 
                    id="niveau"
                    name="niveau" 
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none" 
                    value={formData.niveau} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez</option>
                    <option value="collège">Collège</option>
                    <option value="lycée">Lycée</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="classe" className="block text-sm font-semibold text-gray-700 mb-3">
                  Classe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select 
                    id="classe"
                    name="classe" 
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none" 
                    value={formData.classe} 
                    onChange={handleChange}
                    required
                    disabled={!formData.niveau}
                  >
                    <option value="">Sélectionnez</option>
                    {formData.niveau && classesParNiveau[formData.niveau].map((classe) => (
                      <option key={classe} value={classe}>{classe}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.niveau || !formData.classe}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sauvegarde en cours...
                </>
              ) : (
                'Compléter mon profil'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage; 