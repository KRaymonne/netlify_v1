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

  const getServiceTypeText = (type: string) => {
    const types: Record<string, string> = {
      'ACCOUNTING_SOFTWARE_LICENSE_FEE': 'Redevance logiciel',
      'PROFESSIONAL_FEES': 'Honoraires',
      'AIR_TICKET': 'Billet d\'avion',
      'BUILDING_RENTAL': 'Location',
      'INTERNET': 'Internet',
      'BUSINESS_TRIP_ASSIGNMENT': 'Mission',
      'MAINTENANCE_REPAIR_MOVABLE_PROPERTY': 'Entretien',
      'RECEPTIONS_HOSPITALITY': 'Réceptions',
      'OTHER_SERVICE': 'Autre',
    };
    return types[type] || type;
  };

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      'PAID': 'Payé',
      'PENDING': 'En attente',
      'OVERDUE': 'En retard',
    };
    return statuses[status] || status;
  };

  const formatCurrency = (amount: number, devise: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Function to render URL as a clickable link
  const renderUrl = (url: string) => {
    if (!url) return '-';
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Voir le document
      </a>
    );
  };

  const renderValue = (field: any, value: any) => {
    if (field.render) {
      return field.render(value);
    }

    // Handle specific field types
    if (field.key === 'serviceType') {
      return getServiceTypeText(value);
    }

    if (field.key === 'status') {
      return getStatusText(value);
    }

    if (field.key.includes('Amount') || field.key.includes('amount')) {
      const devise = data.devise || 'XAF';
      return formatCurrency(value, devise);
    }

    if (field.key.includes('Date')) {
      return formatDate(value);
    }

    // Handle attachment field as URL
    if (field.key === 'attachment') {
      return renderUrl(value);
    }

    if (value === null || value === undefined) {
      return '-';
    }

    return String(value);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 sm:px-6 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {renderValue(field, data[field.key])}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;