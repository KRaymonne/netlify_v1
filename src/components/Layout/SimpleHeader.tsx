import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function SimpleHeader() {
  const { logout, role, email, firstName, lastName, effectiveCountryCode } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    setShowLogoutModal(false);
  };

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const countries = [
    { code: 'cameroun', name: 'Cameroun', flag: '/image/cameroun.png' },
    { code: 'coteIvoire', name: 'Côte d\'Ivoire', flag: '/image/coteIvoire.png' },
    { code: 'italie', name: 'Italie', flag: '/image/italie.png' },
    { code: 'ghana', name: 'Ghana', flag: '/image/ghana.jpg' },
    { code: 'benin', name: 'Bénin', flag: '/image/benin.png' },
    { code: 'togo', name: 'Togo', flag: '/image/togo.png' },
    { code: 'romanie', name: 'Roumanie', flag: '/image/romanie.png' }
  ];
  const getFlagPath = (code: string) => (countries.find(c => c.code === code)?.flag) || 'image/cameroun.png';
  const countryLabel = countries.find(c => c.code === effectiveCountryCode)?.name || 'Cameroun';

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">Tableau de bord</h1>
            {/* Country flag for non-admin view */}
            <div className="flex items-center space-x-2">
              <img
                src={getFlagPath(effectiveCountryCode || 'cameroun')}
                alt={countryLabel}
                className="w-5 h-5 object-cover rounded-sm"
                onError={(e) => { e.currentTarget.src = 'image/cameroun.png'; }}
              />
              <span className="text-sm text-gray-600">{countryLabel}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User menu */}
            <div className="relative flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {firstName && lastName 
                    ? `${firstName} ${lastName}` 
                    : email?.split('@')[0].toUpperCase() || 'USER'}
                </p>
                <p className="text-xs text-gray-500">{role || 'Utilisateur'}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Bouton de déconnexion visible */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowLogoutModal(false)}
            ></div>

            {/* Modal */}
            <div 
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header avec couleur de l'app (bleu) */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <LogOut className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Confirmation de déconnexion
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <LogOut className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-base leading-relaxed">
                      Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Toutes vos données de session seront supprimées et vous devrez vous reconnecter pour accéder à l'application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer avec boutons */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                >
                  Oui, me déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

