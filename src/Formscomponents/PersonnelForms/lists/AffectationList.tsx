import React, { useState, useMemo } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ViewDetailsModal from './ViewDetailsModal';

interface Affectation {
  affectationsId: number;
  userId: number;
  workLocation: string;
  site: string;
  affectationtype: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  attached_file: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

interface AffectationListProps {
  affectations: Affectation[];
  onEdit: (affectation: Affectation) => void;
  onDelete: (id: number) => void;
  onView: (affectation: Affectation) => void;
}

const AffectationList: React.FC<AffectationListProps> = ({ affectations, onEdit, onDelete, onView }) => {
  const [filters, setFilters] = useState({
    affectationtype: '',
    workLocation: '',
    search: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; affectation: Affectation | null }>({
    isOpen: false,
    affectation: null,
  });
  
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; affectation: Affectation | null }>({
    isOpen: false,
    affectation: null,
  });

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getAffectationTypeText = (type: string) => {
    switch (type) {
      case 'PERMANENT': return 'Permanente';
      case 'TEMPORARY': return 'Temporaire';
      case 'TRANSFER': return 'Mutation';
      case 'PROJECT_BASED': return 'Basée sur projet';
      case 'SPECIAL_ASSIGNMENT': return 'Mission spéciale';
      default: return type;
    }
  };

  const filteredAffectations = useMemo(() => {
    return affectations.filter((affectation) => {
      if (filters.affectationtype && affectation.affectationtype !== filters.affectationtype) return false;
      if (filters.workLocation && !affectation.workLocation.toLowerCase().includes(filters.workLocation.toLowerCase())) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          affectation.user?.firstName?.toLowerCase().includes(searchLower) ||
          affectation.user?.lastName?.toLowerCase().includes(searchLower) ||
          affectation.workLocation?.toLowerCase().includes(searchLower) ||
          affectation.site?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [affectations, filters]);

  const totalPages = Math.ceil(filteredAffectations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAffectations = filteredAffectations.slice(startIndex, endIndex);

  const handleDeleteClick = (affectation: Affectation) => {
    setDeleteModal({ isOpen: true, affectation });
  };

  const handleViewClick = (affectation: Affectation) => {
    setViewModal({ isOpen: true, affectation });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.affectation) {
      onDelete(deleteModal.affectation.affectationsId);
      setDeleteModal({ isOpen: false, affectation: null });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Employé, lieu, site..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'affectation
            </label>
            <select
              value={filters.affectationtype}
              onChange={(e) => setFilters({ ...filters, affectationtype: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="PERMANENT">Permanente</option>
              <option value="TEMPORARY">Temporaire</option>
              <option value="TRANSFER">Mutation</option>
              <option value="PROJECT_BASED">Basée sur projet</option>
              <option value="SPECIAL_ASSIGNMENT">Mission spéciale</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de travail
            </label>
            <input
              type="text"
              placeholder="Lieu de travail"
              value={filters.workLocation}
              onChange={(e) => setFilters({ ...filters, workLocation: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Par page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu d'affectation</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedAffectations.map((affectation) => (
              <tr key={affectation.affectationsId} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900">
                  {affectation.user?.firstName} {affectation.user?.lastName}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900">{affectation.workLocation}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{affectation.site}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{getAffectationTypeText(affectation.affectationtype)}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{formatDate(affectation.startDate)}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{formatDate(affectation.endDate)}</td>
                <td className="px-3 py-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewClick(affectation)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(affectation)}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(affectation)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-lg sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                <span className="font-medium">{Math.min(endIndex, filteredAffectations.length)}</span> sur{' '}
                <span className="font-medium">{filteredAffectations.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === idx + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, affectation: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.affectation ? `Affectation de ${deleteModal.affectation.user?.firstName} ${deleteModal.affectation.user?.lastName}` : ''}
        itemType="l'affectation"
      />

      {/* View Modal */}
      <ViewDetailsModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, affectation: null })}
        title="Détails de l'affectation"
        data={viewModal.affectation || {}}
        fields={[
          { key: 'affectationsId', label: 'ID Affectation' },
          { key: 'user', label: 'Employé', render: (user: any) => user ? `${user.firstName} ${user.lastName}` : '-' },
          { key: 'workLocation', label: 'Lieu de travail' },
          { key: 'site', label: 'Site' },
          { key: 'affectationtype', label: 'Type d\'affectation', render: (val: string) => getAffectationTypeText(val) },
          { key: 'description', label: 'Description' },
          { key: 'attached_file', label: 'Fichier joint', render: (val: string) => val ? (
            <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Voir le fichier
            </a>
          ) : '-' },
          { key: 'startDate', label: 'Date début', render: formatDate },
          { key: 'endDate', label: 'Date fin', render: formatDate },
          { key: 'createdAt', label: 'Créé le', render: formatDate },
          { key: 'updatedAt', label: 'Mis à jour le', render: formatDate },
        ]}
      />
    </div>
  );
};

export default AffectationList;

