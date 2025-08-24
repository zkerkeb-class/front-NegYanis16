import React from 'react';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement annulé</h1>
          <p className="text-gray-600">Votre achat de jetons a été annulé. Aucun montant n'a été débité.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/jetons'}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-lg font-medium hover:from-[#023e8a] hover:to-[#0077b6] transition-all"
          >
            Réessayer l'achat
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}