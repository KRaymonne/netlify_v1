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
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'IN_USE': return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_SERVICE': return 'bg-red-100 text-red-800';
      case 'GOOD': return 'bg-green-100 text-green-800';
      case 'BAD': return 'bg-yellow-100 text-yellow-800';
      case 'BROKEN': return 'bg-red-100 text-red-800';
      case 'DECOMMISSIONED': return 'bg-gray-100 text-gray-800';
      case 'LOST': return 'bg-orange-100 text-orange-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800';
      case 'RETURNED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'MECHANICAL': return 'bg-blue-100 text-blue-800';
      case 'ELECTRONIC': return 'bg-yellow-100 text-yellow-800';
      case 'SOFTWARE': return 'bg-purple-100 text-purple-800';
      case 'BODYWORK': return 'bg-orange-100 text-orange-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      case 'PURCHASE': return 'bg-green-100 text-green-800';
      case 'REPAIR': return 'bg-red-100 text-red-800';
      case 'REVISION': return 'bg-yellow-100 text-yellow-800';
      case 'CALIBRATION': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponible';
      case 'IN_USE': return 'En service';
      case 'UNDER_MAINTENANCE': return 'Maintenance';
      case 'OUT_OF_SERVICE': return 'Hors service';
      case 'GOOD': return 'Bon';
      case 'BAD': return 'Mauvais';
      case 'BROKEN': return 'En panne';
      case 'DECOMMISSIONED': return 'Réformé';
      case 'LOST': return 'Perdu';
      case 'ASSIGNED': return 'Affecté';
      case 'IN_TRANSIT': return 'En transit';
      case 'RETURNED': return 'Retourné';
      case 'CANCELLED': return 'Annulé';
      case 'PENDING': return 'En attente';
      case 'COMPLETED': return 'Complété';
      case 'FAILED': return 'Échoué';
      case 'MECHANICAL': return 'Mécanique';
      case 'ELECTRONIC': return 'Électronique';
      case 'SOFTWARE': return 'Logiciel';
      case 'BODYWORK': return 'Carrosserie';
      case 'OTHER': return 'Autre';
      case 'PURCHASE': return 'Achat';
      case 'REPAIR': return 'Réparation';
      case 'REVISION': return 'Révision';
      case 'CALIBRATION': return 'Calibration';
      default: return status;
    }
  };

  const getFuelTypeText = (fuelType: string) => {
    switch (fuelType) {
      case 'GASOLINE': return 'Essence';
      case 'DIESEL': return 'Diesel';
      case 'ELECTRIC': return 'Électrique';
      case 'HYBRID': return 'Hybride';
      default: return fuelType;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'CAR': return 'Voiture';
      case 'TRUCK': return 'Camion';
      case 'VAN': return 'Fourgon';
      case 'MOTORCYCLE': return 'Moto';
      case 'PREVENTIVE': return 'Préventive';
      case 'CORRECTIVE': return 'Corrective';
      case 'PREDICTIVE': return 'Prédictive';
      default: return type;
    }
  };

  const getCountryText = (country: string) => {
    switch (country) {
      case 'IVORY_COAST': return 'Côte d\'Ivoire';
      case 'GHANA': return 'Ghana';
      case 'BENIN': return 'Bénin';
      case 'CAMEROON': return 'Cameroun';
      case 'TOGO': return 'Togo';
      case 'ROMANIE': return 'Romanie';
      case 'ITALIE': return 'Italie';
      default: return country;
    }
  };

  const formatCurrency = (amount: number, devise: string = 'XAF') => {
    // If amount is not a number, return '-'
    if (isNaN(amount)) {
      return '-';
    }
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise,
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
                    } else if (field.key === 'fuelType') {
                      displayValue = getFuelTypeText(value);
                    } else if (field.key === 'type') {
                      displayValue = getTypeText(value);
                    } else if (field.key === 'vehiclecountry' || field.key === 'InserterCountry') {
                      displayValue = getCountryText(value);
                    } else if (field.key.includes('Amount') && typeof value === 'number') {
                      // Try to get devise from data or default to XAF
                      const devise = data.devise || 'XAF';
                      displayValue = formatCurrency(value, devise);
                    } else if (field.key.includes('Price') && typeof value === 'number') {
                      // Try to get devise from data or default to XAF
                      const devise = data.devise || 'XAF';
                      displayValue = formatCurrency(value, devise);
                    } else if (field.key.includes('Montant') && typeof value === 'number') {
                      // Try to get devise from data or default to XAF
                      const devise = data.devise || 'XAF';
                      displayValue = formatCurrency(value, devise);
                    } else if (field.key.includes('Cost') && typeof value === 'number') {
                      // Try to get devise from data or default to XAF
                      const devise = data.devise || 'XAF';
                      displayValue = formatCurrency(value, devise);
                    } else if (field.key.includes('Prix') && typeof value === 'number') {
                      // Try to get devise from data or default to XAF
                      const devise = data.devise || 'XAF';
                      displayValue = formatCurrency(value, devise);
                    } else if (field.key.includes('Date') && value) {
                      displayValue = formatDate(value);
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