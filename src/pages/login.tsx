import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Liste des pays disponibles
  const countries = [
    { code: '', name: 'Sélectionnez votre pays' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'TG', name: 'Togo' },
    { code: 'CM', name: 'Cameroun' },
    { code: 'RO', name: 'Roumanie' },
    { code: 'IT', name: 'Italie' },
    { code: 'BJ', name: 'Bénin' },
    { code: 'SL', name: 'Sierra Leone' },
  ];

  // Simuler une base d'utilisateurs avec leurs rôles et pays
  const users = [
    { username: 'admin', password: 'admin123', role: 'Admin', country: 'CM' },
    { username: 'comptable', password: 'compta123', role: 'Comptable', country: 'CM' },
    { username: 'employe', password: 'employe123', role: 'Employé', country: 'CM' },
    { username: 'gestionnaire', password: 'gestion123', role: 'Gestionnaire du parc', country: 'CM' },
    { username: 'rh', password: 'rh123', role: 'Ressources humaines', country: 'CM' },
    { username: 'chefprojet', password: 'chef123', role: 'Chef de projet', country: 'CM' },
    { username: 'boss', password: 'boss123', role: 'Boss', country: 'CM' },
    { username: 'employeer', password: 'employeer123', role: 'Employeer', country: 'CM' },
    { username: 'admin_ca', password: 'admin123', role: 'Admin', country: 'CM' },
    { username: 'comptable_sn', password: 'compta123', role: 'Comptable', country: 'CM' },
    { username: 'admin_ci', password: 'admin123', role: 'Admin', country: 'CM' },
    { username: 'comptable_tg', password: 'compta123', role: 'Comptable', country: 'CM' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validation du pays
    if (!country) {
      setError('Veuillez sélectionner votre pays');
      setIsLoading(false);
      return;
    }
    
    // Simulation d'un délai de chargement
    setTimeout(() => {
      // Vérification des identifiants
      const user = users.find(
        u => u.username === username && u.password === password && u.country === country
      );
      
      if (user) {
        // Stocker les infos utilisateur
        localStorage.setItem('user', JSON.stringify({
          username: user.username,
          role: user.role,
          country: user.country
        }));
        
        // Redirection selon le rôle
        switch(user.role) {
          case 'Admin':
            navigate('/dashboard/admin');
            break;
          case 'Comptable':
            navigate('/dashboard/comptable');
            break;
          case 'Boss':
            navigate('/dashboard/boss');
            break;
          case 'Employeer':
            navigate('/dashboard/employeer');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError('Nom d\'utilisateur, mot de passe ou pays incorrect');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Connexion au Système
          </h2>
          <p className="mt-2 text-indigo-100">
            Accès aux modules de gestion d'entreprise
          </p>
        </div>
        
        <form className="px-8 py-6 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <div className="relative">
                <select
                  id="country"
                  name="country"
                  required
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-colors"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-colors"
                  placeholder="Votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-colors"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : 'Se connecter'}
            </button>
          </div>
        </form>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            &copy; {new Date().getFullYear()} Système de Gestion d'Entreprise. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}