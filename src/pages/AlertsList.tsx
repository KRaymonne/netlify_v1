import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  Plus,
} from 'lucide-react';

type Alert = {
  id: number;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  type: string;
  createdAt: string;
  updatedAt: string;
};

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      const res = await fetch(`/.netlify/functions/alerts${queryParams}`);
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec du chargement');
      }
      
      const data = await res.json();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [activeFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Parc auto": "bg-blue-500",
      "Personnel": "bg-red-500", 
      "Affaire/Chantier": "bg-green-500",
      "Facture Client": "bg-purple-500",
      "Facture Fournisseur": "bg-pink-500",
      "Équipement": "bg-orange-500"
    };
    return colors[type] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const markAsCompleted = async (alertId: number) => {
    try {
      const res = await fetch('/.netlify/functions/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: alertId, 
          status: 'completed' 
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la mise à jour');
      }
      
      // Recharger les alertes pour avoir les données fraîches
      await loadAlerts();
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    }
  };

  const deleteAlert = async (alertId: number) => {
    try {
      const res = await fetch(`/.netlify/functions/alerts/${alertId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la suppression');
      }
      
      // Mettre à jour localement sans recharger
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center">
          <Bell className="w-6 h-6 mr-2 text-red-500" />
          Alertes des Échéances
        </h1>
        <a href="/alerts/create" className="px-3 py-2 bg-red-600 text-white rounded flex items-center hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4 mr-1" />
          Nouvelle alerte
        </a>
      </div>

      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Toutes ({alerts.length})
        </button>
        <button 
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          En attente ({alerts.filter(a => a.status === 'pending').length})
        </button>
        <button 
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Terminées ({alerts.filter(a => a.status === 'completed').length})
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Titre</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Priorité</th>
                <th className="p-2 border">Date d'échéance</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{alert.id}</td>
                  <td className="p-2 border">
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      {alert.description && (
                        <div className="text-sm text-gray-600">{alert.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 border">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getTypeColor(alert.type)}`}></div>
                      {alert.type}
                    </div>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(alert.priority)}`}>
                      {alert.priority === 'high' ? 'Élevée' : 
                       alert.priority === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
                  </td>
                  <td className="p-2 border">{formatDate(alert.dueDate)}</td>
                  <td className="p-2 border">
                    {alert.status === 'completed' ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Terminée
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex space-x-2">
                      {alert.status === 'pending' && (
                        <button 
                          onClick={() => markAsCompleted(alert.id)}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                        >
                          Terminer
                        </button>
                      )}
                      <button 
                        onClick={() => deleteAlert(alert.id)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune alerte trouvée</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}