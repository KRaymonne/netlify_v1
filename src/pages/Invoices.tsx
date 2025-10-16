import React, { useState } from 'react';
import { 
  FileText, Plus, User, Download, X, Save, Edit, Trash2, BarChart3, Search,
  Filter, Droplet, Zap, Fuel, Wrench, Phone, Shield, Truck, Folder,
  Package, Upload
} from 'lucide-react';

export function Invoices() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('search');
  const [activeSearchTab, setActiveSearchTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Catégories avec icônes et montants par défaut
  const expenseCategories = [
    { id: 'cleaning', name: 'Produits d\'entretien', icon: Package, defaultAmount: 450000 },
    { id: 'water', name: 'Fournitures non stockables - Eau', icon: Droplet, defaultAmount: 180000 },
    { id: 'electricity', name: 'Fournitures non stockables - Électricité', icon: Zap, defaultAmount: 680000 },
    { id: 'fuel', name: 'Fournitures non stockables – Autres énergies CARBURANT', icon: Fuel, defaultAmount: 0 },
    { id: 'tools', name: 'Achats de petit matériel et outillage', icon: Wrench, defaultAmount: 0 },
    { id: 'bank', name: 'Frais bancaires', icon: Shield, defaultAmount: 85000 },
    { id: 'phone', name: 'Frais téléphone MTN', icon: Phone, defaultAmount: 125000 },
    { id: 'customs', name: 'Douane', icon: Shield, defaultAmount: 340000 },
    { id: 'transport', name: 'TRANSPORT Transport Express', icon: Truck, defaultAmount: 780000 },
    { id: 'files', name: 'DOSSIERS AO', icon: Folder, defaultAmount: 0 }
  ];
  
  // Devise options
  const currencyOptions = [
    { value: 'FCFA', label: 'FCFA - Franc CFA' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'USD', label: 'USD - Dollar américain' },
    { value: 'GBP', label: 'GBP - Livre sterling' },
    { value: 'XOF', label: 'XOF - Franc CFA (Bénin)' },
    { value: 'XAF', label: 'XAF - Franc CFA (Cameroun)' }
  ];
  
  // Formulaires séparés pour chaque type
  const [serviceForm, setServiceForm] = useState({
    service: '',
    provider: '',
    currency: 'FCFA',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    status: 'pending',
    file: null as File | null
  });
  
  const [personnelForm, setPersonnelForm] = useState({
    type: '',
    name: '',
    currency: 'FCFA',
    amount: '',
    month: new Date().toISOString().split('T')[0],
    employeeNumber: '',
    status: 'pending',
    file: null as File | null
  });
  
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    description: '',
    currency: 'FCFA',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    status: 'pending',
    file: null as File | null
  });
  
  // Données des factures avec IDs pour la gestion (initialisées vides)
  const [services, setServices] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // Filtrer les données en fonction du terme de recherche
  const filteredServices = services.filter(item => 
    item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPersonnel = personnel.filter(item => 
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredExpenses = expenses.filter(item => {
    const category = expenseCategories.find(cat => cat.id === item.category);
    const categoryName = category ? category.name.toLowerCase() : '';
    return (
      categoryName.includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Calculer les statistiques
  const calculateStats = (data) => {
    return {
      paid: data.filter(item => item.status === 'paid').length,
      pending: data.filter(item => item.status === 'pending').length,
      overdue: data.filter(item => item.status === 'overdue').length,
      total: data.length,
      totalAmount: data.reduce((sum, item) => sum + item.amount, 0)
    };
  };
  
  const serviceStats = calculateStats(services);
  const personnelStats = calculateStats(personnel);
  const expensesStats = calculateStats(expenses);
  
  const globalStats = {
    paid: serviceStats.paid + personnelStats.paid + expensesStats.paid,
    pending: serviceStats.pending + personnelStats.pending + expensesStats.pending,
    overdue: serviceStats.overdue + personnelStats.overdue + expensesStats.overdue,
    total: serviceStats.total + personnelStats.total + expensesStats.total,
    totalAmount: serviceStats.totalAmount + personnelStats.totalAmount + expensesStats.totalAmount
  };
  
  const formatCurrency = (amount, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XAF' : currency,
      minimumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA');
  };
  
  // Gestionnaires d'événements pour les formulaires
  const handleServiceInputChange = (field, value) => {
    setServiceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePersonnelInputChange = (field, value) => {
    setPersonnelForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleExpenseInputChange = (field, value) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setServiceForm(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    } else {
      setServiceForm(prev => ({
        ...prev,
        file: null
      }));
    }
  };
  
  const handlePersonnelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPersonnelForm(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    } else {
      setPersonnelForm(prev => ({
        ...prev,
        file: null
      }));
    }
  };
  
  const handleExpenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExpenseForm(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    } else {
      setExpenseForm(prev => ({
        ...prev,
        file: null
      }));
    }
  };
  
  const resetForm = () => {
    if (activeSearchTab === 'services') {
      setServiceForm({
        service: '',
        provider: '',
        currency: 'FCFA',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        status: 'pending',
        file: null
      });
    } else if (activeSearchTab === 'personnel') {
      setPersonnelForm({
        type: '',
        name: '',
        currency: 'FCFA',
        amount: '',
        month: new Date().toISOString().split('T')[0],
        employeeNumber: '',
        status: 'pending',
        file: null
      });
    } else {
      setExpenseForm({
        category: '',
        description: '',
        currency: 'FCFA',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        status: 'pending',
        file: null
      });
    }
  };
  
  // Fonction modifiée pour pré-remplir le formulaire lors de la modification
  const handleEdit = (item, type) => {
    setIsEditing(true);
    setEditingId(item.id);
    
    if (type === 'services') {
      setServiceForm({
        service: item.service,
        provider: item.provider,
        currency: item.currency,
        amount: item.amount.toString(),
        date: item.date,
        invoiceNumber: item.invoiceNumber,
        status: item.status,
        file: item.file
      });
      setActiveSearchTab('services');
    } else if (type === 'personnel') {
      setPersonnelForm({
        type: item.type,
        name: item.name || '',
        currency: item.currency,
        amount: item.amount.toString(),
        month: item.month,
        employeeNumber: item.employeeNumber,
        status: item.status,
        file: item.file
      });
      setActiveSearchTab('personnel');
    } else if (type === 'expenses') {
      setExpenseForm({
        category: item.category,
        description: item.description,
        currency: item.currency,
        amount: item.amount.toString(),
        date: item.date,
        invoiceNumber: item.invoiceNumber,
        status: item.status,
        file: item.file
      });
      setActiveSearchTab('expenses');
    }
    
    setShowModal(true);
  };
  
  const handleDelete = (id, type) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      if (type === 'services') {
        setServices(services.filter(item => item.id !== id));
      } else if (type === 'personnel') {
        setPersonnel(personnel.filter(item => item.id !== id));
      } else if (type === 'expenses') {
        setExpenses(expenses.filter(item => item.id !== id));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let formData;
      let updateFunction;
      
      if (activeSearchTab === 'services') {
        formData = {
          ...serviceForm,
          amount: parseFloat(serviceForm.amount)
        };
        if (isEditing) {
          await updateInvoiceApi(editingId, formData);
          updateFunction = (prev) => prev.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          );
          setServices(updateFunction);
        } else {
          const newInvoice = await createInvoiceApi(formData);
          setServices(prev => [...prev, newInvoice]);
        }
      } else if (activeSearchTab === 'personnel') {
        formData = {
          ...personnelForm,
          amount: parseFloat(personnelForm.amount)
        };
        if (isEditing) {
          await updateInvoiceApi(editingId, formData);
          updateFunction = (prev) => prev.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          );
          setPersonnel(updateFunction);
        } else {
          const newInvoice = await createInvoiceApi(formData);
          setPersonnel(prev => [...prev, newInvoice]);
        }
      } else if (activeSearchTab === 'expenses') {
        formData = {
          ...expenseForm,
          amount: parseFloat(expenseForm.amount)
        };
        if (isEditing) {
          await updateInvoiceApi(editingId, formData);
          updateFunction = (prev) => prev.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          );
          setExpenses(updateFunction);
        } else {
          const newInvoice = await createInvoiceApi(formData);
          setExpenses(prev => [...prev, newInvoice]);
        }
      }
      
      // Réinitialiser le formulaire et fermer le modal
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
      
      // Afficher une notification de succès
      showNotification(
        isEditing ? 'Facture mise à jour avec succès' : 'Facture créée avec succès',
        'success'
      );
    } catch (error) {
      showNotification('Une erreur est survenue', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Payée' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'En retard' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };
  
  const renderServiceForm = () => {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service *
          </label>
          <select
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={serviceForm.service || ''}
            onChange={(e) => handleServiceInputChange('service', e.target.value)}
          >
            <option value="">Sélectionner un service</option>
            <option value="Redevance logiciel comptable">Redevance logiciel comptable</option>
            <option value="Honoraire">Honoraire</option>
            <option value="BILLET D'AVION">BILLET D'AVION</option>
            <option value="Location de bâtiment">Location de bâtiment</option>
            <option value="Internet">Internet</option>
            <option value="Mission">Mission</option>
            <option value="Entretien et réparation des biens mobiliers">Entretien et réparation des biens mobiliers</option>
            <option value="Réceptions">Réceptions</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fournisseur *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: SAGE"
            value={serviceForm.provider || ''}
            onChange={(e) => handleServiceInputChange('provider', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise *
          </label>
          <select
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={serviceForm.currency || 'FCFA'}
            onChange={(e) => handleServiceInputChange('currency', e.target.value)}
          >
            {currencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant *
          </label>
          <input
            type="number"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="120000"
            value={serviceForm.amount || ''}
            onChange={(e) => handleServiceInputChange('amount', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de facturation
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={serviceForm.date || ''}
            onChange={(e) => handleServiceInputChange('date', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de facture
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="FAC-2024-001"
            value={serviceForm.invoiceNumber || ''}
            onChange={(e) => handleServiceInputChange('invoiceNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={serviceForm.status || 'pending'}
            onChange={(e) => handleServiceInputChange('status', e.target.value)}
          >
            <option value="paid">Payée</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichier joint
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="service-file" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                  <span>Télécharger un fichier</span>
                  <input 
                    id="service-file" 
                    name="file" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleServiceFileChange}
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX jusqu'à 10MB
              </p>
              {serviceForm.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Fichier sélectionné: {serviceForm.file.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderPersonnelForm = () => {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de Charge Entreprise *
          </label>
          <select
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={personnelForm.type || ''}
            onChange={(e) => handlePersonnelInputChange('type', e.target.value)}
          >
            <option value="">Sélectionner un type</option>
            <option value="Appointements salaires et commissions">Appointements salaires et commissions</option>
            <option value="Charges sociales sur rémunération du personnel national">Charges sociales sur rémunération</option>
            <option value="Personnel détaché ou prêté à l'entreprise MANUTENTION">Personnel détaché ou prêté</option>
            <option value="Prestataire">Prestataire externe</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom/Description *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Prestataire 3"
            value={personnelForm.name || ''}
            onChange={(e) => handlePersonnelInputChange('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise *
          </label>
          <select
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={personnelForm.currency || 'FCFA'}
            onChange={(e) => handlePersonnelInputChange('currency', e.target.value)}
          >
            {currencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant *
          </label>
          <input
            type="number"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="800000"
            value={personnelForm.amount || ''}
            onChange={(e) => handlePersonnelInputChange('amount', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mois de paie *
          </label>
          <input
            type="date"
            value={personnelForm.month}
            onChange={(e) => handlePersonnelInputChange('month', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro d'employé (optionnel)
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="EMP-001"
            value={personnelForm.employeeNumber || ''}
            onChange={(e) => handlePersonnelInputChange('employeeNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={personnelForm.status || 'pending'}
            onChange={(e) => handlePersonnelInputChange('status', e.target.value)}
          >
            <option value="paid">Payée</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichier joint
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="personnel-file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Télécharger un fichier</span>
                  <input 
                    id="personnel-file" 
                    name="file" 
                    type="file" 
                    className="sr-only" 
                    onChange={handlePersonnelFileChange}
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX jusqu'à 10MB
              </p>
              {personnelForm.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Fichier sélectionné: {personnelForm.file.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderExpenseForm = () => {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie de dépense *
          </label>
          <select
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={expenseForm.category || ''}
            onChange={(e) => {
              handleExpenseInputChange('category', e.target.value);
              const category = expenseCategories.find(cat => cat.id === e.target.value);
              if (category) {
                handleExpenseInputChange('amount', category.defaultAmount);
              }
            }}
          >
            <option value="">Sélectionner une catégorie</option>
            {expenseCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Description de la dépense"
            value={expenseForm.description || ''}
            onChange={(e) => handleExpenseInputChange('description', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise *
          </label>
          <select
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={expenseForm.currency || 'FCFA'}
            onChange={(e) => handleExpenseInputChange('currency', e.target.value)}
          >
            {currencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant *
          </label>
          <input
            type="number"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
            value={expenseForm.amount || ''}
            onChange={(e) => handleExpenseInputChange('amount', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de dépense
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={expenseForm.date || ''}
            onChange={(e) => handleExpenseInputChange('date', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de facture
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="EXP-2024-001"
            value={expenseForm.invoiceNumber || ''}
            onChange={(e) => handleExpenseInputChange('invoiceNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={expenseForm.status || 'pending'}
            onChange={(e) => handleExpenseInputChange('status', e.target.value)}
          >
            <option value="paid">Payée</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichier joint
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="expense-file" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>Télécharger un fichier</span>
                  <input 
                    id="expense-file" 
                    name="file" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleExpenseFileChange}
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX jusqu'à 10MB
              </p>
              {expenseForm.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Fichier sélectionné: {expenseForm.file.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderTable = () => {
    let data, columns;
    
    if (activeSearchTab === 'services') {
      data = filteredServices;
      columns = ['Service', 'Fournisseur', 'Devise', 'Montant', 'Date', 'N° Facture', 'Statut', 'Fichier joint', 'Actions'];
    } else if (activeSearchTab === 'personnel') {
      data = filteredPersonnel;
      columns = ['Type', 'Nom/Description', 'Devise', 'Montant', 'Mois', 'N° Employé', 'Statut', 'Fichier joint', 'Actions'];
    } else {
      data = filteredExpenses;
      columns = ['Catégorie', 'Description', 'Devise', 'Montant', 'Date', 'N° Facture', 'Statut', 'Fichier joint', 'Actions'];
    }
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {activeSearchTab === 'services' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.amount, item.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.file ? (
                          <span className="text-blue-600 hover:text-blue-800">
                            <FileText className="w-4 h-4 inline mr-1" />
                            {item.file.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Aucun fichier</span>
                        )}
                      </td>
                    </>
                  ) : activeSearchTab === 'personnel' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.amount, item.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.employeeNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.file ? (
                          <span className="text-blue-600 hover:text-blue-800">
                            <FileText className="w-4 h-4 inline mr-1" />
                            {item.file.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Aucun fichier</span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {(() => {
                            const category = expenseCategories.find(cat => cat.id === item.category);
                            const IconComponent = category ? category.icon : FileText;
                            return <IconComponent className="w-4 h-4 mr-2" />;
                          })()}
                          {(() => {
                            const category = expenseCategories.find(cat => cat.id === item.category);
                            return category ? category.name : 'Inconnue';
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.amount, item.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.invoiceNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.file ? (
                          <span className="text-blue-600 hover:text-blue-800">
                            <FileText className="w-4 h-4 inline mr-1" />
                            {item.file.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Aucun fichier</span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item, activeSearchTab)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, activeSearchTab)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
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
          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune donnée trouvée. Commencez par ajouter une dépense.
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderSearchContent = () => {
    return (
      <div>
        {/* Sous-onglets pour la recherche */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'services' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('services')}
          >
            Services Professionnels
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'personnel' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('personnel')}
          >
           Charges Entreprise
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'expenses' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('expenses')}
          >
            Autres Dépenses
          </button>
        </div>
        {/* Barre de recherche */}
        <div className="bg-white p-4 rounded-lg shadow flex items-center mb-6">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par description, fournisseur, numéro de facture..."
            className="w-full p-2 border-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {renderTable()}
      </div>
    );
  };
  
  const renderCreationContent = () => {
    return (
      <div>
        {/* Sous-onglets pour la création */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'services' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('services')}
          >
            Services Professionnels
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'personnel' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('personnel')}
          >
           Charges Entreprise
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'expenses' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('expenses')}
          >
            Autres Dépenses
          </button>
        </div>
        
        {/* Formulaire de création */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Modifier une dépense' : 'Ajouter une nouvelle dépense'}
          </h2>
          
          <div className="space-y-4">
            {activeSearchTab === 'services' && renderServiceForm()}
            {activeSearchTab === 'personnel' && renderPersonnelForm()}
            {activeSearchTab === 'expenses' && renderExpenseForm()}
          </div>
          
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForms();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              className={`px-6 py-2 text-white rounded-lg flex items-center space-x-2 ${
                activeSearchTab === 'services' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : activeSearchTab === 'personnel'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Mettre à jour' : 'Enregistrer'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Dépenses</h1>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
            </select>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <button
            onClick={() => {
              resetForms();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une dépense</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Statistiques en haut */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            <h4 className="font-semibold">Statistiques Globales</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{globalStats.paid}</div>
                <div className="text-sm text-gray-600">Dépenses payées</div>
                <div className="text-xs text-gray-500 mt-1">{formatCurrency(globalStats.totalAmount)}</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">{globalStats.pending}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{globalStats.overdue}</div>
                <div className="text-sm text-gray-600">En retard</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{globalStats.total}</div>
                <div className="text-sm text-gray-600">Total dépenses</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(globalStats.totalAmount)}</div>
                <div className="text-sm text-gray-600">Montant total</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation principale */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-6 py-3 font-medium ${activeMainTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveMainTab('search')}
          >
            Recherche
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeMainTab === 'creation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveMainTab('creation')}
          >
            Création
          </button>
        </div>
        
        {activeMainTab === 'search' ? renderSearchContent() : renderCreationContent()}
      </div>
      
      {/* Modal pour création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier une dépense' : 'Ajouter une nouvelle dépense'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForms();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de dépense
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('services')}
                    className={`p-4 border rounded-lg text-left ${
                      activeSearchTab === 'services' ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Services Professionnels</h3>
                        <p className="text-sm text-gray-500">Redevances, honoraires, locations, etc.</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('personnel')}
                    className={`p-4 border rounded-lg text-left ${
                      activeSearchTab === 'personnel' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <User className="w-6 h-6 mr-2 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Charges Entreprise</h3>
                        <p className="text-sm text-gray-500">Salaires, charges sociales, prestataires</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('expenses')}
                    className={`p-4 border rounded-lg text-left ${
                      activeSearchTab === 'expenses' ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <Package className="w-6 h-6 mr-2 text-green-600" />
                      <div>
                        <h3 className="font-medium">Autres Dépenses</h3>
                        <p className="text-sm text-gray-500">Fournitures, frais bancaires, douane, etc.</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {activeSearchTab === 'services' && renderServiceForm()}
                {activeSearchTab === 'personnel' && renderPersonnelForm()}
                {activeSearchTab === 'expenses' && renderExpenseForm()}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForms();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className={`px-6 py-2 text-white rounded-lg flex items-center space-x-2 ${
                    activeSearchTab === 'services' 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : activeSearchTab === 'personnel'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Mettre à jour' : 'Enregistrer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}