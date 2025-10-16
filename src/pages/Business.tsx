import React, { useState, useRef } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { Card } from '../components/Common/Card';
import { Table } from '../components/Common/Table';
import { Button } from '../components/Common/Button';
import { Business } from '../types';
import { 
  Plus, Edit, Trash2, Search as Download, FileText, FileSpreadsheet, 
  Briefcase, TrendingUp, Save, X, DollarSign, Euro, Upload, AlertCircle
} from 'lucide-react';

export function BusinessPage(){
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  // État pour le formulaire de création/édition
  const [businessForm, setBusinessForm] = useState({
    businessId: '',
    name: '',
    status: 'prospect' as 'prospect' | 'negotiation' | 'won' | 'lost',
    client: '',
    contact: '',
    startDate: '',
    endDate: '',
    estimatedCost: '',
    salePrice: '',
    currency: 'EUR' as 'EUR' | 'USD' | 'GBP' | 'CFA' | 'XAF',
    comment: '',
    progress: 0
  });

  // Charger les affaires depuis le backend
  React.useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/businesses');
      const data = await res.json();
      setBusinesses(data.data || []);
    } catch (err) {
      console.error('Erreur chargement affaires:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBusiness = async (business: Partial<Business>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business)
      });
      const data = await res.json();
      if (data && data.data) {
        setBusinesses(prev => [...prev, data.data]);
        return data.data;
      }
    } catch (err) {
      console.error('Erreur création affaire:', err);
    } finally {
      setLoading(false);
    }
  };

  const editBusiness = async (id: string, business: Partial<Business>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business)
      });
      const data = await res.json();
      if (data && data.data) {
        setBusinesses(prev => prev.map(b => b._id === id ? data.data : b));
        return data.data;
      }
    } catch (err) {
      console.error('Erreur modification affaire:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeBusiness = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBusinesses(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error('Erreur suppression affaire:', err);
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Symboles de devise
  const currencySymbols = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CFA: 'CFA',
    XAF: 'XAF'
  };
  
  // Fonction pour formater le montant avec le symbole de devise
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || currency;
    
    // Pour les devises comme CFA et XAF, on met le symbole après le montant
    if (currency === 'CFA' || currency === 'XAF') {
      return `${amount.toLocaleString()} ${symbol}`;
    }
    
    // Pour les autres devises, on met le symbole avant le montant
    return `${symbol}${amount.toLocaleString()}`;
  };
  
  // Fonction pour formater la date pour les inputs
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    // Si la date est déjà au format YYYY-MM-DD, la retourner directement
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    return dateString;
  };
  
  // Fonction pour formater la date pour l'affichage (MM/JJ/AAAA)
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Si la date est invalide, retourner la chaîne brute
      
      // Formater en MM/JJ/AAAA
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateString;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDeleteBusiness = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette affaire ?')) return;
    await removeBusiness(id);
  };
  
  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setBusinessForm({
      businessId: business.businessId || '',
      name: business.name,
      status: business.status,
      client: business.client,
      contact: business.contact || '',
      startDate: formatDateForInput(business.startDate),
      endDate: formatDateForInput(business.expectedCloseDate),
      estimatedCost: business.estimatedCost?.toString() || '',
      salePrice: business.value.toString(),
      currency: business.currency || 'EUR',
      comment: business.comment || '',
      progress: business.progress
    });
    setActiveTab('creation');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // S'assurer que les dates sont au bon format
    const startDate = businessForm.startDate 
      ? new Date(businessForm.startDate).toISOString() 
      : new Date().toISOString();
      
    const endDate = businessForm.endDate 
      ? new Date(businessForm.endDate).toISOString() 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // +30 jours par défaut
    
    const businessData: Partial<Business> = {
      businessId: businessForm.businessId || undefined,
      name: businessForm.name,
      client: businessForm.client,
      contact: businessForm.contact || undefined,
      value: parseFloat(businessForm.salePrice) || 0,
      currency: businessForm.currency,
      status: businessForm.status,
      progress: parseInt(businessForm.progress.toString()) || 0,
      startDate: startDate,
      expectedCloseDate: endDate,
      estimatedCost: businessForm.estimatedCost ? parseFloat(businessForm.estimatedCost) : undefined,
      comment: businessForm.comment || undefined
    };
    
    if (editingBusiness && editingBusiness._id) {
      await editBusiness(editingBusiness._id, businessData);
    } else {
      await createBusiness(businessData);
    }
    
    // Réinitialiser le formulaire
    setBusinessForm({
      businessId: '',
      name: '',
      status: 'prospect',
      client: '',
      contact: '',
      startDate: '',
      endDate: '',
      estimatedCost: '',
      salePrice: '',
      currency: 'EUR',
      comment: '',
      progress: 0
    });
    setEditingBusiness(null);
    setActiveTab('search');
  };

  // Fonctions d'export
  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/businesses/export/csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `affaires_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'exportation CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/businesses/export/pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `affaires_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/businesses/export/excel');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `affaires_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'exportation Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Fonction d'importation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    setImportSuccess(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const res = await fetch('/api/businesses/import', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        setImportSuccess(`${data.imported} affaire(s) importée(s) avec succès`);
        fetchBusinesses(); // Recharger les données
        setShowImportModal(false);
      } else {
        setImportError(data.error || 'Erreur lors de l\'importation');
      }
    } catch (err) {
      console.error('Erreur importation affaires:', err);
      setImportError('Erreur lors de l\'importation du fichier');
    } finally {
      setLoading(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Les données d'affaires filtrées pour la table de résultats
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    const matchesCurrency = currencyFilter === 'all' || business.currency === currencyFilter;
    return matchesSearch && matchesStatus && matchesCurrency;
  });
  
  // Calcul des totaux par devise
  const totalsByCurrency = businesses.reduce((acc, business) => {
    const currency = business.currency || 'EUR';
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += business.value;
    return acc;
  }, {} as Record<string, number>);
  
  const wonDeals = businesses.filter(b => b.status === 'won');
  const activeDeals = businesses.filter(b => b.status === 'negotiation' || b.status === 'prospect');
  
  const columns = [
    {
      key: 'businessId',
      title: 'ID Affaire',
      render: (value: string) => (
        <div className="font-mono text-sm">{value || '-'}</div>
      ),
    },
    {
      key: 'name',
      title: 'Nom',
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: 'client',
      title: 'Client',
      render: (value: string) => (
        <div>{value}</div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (value: string) => (
        <div>{value || '-'}</div>
      ),
    },
    {
      key: 'value',
      title: 'Valeur',
      render: (_: any, record: Business) => (
        <div className="font-medium">
          {formatCurrency(record.value, record.currency || 'EUR')}
        </div>
      ),
    },
    {
      key: 'currency',
      title: 'Devise',
      render: (value: string) => (
        <div>{value || 'EUR'}</div>
      ),
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value: string) => {
        const statusColors = {
          prospect: 'bg-yellow-100 text-yellow-800',
          negotiation: 'bg-blue-100 text-blue-800',
          won: 'bg-green-100 text-green-800',
          lost: 'bg-red-100 text-red-800',
        };
        
        const statusLabels = {
          prospect: 'Prospect',
          negotiation: 'Négociation',
          won: 'Gagnée',
          lost: 'Perdue',
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      },
    },
    {
      key: 'progress',
      title: 'Progression',
      render: (value: number) => (
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{value}%</span>
        </div>
      ),
    },
    {
      key: 'startDate',
      title: 'Date de début',
      render: (value: string) => (
        <div className="font-medium">{formatDateForDisplay(value)}</div>
      ),
    },
    {
      key: 'expectedCloseDate',
      title: 'Clôture prévue',
      render: (value: string) => (
        <div className="font-medium">{formatDateForDisplay(value)}</div>
      ),
    },
    {
      key: 'estimatedCost',
      title: 'Coût estimé',
      render: (_: any, record: Business) => (
        <div>
          {record.estimatedCost ? formatCurrency(record.estimatedCost, record.currency || 'EUR') : '-'}
        </div>
      ),
    },
    {
      key: 'comment',
      title: 'Commentaire',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || '-'}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Business) => (
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Edit}
            onClick={() => handleEditBusiness(record)}
          >
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => record._id && handleDeleteBusiness(record._id)}
            disabled={isDeleting === record._id}
            loading={isDeleting === record._id}
          >
            {isDeleting === record._id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      ),
    },
  ];
  
  const renderContent = () => {
    if (activeTab === 'search') {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Rechercher une affaire</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input 
                type="text" 
                id="searchTerm" 
                placeholder="Nom d'affaire ou client..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Statut de l'affaire</label>
              <select 
                id="statusFilter" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="prospect">Prospect</option>
                <option value="negotiation">Négociation</option>
                <option value="won">Gagnée</option>
                <option value="lost">Perdue</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Résultats de recherche</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {filteredBusinesses.length} affaire(s) trouvée(s)
                </span>
                {filteredBusinesses.length > 0 && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      icon={FileText} 
                      size="sm" 
                      onClick={exportToPDF}
                      disabled={isExporting}
                      loading={isExporting}
                    >
                      PDF
                    </Button>
                    <Button 
                      variant="secondary" 
                      icon={FileSpreadsheet} 
                      size="sm" 
                      onClick={exportToExcel}
                      disabled={isExporting}
                      loading={isExporting}
                    >
                      EXCEL
                    </Button>
                    <Button 
                      variant="secondary" 
                      icon={Download} 
                      size="sm" 
                      onClick={exportToCSV}
                      disabled={isExporting}
                      loading={isExporting}
                    >
                      CSV
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredBusinesses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  data={filteredBusinesses}
                  columns={columns}
                />
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune affaire trouvée</p>
                <Button 
                  variant="primary" 
                  className="mt-4"
                  icon={Plus}
                  onClick={() => setActiveTab('creation')}
                >
                  Créer une affaire
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (activeTab === 'creation') {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            {editingBusiness ? 'Modifier une affaire' : 'Créer une nouvelle affaire'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end space-x-4 mb-6">
              <Button 
                type="submit" 
                variant="primary" 
                icon={Save}
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : (editingBusiness ? 'Mettre à jour' : 'Enregistrer')}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setEditingBusiness(null);
                  setActiveTab('search');
                }} 
                icon={X}
              >
                Annuler
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° d'ID Affaire</label>
                  <input 
                    type="text" 
                    name="businessId"
                    value={businessForm.businessId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'affaire <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={businessForm.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut de l'affaire <span className="text-red-500">*</span></label>
                  <select 
                    name="status"
                    value={businessForm.status}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choisir</option>
                    <option value="prospect">Prospect</option>
                    <option value="negotiation">Négociation</option>
                    <option value="won">Gagnée</option>
                    <option value="lost">Perdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client <span className="text-red-500">*</span></label>
                   <input 
                    type="text" 
                    name="client"
                    value={businessForm.client}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                   <input 
                    type="text" 
                    name="contact"
                    value={businessForm.contact}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={businessForm.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin prévue</label>
                  <input 
                    type="date" 
                    name="endDate"
                    value={businessForm.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progression (%)</label>
                  <input 
                    type="range" 
                    name="progress"
                    min="0"
                    max="100"
                    value={businessForm.progress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                  />
                  <span className="text-sm text-gray-600">{businessForm.progress}%</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise <span className="text-red-500">*</span></label>
                  <select 
                    name="currency"
                    value={businessForm.currency}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar américain)</option>
                    <option value="GBP">GBP (Livre sterling)</option>
                    <option value="CFA">CFA (Franc CFA)</option>
                    <option value="XAF">XAF (Franc CFA BEAC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {businessForm.currency === 'EUR' && <Euro className="h-5 w-5 text-gray-400" />}
                      {businessForm.currency === 'USD' && <DollarSign className="h-5 w-5 text-gray-400" />}
                      {businessForm.currency === 'GBP' && <span className="text-gray-400">£</span>}
                      {(businessForm.currency === 'CFA' || businessForm.currency === 'XAF') && <span className="text-gray-400 text-sm">CFA</span>}
                    </div>
                    <input 
                      type="number" 
                      name="salePrice"
                      value={businessForm.salePrice}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coût estimé</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {businessForm.currency === 'EUR' && <Euro className="h-5 w-5 text-gray-400" />}
                      {businessForm.currency === 'USD' && <DollarSign className="h-5 w-5 text-gray-400" />}
                      {businessForm.currency === 'GBP' && <span className="text-gray-400">£</span>}
                      {(businessForm.currency === 'CFA' || businessForm.currency === 'XAF') && <span className="text-gray-400 text-sm">CFA</span>}
                    </div>
                    <input 
                      type="number" 
                      name="estimatedCost"
                      value={businessForm.estimatedCost}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                  <textarea 
                    name="comment"
                    value={businessForm.comment}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      );
    }
  };
  
  // Modal d'importation
  const renderImportModal = () => {
    if (!showImportModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Importer des affaires</h3>
              <button 
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                  setImportSuccess(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {importError && (
              <div className="mb-4 p-3 bg-red-50 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <p className="text-sm text-red-700">{importError}</p>
              </div>
            )}
            
            {importSuccess && (
              <div className="mb-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-700">{importSuccess}</p>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Importez un fichier CSV avec les colonnes suivantes : ID, Nom, Client, Statut, Valeur, Devise, Progression, Date début, Date fin prévue.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500 mt-1">CSV uniquement</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                  setImportSuccess(null);
                }}
              >
                Annuler
              </Button>
              <Button 
                variant="primary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? 'Importation...' : 'Parcourir les fichiers'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <PageHeader 
        title="Suivi des Affaires"
        subtitle="Gérez vos opportunités commerciales et leur progression"
        actions={
          <Button 
            icon={Plus} 
            onClick={() => {
              setEditingBusiness(null);
              setActiveTab('creation');
            }}
            variant="primary"
          >
            Nouvelle affaire
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {activeDeals.length}
            </div>
            <div className="text-sm text-gray-600">Affaires actives</div>
          </div>
        </Card>
        <Card>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {wonDeals.length}
            </div>
            <div className="text-sm text-gray-600">Affaires gagnées</div>
          </div>
        </Card>
        <Card>
          <div className="text-center p-4">
            <div className="text-sm text-gray-600 mb-2">Valeur totale par devise</div>
            {Object.entries(totalsByCurrency).map(([currency, total]) => (
              <div key={currency} className="text-lg font-bold text-purple-600">
                {formatCurrency(total, currency)}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 mr-1" />
              {businesses.length > 0 ? Math.round((wonDeals.length / businesses.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Taux de réussite</div>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="flex border-b border-gray-200">
          <button className={`px-4 py-2 font-medium ${activeTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('search')}>
            Recherche
          </button>
          <button className={`px-4 py-2 font-medium ${activeTab === 'creation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('creation')}>
            {editingBusiness ? 'Modification' : 'Création'}
          </button>
        </div>
        {renderContent()}
      </Card>
      
      {renderImportModal()}
    </div>
  );
};