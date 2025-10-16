import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { Card } from '../components/Common/Card';
import { Table } from '../components/Common/Table';
import { Button } from '../components/Common/Button';
import { useApp } from '../context/AppContext';
import { Offer } from '../types';
import { 
  Plus, Edit, Trash2, Search as SearchIcon, Download, 
  FileText, FileSpreadsheet, Package, Eye, Save, X, Upload 
} from 'lucide-react';
import axios from 'axios';

export function Offers() {
  const { state, addOffer, deleteOffer, updateOffer } = useApp();
  const [activeTab, setActiveTab] = useState('ami');
  const [activeSubTab, setActiveSubTab] = useState('recherche');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  // Ajout feedback global
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // État pour le mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // États pour les formulaires
  const [amiForm, setAmiForm] = useState({
  activityCode: '',
  depositDate: '',
  name: '',
  client: '',
  contact: '',
  submissionDate: '',
  object: '',
  status: '',
  comment: '',
  file: null as File | null
  });
  
  const [daoForm, setDaoForm] = useState({
  activityCode: '',
  transmissionDate: '',
  daoNumber: '',
  client: '',
  contact: '',
  submissionDate: '',
  submissionType: '',
  object: '',
  status: '',
  conversionRate: '',
  comment: '',
  file: null as File | null
  });
  
  const [devisForm, setDevisForm] = useState({
    indexNumber: '',
    status: '',
    client: '',
    amount: '',
    validityDate: '',
    description: '',
    currency: 'XOF',
    file: null as File | null
  });
  
  // Données depuis le backend
  const [amiData, setAmiData] = useState<Offer[]>([]);
  const [daoData, setDaoData] = useState<Offer[]>([]);
  const [devisData, setDevisData] = useState<Offer[]>([]);
  
  // Récupérer les données par catégorie
  useEffect(() => {
    const fetchOffersByCategory = async () => {
      try {
        const [amiRes, daoRes, devisRes] = await Promise.all([
          axios.get('http://localhost:5000/api/offers/category/AMI'),
          axios.get('http://localhost:5000/api/offers/category/DAO'),
          axios.get('http://localhost:5000/api/offers/category/DEVIS')
        ]);
        
        setAmiData(amiRes.data);
        setDaoData(daoRes.data);
        setDevisData(devisRes.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      }
    };
    
    fetchOffersByCategory();
  }, []);
  
  // Colonnes spécifiques AMI
  const amiColumns = [
  { key: 'activityCode', title: 'Code activité' },
  { key: 'depositDate', title: 'Date dépôt', render: (value: any) => value ? new Date(value).toLocaleDateString('fr-FR') : '' },
  { key: 'name', title: 'Nom' },
  { key: 'client', title: 'Client' },
  { key: 'contact', title: 'Contact' },
  { key: 'submissionDate', title: 'Date soumission', render: (value: any) => value ? new Date(value).toLocaleDateString('fr-FR') : '' },
  { key: 'object', title: 'Objet' },
  { key: 'status', title: 'État' },
  { key: 'comment', title: 'Commentaire' },
  { key: 'file', title: 'Fichier', render: (value: any) => value ? (typeof value === 'object' && value.originalName ? value.originalName : value) : '' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Offer) => {
        const rowId = record._id || record.id;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={Edit}
              onClick={() => handleEditOffer(record, 'ami')}
            >
              Modifier
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => rowId && handleDeleteOffer(rowId)}
              disabled={isDeleting === rowId}
              loading={isDeleting === rowId}
            >
              {isDeleting === rowId ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        );
      },
    },
  ];
  
  // Colonnes spécifiques DAO
  const daoColumns = [
  // ...autres colonnes...
  { key: 'activityCode', title: 'Code activité' },
  { key: 'transmissionDate', title: 'Date transmission', render: (value: any) => value ? new Date(value).toLocaleDateString('fr-FR') : '' },
  { key: 'daoNumber', title: 'N° DAO' },
  { key: 'client', title: 'Client' },
  { key: 'contact', title: 'Contact' },
  { key: 'submissionDate', title: 'Date soumission', render: (value: any) => value ? new Date(value).toLocaleDateString('fr-FR') : '' },
  { key: 'submissionType', title: 'Type soumission' },
  { key: 'object', title: 'Objet' },
  { key: 'status', title: 'État' },
  { key: 'conversionRate', title: 'Taux de transformation' },
  { key: 'comment', title: 'Commentaire' },
  { key: 'file', title: 'Document/Fichier', render: (value: any) => value ? (typeof value === 'object' && value.originalName ? value.originalName : value) : '' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Offer) => {
        const rowId = record._id || record.id;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={Edit}
              onClick={() => handleEditOffer(record, 'dao')}
            >
              Modifier
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => rowId && handleDeleteOffer(rowId)}
              disabled={isDeleting === rowId}
              loading={isDeleting === rowId}
            >
              {isDeleting === rowId ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        );
      },
    },
  ];
  
  // Colonnes spécifiques Devis
  const devisColumns = [
  { key: 'indexNumber', title: 'N° Index' },
  { key: 'client', title: 'Client' },
  { key: 'amount', title: 'Montant' },
  { key: 'currency', title: 'Devise' },
  { key: 'validityDate', title: 'Date validité', render: (value: any) => value ? new Date(value).toLocaleDateString('fr-FR') : '' },
  { key: 'status', title: 'État' },
  { key: 'description', title: 'Description' },
  { key: 'file', title: 'Fichier', render: (value: any) => value ? (typeof value === 'object' && value.originalName ? value.originalName : value) : '' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Offer) => {
        const rowId = record._id || record.id;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={Edit}
              onClick={() => handleEditOffer(record, 'devis')}
            >
              Modifier
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => rowId && handleDeleteOffer(rowId)}
              disabled={isDeleting === rowId}
              loading={isDeleting === rowId}
            >
              {isDeleting === rowId ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        );
      },
    },
  ];
  
  // Gestionnaires d'événements pour les formulaires
  const handleAmiInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setAmiForm(prev => ({ ...prev, [name]: fileInput.files![0] }));
      } else {
        setAmiForm(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setAmiForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDaoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setDaoForm(prev => ({ ...prev, [name]: fileInput.files![0] }));
      } else {
        setDaoForm(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setDaoForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDevisInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setDevisForm(prev => ({ ...prev, [name]: fileInput.files![0] }));
      } else {
        setDevisForm(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setDevisForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Suppression d'une offre
    const handleDeleteOffer = async (id: string) => {
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
      setIsDeleting(id);
      setError(null);
      setMessage(null);
      try {
        // Utilise _id si présent, sinon id
        await axios.delete(`http://localhost:5000/api/offers/${id}`);
        setMessage('Suppression réussie');
        await fetchOffersByCategory();
      } catch (err) {
        setError("Erreur lors de la suppression");
      } finally {
        setIsDeleting(null);
        setTimeout(() => { setMessage(null); setError(null); }, 3000);
      }
    };
  
  // Édition d'une offre
  const handleEditOffer = (offer: Offer, type: string) => {
  setIsEditing(true);
  const rowId = offer._id || offer.id;
  if (rowId) setEditingId(rowId);
    setActiveTab(type);
    setActiveSubTab('creation');
    
    // Helper pour formater la date en YYYY-MM-DD
    const formatDate = (dateVal: any) => {
      if (!dateVal) return '';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().slice(0, 10);
    };

    if (type === 'ami') {
      setAmiForm({
        activityCode: offer.activityCode || '',
        depositDate: formatDate(offer.depositDate),
        name: offer.name || '',
        client: offer.client || '',
        contact: offer.contact || '',
        submissionDate: formatDate(offer.submissionDate),
        object: offer.object || '',
        status: offer.status || '',
        comment: offer.comment || '',
        file: null
      });
    } else if (type === 'dao') {
      setDaoForm({
        activityCode: offer.activityCode || '',
        transmissionDate: formatDate(offer.transmissionDate),
        daoNumber: offer.daoNumber || '',
        client: offer.client || '',
        contact: offer.contact || '',
        submissionDate: formatDate(offer.submissionDate),
        submissionType: offer.submissionType || '',
        object: offer.object || '',
        status: offer.status || '',
        conversionRate: offer.conversionRate || '',
        comment: offer.comment || '',
        file: null
      });
    } else if (type === 'devis') {
      setDevisForm({
        indexNumber: offer.indexNumber || '',
        status: offer.status || '',
        client: offer.client || '',
        amount: offer.amount?.toString() || '',
        validityDate: formatDate(offer.validityDate),
        description: offer.description || '',
        currency: offer.currency || 'XOF',
        file: null
      });
    }
  };

// --- Début correctif : sortir les fonctions du bloc précédent ---
  const fetchOffersByCategory = async () => {
    try {
      const [amiRes, daoRes, devisRes] = await Promise.all([
        axios.get('http://localhost:5000/api/offers/category/AMI'),
        axios.get('http://localhost:5000/api/offers/category/DAO'),
        axios.get('http://localhost:5000/api/offers/category/DEVIS')
      ]);
      setAmiData(amiRes.data);
      setDaoData(daoRes.data);
      setDevisData(devisRes.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
    }
  };

  useEffect(() => {
    fetchOffersByCategory();
  }, []);


// --- Fin correctif ---
  
  // Soumission des formulaires
  const handleSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    
    try {
      let formData;
      
      if (formType === 'ami') {
        formData = new FormData();
        Object.keys(amiForm).forEach(key => {
          if (key === 'file' && amiForm.file) {
            formData.append('file', amiForm.file);
          } else {
            formData.append(key, (amiForm as any)[key]);
          }
        });
        formData.append('category', 'AMI');
        
        if (isEditing && editingId) {
          // Mode édition
          const response = await axios.put(`http://localhost:5000/api/offers/${editingId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          // Rafraîchit la liste après update
          await fetchOffersByCategory();
        } else {
          // Mode création
          const response = await axios.post('http://localhost:5000/api/offers', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          setAmiData(prev => [...prev, response.data]);
        }
      } else if (formType === 'dao') {
        formData = new FormData();
        Object.keys(daoForm).forEach(key => {
          if (key === 'file' && daoForm.file) {
            formData.append('file', daoForm.file);
          } else {
            formData.append(key, (daoForm as any)[key]);
          }
        });
        formData.append('category', 'DAO');
        
        if (isEditing && editingId) {
          // Mode édition
          const response = await axios.put(`http://localhost:5000/api/offers/${editingId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          // Rafraîchit la liste après update
          await fetchOffersByCategory();
        } else {
          // Mode création
          const response = await axios.post('http://localhost:5000/api/offers', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          setDaoData(prev => [...prev, response.data]);
        }
      } else if (formType === 'devis') {
        formData = new FormData();
        Object.keys(devisForm).forEach(key => {
          if (key === 'file' && devisForm.file) {
            formData.append('file', devisForm.file);
          } else {
            formData.append(key, (devisForm as any)[key]);
          }
        });
        formData.append('category', 'DEVIS');
        
        if (isEditing && editingId) {
          // Mode édition
          const response = await axios.put(`http://localhost:5000/api/offers/${editingId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          // Rafraîchit la liste après update
          await fetchOffersByCategory();
        } else {
          // Mode création
          const response = await axios.post('http://localhost:5000/api/offers', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          setDevisData(prev => [...prev, response.data]);
        }
      }
      
      resetForms();
      setActiveSubTab('recherche');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };
  
  // Filtrage des offres
  const [currencyFilter, setCurrencyFilter] = useState<string>('');
  const getFilteredOffers = () => {
    let data;
    if (activeTab === 'ami') {
      data = amiData;
    } else if (activeTab === 'dao') {
      data = daoData;
    } else {
      data = devisData;
    }
    let filtered = data;
    if (currencyFilter) {
      filtered = filtered.filter(offer => offer.currency === currencyFilter);
    }
    if (!searchTerm) return filtered;
    return filtered.filter(offer => {
      return Object.values(offer).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  const filteredOffers = getFilteredOffers();
  
  // Export handlers
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    const category = activeTab === 'ami' ? 'AMI' : activeTab === 'dao' ? 'DAO' : 'DEVIS';
    let url = `http://localhost:5000/api/offers/export/${format}?category=${category}`;
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      // Determine filename
      const filename = `offres_${category}.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'csv'}`;
      // Create a link and trigger download
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      alert('Erreur lors de l\'exportation.');
      console.error('Erreur export:', error);
    }
  };
  
  // Contenu de l'onglet recherche
  const renderSearchContent = () => {
    const categoryLabel = activeTab === 'ami' ? 'AMI' : activeTab === 'dao' ? 'DAO' : 'DEVIS';
    const searchPlaceholder = `Rechercher un ${categoryLabel}...`;
    
    // Sélection des colonnes selon le type actif
    const currentColumns = activeTab === 'ami' 
      ? amiColumns 
      : activeTab === 'dao' 
        ? daoColumns 
        : devisColumns;
        
    return (
      <div className="p-6">
        {/* Barre de recherche */}
        <div className="flex gap-4 mb-6 items-end">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Devise</label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={currencyFilter}
              onChange={e => setCurrencyFilter(e.target.value)}
            >
              <option value="">Toutes</option>
              <option value="XOF">XOF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="CFA">CFA</option>
              <option value="GNF">GNF</option>
              <option value="MAD">MAD</option>
              <option value="FCFA">FCFA</option>
              <option value="XAF">XAF</option>
              <option value="XPF">XPF</option>
              <option value="CAD">CAD</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
          <Button variant="primary" icon={SearchIcon}>
            Rechercher
          </Button>
        </div>
        
        {/* Boutons d'exportation */}
        <div className="flex justify-end mb-4 space-x-2">
          <Button variant="secondary" size="sm" icon={FileText} onClick={() => handleExport('pdf')}>
            Exporter PDF
          </Button>
          <Button variant="secondary" size="sm" icon={FileSpreadsheet} onClick={() => handleExport('excel')}>
            Exporter Excel
          </Button>
          <Button variant="secondary" size="sm" icon={Download} onClick={() => handleExport('csv')}>
            Exporter CSV
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              {filteredOffers.length === 0 ? 'Aucun résultat trouvé' : 'Résultats de recherche'}
            </h3>
            <span className="text-sm text-gray-500">
              {filteredOffers.length} {categoryLabel}(s) trouvé(s)
            </span>
          </div>
          
          {filteredOffers.length > 0 ? (
            <Table
              data={filteredOffers}
              columns={currentColumns}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Aucun {categoryLabel} trouvé</p>
              <p className="text-gray-400 text-sm mb-4">Essayez de modifier vos critères de recherche</p>
              <Button 
                variant="primary" 
                icon={Plus}
                onClick={() => {
                  setActiveSubTab('creation');
                  resetForms();
                }}
              >
                Créer un {categoryLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Contenu de l'onglet création
  const renderCreationContent = () => {
    const formTitle = isEditing 
      ? `Modifier un ${activeTab === 'ami' ? 'AMI' : activeTab === 'dao' ? 'DAO' : 'DEVIS'}`
      : `Créer un nouveau ${activeTab === 'ami' ? 'AMI' : activeTab === 'dao' ? 'DAO' : 'DEVIS'}`;
    
    switch (activeTab) {
      case 'ami':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{formTitle}</h2>
            <form onSubmit={(e) => handleSubmit(e, 'ami')}>
              <div className="flex justify-end space-x-4 mb-6">
                <Button type="submit" variant="primary" icon={Save}>
                  {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setActiveSubTab('recherche'); resetForms(); }} icon={X}>
                  Annuler
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code activité</label>
                    <input 
                      type="text" 
                      name="activityCode"
                      value={amiForm.activityCode}
                      onChange={handleAmiInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Dépôt</label>
                    <input 
                      type="date" 
                      name="depositDate"
                      value={amiForm.depositDate}
                      onChange={handleAmiInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input 
                      type="text" 
                      name="name"
                      value={amiForm.name}
                      onChange={handleAmiInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input 
                      type="text" 
                      name="client"
                      value={amiForm.client}
                      onChange={handleAmiInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    {/* Champ devise retiré pour AMI */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fichier joint</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="ami-file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Télécharger un fichier</span>
                            <input 
                              id="ami-file" 
                              name="file" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleAmiInputChange}
                            />
                          </label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX jusqu'à 10MB
                        </p>
                        {amiForm.file && (
                          <p className="text-sm text-gray-600 mt-2">
                            Fichier sélectionné: {amiForm.file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input 
                      type="text" 
                      name="contact"
                      value={amiForm.contact}
                      onChange={handleAmiInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de soumission</label>
                    <input 
                      type="date" 
                      name="submissionDate"
                      value={amiForm.submissionDate}
                      onChange={handleAmiInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                    <textarea 
                      name="object"
                      value={amiForm.object}
                      onChange={handleAmiInputChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                    <select 
                      name="status"
                      value={amiForm.status}
                      onChange={handleAmiInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="Candidature">Candidature</option>
                      <option value="En Etude">En Etude</option>
                      <option value="En Attente">En Attente</option>
                      <option value="Retenue">Retenue</option>
                      <option value="Soumission">Soumission</option>
                      <option value="Pas de suite">Pas de suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <textarea 
                      name="comment"
                      value={amiForm.comment}
                      onChange={handleAmiInputChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 'dao':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{formTitle}</h2>
            <form onSubmit={(e) => handleSubmit(e, 'dao')}>
              <div className="flex justify-end space-x-4 mb-6">
                <Button type="submit" variant="primary" icon={Save}>
                  {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setActiveSubTab('recherche'); resetForms(); }} icon={X}>
                  Annuler
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code activité</label>
                    <input 
                      type="text" 
                      name="activityCode"
                      value={daoForm.activityCode}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Transmission</label>
                    <input 
                      type="date" 
                      name="transmissionDate"
                      value={daoForm.transmissionDate}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° DAO</label>
                    <input 
                      type="text" 
                      name="daoNumber"
                      value={daoForm.daoNumber}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select 
                      name="client"
                      value={daoForm.client}
                      onChange={handleDaoInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="FER">FER</option>
                      <option value="KIDI COTE D'IVOIRE">KIDI COTE D'IVOIRE</option>
                      <option value="BTP CONTRACTING CI">BTP CONTRACTING CI</option>
                      <option value="BESBAC CI">BESBAC CI</option>
                      <option value="SOCOTRA">SOCOTRA</option>
                      <option value="PETROCI">PETROCI</option>
                    </select>
                  </div>
                  <div>
                    {/* Champ devise retiré pour DAO */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fichier joint</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="dao-file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Télécharger un fichier</span>
                            <input 
                              id="dao-file" 
                              name="file" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleDaoInputChange}
                            />
                          </label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX jusqu'à 10MB
                        </p>
                        {daoForm.file && (
                          <p className="text-sm text-gray-600 mt-2">
                            Fichier sélectionné: {daoForm.file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <select 
                      name="contact"
                      value={daoForm.contact}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="contact1">Contact 1</option>
                      <option value="contact2">Contact 2</option>
                      <option value="contact3">Contact 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date soumission</label>
                    <input 
                      type="date" 
                      name="submissionDate"
                      value={daoForm.submissionDate}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type Soumission</label>
                    <select 
                      name="submissionType"
                      value={daoForm.submissionType}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="TTC">TTC</option>
                      <option value="Groupement">Groupement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                    <textarea 
                      name="object"
                      value={daoForm.object}
                      onChange={handleDaoInputChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                    <select 
                      name="status"
                      value={daoForm.status}
                      onChange={handleDaoInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="Candidature">Candidature</option>
                      <option value="En Etude">En Etude</option>
                      <option value="En Attente">En Attente</option>
                      <option value="Retenue">Retenue</option>
                      <option value="Soumission">Soumission</option>
                      <option value="Pas de suite">Pas de suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taux de transformation</label>
                    <select 
                      name="conversionRate"
                      value={daoForm.conversionRate}
                      onChange={handleDaoInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="10%">10%</option>
                      <option value="20%">20%</option>
                      <option value="30%">30%</option>
                      <option value="40%">40%</option>
                      <option value="50%">50%</option>
                      <option value="60%">60%</option>
                      <option value="70%">70%</option>
                      <option value="80%">80%</option>
                      <option value="90%">90%</option>
                      <option value="100%">100%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <textarea 
                      name="comment"
                      value={daoForm.comment}
                      onChange={handleDaoInputChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 'devis':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{formTitle}</h2>
            <form onSubmit={(e) => handleSubmit(e, 'devis')}>
              <div className="flex justify-end space-x-4 mb-6">
                <Button type="submit" variant="primary" icon={Save}>
                  {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setActiveSubTab('recherche'); resetForms(); }} icon={X}>
                  Annuler
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° index</label>
                    <input 
                      type="text" 
                      name="indexNumber"
                      value={devisForm.indexNumber}
                      onChange={handleDevisInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input 
                      type="text" 
                      name="client"
                      value={devisForm.client}
                      onChange={handleDevisInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                    <input 
                      type="number" 
                      name="amount"
                      value={devisForm.amount}
                      onChange={handleDevisInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                    <select
                      name="currency"
                      value={devisForm.currency || 'XOF'}
                      onChange={handleDevisInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="XOF">XOF</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="CFA">CFA</option>
                      <option value="GNF">GNF</option>
                      <option value="MAD">MAD</option>
                      <option value="FCFA">FCFA</option>
                      <option value="XAF">XAF</option>
                      <option value="XPF">XPF</option>
                      <option value="CAD">CAD</option>
                      <option value="GBP">GBP</option>
                      <option value="CHF">CHF</option>
                      <option value="JPY">JPY</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fichier joint</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="devis-file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Télécharger un fichier</span>
                            <input 
                              id="devis-file" 
                              name="file" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleDevisInputChange}
                            />
                          </label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX jusqu'à 10MB
                        </p>
                        {devisForm.file && (
                          <p className="text-sm text-gray-600 mt-2">
                            Fichier sélectionné: {devisForm.file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de validité</label>
                    <input 
                      type="date" 
                      name="validityDate"
                      value={devisForm.validityDate}
                      onChange={handleDevisInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                    <select 
                      name="status"
                      value={devisForm.status}
                      onChange={handleDevisInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="En cours">En cours</option>
                      <option value="Accepté">Accepté</option>
                      <option value="Refusé">Refusé</option>
                      <option value="Expiré">Expiré</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      name="description"
                      value={devisForm.description}
                      onChange={handleDevisInputChange}
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };
  
  const resetForms = () => {
    setIsEditing(false);
    setEditingId(null);
    setAmiForm({
      activityCode: '',
      depositDate: '',
      name: '',
      client: '',
      contact: '',
      submissionDate: '',
      object: '',
      status: '',
      comment: '',
      currency: 'XOF',
      file: null
    });
    setDaoForm({
      activityCode: '',
      transmissionDate: '',
      daoNumber: '',
      client: '',
      contact: '',
      submissionDate: '',
      submissionType: '',
      object: '',
      status: '',
      conversionRate: '',
      comment: '',
      currency: 'XOF',
      file: null
    });
    setDevisForm({
      indexNumber: '',
      status: '',
      client: '',
      amount: '',
      validityDate: '',
      description: '',
      currency: 'XOF',
      file: null
    });
  };

  return (
    <div>
      <PageHeader 
        title="Gestion des Offres"
        actions={
          <Button 
            icon={Plus} 
            onClick={() => {
              setActiveSubTab('creation');
              resetForms();
            }}
            variant="primary"
          >
            Créer une offre
          </Button>
        }
      />
      
      <Card>
        {/* Onglets principaux Recherche/Création */}
        <div className="flex bg-gray-50 border-b border-gray-200">
          <button 
            className={`px-6 py-3 text-sm font-medium ${
              activeSubTab === 'recherche' 
                ? 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-600 hover:text-gray-800'
            }`} 
            onClick={() => setActiveSubTab('recherche')}
          >
            Recherche
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium ${
              activeSubTab === 'creation' 
                ? 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-600 hover:text-gray-800'
            }`} 
            onClick={() => {
              setActiveSubTab('creation');
              if (!isEditing) {
                resetForms();
              }
            }}
          >
            {isEditing ? 'Modification' : 'Création'}
          </button>
        </div>
        
        {/* Onglets de types d'offres */}
        <div className="flex bg-white border-b border-gray-200">
          {activeSubTab === 'recherche' ? (
            <>
              <button 
                className={`px-6 py-2 text-sm ${
                  activeTab === 'ami' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`} 
                onClick={() => setActiveTab('ami')}
              >
                AMI
              </button>
              <button 
                className={`px-6 py-2 text-sm ${
                  activeTab === 'dao' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`} 
                onClick={() => setActiveTab('dao')}
              >
                DAO
              </button>
              <button 
                className={`px-6 py-2 text-sm ${
                  activeTab === 'devis' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`} 
                onClick={() => setActiveTab('devis')}
              >
                DEVIS
              </button>
            </>
          ) : (
            <>
              <button 
                className={`px-6 py-2 text-sm ${
                  activeTab === 'ami' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`} 
                onClick={() => {
                  setActiveTab('ami');
                  if (!isEditing) {
                    resetForms();
                  }
                }}
              >
                {isEditing ? 'Modifier AMI' : 'Créer un AMI'}
              </button>
              <button 
                className={`px-6 py-2 text-sm ${
                  activeTab === 'dao' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`} 
                onClick={() => {
                  setActiveTab('dao');
                  if (!isEditing) {
                    resetForms();
                  }
                }}
              >
                {isEditing ? 'Modifier DAO' : 'Créer un DAO'}
              </button>
              <button 
                className={`px-6 py-2 text-sm ${
                  activeTab === 'devis' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`} 
                onClick={() => {
                  setActiveTab('devis');
                  if (!isEditing) {
                    resetForms();
                  }
                }}
              >
                {isEditing ? 'Modifier DEVIS' : 'Créer un DEVIS'}
              </button>
            </>
          )}
        </div>
        
        {/* Contenu selon l'onglet actif */}
        {activeSubTab === 'recherche' ? renderSearchContent() : renderCreationContent()}
      </Card>
    </div>
  );
}