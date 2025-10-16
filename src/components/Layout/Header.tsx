import React, { useState } from 'react';
import { User, Bell, Globe, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onCountryChange: (country: string) => void;
}

export function Header({ onCountryChange }: HeaderProps) {
  const [language, setLanguage] = useState('fr');
  const [country, setCountry] = useState('cameroun');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
    setShowCountryMenu(false);
  };

  const toggleCountryMenu = () => {
    setShowCountryMenu(!showCountryMenu);
    setShowLanguageMenu(false);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const changeCountry = (countryCode: string) => {
    setCountry(countryCode);
    setShowCountryMenu(false);
    if (onCountryChange) {
      onCountryChange(countryCode);
    }
  };

  // Liste des pays avec leurs informations
  const countries = [
    { code: 'cameroun', name: 'Cameroun', flag: '/image/cameroun.png' },
    { code: 'coteIvoire', name: 'Côte d\'Ivoire', flag: '/image/coteIvoire.png' },
    { code: 'italie', name: 'Italie', flag: '/image/italie.png' },
    { code: 'benin', name: 'Bénin', flag: '/image/benin.png' },
    { code: 'togo', name: 'Togo', flag: '/image/togo.png' },
    { code: 'romanie', name: 'Roumanie', flag: '/image/romanie.png' },
    { code: 'sierraLeone', name: 'Sierra Leone', flag: '/image/sierraLeone.png' }
  ];

  // Fonction pour obtenir le chemin du drapeau selon le pays
  const getFlagPath = (countryCode: string) => {
    const countryItem = countries.find(c => c.code === countryCode);
    return countryItem ? countryItem.flag : 'image/cameroun.png';
  };

  // Fermer les menus si on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowLanguageMenu(false);
      setShowCountryMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sélecteur de langue */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguageMenu();
              }}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    language === 'fr' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    language === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => changeLanguage('it')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    language === 'it' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  🇮🇹 Italiano
                </button>
              </div>
            )}
          </div>
          
          {/* Sélecteur de pays */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleCountryMenu();
              }}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img 
                src={getFlagPath(country)} 
                alt={`Drapeau ${country}`} 
                className="w-5 h-5 object-cover rounded-sm"
                onError={(e) => {
                  console.error(`Erreur de chargement du drapeau: ${getFlagPath(country)}`);
                  e.currentTarget.src = 'image/cameroun.png'; // Image de secours
                }}
              />
              <span className="text-sm font-medium capitalize">{country}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showCountryMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 max-h-80 overflow-y-auto">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => changeCountry(c.code)}
                    className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      country === c.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <img 
                      src={c.flag} 
                      alt={c.name} 
                      className="w-5 h-5 object-cover rounded-sm"
                      onError={(e) => {
                        console.error(`Erreur de chargement du drapeau: ${c.flag}`);
                        e.currentTarget.src = 'image/cameroun.png'; // Image de secours
                      }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">KAMILIA</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <button className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}