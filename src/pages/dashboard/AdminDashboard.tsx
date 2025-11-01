import { useNavigate } from 'react-router-dom';
import { Users, Settings, Shield } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();

  const handleManageBusiness = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <p className="mt-2 text-gray-600">Gestion complète du système</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administration</p>
                <p className="text-2xl font-bold text-gray-900">Accès total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">Gestion complète</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Configuration</p>
                <p className="text-2xl font-bold text-gray-900">Paramètres</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleManageBusiness}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors duration-200 cursor-pointer"
            >
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-semibold">Gestion de l'entreprise</p>
              <p className="text-sm text-gray-600">Employés, contrats, transactions, taxes et impôts</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

