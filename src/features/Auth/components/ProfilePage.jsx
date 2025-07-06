import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PencilIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CurrencyEuroIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';

const niveaux = [
  { label: 'Collège', value: 'collège', classes: ['6ème', '5ème', '4ème', '3ème'] },
  { label: 'Lycée', value: 'lycée', classes: ['2nd', '1ère', 'Terminale'] },
];

const ProfilePage = () => {
  const { user, token, loadingUser, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', niveau: '', classe: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Préremplir le formulaire avec les infos utilisateur
  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        niveau: user.niveau || 'collège',
        classe: user.classe || '6ème',
      });
    }
  }, [user]);

  // Gérer le changement de champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si on change de niveau, reset la classe à la première du niveau
    if (name === 'niveau') {
      const nv = niveaux.find(n => n.value === value);
      setForm(f => ({ ...f, niveau: value, classe: nv.classes[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Soumettre la modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }
      setSuccess('Profil mis à jour avec succès !');
      await fetchUserProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md border border-gray-100 relative overflow-hidden">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement du profil</h2>
            <p className="text-gray-600">Récupération de vos informations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
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
              <UserIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Gestion du profil</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mon <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">profil</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gérez vos informations personnelles et vos préférences d'apprentissage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations utilisateur */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.prenom} {user?.nom}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              {/* Statistiques utilisateur */}
              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CurrencyEuroIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <span className="font-semibold text-blue-800">Jetons</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{user?.jetons || 0}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-6 w-6 text-emerald-600 mr-3" />
                      <span className="font-semibold text-emerald-800">Niveau</span>
                    </div>
                    <span className="text-lg font-semibold text-emerald-600">{user?.classe}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BuildingLibraryIcon className="h-6 w-6 text-purple-600 mr-3" />
                      <span className="font-semibold text-purple-800">Établissement</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-600">{user?.niveau}</span>
                  </div>
                </div>
              </div>

              {/* Informations de sécurité */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">Sécurité</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vos données sont protégées et sécurisées. L'email ne peut pas être modifié pour des raisons de sécurité.
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire de modification */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <PencilIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Modifier mes informations</h2>
                  <p className="text-gray-600">Mettez à jour vos informations personnelles</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      value={form.prenom}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Nom
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-600" />
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-gray-50"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre.email@exemple.com"
                    required
                    disabled
                  />
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <ShieldCheckIcon className="h-4 w-4 mr-2 text-gray-400" />
                    L'email ne peut pas être modifié pour des raisons de sécurité
                  </div>
                </div>

                {/* Niveau et Classe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="niveau" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <BuildingLibraryIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Niveau
                    </label>
                    <select
                      id="niveau"
                      name="niveau"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 bg-white"
                      value={form.niveau}
                      onChange={handleChange}
                    >
                      {niveaux.map(nv => (
                        <option key={nv.value} value={nv.value}>{nv.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="classe" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Classe
                    </label>
                    <select
                      id="classe"
                      name="classe"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 bg-white"
                      value={form.classe}
                      onChange={handleChange}
                    >
                      {niveaux.find(nv => nv.value === form.niveau)?.classes.map(cl => (
                        <option key={cl} value={cl}>{cl}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Messages de succès/erreur */}
                {success && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                      <span className="font-semibold text-green-800">{success}</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                      <span className="font-semibold text-red-800">{error}</span>
                    </div>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage; 