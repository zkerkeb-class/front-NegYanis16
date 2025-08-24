import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PAYMENT_ENDPOINTS, USER_ENDPOINTS, PRICE_TOKEN_MAPPING, putAuthConfig } from '../config/api';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyEuroIcon,
  SparklesIcon,
  HomeIcon,
  CreditCardIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokensAdded, setTokensAdded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    const fetchSessionAndUpdateTokens = async () => {
      if (!sessionId) return setLoading(false);

      try {
        const res = await fetch(PAYMENT_ENDPOINTS.GET_SESSION(sessionId));
        const data = await res.json();
        console.log("data", data);

        setSessionDetails(data);

        if (data.payment_status === 'paid' && !tokensAdded) {
          const jetons = PRICE_TOKEN_MAPPING[data.amount_total];
          const authToken = localStorage.getItem('token'); // ou sessionStorage

          if (jetons) {
            const updateRes = await fetch(USER_ENDPOINTS.TOKENS, putAuthConfig(authToken, { jetons, operation: 'add' }));

            if (!updateRes.ok) {
              throw new Error("Erreur lors de l'ajout des jetons.");
            }

            setTokensAdded(true);
          } else {
            setError("Montant non reconnu, impossible d'ajouter les jetons automatiquement.");
          }
        }
      } catch (err) {
        console.error('Erreur de traitement:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndUpdateTokens();
  }, [searchParams, tokensAdded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md border border-gray-100 relative overflow-hidden">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CreditCardIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification du paiement</h2>
            <p className="text-gray-600 mb-6">Traitement de votre transaction...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTokenAmount = () => {
    if (!sessionDetails) return 0;
    const tokenMapping = {
      500: 10,
      900: 20,
      1200: 30,
    };
    return tokenMapping[sessionDetails.amount_total] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header de succès */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircleIcon className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200 mb-6">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-emerald-800">Paiement sécurisé</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Paiement <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">réussi</span> !
            </h1>
            
            {tokensAdded ? (
              <p className="text-xl text-gray-600 mb-6">
                Vos jetons ont été ajoutés à votre compte avec succès
              </p>
            ) : (
              <p className="text-xl text-gray-600 mb-6">
                Ajout des jetons en cours...
              </p>
            )}
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                  <span className="font-semibold text-red-800">Attention</span>
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Détails de la transaction */}
          {sessionDetails && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Détails de la transaction
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Montant payé</span>
                      <CurrencyEuroIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(sessionDetails.amount_total / 100).toFixed(2)} €
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Jetons ajoutés</span>
                      <SparklesIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {getTokenAmount()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Statut du paiement</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      sessionDetails.payment_status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sessionDetails.payment_status === 'paid' ? 'Payé' : sessionDetails.payment_status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Que souhaitez-vous faire maintenant ?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Retour au tableau de bord
              </button>
              
              <button
                onClick={() => navigate('/jetons')}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Acheter plus de jetons
              </button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
                Prochaines étapes
              </h4>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Vos jetons sont maintenant disponibles sur votre compte</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Vous pouvez commencer un nouveau quiz dès maintenant</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Un reçu de paiement vous a été envoyé par email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
