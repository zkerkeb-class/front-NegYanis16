import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import { USER_ENDPOINTS, QUIZ_ENDPOINTS, getAuthConfig, postAuthConfig, putAuthConfig } from '../../../config/api';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  TrophyIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/solid';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { matiere, classe } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [jetonsChecked, setJetonsChecked] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { token, user, fetchUserProfile } = useAuth();
  const jetonsConsumedRef = useRef(false);

  // Vérifier et consommer un jeton avant de commencer le quiz
  useEffect(() => {
    const checkAndConsumeJetons = async () => {
      if (!token || jetonsChecked || !user || jetonsConsumedRef.current) return;

      try {
        // Vérifier si l'utilisateur a des jetons
        if (user.jetons < 1) {
          setError('Vous n\'avez pas assez de jetons pour participer à ce quiz. Veuillez acheter des jetons.');
          setLoading(false);
          return;
        }

        // Marquer comme en cours de consommation pour éviter les appels multiples
        jetonsConsumedRef.current = true;

        // Consommer un jeton
        const response = await fetch(USER_ENDPOINTS.TOKENS, putAuthConfig(token, {
          jetons: 1,
          operation: 'subtract'
        }));

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la consommation des jetons');
        }

        // Rafraîchir le profil utilisateur pour mettre à jour l'affichage
        await fetchUserProfile();
        setJetonsChecked(true);

      } catch (error) {
        console.error('Erreur lors de la vérification des jetons:', error);
        setError(error.message || 'Erreur lors de la vérification des jetons');
        setLoading(false);
        // Réinitialiser le ref en cas d'erreur pour permettre une nouvelle tentative
        jetonsConsumedRef.current = false;
      }
    };

    checkAndConsumeJetons();
  }, [token, user, jetonsChecked]);

  useEffect(() => {
    if (!matiere || !classe || !jetonsChecked) {
      return;
    }

    setLoading(true);
    setError('');
    const params = new URLSearchParams({ level: classe, subject: matiere });
    fetch(`${QUIZ_ENDPOINTS.GENERATE}?${params.toString()}`, getAuthConfig(token)) 
      .then(async (res) => {
        if (!res.ok) throw new Error('Erreur lors de la génération du quiz');
        const data = await res.json();
        setQuestions(data.questions || []);
        setQuizId(data._id);
        // Initialiser les réponses vides
        const initialAnswers = {};
        (data.questions || []).forEach((_, index) => {
          initialAnswers[index] = '';
        });
        setAnswers(initialAnswers);
      })
      .catch((err) => {
        setError(err.message || 'Erreur inconnue');
      })
      .finally(() => setLoading(false));
  }, [matiere, classe, token, jetonsChecked]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(QUIZ_ENDPOINTS.CORRECT, postAuthConfig(token, {
        quizId: quizId,
        answers: Object.values(answers)
      }));

      if (!response.ok) {
        throw new Error('Erreur lors de la correction du quiz');
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      setError(err.message || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const isAllAnswered = () => {
    return questions.every((question, index) => {
      const answer = answers[index];
      if (question.type === 'ouverte') {
        // Pour les questions ouvertes, vérifier que la réponse n'est pas vide
        return answer && answer.trim() !== '';
      } else {
        // Pour les questions QCM, vérifier qu'une option est sélectionnée
        return answer && answer.trim() !== '';
      }
    });
  };

  const handleBuyJetons = () => {
    navigate('/jetons');
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => answer && answer.trim() !== '').length;
  };

  const getProgressPercentage = () => {
    return questions.length > 0 ? (getAnsweredCount() / questions.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md border border-gray-100 relative overflow-hidden">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Préparation du quiz</h2>
            <p className="text-gray-600 mb-6">Génération de vos questions personnalisées...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-gray-100">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            
            {error.includes('jetons') && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border border-amber-200">
                <div className="flex items-center justify-center mb-4">
                  <CurrencyEuroIcon className="h-6 w-6 text-amber-600 mr-2" />
                  <span className="font-semibold text-amber-800">Jetons actuels : {user?.jetons || 0}</span>
                </div>
                <button
                  onClick={handleBuyJetons}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <SparklesIcon className="h-5 w-5 inline mr-2" />
                  Acheter des jetons
                </button>
              </div>
            )}
            
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    const isExcellent = result.percentage >= 90;
    const isGood = result.percentage >= 70;
    const isAverage = result.percentage >= 50;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* En-tête des résultats */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-6">
                <TrophyIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Quiz terminé</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Résultats du quiz <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{matiere}</span>
              </h2>
              
              <div className="relative inline-block mb-6">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  isExcellent ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                  isGood ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                  isAverage ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                  'bg-gradient-to-r from-red-500 to-pink-600'
                } shadow-2xl`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{result.percentage}%</div>
                    <div className="text-sm text-white opacity-90">Score</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  {isExcellent && <TrophyIcon className="h-8 w-8 text-yellow-400" />}
                  {isGood && <CheckCircleIcon className="h-8 w-8 text-green-400" />}
                  {isAverage && <LightBulbIcon className="h-8 w-8 text-yellow-400" />}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{result.totalQuestions}</div>
                  <div className="text-sm text-blue-700">Questions totales</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{result.correctAnswers || 0}</div>
                  <div className="text-sm text-green-700">Réponses correctes</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{result.totalQuestions - (result.correctAnswers || 0)}</div>
                  <div className="text-sm text-purple-700">Réponses incorrectes</div>
                </div>
              </div>
              
              {result.feedback && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 mb-8">
                  <div className="flex items-center mb-3">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-900">Feedback personnalisé</span>
                  </div>
                  <p className="text-gray-700 text-lg italic">"{result.feedback}"</p>
                </div>
              )}
            </div>

            {/* Détail des questions et réponses */}
            <div className="space-y-6 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                Détail des questions
              </h3>
              
              {questions.map((question, index) => {
                const correction = result.corrections?.[index];
                const userAnswer = answers[index];
                const isCorrect = correction?.isCorrect;
                
                return (
                  <div key={index} className={`rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                    isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-start">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {index + 1}
                        </span>
                        {question.question}
                      </h3>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Incorrect
                          </>
                        )}
                      </div>
                    </div>

                    {/* Votre réponse */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Votre réponse :
                      </h4>
                      <div className={`p-4 rounded-lg border ${
                        isCorrect ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {userAnswer || 'Aucune réponse'}
                      </div>
                    </div>

                    {/* Réponse correcte */}
                    {!isCorrect && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Réponse correcte :
                        </h4>
                        <div className="p-4 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {correction?.correctAnswer || 'Non disponible'}
                        </div>
                      </div>
                    )}

                    {/* Explication */}
                    {correction?.feedback && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          <LightBulbIcon className="h-4 w-4 mr-2 text-yellow-600" />
                          Explication :
                        </h4>
                        <div className="p-4 rounded-lg bg-yellow-50 text-gray-800 border border-yellow-200">
                          {correction.feedback}
                        </div>
                      </div>
                    )}

                    {/* Score de la question */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Score : <span className="font-semibold">{correction?.score ? Math.round(correction.score * 100) : 0}%</span>
                      </div>
                      {correction?.score && (
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${correction.score * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/select-quiz')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Nouveau quiz
              </button>
              <button
                onClick={() => navigate('/results')}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <TrophyIcon className="h-5 w-5 mr-2" />
                Voir tous mes résultats
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header du quiz */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/select-quiz')}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                  <ClockIcon className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-blue-800">~15 min</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full">
                  <CurrencyEuroIcon className="h-4 w-4 text-emerald-600 mr-1" />
                  <span className="text-sm font-medium text-emerald-800">{user?.jetons || 0} jetons</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-4">
                <AcademicCapIcon className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Quiz en cours</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Quiz <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{matiere}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">Classe : {classe}</p>
              
              {/* Barre de progression */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progression</span>
                  <span>{getAnsweredCount()}/{questions.length} questions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {question.question}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {question.type === 'ouverte' ? (
                    // Question ouverte - champ de texte
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Votre réponse :
                      </label>
                      <textarea
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Écrivez votre réponse ici..."
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none text-gray-800 placeholder-gray-400"
                        rows="4"
                        required
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        {answers[index] ? `${answers[index].length} caractères` : '0 caractères'}
                      </div>
                    </div>
                  ) : (
                    // Question QCM - boutons radio
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Choisissez votre réponse :
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-md">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-4 text-gray-700 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bouton de soumission */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleSubmitQuiz}
              disabled={!isAllAnswered() || submitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Correction en cours...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Soumettre le quiz
                </>
              )}
            </button>
          </div>
          
          {/* Indicateur de progression */}
          {!isAllAnswered() && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Répondez à toutes les questions pour pouvoir soumettre le quiz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
