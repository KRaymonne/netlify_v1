import { DollarSign, Receipt, Banknote, FileText, Users, AlertCircle, Car, Briefcase, Phone, Wrench, Building } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout';

export function AccountantDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Comptable</h1>
          <p className="mt-2 text-gray-600">Gestion financière et comptable</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registres</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Banknote className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banques</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Receipt className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Factures</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impôts</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-semibold">Registres</p>
              <p className="text-sm text-gray-600">Gérer les registres comptables</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Banknote className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-semibold">Banques</p>
              <p className="text-sm text-gray-600">Gérer les comptes bancaires</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Receipt className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-semibold">Factures</p>
              <p className="text-sm text-gray-600">Consulter et gérer les factures</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Car className="w-6 h-6 text-gray-600 mb-2" />
              <p className="font-semibold">Parc Auto</p>
              <p className="text-sm text-gray-600">Gérer le parc automobile</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-semibold">Alertes</p>
              <p className="text-sm text-gray-600">Voir les alertes</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <FileText className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-semibold">Impôts et taxes</p>
              <p className="text-sm text-gray-600">Gérer les impôts</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Users className="w-6 h-6 text-indigo-600 mb-2" />
              <p className="font-semibold">Personnel</p>
              <p className="text-sm text-gray-600">Gérer le personnel</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Phone className="w-6 h-6 text-teal-600 mb-2" />
              <p className="font-semibold">Contacts</p>
              <p className="text-sm text-gray-600">Gérer les contacts</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Wrench className="w-6 h-6 text-yellow-600 mb-2" />
              <p className="font-semibold">Equipement</p>
              <p className="text-sm text-gray-600">Gérer les équipements</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Briefcase className="w-6 h-6 text-pink-600 mb-2" />
              <p className="font-semibold">Offre</p>
              <p className="text-sm text-gray-600">Gérer les offres</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <Building className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-semibold">Affaire</p>
              <p className="text-sm text-gray-600">Gérer les affaires</p>
            </button>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}

