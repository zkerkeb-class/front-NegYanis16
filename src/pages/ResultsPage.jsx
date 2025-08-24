import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import { QUIZ_ENDPOINTS, getAuthConfig } from '../config/api';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  SparklesIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid';

const ResultsPage = () => {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(QUIZ_ENDPOINTS.USER_RESULTS, getAuthConfig(token))
      .then(res => res.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [token]);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'note') {
      return sortOrder === 'desc' ? b.note - a.note : a.note - b.note;
    } else if (sortBy === 'matiere') {
      return sortOrder === 'desc' 
        ? b.matiere.localeCompare(a.matiere)
        : a.matiere.localeCompare(b.matiere);
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 0.8) return '🏆';
    if (score >= 0.6) return '⭐';
    return '📚';
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Bon';
    return 'À améliorer';
  };

  const getMatiereIcon = (matiere) => {
    const icons = {
      'Maths': '📐',
      'Histoire': '📚',
      'Anglais': '🇬🇧',
      'Physique': '⚡',
      'Chimie': '🧪',
      'Français': '📖'
    };
    return icons[matiere] || '📝';
  };

  const getMatiereColor = (matiere) => {
    const colors = {
      'Maths': 'from-blue-500 to-blue-600',
      'Histoire': 'from-emerald-500 to-emerald-600',
      'Anglais': 'from-purple-500 to-purple-600',
      'Physique': 'from-amber-500 to-amber-600',
      'Chimie': 'from-red-500 to-red-600',
      'Français': 'from-indigo-500 to-indigo-600'
    };
    return colors[matiere] || 'from-gray-500 to-gray-600';
  };

  const calculateStats = () => {
    if (results.length === 0) return { totalQuizzes: 0, averageScore: 0, bestScore: 0, recentTrend: 'stable' };
    
    const totalQuizzes = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.note, 0) / totalQuizzes;
    const bestScore = Math.max(...results.map(result => result.note));
    
    // Calculer la tendance récente (3 derniers quiz)
    let recentTrend = 'stable';
    if (results.length >= 3) {
      const recent = results.slice(0, 3).map(r => r.note);
      const older = results.slice(3, 6).map(r => r.note);
      if (older.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        if (recentAvg > olderAvg + 0.1) recentTrend = 'up';
        else if (recentAvg < olderAvg - 0.1) recentTrend = 'down';
      }
    }
    
    return { totalQuizzes, averageScore, bestScore, recentTrend };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md border border-gray-100 relative overflow-hidden">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ChartBarIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement des résultats</h2>
            <p className="text-gray-600">Récupération de vos performances...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-4">
              <TrophyIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Historique complet</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mes <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">résultats</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Suivez votre progression académique et analysez vos performances
            </p>
          </div>
        </div>

        {/* Statistiques globales */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</div>
                  <div className="text-sm text-gray-600">Quiz total</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Nombre total de quiz réalisés</div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{(stats.averageScore * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Moyenne</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Score moyen sur tous vos quiz</div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{(stats.bestScore * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Meilleur</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Votre meilleur score obtenu</div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {results.length > 0 ? new Date(results[0].createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Dernier quiz</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Date de votre dernier quiz</div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        {results.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header du tableau */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpenIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Historique détaillé</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Trier par :</span>
                  <button
                    onClick={() => handleSort('date')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'date' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Date
                  </button>
                  <button
                    onClick={() => handleSort('note')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'note' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Score
                  </button>
                  <button
                    onClick={() => handleSort('matiere')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'matiere' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Matière
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tableau des résultats */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Matière</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Évaluation</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getMatiereColor(result.matiere)} rounded-xl flex items-center justify-center mr-3`}>
                            <span className="text-white text-lg">{getMatiereIcon(result.matiere)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{result.matiere}</div>
                            <div className="text-sm text-gray-500">Quiz #{index + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(result.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(result.note)}`}>
                            <span className="mr-1">{getScoreIcon(result.note)}</span>
                            {(result.note * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          result.note >= 0.8 ? 'bg-emerald-100 text-emerald-800' :
                          result.note >= 0.6 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {getScoreLabel(result.note)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                result.note >= 0.8 ? 'bg-emerald-500' : 
                                result.note >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${result.note * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{(result.note * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* État vide */
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun résultat disponible</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Commencez par passer quelques quiz pour voir vos résultats ici et suivre votre progression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/select-quiz')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Commencer un quiz
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </button>
            </div>
          </div>
        )}

             </div>
    </div>
  );
};

export default ResultsPage; 