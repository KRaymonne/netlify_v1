import React from 'react';
import { X, Eye, Calendar, User, FileText, DollarSign, Globe } from 'lucide-react';

interface OffreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'dao' | 'devis' | 'ami';
}

export const OffreDetailsModal: React.FC<OffreDetailsModalProps> = ({
  isOpen,
  onClose,
  data,
  type
}) => {
  if (!isOpen || !data) return null;

  const formatCurrency = (amount: number, currency: string = 'XAF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLICATION':
      case 'Application':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW':
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'SHORTLISTED':
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'BID_SUBMITTED':
      case 'Bid Submitted':
        return 'bg-purple-100 text-purple-800';
      case 'NOT_PURSUED':
      case 'Not Pursued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPLICATION': return 'Candidature';
      case 'UNDER_REVIEW': return 'En Étude';
      case 'PENDING': return 'En Attente';
      case 'SHORTLISTED': return 'Retenu';
      case 'BID_SUBMITTED': return 'Soumission';
      case 'NOT_PURSUED': return 'Pas de suite';
      default: return status;
    }
  };

  const getSubmissionTypeText = (type: string) => {
    switch (type) {
      case 'ELECTRONIC': return 'Électronique';
      case 'PHYSICAL': return 'Physique';
      case 'EMAIL': return 'Email';
      default: return type;
    }
  };

  const renderDAOFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">N° DAO</p>
              <p className="text-lg font-semibold text-gray-900">{data.daoNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-lg font-semibold text-gray-900">{data.clientname}</p>
            </div>
          </div>

          {data.contactname && (
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-lg font-semibold text-gray-900">{data.contactname}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date de transmission</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(data.transmissionDate)}</p>
            </div>
          </div>

          {data.submissionDate && (
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date de soumission</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(data.submissionDate)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Type de soumission</p>
              <p className="text-lg font-semibold text-gray-900">{getSubmissionTypeText(data.submissionType)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(data.status)}`}>
                {getStatusText(data.status)}
              </span>
            </div>
          </div>

          {data.activityCode && (
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Code d'activité</p>
                <p className="text-lg font-semibold text-gray-900">{data.activityCode}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Devise</p>
              <p className="text-lg font-semibold text-gray-900">{data.devise}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Objet</h4>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{data.object}</p>
      </div>

      {data.attachment && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Pièce jointe</h4>
          <a 
            href={data.attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voir le fichier
          </a>
        </div>
      )}
    </>
  );

  const renderDevisFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">N° Index</p>
              <p className="text-lg font-semibold text-gray-900">{data.indexNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-lg font-semibold text-gray-900">{data.clientname}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Montant</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(data.amount, data.devise)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date de validité</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(data.validityDate)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(data.status)}`}>
                {getStatusText(data.status)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Devise</p>
              <p className="text-lg font-semibold text-gray-900">{data.devise}</p>
            </div>
          </div>
        </div>
      </div>

      {data.description && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{data.description}</p>
        </div>
      )}

      {data.attachment && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Pièce jointe</h4>
          <a 
            href={data.attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voir le fichier
          </a>
        </div>
      )}
    </>
  );

  const renderAMIFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nom</p>
              <p className="text-lg font-semibold text-gray-900">{data.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-lg font-semibold text-gray-900">{data.client}</p>
            </div>
          </div>

          {data.contact && (
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-lg font-semibold text-gray-900">{data.contact}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date de dépôt</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(data.depositDate)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date de soumission</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(data.submissionDate)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(data.status)}`}>
                {data.status}
              </span>
            </div>
          </div>

          {data.activityCode && (
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Code d'activité</p>
                <p className="text-lg font-semibold text-gray-900">{data.activityCode}</p>
              </div>
            </div>
          )}

          {data.soumissionType && (
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Type de soumission</p>
                <p className="text-lg font-semibold text-gray-900">{data.soumissionType}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Objet</h4>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{data.object}</p>
      </div>

      {data.comment && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Commentaire</h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{data.comment}</p>
        </div>
      )}

      {data.attachment && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Pièce jointe</h4>
          <a 
            href={data.attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voir le fichier
          </a>
        </div>
      )}
    </>
  );

  const getTitle = () => {
    switch (type) {
      case 'dao': return `Détails du DAO ${data.daoNumber}`;
      case 'devis': return `Détails du Devis ${data.indexNumber}`;
      case 'ami': return `Détails de l'AMI ${data.name}`;
      default: return 'Détails';
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'dao': return renderDAOFields();
      case 'devis': return renderDevisFields();
      case 'ami': return renderAMIFields();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{getTitle()}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4">
              {renderFields()}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
