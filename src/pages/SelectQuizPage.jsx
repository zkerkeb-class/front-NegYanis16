import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import {
  AcademicCapIcon,
  CurrencyEuroIcon,
  PlayIcon,
  SparklesIcon,
  ClockIcon,
  UserIcon,
  TrophyIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

const SelectQuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matiere, setMatiere] = useState('Maths');

  const matieres = [
    { 
      value: 'Maths', 
      label: 'Mathématiques', 
      icon: '📐',
      description: 'Algèbre, géométrie, calcul',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'Histoire', 
      label: 'Histoire', 
      icon: '📚',
      description: 'Histoire de France, géographie',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    { 
      value: 'Anglais', 
      label: 'Anglais', 
      icon: '🇬🇧',
      description: 'Grammaire, vocabulaire, compréhension',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    { 
      value: 'Physique', 
      label: 'Physique', 
      icon: '⚡',
      description: 'Mécanique, électricité, optique',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200'
    },
    { 
      value: 'Chimie', 
      label: 'Chimie', 
      icon: '🧪',
      description: 'Réactions, équilibres, solutions',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    { 
      value: 'Français', 
      label: 'Français', 
      icon: '📖',
      description: 'Grammaire, littérature, expression',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    }
  ];

  const handleStartQuiz = () => {
    if (!user) {
      alert('Vous devez être connecté pour commencer un quiz');
      return;
    }
    
    if (!user.jetons || user.jetons < 1) {
      alert('Vous n\'avez pas assez de jetons. Veuillez en acheter.');
      navigate('/jetons');
      return;
    }

    navigate('/quiz', { 
      state: { 
        matiere, 
        classe: user.classe 
      } 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-gray-100">
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
            <p className="text-gray-600 mb-8 text-lg">Vous devez être connecté pour accéder aux quiz personnalisés.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center mx-auto"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-6">
            <SparklesIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Quiz IA Intelligents</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sélectionnez votre <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">quiz</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez une matière et laissez notre intelligence artificielle créer des questions adaptées à votre niveau.
          </p>

          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Niveau</div>
                  <div className="font-semibold text-gray-900">{user.niveau}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Classe</div>
                  <div className="font-semibold text-gray-900">{user.classe}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <CurrencyEuroIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Jetons</div>
                  <div className="font-semibold text-gray-900">{user.jetons || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matieres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {matieres.map((mat) => (
            <div
              key={mat.value}
              onClick={() => setMatiere(mat.value)}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                matiere === mat.value
                  ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className={`bg-gradient-to-br ${mat.bgColor} border ${mat.borderColor} rounded-2xl p-6 h-full`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{mat.icon}</div>
                  {matiere === mat.value && (
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mat.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{mat.description}</p>
                
                <div className={`w-full h-2 bg-white rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${mat.color} transition-all duration-500 ${
                      matiere === mat.value ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Durée estimée</h3>
              <p className="text-gray-600">10-15 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions</h3>
              <p className="text-gray-600">10 questions adaptées</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Difficulté</h3>
              <p className="text-gray-600">Adaptée à votre niveau</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleStartQuiz}
            disabled={!user.jetons || user.jetons < 1}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
          >
            <PlayIcon className="h-6 w-6 mr-2" />
            Commencer le quiz {matiere}
            <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/jetons')}
            className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center"
          >
            <CurrencyEuroIcon className="h-5 w-5 mr-2" />
            Acheter des jetons
          </button>
        </div>

        {/* Warning if no tokens */}
        {(!user.jetons || user.jetons < 1) && (
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mr-2" />
              <span className="font-semibold text-amber-800">Jetons insuffisants</span>
            </div>
            <p className="text-amber-700">
              Vous avez besoin d'au moins 1 jeton pour commencer un quiz. 
              <button 
                onClick={() => navigate('/jetons')}
                className="underline font-medium ml-1 hover:text-amber-800"
              >
                Achetez des jetons maintenant
              </button>
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            💡 Conseils pour réussir
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Lisez attentivement</h4>
                <p className="text-gray-600 text-sm">Prenez le temps de bien comprendre chaque question avant de répondre.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Répondez à tout</h4>
                <p className="text-gray-600 text-sm">Même si vous n'êtes pas sûr, essayez de répondre à toutes les questions.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Analysez les résultats</h4>
                <p className="text-gray-600 text-sm">Après le quiz, prenez le temps de comprendre vos erreurs pour progresser.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Pratiquez régulièrement</h4>
                <p className="text-gray-600 text-sm">La régularité est la clé pour améliorer vos compétences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectQuizPage; 