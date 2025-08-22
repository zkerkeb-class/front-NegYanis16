import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import {
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  UserGroupIcon,
  StarIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/solid';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-blue-600" />,
      title: "Quiz Personnalisés",
      description: "Des questions adaptées à votre niveau et à votre classe pour un apprentissage optimal.",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-emerald-600" />,
      title: "Suivi des Progrès",
      description: "Suivez vos performances et vos améliorations avec des statistiques détaillées.",
      color: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      icon: <TrophyIcon className="h-8 w-8 text-amber-600" />,
      title: "Badges et Récompenses",
      description: "Gagnez des badges en fonction de vos performances et restez motivé.",
      color: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-8">
              <SparklesIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Nouveau : Quiz IA Intelligents</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Bienvenue sur
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                QuizPro
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Améliorez vos connaissances avec nos quiz intelligents adaptés à votre niveau. 
              <span className="font-semibold text-gray-800"> Apprenez en vous amusant</span> avec des questions personnalisées.
            </p>

            {/* CTA Buttons */}
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  to="/register" 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  aria-label="Créer un compte pour commencer les quiz"
                >
                  <RocketLaunchIcon className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Commencer maintenant
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center"
                  aria-label="Se connecter à mon compte existant"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Se connecter
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  to="/dashboard" 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  aria-label="Accéder à mon tableau de bord"
                >
                  <ChartBarIcon className="h-6 w-6 mr-2" />
                  Aller au tableau de bord
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/select-quiz" 
                  className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center"
                  aria-label="Commencer un nouveau quiz"
                >
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Commencer un quiz
                </Link>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Gratuit pour commencer
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Pas de carte de crédit
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                IA Intelligente
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">QuizPro</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les fonctionnalités qui font de QuizPro la plateforme d'apprentissage préférée des étudiants.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${feature.color} border ${feature.borderColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En seulement 3 étapes simples, commencez votre apprentissage personnalisé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Créez votre compte",
                description: "Inscrivez-vous gratuitement et configurez votre profil avec votre niveau et classe.",
                icon: <UserGroupIcon className="h-8 w-8 text-white" />
              },
              {
                step: "02",
                title: "Choisissez votre quiz",
                description: "Sélectionnez une matière et laissez notre IA générer des questions adaptées.",
                icon: <AcademicCapIcon className="h-8 w-8 text-white" />
              },
              {
                step: "03",
                title: "Apprenez et progressez",
                description: "Répondez aux questions, recevez des feedbacks et suivez vos améliorations.",
                icon: <ChartBarIcon className="h-8 w-8 text-white" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à commencer votre apprentissage ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'étudiants qui améliorent leurs connaissances avec QuizPro.
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="group bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <RocketLaunchIcon className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Commencer gratuitement
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Se connecter
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/select-quiz" 
                  className="group bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  Commencer un quiz
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Voir mes progrès
                </Link>
              </div>
            )}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
