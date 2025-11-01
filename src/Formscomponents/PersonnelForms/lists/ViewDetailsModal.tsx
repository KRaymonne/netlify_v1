import React, { useState } from 'react';
import { X, Eye } from 'lucide-react';

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
  const [viewingFile, setViewingFile] = useState<{ url: string; isLocal: boolean } | null>(null);

  if (!isOpen) return null;

  const isLocalFile = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== 'string') return false;
    // Check if it's a relative path (starts with /) and not an HTTP/HTTPS URL
    return url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://');
  };

  const handleFileView = (url: string) => {
    if (!url) return;
    
    const local = isLocalFile(url);
    
    if (local) {
      // For local files, show in iframe
      setViewingFile({ url, isLocal: true });
    } else {
      // For HTTP/HTTPS URLs, open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatValue = (value: any, render?: (value: any) => string | React.ReactNode): string | React.ReactNode => {
    if (render) {
      return render(value);
    }
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (value instanceof Date) return value.toLocaleDateString('fr-FR');
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects (e.g., user object)
      if (value.firstName && value.lastName) {
        return `${value.firstName} ${value.lastName}`;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderFileField = (url: string | null | undefined) => {
    if (!url) return '-';
    
    const local = isLocalFile(url);
    
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleFileView(url)}
          className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          Voir
        </button>
        {local && (
          <span className="text-xs text-gray-500">({url.split('/').pop()})</span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          ></div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
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

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {fields.map((field) => {
                  const value = data[field.key];
                  let displayValue = formatValue(value, field.render);

                  // Auto-detect file fields and render appropriately
                  if (field.key.toLowerCase().includes('file') || 
                      field.key.toLowerCase().includes('attachment') ||
                      field.key.toLowerCase().includes('document') ||
                      (typeof value === 'string' && (isLocalFile(value) || value.startsWith('http')))) {
                    displayValue = renderFileField(value);
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

      {/* File Viewer Modal for Local Files */}
      {viewingFile && viewingFile.isLocal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setViewingFile(null)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Aperçu du fichier
                  </h3>
                  <button
                    onClick={() => setViewingFile(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
                  <iframe
                    src={viewingFile.url}
                    className="w-full"
                    style={{ minHeight: '500px', border: 'none' }}
                    title="File preview"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setViewingFile(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewDetailsModal;
