import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Bell, 
  Plus,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  List
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

export function Alerts() {
  const [currentMonth, setCurrentMonth] = useState('juin 2025');
  const [selectedView, setSelectedView] = useState('Mois');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    type: 'Facture Client'
  });

  // Charger les alertes
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
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [activeFilter]);

  const alertTypes = [
    "Facture Client",
    "Facture Fournisseur", 
    "Personnel",
    "Parc auto",
    "Équipement",
    "Affaire/Chantier"
  ];

  const priorityLevels = [
    { value: 'high', label: 'Élevée', color: 'red' },
    { value: 'medium', label: 'Moyenne', color: 'yellow' },
    { value: 'low', label: 'Faible', color: 'green' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-500 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
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

  const filteredAlerts = alerts; // Déjà filtré par l'API

  const markAsCompleted = async (alertId: number) => {
    try {
      const res = await fetch('/.netlify/functions/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, status: 'completed' })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la mise à jour');
      }
      
      await loadAlerts(); // Recharger les données
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
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
      
      await loadAlerts(); // Recharger les données
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleNewAlert = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création');
      }
      
      await loadAlerts(); // Recharger les données
      setShowModal(false);
      setNewAlert({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        type: 'Facture Client'
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewAlert(prev => ({ ...prev, [field]: value }));
  };

  const navigateMonth = (direction: string) => {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    const [currentMonthName, year] = currentMonth.split(' ');
    const currentMonthIndex = months.indexOf(currentMonthName);
    let newMonthIndex = direction === 'next' 
      ? (currentMonthIndex + 1) % 12 
      : (currentMonthIndex - 1 + 12) % 12;
    
    let newYear = parseInt(year);
    if (direction === 'next' && currentMonthIndex === 11) newYear++;
    if (direction === 'prev' && currentMonthIndex === 0) newYear--;
    
    setCurrentMonth(`${months[newMonthIndex]} ${newYear}`);
  };

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 mr-3 text-red-500" />
              Alertes des Échéances
            </h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowRecords(!showRecords)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <List className="w-4 h-4" />
                <span>{showRecords ? 'Calendrier' : 'Enregistrements'}</span>
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle alerte</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Calendar section */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Calendar header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-white hover:shadow rounded-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-white hover:shadow rounded-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold text-gray-800 capitalize">{currentMonth}</span>
                  </div>
                  <div className="flex space-x-2">
                    {['Mois', 'Semaine', 'Jour'].map(view => (
                      <button 
                        key={view}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedView === view 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedView(view)}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="p-6 border-b bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Légende des types d'alertes</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {[
                    { color: "bg-blue-500", label: "Parc auto" },
                    { color: "bg-red-500", label: "Personnel" },
                    { color: "bg-green-500", label: "Affaire/Chantier" },
                    { color: "bg-purple-500", label: "Facture Client" },
                    { color: "bg-pink-500", label: "Facture Fournisseur" },
                    { color: "bg-orange-500", label: "Équipement" }
                  ].map(item => (
                    <div key={item.label} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar grid */}
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map(day => {
                    const dayAlerts = alerts.filter(alert => {
                      const alertDate = new Date(alert.dueDate);
                      return alertDate.getDate() === day && alertDate.getMonth() === 5; // Juin
                    });
                    
                    return (
                      <div key={day} className="h-24 border border-gray-200 p-2 bg-white rounded-lg hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-gray-700 mb-1">{day}</div>
                        {dayAlerts.map(alert => (
                          <div 
                            key={alert.id} 
                            className={`w-2 h-2 rounded-full mb-1 ${getTypeColor(alert.type)}`}
                            title={alert.title}
                          ></div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts panel */}
          <div className="w-96 bg-white shadow-xl border-l">
            <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Alertes Actives
              </h2>
              <p className="text-red-100 text-sm mt-1">
                {alerts.filter(a => a.status === 'pending').length} alertes en attente
              </p>
            </div>

            <div className="p-6">
              {/* Filter buttons */}
              <div className="flex space-x-2 mb-6">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Toutes ({alerts.length})
                </button>
                <button 
                  onClick={() => setActiveFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'pending'
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  En attente ({alerts.filter(a => a.status === 'pending').length})
                </button>
                <button 
                  onClick={() => setActiveFilter('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'completed'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Terminées ({alerts.filter(a => a.status === 'completed').length})
                </button>
              </div>

              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              {loading && <p className="text-gray-600 text-sm mb-4">Chargement...</p>}

              {/* Alerts list */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`border-l-4 p-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      {alert.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-700 mb-3">{alert.description}</p>
                    
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{formatDate(alert.dueDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getTypeColor(alert.type)}`}></div>
                        <span className="text-gray-600">{alert.type}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {alert.status === 'pending' && (
                        <button 
                          onClick={() => markAsCompleted(alert.id)}
                          className="flex-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-md font-medium transition-colors"
                        >
                          ✓ Terminer
                        </button>
                      )}
                      <button 
                        onClick={() => deleteAlert(alert.id)}
                        className="flex-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        × Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAlerts.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune alerte trouvée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour nouvelle alerte */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-red-500" />
                  Nouvelle Alerte
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'alerte *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: Échéance facture client"
                    value={newAlert.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-20"
                    placeholder="Description détaillée de l'alerte"
                    value={newAlert.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={newAlert.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={newAlert.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    {priorityLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'alerte *
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={newAlert.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                  >
                    {alertTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleNewAlert}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 font-medium transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Création...' : 'Créer l\'alerte'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}