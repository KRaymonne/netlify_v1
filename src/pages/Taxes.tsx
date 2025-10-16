import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Download,
  X,
  Save,
  Trash2,
  Edit,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Landmark,
  Receipt,
  CalendarDays,
  Search,
  Upload
} from 'lucide-react';

// Interface pour les taxes
interface Tax {
  _id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'À payer' | 'Soldé' | 'En retard';
  penalty: number;
  paymentDate: string;
  referenceNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount).replace('XAF', 'FCFA');
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch (e) {
    return dateString;
  }
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Soldé':
      return 'bg-green-100 text-green-800';
    case 'À payer':
      return 'bg-yellow-100 text-yellow-800';
    case 'En retard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Soldé':
      return <CheckCircle className="w-4 h-4" />;
    case 'À payer':
      return <Clock className="w-4 h-4" />;
    case 'En retard':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export function Taxes() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    dueDate: '',
    status: 'À payer' as 'À payer' | 'Soldé' | 'En retard',
    penalty: '',
    paymentDate: '',
    referenceNumber: '',
    notes: '',
    file: null as File | null
  });

  // Charger les taxes depuis le backend
  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/taxes');
      const data = await response.json();
      if (data.success) {
        setTaxes(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des taxes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTax = async (taxData: Partial<Tax>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/taxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taxData),
      });
      const data = await response.json();
      if (data.success) {
        setTaxes(prev => [...prev, data.data]);
        return data.data;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la taxe:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTax = async (id: string, taxData: Partial<Tax>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/taxes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taxData),
      });
      const data = await response.json();
      if (data.success) {
        setTaxes(prev => prev.map(tax => tax._id === id ? data.data : tax));
        return data.data;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la taxe:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTax = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette taxe?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/taxes/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setTaxes(prev => prev.filter(tax => tax._id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la taxe:', error);
    } finally {
      setLoading(false);
    }
  };

const exportTaxes = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/taxes/export/${exportFormat}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    // Vérification du content-type selon le format
    const contentType = response.headers.get('content-type');
    let expectedType = '';
    let extension = exportFormat;
    switch (exportFormat) {
      case 'pdf':
        expectedType = 'application/pdf';
        extension = 'pdf';
        break;
      case 'excel':
        expectedType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = 'xlsx';
        break;
      case 'xls':
        expectedType = 'application/vnd.ms-excel';
        extension = 'xls';
        break;
      case 'csv':
        expectedType = 'text/csv';
        extension = 'csv';
        break;
      default:
        expectedType = '';
    }
    if (expectedType && (!contentType || !contentType.includes(expectedType))) {
      throw new Error(`Le type de contenu reçu n'est pas un fichier ${extension} valide`);
    }
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Le fichier exporté est vide');
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxes_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error(`Erreur lors de l'exportation en ${exportFormat}:`, error);
    alert(`Une erreur est survenue lors de l'exportation: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Filtrer les taxes en fonction du terme de recherche
  const filteredTaxes = useMemo(() => {
    if (!searchTerm) return taxes;
    
    return taxes.filter(tax => 
      tax.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.dueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(tax.amount).includes(searchTerm) ||
      (tax.referenceNumber && tax.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tax.notes && tax.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tax.paymentDate && tax.paymentDate.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [taxes, searchTerm]);

  const handleOpenModal = (tax: Tax | null = null) => {
    if (tax) {
      setEditingId(tax._id);
      setFormData({
        type: tax.type,
        amount: tax.amount.toString(),
        dueDate: tax.dueDate,
        status: tax.status,
        penalty: tax.penalty.toString(),
        paymentDate: tax.paymentDate,
        referenceNumber: tax.referenceNumber,
        notes: tax.notes,
        file: null
      });
    } else {
      setEditingId(null);
      setFormData({
        type: '',
        amount: '',
        dueDate: '',
        status: 'À payer',
        penalty: '',
        paymentDate: '',
        referenceNumber: '',
        notes: '',
        file: null
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      type: '',
      amount: '',
      dueDate: '',
      status: 'À payer',
      penalty: '',
      paymentDate: '',
      referenceNumber: '',
      notes: '',
      file: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: fileInput.files![0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: null
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type && formData.amount) {
      const taxData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
        penalty: parseFloat(formData.penalty) || 0,
        paymentDate: formData.paymentDate,
        referenceNumber: formData.referenceNumber,
        notes: formData.notes,
      };
      if (editingId) {
        await updateTax(editingId, taxData);
      } else {
        await createTax(taxData);
      }
      handleCloseModal();
    }
  };

  // Calculs des statistiques
  const totalAmount = taxes.reduce((sum, tax) => sum + (tax.amount || 0) + (tax.penalty || 0), 0);
  const totalPaid = taxes.filter(t => t.status === 'Soldé').reduce((sum, tax) => sum + tax.amount + tax.penalty, 0);
  const totalPending = taxes.filter(t => t.status === 'À payer').reduce((sum, tax) => sum + tax.amount + tax.penalty, 0);
  const totalLate = taxes.filter(t => t.status === 'En retard').reduce((sum, tax) => sum + tax.amount + tax.penalty, 0);
  
  const paidCount = taxes.filter(t => t.status === 'Soldé').length;
  const pendingCount = taxes.filter(t => t.status === 'À payer').length;
  const lateCount = taxes.filter(t => t.status === 'En retard').length;
  const totalCount = taxes.length;
  const paymentProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;
  
  // Résumé fiscal détaillé
  const fiscalSummary = {
    totalTaxes: totalAmount,
    taxesPaid: totalPaid,
    taxesPending: totalPending,
    taxesLate: totalLate,
    paymentProgress: paymentProgress,
    upcomingPayments: taxes.filter(t => t.status === 'À payer' && t.dueDate !== '-'),
    recentPayments: taxes.filter(t => t.status === 'Soldé').slice(0, 3)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <Landmark className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Impôts et Taxes</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <button 
              onClick={exportTaxes}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Section Résumé Fiscal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Résumé Fiscal Détail */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-red-500" />
                Résumé Fiscal {selectedPeriod}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Répartition des Taxes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Payées</span>
                    <span className="font-bold text-green-600">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">En attente</span>
                    <span className="font-bold text-yellow-600">{formatCurrency(totalPending)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">En retard</span>
                    <span className="font-bold text-red-600">{formatCurrency(totalLate)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Prochaines Échéances</h3>
                <div className="space-y-2">
                  {fiscalSummary.upcomingPayments.slice(0, 3).map((tax, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <div>
                        <div className="text-sm font-medium">{tax.type}</div>
                        <div className="text-xs text-gray-600">Échéance: {tax.dueDate}</div>
                      </div>
                      <span className="font-bold text-blue-600">{formatCurrency(tax.amount)}</span>
                    </div>
                  ))}
                  {fiscalSummary.upcomingPayments.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
                      <p className="text-sm">Aucune échéance à venir</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendrier Fiscal */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
              <CalendarDays className="w-6 h-6 mr-2 text-red-500" />
              Calendrier Fiscal
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-red-800">TVA Mensuelle</div>
                    <div className="text-sm text-red-600">Chaque 15 du mois</div>
                  </div>
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">15</div>
                </div>
              </div>
              <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-orange-800">Impôt sur les sociétés</div>
                    <div className="text-sm text-orange-600">Trimestriel</div>
                  </div>
                  <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-bold">31/03</div>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-yellow-800">Taxe foncière</div>
                    <div className="text-sm text-yellow-600">Annuel</div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">30/06</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Taxes à Gérer */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-red-500" />
              Taxes et Impôts à Gérer
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une taxe..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors hover:bg-red-700 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle déclaration</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de taxe</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pénalités</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'échéance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de paiement</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
                        <p className="text-gray-500 text-lg">Chargement des taxes...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTaxes.length > 0 ? (
                  filteredTaxes.map((tax) => (
                    <tr key={tax._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                          {tax.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        {formatCurrency(tax.amount)}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        {tax.penalty > 0 ? formatCurrency(tax.penalty) : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(tax.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(tax.paymentDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {tax.referenceNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={tax.notes}>
                        {tax.notes || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(tax.status)}`}>
                          {getStatusIcon(tax.status)}
                          <span className="ml-1">{tax.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 justify-center">
                          <button 
                            onClick={() => handleOpenModal(tax)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteTax(tax._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-2">Aucune taxe trouvée</p>
                        <p className="text-gray-400 text-sm mb-4">Essayez de modifier vos critères de recherche</p>
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Réinitialiser la recherche
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Afficher le nombre de résultats */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Affichage de {filteredTaxes.length} sur {taxes.length} taxes
          </div>
        </div>
      </div>
      
      {/* Modale pour une nouvelle déclaration */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                {editingId ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {editingId ? 'Modifier la déclaration' : 'Nouvelle Déclaration'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveTax}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de taxe *</label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Ex: Taxe sur appointements, TVA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Montant (FCFA) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Ex: 500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pénalités (FCFA)</label>
                    <input
                      type="number"
                      name="penalty"
                      value={formData.penalty}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Ex: 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de paiement</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de référence</label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Ex: REF-2024-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    >
                      <option value="À payer">À payer</option>
                      <option value="Soldé">Soldé</option>
                      <option value="En retard">En retard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Informations complémentaires sur la déclaration..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fichier joint</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="tax-file" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                          <span>Télécharger un fichier</span>
                          <input 
                            id="tax-file" 
                            name="file" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleInputChange}
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX jusqu'à 10MB
                      </p>
                      {formData.file && (
                        <p className="text-sm text-gray-600 mt-2">
                          Fichier sélectionné: {formData.file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Enregistrement...' : (editingId ? 'Modifier' : 'Enregistrer')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}