import React from 'react';
import { X } from 'lucide-react';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  fields: Array<{
    key: string;
    label: string;
    render?: (value: any) => string | React.ReactNode;
  }>;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  fields,
}) => {
  if (!isOpen) return null;

  const getGroupeText = (groupe: string) => {
    switch (groupe) {
      case 'CLIENT': return 'Client';
      case 'SUPPLIER': return 'Fournisseur';
      case 'CONSULTANTS': return 'Consultants';
      case 'PUBLIC_ADMINISTRATION': return 'Administration Publique';
      case 'OTHERS': return 'Autres';
      default: return groupe;
    }
  };

  const getGroupeColor = (groupe: string) => {
    switch (groupe) {
      case 'CLIENT': return 'bg-blue-100 text-blue-800';
      case 'SUPPLIER': return 'bg-green-100 text-green-800';
      case 'CONSULTANTS': return 'bg-purple-100 text-purple-800';
      case 'PUBLIC_ADMINISTRATION': return 'bg-orange-100 text-orange-800';
      case 'OTHERS': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompanyText = (company: string) => {
    switch (company) {
      case 'SITINFRA_SARL': return 'SITINFRA SARL';
      case 'GEOTOP': return 'GEOTOP';
      case 'SITALIA': return 'SITALIA';
      case 'OTHER_COMPANY': return 'Autre Entreprise';
      default: return company;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {fields.map((field) => {
                const value = data[field.key];
                const displayValue = field.render ? field.render(value) : value;

                // Special handling for contactGroupe
                if (field.key === 'contactGroupe') {
                  return (
                    <div key={field.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">{field.label}:</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGroupeColor(value)}`}>
                        {getGroupeText(value)}
                      </span>
                    </div>
                  );
                }

                // Special handling for companyName
                if (field.key === 'companyName') {
                  return (
                    <div key={field.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">{field.label}:</span>
                      <span className="text-sm text-gray-900">{getCompanyText(value)}</span>
                    </div>
                  );
                }

                return (
                  <div key={field.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">{field.label}:</span>
                    <span className="text-sm text-gray-900">{displayValue || '-'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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

