import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  CurrencyEuroIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  BoltIcon,
  GiftIcon
} from '@heroicons/react/24/solid';

const offers = [
  { 
    id: 10, 
    price: 500, 
    name: 'Pack Starter',
    description: 'Parfait pour commencer',
    popular: false,
    savings: null,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200'
  },
  { 
    id: 20, 
    price: 900, 
    name: 'Pack Popular',
    description: 'Le plus choisi',
    popular: true,
    savings: 10,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200'
  },
  { 
    id: 30, 
    price: 1200, 
    name: 'Pack Pro',
    description: 'Pour les utilisateurs réguliers',
    popular: false,
    savings: 20,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200'
  },
];

export default function JetonsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePurchase = async (tokens, price) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3003/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: tokens }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const data = await response.json();
      window.location.href = data.url;
      
    } catch (err) {
      console.error('Erreur de paiement:', err);
      setError('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour
          </button>

          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200 mb-6">
            <SparklesIcon className="h-4 w-4 text-amber-600 mr-2" />
            <span className="text-sm font-medium text-amber-800">Paiement sécurisé</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Achetez vos <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">jetons</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez le pack qui vous convient et commencez votre apprentissage avec nos quiz IA intelligents.
          </p>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-2" />
              Paiement sécurisé
            </div>
            <div className="flex items-center">
              <CreditCardIcon className="h-4 w-4 text-blue-500 mr-2" />
              Stripe
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 mr-2" />
              Sans engagement
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center mb-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                <span className="font-semibold text-red-800">Erreur de paiement</span>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`relative bg-gradient-to-br ${offer.bgColor} border ${offer.borderColor} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                offer.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <StarIcon className="h-4 w-4 inline mr-1" />
                    Le plus populaire
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              {offer.savings && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{offer.savings}%
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.name}</h3>
                <p className="text-gray-600 mb-6">{offer.description}</p>
                
                <div className="mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{offer.id}</div>
                  <div className="text-lg text-gray-600">jetons</div>
                </div>

                <div className="mb-8">
                  <div className="text-3xl font-bold text-gray-900">{(offer.price / 100).toFixed(2)} €</div>
                  <div className="text-sm text-gray-500">
                    {(offer.price / offer.id / 100).toFixed(2)} € par jeton
                  </div>
                </div>

                <button
                  className={`w-full px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r ${offer.color} text-white hover:from-opacity-90 hover:to-opacity-90`}
                  onClick={() => handlePurchase(offer.id, offer.price)}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Chargement...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CurrencyEuroIcon className="h-5 w-5 mr-2" />
                      Acheter maintenant
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Pourquoi acheter des jetons ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz IA Intelligents</h3>
              <p className="text-gray-600">Des questions adaptées à votre niveau générées par intelligence artificielle.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GiftIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Feedback Personnalisé</h3>
              <p className="text-gray-600">Recevez des explications détaillées et des conseils pour progresser.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Suivi des Progrès</h3>
              <p className="text-gray-600">Analysez vos performances et suivez votre évolution dans le temps.</p>
            </div>
          </div>
        </div> */}

        {/* Test Cards Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💳 Cartes de test Stripe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-emerald-700 mb-3 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Paiement réussi
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Numéro :</strong> 4242 4242 4242 4242</p>
                <p><strong>Date :</strong> N'importe quelle date future</p>
                <p><strong>CVC :</strong> N'importe quels 3 chiffres</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Paiement échoué
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Numéro :</strong> 4000 0000 0000 0002</p>
                <p><strong>Date :</strong> N'importe quelle date future</p>
                <p><strong>CVC :</strong> N'importe quels 3 chiffres</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Questions fréquentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Les jetons expirent-ils ?</h4>
              <p className="text-gray-600 text-sm">Non, vos jetons n'expirent jamais et restent disponibles sur votre compte.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Puis-je rembourser mes jetons ?</h4>
              <p className="text-gray-600 text-sm">Oui, vous pouvez demander un remboursement dans les 30 jours suivant l'achat.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Combien de questions par quiz ?</h4>
              <p className="text-gray-600 text-sm">Chaque quiz contient 10 questions adaptées à votre niveau et classe.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Mes données sont-elles sécurisées ?</h4>
              <p className="text-gray-600 text-sm">Absolument, nous utilisons Stripe pour des paiements 100% sécurisés.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}