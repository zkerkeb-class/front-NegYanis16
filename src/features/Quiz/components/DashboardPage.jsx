import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUTH_ENDPOINTS, QUIZ_ENDPOINTS, getAuthConfig } from '../../../config/api';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  StarIcon, 
  CurrencyEuroIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  CalendarIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

const DashboardPage = () => {
  const { logout, token, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [matiere, setMatiere] = useState('Maths');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  // Récupérer le token depuis l'URL si nécessaire
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl && !token) {
      // Si on a un token dans l'URL mais pas dans le contexte, on le sauvegarde
      login(tokenFromUrl);
    }
  }, [searchParams, token, login]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(AUTH_ENDPOINTS.ME, getAuthConfig(token))
      .then(async res => {
        if (!res.ok) throw new Error('Erreur lors de la récupération du profil');
        const data = await res.json();
        setUser(data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [token]);

  // Récupérer les résultats des quiz
  useEffect(() => {
    if (!token) {
      console.log('Pas de token disponible');
      return;
    }
    console.log('Token disponible, récupération des résultats...');
    setResultsLoading(true);
    fetch(QUIZ_ENDPOINTS.USER_RESULTS, getAuthConfig(token))
      .then(async res => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des résultats');
        const data = await res.json();
        console.log('Données reçues de l\'API:', data);
        const resultsArray = Array.isArray(data) ? data : [];
        console.log('Résultats traités:', resultsArray);
        setResults(resultsArray);
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des résultats:', err);
        setResults([]);
      })
      .finally(() => setResultsLoading(false));
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartQuiz = () => {
    if (!user) return;
    navigate('/quiz', { state: { matiere, classe: user.classe } });
  };

  // Calculer les statistiques
  const calculateStats = () => {
    if (results.length === 0) return { totalQuizzes: 0, averageScore: 0, bestScore: 0 };
    
    const totalQuizzes = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.note, 0) / totalQuizzes;
    const bestScore = Math.max(...results.map(result => result.note));
    
    return { totalQuizzes, averageScore, bestScore };
  };

  const stats = calculateStats();

  // Fonction pour obtenir l'icône de matière
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

  // Fonction pour obtenir la couleur de score
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  function StatCards({ stats, user }) {
    const navigate = useNavigate();
    
    const getQuizComment = () => {
      if (stats.totalQuizzes === 0) return { evolution: "Aucun quiz", evolutionColor: "text-gray-500", subtitle: "Commencez votre premier quiz" };
      if (stats.totalQuizzes === 1) return { evolution: "Premier quiz", evolutionColor: "text-blue-600", subtitle: "Excellent début !" };
      if (stats.totalQuizzes >= 10) return { evolution: "Quiz régulier", evolutionColor: "text-green-600", subtitle: "Vous êtes assidu" };
      return { evolution: `${stats.totalQuizzes} quiz(s)`, evolutionColor: "text-blue-600", subtitle: "Continuez comme ça" };
    };

    const getAverageComment = () => {
      if (stats.averageScore === 0) return { evolution: "Aucune note", evolutionColor: "text-gray-500", subtitle: "Passez votre premier quiz" };
      if (stats.averageScore >= 0.8) return { evolution: "Excellente moyenne", evolutionColor: "text-green-600", subtitle: "Vous excellez !" };
      if (stats.averageScore >= 0.6) return { evolution: "Bonne moyenne", evolutionColor: "text-blue-600", subtitle: "Continuez à progresser" };
      return { evolution: "Moyenne à améliorer", evolutionColor: "text-yellow-600", subtitle: "Plus de pratique nécessaire" };
    };

    const getBestScoreComment = () => {
      if (stats.bestScore === 0) return { evolution: "Aucun score", evolutionColor: "text-gray-500", subtitle: "Passez votre premier quiz" };
      if (stats.bestScore >= 0.9) return { evolution: "Score parfait", evolutionColor: "text-green-600", subtitle: "Impressionnant !" };
      if (stats.bestScore >= 0.8) return { evolution: "Très bon score", evolutionColor: "text-blue-600", subtitle: "Excellent travail" };
      return { evolution: "Score correct", evolutionColor: "text-yellow-600", subtitle: "Vous pouvez faire mieux" };
    };

    const getJetonsComment = () => {
      const jetons = user?.jetons || 0;
      if (jetons === 0) return { evolution: "Aucun jeton", evolutionColor: "text-red-600", subtitle: "Achetez des jetons" };
      if (jetons >= 10) return { evolution: "Jetons suffisants", evolutionColor: "text-green-600", subtitle: "Vous êtes prêt" };
      return { evolution: `${jetons} jeton(s)`, evolutionColor: "text-yellow-600", subtitle: "Pensez à en racheter" };
    };

    const quizComment = getQuizComment();
    const averageComment = getAverageComment();
    const bestScoreComment = getBestScoreComment();
    const jetonsComment = getJetonsComment();

    const statsData = [
      {
        icon: <AcademicCapIcon className="h-8 w-8 text-white" />,
        title: "Quiz réalisés",
        value: stats.totalQuizzes,
        evolution: quizComment.evolution,
        evolutionColor: quizComment.evolutionColor,
        subtitle: quizComment.subtitle,
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        shadow: "shadow-blue-100"
      },
      {
        icon: <ChartBarIcon className="h-8 w-8 text-white" />,
        title: "Moyenne générale",
        value: `${(stats.averageScore * 100).toFixed(1)}%`,
        evolution: averageComment.evolution,
        evolutionColor: averageComment.evolutionColor,
        subtitle: averageComment.subtitle,
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        shadow: "shadow-emerald-100"
      },
      {
        icon: <TrophyIcon className="h-8 w-8 text-white" />,
        title: "Meilleur score",
        value: `${(stats.bestScore * 100).toFixed(1)}%`,
        evolution: bestScoreComment.evolution,
        evolutionColor: bestScoreComment.evolutionColor,
        subtitle: bestScoreComment.subtitle,
        bg: "bg-gradient-to-br from-amber-500 to-amber-600",
        shadow: "shadow-amber-100"
      },
      {
        icon: <CurrencyEuroIcon className="h-8 w-8 text-white" />,
        title: "Jetons restants",
        value: (
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-800">{user?.jetons ?? 0}</div>
            <button
              className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={() => navigate("/jetons")}
            >
              Acheter des jetons
            </button>
          </div>
        ),
        evolution: jetonsComment.evolution,
        evolutionColor: jetonsComment.evolutionColor,
        subtitle: jetonsComment.subtitle,
        bg: "bg-gradient-to-br from-purple-500 to-purple-600",
        shadow: "shadow-purple-100"
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between min-h-[180px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${stat.shadow}`}
          >
            <div className="flex items-center p-6 pb-4">
              <div className={`rounded-2xl ${stat.bg} flex items-center justify-center w-14 h-14 mr-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="flex-1 text-right">
                <div className="text-sm font-medium text-gray-500 mb-1">{stat.title}</div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex items-center bg-gray-50 rounded-b-2xl">
              <span className={`font-semibold mr-2 ${stat.evolutionColor}`}>{stat.evolution}</span>
              <span className="text-gray-500 text-sm">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-lg text-gray-600">
                Bienvenue, {user?.prenom || 'Étudiant'} ! Voici un aperçu de vos performances.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Niveau :</span>
                <span className="ml-2 font-semibold text-gray-800">{user?.niveau || 'N/A'}</span>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Classe :</span>
                <span className="ml-2 font-semibold text-gray-800">{user?.classe || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <StatCards stats={stats} user={user} />

        {/* Section principale avec historique et actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Historique des quiz - Section principale */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Historique des quiz</h2>
                  </div>
                  {results.length > 0 && (
                    <button
                      onClick={() => navigate('/results')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors"
                    >
                      Voir tout
                      <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {resultsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Chargement de l'historique...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.slice(0, 5).map((result, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">
                              {getMatiereIcon(result.matiere)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{result.matiere}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(result.createdAt).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(result.note)}`}>
                            {(result.note * 100).toFixed(1)}%
                          </div>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              result.note >= 0.8 ? 'bg-emerald-500' : 
                              result.note >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.note * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun quiz réalisé</h3>
                    <p className="text-gray-600 mb-6">Commencez votre apprentissage en passant votre premier quiz !</p>
                    <button
                      onClick={() => navigate('/select-quiz')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Commencer un quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section latérale - Actions rapides et feedbacks */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <div className="flex items-center">
                  <SparklesIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">Actions rapides</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Matière :</label>
                    <select 
                      value={matiere} 
                      onChange={e => setMatiere(e.target.value)} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="Maths">Mathématiques</option>
                      <option value="Histoire">Histoire</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Physique">Physique</option>
                      <option value="Chimie">Chimie</option>
                      <option value="Français">Français</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleStartQuiz}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    Commencer un quiz
                  </button>
                  
                  <button 
                    onClick={() => navigate('/select-quiz')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Voir tous les quiz
                  </button>
                </div>
              </div>
            </div>

            {/* Feedbacks & Conseils */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-200">
                  <div className="flex items-center">
                    <LightBulbIcon className="h-6 w-6 text-emerald-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">Feedbacks & Conseils</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.averageScore >= 0.8 ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="text-2xl mr-2">🎉</div>
                          <h4 className="font-semibold text-emerald-800">Excellent travail !</h4>
                        </div>
                        <p className="text-emerald-700 text-sm">
                          Votre moyenne de {(stats.averageScore * 100).toFixed(1)}% montre une excellente compréhension des matières.
                        </p>
                      </div>
                    ) : stats.averageScore >= 0.6 ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="text-2xl mr-2">👍</div>
                          <h4 className="font-semibold text-amber-800">Bon travail !</h4>
                        </div>
                        <p className="text-amber-700 text-sm">
                          Continuez à vous entraîner pour améliorer votre moyenne de {(stats.averageScore * 100).toFixed(1)}%.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="text-2xl mr-2">💪</div>
                          <h4 className="font-semibold text-red-800">Continuez à vous entraîner !</h4>
                        </div>
                        <p className="text-red-700 text-sm">
                          Votre moyenne de {(stats.averageScore * 100).toFixed(1)}% peut être améliorée avec plus de pratique.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-amber-200">
                <div className="flex items-center">
                  <TrophyIcon className="h-6 w-6 text-amber-600 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">Badges & Récompenses</h3>
                </div>
              </div>
              
              <div className="p-6">
                {results.length > 0 ? (
                  <div className="space-y-3">
                    {stats.totalQuizzes >= 5 && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                        <div className="text-2xl mr-3">🏆</div>
                        <div>
                          <div className="font-semibold text-yellow-800">Quiz Master</div>
                          <div className="text-sm text-yellow-700">5+ quiz réalisés</div>
                        </div>
                      </div>
                    )}
                    {stats.averageScore >= 0.8 && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                        <div className="text-2xl mr-3">🎯</div>
                        <div>
                          <div className="font-semibold text-emerald-800">Excellent</div>
                          <div className="text-sm text-emerald-700">Moyenne ≥ 80%</div>
                        </div>
                      </div>
                    )}
                    {stats.bestScore >= 0.9 && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                        <div className="text-2xl mr-3">⭐</div>
                        <div>
                          <div className="font-semibold text-purple-800">Perfectionniste</div>
                          <div className="text-sm text-purple-700">Score ≥ 90%</div>
                        </div>
                      </div>
                    )}
                    {stats.totalQuizzes === 0 && (
                      <div className="text-center py-4">
                        <div className="text-3xl mb-2">🎁</div>
                        <p className="text-gray-600 text-sm">Passez votre premier quiz pour débloquer des badges !</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🎁</div>
                    <p className="text-gray-600 text-sm">Passez votre premier quiz pour débloquer des badges !</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 