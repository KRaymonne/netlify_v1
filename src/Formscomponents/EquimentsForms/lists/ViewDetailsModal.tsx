import React from 'react';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  fields: Array<{
    key: string;
    label: string;
    render?: (value: any) => React.ReactNode;
  }>;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, onClose, title, data, fields }) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD': return 'bg-green-100 text-green-800';
      case 'BAD': return 'bg-yellow-100 text-yellow-800';
      case 'BROKEN': return 'bg-red-100 text-red-800';
      case 'DECOMMISSIONED': return 'bg-gray-100 text-gray-800';
      case 'LOST': return 'bg-orange-100 text-orange-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800';
      case 'RETURNED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'GOOD': return 'Bon';
      case 'BAD': return 'Mauvais';
      case 'BROKEN': return 'En panne';
      case 'DECOMMISSIONED': return 'Réformé';
      case 'LOST': return 'Perdu';
      case 'ASSIGNED': return 'Affecté';
      case 'IN_TRANSIT': return 'En transit';
      case 'RETURNED': return 'Retourné';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'TOPOGRAPHIC_MATERIALS': return 'Matériels Topographiques';
      case 'COMPUTER_MATERIALS': return 'Matériels Informatiques';
      case 'OTHERS': return 'Autres';
      default: return category;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'TOTAL_STATION': return 'Station Totale';
      case 'GPS': return 'GPS';
      case 'LEVEL': return 'Niveau';
      case 'TABLET': return 'Tablette';
      case 'OTHERS': return 'Autres';
      default: return type;
    }
  };

  const getOwnershipText = (ownership: string) => {
    switch (ownership) {
      case 'OWNED': return 'Propriété';
      case 'LEASED': return 'Location';
      case 'BORROWED': return 'Emprunté';
      default: return ownership;
    }
  };

  const formatCurrency = (amount: number, devise: string = 'XAF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'devise',
      devise: devise,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Helper function to get nested property values
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, prop) => current && current[prop], obj);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {title}
                </h3>
                <div className="mt-2 grid grid-cols-1 gap-3">
                  {fields.map((field) => {
                    const value = getNestedValue(data, field.key);
                    let displayValue = value;
                    
                    if (field.render) {
                      displayValue = field.render(value);
                    } else if (field.key === 'status') {
                      displayValue = (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                          {getStatusText(value)}
                        </span>
                      );
                    } else if (field.key === 'category') {
                      displayValue = getCategoryText(value);
                    } else if (field.key === 'type') {
                      displayValue = getTypeText(value);
                    } else if (field.key === 'ownership') {
                      displayValue = getOwnershipText(value);
                    } else if (field.key.includes('Amount') && typeof value === 'number') {
                      const devise = data.devise || 'XAF';
                      displayValue = formatCurrency(value, devise);
                    } else if (field.key.includes('Date') && value) {
                      displayValue = formatDate(value);
                    } else if (field.key === 'attachmentFile' && value) {
                      displayValue = (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Voir
                        </a>
                      );
                    } else if (value === null || value === undefined || value === '') {
                      displayValue = '-';
                    }
                    
                    return (
                      <div key={field.key} className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
                        <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {displayValue}
                        </dd>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;