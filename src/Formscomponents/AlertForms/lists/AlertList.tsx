import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Eye, Calendar, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/Common/Button';
import ViewDetailsModal from './ViewDetailsModal';

interface Alert {
  alertId: number;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  userId?: number | null;
  user?: {
    firstName: string;
    lastName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface AlertListProps {
  alerts: Alert[];
  onEdit: (alert: Alert) => void;
  onDelete: (id: number) => void;
  onView?: (alert: Alert) => void;
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onEdit,
  onDelete,
  onView
}) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    priorityFilter: 'all',
    typeFilter: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; alert: Alert | null }>({
    isOpen: false,
    alert: null,
  });

  // Get unique types for filter
  const uniqueTypes = useMemo(() => {
    const types = new Set(alerts.map(alert => alert.type));
    return Array.from(types);
  }, [alerts]);

  // Filter and search
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = filters.searchTerm === '' || 
        alert.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        alert.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesPriority = filters.priorityFilter === 'all' || alert.priority === filters.priorityFilter;
      const matchesType = filters.typeFilter === 'all' || alert.type === filters.typeFilter;
      
      return matchesSearch && matchesPriority && matchesType;
    });
  }, [alerts, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlerts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Élevée';
      case 'MEDIUM': return 'Moyenne';
      case 'LOW': return 'Faible';
      default: return priority;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Parc auto": "bg-blue-500",
      "Personnel": "bg-red-500", 
      "Affaire/Chantier": "bg-green-500",
      "Facture Client": "bg-purple-500",
      "Facture Fournisseur": "bg-pink-500",
      "Équipement": "bg-orange-500",
      "Général": "bg-gray-500"
    };
    return colors[type] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleViewClick = (alert: Alert) => {
    setViewModal({ isOpen: true, alert });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par titre, description, type..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filters.priorityFilter}
              onChange={(e) => setFilters({ ...filters, priorityFilter: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="HIGH">Élevée</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LOW">Faible</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filters.typeFilter}
              onChange={(e) => setFilters({ ...filters, typeFilter: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Items per page */}
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Reset Filters and Results count */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => {
              setFilters({ searchTerm: '', priorityFilter: 'all', typeFilter: 'all' });
              setCurrentPage(1);
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Réinitialiser les filtres
          </button>
          <div className="text-sm text-gray-600">
            {filteredAlerts.length} alerte{filteredAlerts.length !== 1 ? 's' : ''} trouvée{filteredAlerts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAlerts.map((alert) => (
                <tr key={alert.alertId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {isOverdue(alert.dueDate) && (
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                        {alert.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {alert.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor(alert.type)}`}></div>
                      <span className="text-sm text-gray-900">{alert.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                      {getPriorityLabel(alert.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={isOverdue(alert.dueDate) ? 'text-red-600 font-medium' : ''}>
                        {formatDate(alert.dueDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {alert.user ? (
                        <span>{alert.user.firstName} {alert.user.lastName}</span>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewClick(alert)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(alert)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
                            onDelete(alert.alertId);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 p-1"
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

        {paginatedAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune alerte trouvée</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              ({filteredAlerts.length} total)
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, alert: null })}
        title="Détails de l'Alerte"
        data={viewModal.alert || {}}
        fields={[
          { key: 'alertId', label: 'ID' },
          { key: 'title', label: 'Titre' },
          { key: 'description', label: 'Description' },
          { key: 'dueDate', label: 'Date d\'échéance', render: (val: string) => formatDate(val) },
          { key: 'priority', label: 'Priorité' },
          { key: 'type', label: 'Type' },
          { key: 'user', label: 'Utilisateur', render: (val: any) => val ? `${val.firstName} ${val.lastName}` : 'Non assigné' },
          { key: 'createdAt', label: 'Créé le', render: (val: string) => formatDate(val) },
          { key: 'updatedAt', label: 'Mis à jour le', render: (val: string) => formatDate(val) }
        ]}
      />
    </div>
  );
};