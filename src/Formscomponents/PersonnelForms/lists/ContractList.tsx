import React, { useState, useMemo } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ViewDetailsModal from './ViewDetailsModal';

interface Contract {
  contractId: number;
  userId: number;
  contractType: string;
  startDate: string;
  endDate: string | null;
  post: string;
  department: string;
  unit: string | null;
  grossSalary: number;
  netSalary: number;
  currency: string;
  contractFile: string | null;
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

interface ContractListProps {
  contracts: Contract[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: number) => void;
  onView: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onEdit, onDelete, onView }) => {
  const [filters, setFilters] = useState({
    contractType: '',
    department: '',
    search: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; contract: Contract | null }>({
    isOpen: false,
    contract: null,
  });
  
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; contract: Contract | null }>({
    isOpen: false,
    contract: null,
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getContractTypeText = (type: string) => {
    switch (type) {
      case 'PERMANENT_CONTRACT_CDI': return 'CDI';
      case 'FIXED_TERM_CONTRACT_CDD': return 'CDD';
      case 'INTERNSHIP': return 'Stage';
      case 'CONSULTANT': return 'Consultant';
      default: return type;
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      if (filters.contractType && contract.contractType !== filters.contractType) return false;
      if (filters.department && contract.department !== filters.department) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          contract.user?.firstName?.toLowerCase().includes(searchLower) ||
          contract.user?.lastName?.toLowerCase().includes(searchLower) ||
          contract.contractType?.toLowerCase().includes(searchLower) ||
          contract.department?.toLowerCase().includes(searchLower) ||
          contract.post?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [contracts, filters]);

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContracts = filteredContracts.slice(startIndex, endIndex);

  const handleDeleteClick = (contract: Contract) => {
    setDeleteModal({ isOpen: true, contract });
  };

  const handleViewClick = (contract: Contract) => {
    setViewModal({ isOpen: true, contract });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.contract) {
      onDelete(deleteModal.contract.contractId);
      setDeleteModal({ isOpen: false, contract: null });
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
              placeholder="Employé, type, département..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de contrat
            </label>
            <select
              value={filters.contractType}
              onChange={(e) => setFilters({ ...filters, contractType: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="PERMANENT_CONTRACT_CDI">CDI</option>
              <option value="FIXED_TERM_CONTRACT_CDD">CDD</option>
              <option value="INTERNSHIP">Stage</option>
              <option value="CONSULTANT">Consultant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Département
            </label>
            <input
              type="text"
              placeholder="Département"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire Net</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedContracts.map((contract) => (
              <tr key={contract.contractId} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900">
                  {contract.user?.firstName} {contract.user?.lastName}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900">{getContractTypeText(contract.contractType)}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{contract.department}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{contract.post}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(contract.netSalary, contract.currency)}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{formatDate(contract.startDate)}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{formatDate(contract.endDate)}</td>
                <td className="px-3 py-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewClick(contract)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(contract)}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contract)}
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
                <span className="font-medium">{Math.min(endIndex, filteredContracts.length)}</span> sur{' '}
                <span className="font-medium">{filteredContracts.length}</span> résultats
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
        onClose={() => setDeleteModal({ isOpen: false, contract: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.contract ? `Contrat de ${deleteModal.contract.user?.firstName} ${deleteModal.contract.user?.lastName}` : ''}
        itemType="le contrat"
      />

      {/* View Modal */}
      {viewModal.contract && (
        <ViewDetailsModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, contract: null })}
          title="Détails du contrat"
          data={viewModal.contract}
          fields={[
            { key: 'contractId', label: 'ID Contrat' },
            { key: 'user', label: 'Employé', render: (user: any) => user ? `${user.firstName} ${user.lastName}` : '-' },
            { key: 'contractType', label: 'Type de contrat', render: (val: string) => getContractTypeText(val) },
            { key: 'post', label: 'Poste' },
            { key: 'department', label: 'Département' },
            { key: 'unit', label: 'Unité' },
            { key: 'grossSalary', label: 'Salaire brut', render: (val: number) => formatCurrency(val, viewModal.contract!.currency) },
            { key: 'netSalary', label: 'Salaire net', render: (val: number) => formatCurrency(val, viewModal.contract!.currency) },
            { key: 'currency', label: 'Devise' },
            { key: 'contractFile', label: 'Fichier du contrat', render: (val: string) => val ? (
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
      )}
    </div>
  );
};

export default ContractList;

