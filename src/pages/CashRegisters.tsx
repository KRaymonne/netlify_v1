import React, { useState, useEffect } from 'react';
import { 
  Download,
  X,
  Save,
  ArrowDownCircle,
  Search,
  BarChart3,
  Edit,
  Trash2,
  Package,
  Droplet,
  Zap,
  Fuel,
  Wrench,
  Phone,
  Shield,
  Truck,
  Folder,
  FileText,
  Paperclip
} from 'lucide-react';

// Types pour les caisses et transactions
interface CashAccount {
  _id: string;
  name: string;
  balance: number;
  currency: string;
  location: string;
  responsiblePerson: string;
  document?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  _id: string;
  type: 'fourniture' | 'frais';
  category: string;
  description: string;
  amount: number;
  currency: string;
  cashAccountId: string;
  provider?: string;
  date: string;
  status?: string;
  document?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

// Service API pour les caisses
const CashAccountService = {
  getAll: async (): Promise<CashAccount[]> => {
    const response = await fetch('/cash-registers');
    if (!response.ok) throw new Error('Erreur lors de la récupération des caisses');
    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  },
  
  create: async (data: Omit<CashAccount, '_id' | 'createdAt' | 'updatedAt'>): Promise<CashAccount> => {
    const response = await fetch('/cash-registers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la caisse');
    return response.json();
  },
  
  update: async (id: string, data: Partial<CashAccount>): Promise<CashAccount> => {
    const response = await fetch(`/cash-registers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la caisse');
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/cash-registers/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la caisse');
  }
};

// Service API pour les transactions
const TransactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await fetch('/transactions');
    if (!response.ok) throw new Error('Erreur lors de la récupération des transactions');
    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  },
  
  create: async (data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  const response = await fetch('/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la transaction');
    return response.json();
  },
  
  update: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
  const response = await fetch(`/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la transaction');
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
  const response = await fetch(`/transactions/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la transaction');
  }
};

export function CashRegisters() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [showModal, setShowModal] = useState(false);
  const [showCaisseModal, setShowCaisseModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'fourniture' | 'frais'>('fourniture');
  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const [newCaisseData, setNewCaisseData] = useState<Omit<CashAccount, '_id' | 'createdAt' | 'updatedAt'> & { status?: string }>({
    name: '',
    balance: 0,
    currency: 'XAF',
    location: '',
    responsiblePerson: '',
    document: undefined,
    status: ''
  });
  
  // États pour les onglets principaux
  const [activeMainTab, setActiveMainTab] = useState<'search' | 'creation'>('search');
  const [activeCreationTab, setActiveCreationTab] = useState<'caisse' | 'transaction'>('caisse');
  const [activeSearchTab, setActiveSearchTab] = useState<'cashAccounts' | 'transactions'>('cashAccounts');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les documents
  const [caisseDocumentPreview, setCaisseDocumentPreview] = useState<string | null>(null);
  const [transactionDocumentPreview, setTransactionDocumentPreview] = useState<string | null>(null);
  
  // États pour les données
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CashAccount | Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Catégories avec icônes
  const expenseCategories = [
    { id: 'cleaning', name: 'Produits d\'entretien', icon: Package, defaultAmount: 450000 },
    { id: 'water', name: 'Fournitures non stockables - Eau', icon: Droplet, defaultAmount: 180000 },
    { id: 'electricity', name: 'Fournitures non stockables - Électricité', icon: Zap, defaultAmount: 680000 },
    { id: 'fuel', name: 'Fournitures non stockables – Autres énergies CARBURANT', icon: Fuel, defaultAmount: 1250000 },
    { id: 'tools', name: 'Achats de petit matériel et outillage', icon: Wrench, defaultAmount: 320000 },
    { id: 'phone', name: 'Frais téléphone MTN', icon: Phone, defaultAmount: 125000 },
    { id: 'customs', name: 'Douane', icon: Shield, defaultAmount: 340000 },
    { id: 'transport', name: 'TRANSPORT Transport Express', icon: Truck, defaultAmount: 780000 },
    { id: 'files', name: 'DOSSIERS AO', icon: Folder, defaultAmount: 150000 },
    { id: 'publicity', name: 'PUBLICITÉ (Réseaux sociaux)', icon: FileText, defaultAmount: 180000 },
    { id: 'insurance', name: 'ASSURANCE', icon: Shield, defaultAmount: 650000 },
    { id: 'divers', name: 'Divers frais', icon: FileText, defaultAmount: 95000 }
  ];
  
  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cashAccountsData, transactionsData] = await Promise.all([
        CashAccountService.getAll(),
        TransactionService.getAll()
      ]);
      
      setCashAccounts(cashAccountsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrer les caisses
  const filteredCashAccounts = cashAccounts.filter(caisse => {
    const searchLower = searchTerm.toLowerCase();
    return (
      caisse.name.toLowerCase().includes(searchLower) ||
      caisse.location.toLowerCase().includes(searchLower) ||
      caisse.responsiblePerson.toLowerCase().includes(searchLower) ||
      (caisse.status && caisse.status.toLowerCase().includes(searchLower))
    );
  });
  
  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const category = expenseCategories.find(cat => cat.id === transaction.category);
    const categoryName = category ? category.name : 'Inconnue';
    
    return (
      categoryName.toLowerCase().includes(searchLower) ||
      (transaction.provider && transaction.provider.toLowerCase().includes(searchLower)) ||
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      (transaction.date && transaction.date.includes(searchTerm)) ||
      (transaction.status && transaction.status.toLowerCase().includes(searchLower))
    );
  });
  
  const formatCurrency = (amount: number, currency = 'XAF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount).replace(currency, currency === 'XAF' ? 'FCFA' : currency);
  };
  
  const handleInputChange = (field: keyof Transaction, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCaisseInputChange = (field: keyof typeof newCaisseData, value: string | number | undefined) => {
    setNewCaisseData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCaisseDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCaisseDocumentPreview(result);
        handleCaisseInputChange('document', result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTransactionDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTransactionDocumentPreview(result);
        handleInputChange('document', result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validation obligatoire caisse
    if (!formData.cashAccountId) {
      setLoading(false);
      setError('Veuillez sélectionner une caisse pour la transaction.');
      return;
    }
    
    try {
      const transactionData = {
        type: transactionType,
        category: formData.category || '',
        description: formData.description || '',
        amount: Number(formData.amount) || 0,
        currency: formData.currency || 'XAF',
        cashAccountId: formData.cashAccountId || '',
        provider: formData.provider,
        date: formData.date || new Date().toISOString().split('T')[0],
        document: formData.document,
        reference: formData.reference,
        status: formData.status || ''
      };
      
      if (editingItem && !('balance' in editingItem)) {
        await TransactionService.update(editingItem._id, transactionData);
        setSuccess('Transaction mise à jour avec succès!');
      } else {
        await TransactionService.create(transactionData);
        setSuccess('Transaction créée avec succès!');
      }
      
      // Recharger les données
      await loadData();
      
      // Fermer le modal et réinitialiser le formulaire
      setShowModal(false);
      setFormData({});
      setTransactionDocumentPreview(null);
      setEditingItem(null);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCaisse = async () => {
    if (!newCaisseData.name || !newCaisseData.location || newCaisseData.balance === undefined) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (editingItem && 'balance' in editingItem) {
        await CashAccountService.update(editingItem._id, newCaisseData);
        setSuccess('Caisse mise à jour avec succès!');
      } else {
        await CashAccountService.create(newCaisseData);
        setSuccess('Caisse créée avec succès!');
      }
      
      // Recharger les données
      await loadData();
      
      // Fermer le modal et réinitialiser le formulaire
      setShowCaisseModal(false);
      setNewCaisseData({ 
        name: '', 
        balance: 0,
        currency: 'XAF', 
        location: '', 
        responsiblePerson: '',
        document: undefined,
        status: ''
      });
      setCaisseDocumentPreview(null);
    } catch (err) {
      console.error('Erreur lors de la création de la caisse:', err);
      setError('Une erreur est survenue lors de la création de la caisse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (item: CashAccount | Transaction) => {
    setEditingItem(item);
    setError(null);
    setSuccess(null);
    
    if ('balance' in item) { // C'est une caisse
      const caisse = item as CashAccount;
      setNewCaisseData({
        name: caisse.name,
        balance: caisse.balance,
        currency: caisse.currency,
        location: caisse.location,
        responsiblePerson: caisse.responsiblePerson,
        document: caisse.document,
        status: caisse.status
      });
      setCaisseDocumentPreview(caisse.document || null);
      setShowCaisseModal(true);
    } else { // C'est une transaction
      const transaction = item as Transaction;
      setTransactionType(transaction.type);
      setFormData({
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
        cashAccountId: transaction.cashAccountId,
        provider: transaction.provider,
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        document: transaction.document,
        reference: transaction.reference,
        status: transaction.status
      });
      setTransactionDocumentPreview(transaction.document || null);
      setShowModal(true);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setIsDeleting(id);
    
    try {
      // Déterminer si c'est une caisse ou une transaction
      const cashAccount = cashAccounts.find(caisse => caisse._id === id);
      
      if (cashAccount) {
        await CashAccountService.delete(id);
        setSuccess('Caisse supprimée avec succès!');
      } else {
        await TransactionService.delete(id);
        setSuccess('Transaction supprimée avec succès!');
      }
      
      // Recharger les données
      await loadData();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Une erreur est survenue lors de la suppression. Veuillez réessayer.');
    } finally {
      setLoading(false);
      setIsDeleting(null);
    }
  };
  
  // Fonction d'exportation pour les caisses
  const exportCashAccounts = async (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/cash-registers/export/${format}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      let expectedType = '';
      let extension: string = format;
      
      switch (format) {
        case 'pdf':
          expectedType = 'application/pdf';
          extension = 'pdf';
          break;
        case 'excel':
          expectedType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          extension = 'xlsx';
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
      link.download = `caisses_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
  setSuccess(`Exportation des caisses réussie au format ${format.toUpperCase()}!`);
  setTimeout(() => setSuccess(null), 2000);
    } catch (error: any) {
      console.error('Erreur d\'exportation:', error);
      setError(`Erreur lors de l'exportation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction d'exportation pour les transactions
  const exportTransactions = async (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/transactions/export/${format}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      let expectedType = '';
      let extension: string = format;
      
      switch (format) {
        case 'pdf':
          expectedType = 'application/pdf';
          extension = 'pdf';
          break;
        case 'excel':
          expectedType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          extension = 'xlsx';
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
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
  setSuccess(`Exportation des transactions réussie au format ${format.toUpperCase()}!`);
  setTimeout(() => setSuccess(null), 2000);
    } catch (error: any) {
      console.error('Erreur d\'exportation:', error);
      setError(`Erreur lors de l'exportation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const renderFormFields = () => {
    if (transactionType === 'fourniture') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caisse *
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.cashAccountId || ''}
              onChange={(e) => handleInputChange('cashAccountId', e.target.value)}
            >
              <option value="">Sélectionner une caisse</option>
              {cashAccounts.map((caisse) => (
                <option key={caisse._id} value={caisse._id}>
                  {caisse.name} - {caisse.location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise *
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.currency || 'XAF'}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            >
              <option value="XAF">FCFA (XAF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar américain (USD)</option>
              <option value="GBP">Livre sterling (GBP)</option>
              <option value="CAD">Dollar canadien (CAD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de fourniture *
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">Sélectionner un type</option>
              {expenseCategories.filter(cat => ['cleaning', 'water', 'electricity', 'fuel', 'tools'].includes(cat.id)).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Achat produits de nettoyage"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant *
            </label>
            <input
              type="number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="450000"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fournisseur
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Société ABC"
              value={formData.provider || ''}
              onChange={(e) => handleInputChange('provider', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de transaction
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Sélectionner un statut</option>
              <option value="En attente">En attente</option>
              <option value="Validée">Validée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document (optionnel)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <Paperclip className="w-4 h-4" />
                <span>Ajouter un document</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleTransactionDocumentUpload}
                  className="hidden"
                />
              </label>
              {transactionDocumentPreview && (
                <div className="relative">
                  {transactionDocumentPreview.startsWith('data:image') ? (
                    <img src={transactionDocumentPreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                      <FileText className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionDocumentPreview(null);
                      handleInputChange('document', undefined);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caisse *
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.cashAccountId || ''}
              onChange={(e) => handleInputChange('cashAccountId', e.target.value)}
            >
              <option value="">Sélectionner une caisse</option>
              {cashAccounts.map((caisse) => (
                <option key={caisse._id} value={caisse._id}>
                  {caisse.name} - {caisse.location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise *
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.currency || 'XAF'}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            >
              <option value="XAF">FCFA (XAF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar américain (USD)</option>
              <option value="GBP">Livre sterling (GBP)</option>
              <option value="CAD">Dollar canadien (CAD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de frais *
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">Sélectionner un type</option>
              {expenseCategories.filter(cat => !['cleaning', 'water', 'electricity', 'fuel', 'tools'].includes(cat.id)).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Frais de virement bancaire"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant *
            </label>
            <input
              type="number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="85000"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prestataire/Organisme
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: UBA, MTN, etc."
              value={formData.provider || ''}
              onChange={(e) => handleInputChange('provider', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de transaction
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de référence
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: REF-2024-001"
              value={formData.reference || ''}
              onChange={(e) => handleInputChange('reference', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Sélectionner un statut</option>
              <option value="En attente">En attente</option>
              <option value="Validée">Validée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document (optionnel)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <Paperclip className="w-4 h-4" />
                <span>Ajouter un document</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleTransactionDocumentUpload}
                  className="hidden"
                />
              </label>
              {transactionDocumentPreview && (
                <div className="relative">
                  {transactionDocumentPreview.startsWith('data:image') ? (
                    <img src={transactionDocumentPreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                      <FileText className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionDocumentPreview(null);
                      handleInputChange('document', undefined);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }
  };
  
  const renderSearchContent = () => {
    return (
      <div>
        {/* Barre de recherche */}
        <div className="bg-white p-4 rounded-lg shadow flex items-center mb-6">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par nom, description, type..."
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
        
        {/* Afficher les messages d'erreur et de succès */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* Onglets pour les tableaux */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'cashAccounts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('cashAccounts')}
          >
            Caisses
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeSearchTab === 'transactions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveSearchTab('transactions')}
          >
            Transactions
          </button>
        </div>
        
        {/* Tableau des caisses */}
        {activeSearchTab === 'cashAccounts' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">Caisses</h3>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredCashAccounts.length} éléments
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
                <button
                  onClick={() => exportCashAccounts(exportFormat)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emplacement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCashAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        Aucune caisse trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredCashAccounts.map((caisse) => (
                      <tr key={caisse._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {caisse.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {caisse.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(caisse.balance, caisse.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {caisse.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {caisse.responsiblePerson}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {caisse.status || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(caisse.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {caisse.document ? (
                            <FileText className="w-5 h-5 text-green-600" />
                          ) : (
                            <span className="text-gray-400">Aucun</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(caisse)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(caisse._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Supprimer"
                              disabled={isDeleting === caisse._id}
                            >
                              {isDeleting === caisse._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Tableau des transactions */}
        {activeSearchTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredTransactions.length} éléments
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
                <button
                  onClick={() => exportTransactions(exportFormat)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                        Aucune transaction trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const category = expenseCategories.find(cat => cat.id === transaction.category);
                      return (
                        <tr key={transaction._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.type === 'fourniture' ? 'Fourniture' : 'Frais'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category ? category.name : 'Inconnue'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.provider || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date ? new Date(transaction.date).toLocaleDateString('fr-FR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.status || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.document ? (
                              <FileText className="w-5 h-5 text-green-600" />
                            ) : (
                              <span className="text-gray-400">Aucun</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="Supprimer"
                                disabled={isDeleting === transaction._id}
                              >
                                {isDeleting === transaction._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderCreationContent = () => {
    return (
      <div>
        {/* Sous-onglets pour la création */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeCreationTab === 'caisse' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveCreationTab('caisse')}
          >
            Nouvelle Caisse
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeCreationTab === 'transaction' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveCreationTab('transaction')}
          >
            Nouvelle Transaction
          </button>
        </div>
        
        {/* Afficher les messages d'erreur et de succès */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu des sous-onglets de création */}
        {activeCreationTab === 'caisse' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingItem && 'balance' in editingItem ? 'Modifier une caisse' : 'Créer une nouvelle caisse'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la caisse *
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Caisse principale"
                  value={newCaisseData.name}
                  onChange={(e) => handleCaisseInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emplacement *
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Bureau principal"
                  value={newCaisseData.location}
                  onChange={(e) => handleCaisseInputChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise *
                </label>
                <select
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCaisseData.currency}
                  onChange={(e) => handleCaisseInputChange('currency', e.target.value)}
                >
                  <option value="XAF">FCFA (XAF)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar américain (USD)</option>
                  <option value="GBP">Livre sterling (GBP)</option>
                  <option value="CAD">Dollar canadien (CAD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solde initial *
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500000"
                  value={newCaisseData.balance}
                  onChange={(e) => handleCaisseInputChange('balance', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personne responsable *
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Jean Dupont"
                  value={newCaisseData.responsiblePerson}
                  onChange={(e) => handleCaisseInputChange('responsiblePerson', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut de la caisse
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Active, Fermée, Suspendue..."
                  value={newCaisseData.status || ''}
                  onChange={e => handleCaisseInputChange('status', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document (optionnel)
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <Paperclip className="w-4 h-4" />
                    <span>Ajouter un document</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleCaisseDocumentUpload}
                      className="hidden"
                    />
                  </label>
                  {caisseDocumentPreview && (
                    <div className="relative">
                      {caisseDocumentPreview.startsWith('data:image') ? (
                        <img src={caisseDocumentPreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                          <FileText className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCaisseDocumentPreview(null);
                          handleCaisseInputChange('document', undefined);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setNewCaisseData({ 
                    name: '', 
                    balance: 0,
                    currency: 'XAF', 
                    location: '', 
                    responsiblePerson: '',
                    document: undefined,
                    status: ''
                  });
                  setCaisseDocumentPreview(null);
                  setEditingItem(null);
                  setError(null);
                  setSuccess(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateCaisse}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editingItem && 'balance' in editingItem ? 'Mettre à jour' : 'Créer'}</span>
              </button>
            </div>
          </div>
        )}
        
        {activeCreationTab === 'transaction' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingItem && !('balance' in editingItem) ? 'Modifier une transaction' : 'Enregistrer une nouvelle transaction'}
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de transaction
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTransactionType('fourniture')}
                  className={`p-4 border rounded-lg text-left ${
                    transactionType === 'fourniture'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowDownCircle className="w-5 h-5" />
                    <div className="font-medium">Fournitures & Matériel</div>
                  </div>
                  <div className="text-sm text-gray-600">Achats, équipements</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('frais')}
                  className={`p-4 border rounded-lg text-left ${
                    transactionType === 'frais'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowDownCircle className="w-5 h-5" />
                    <div className="font-medium">Frais & Services</div>
                  </div>
                  <div className="text-sm text-gray-600">Charges diverses</div>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {renderFormFields()}
            </div>
            
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setFormData({});
                  setTransactionDocumentPreview(null);
                  setEditingItem(null);
                  setError(null);
                  setSuccess(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 text-white rounded-lg flex items-center space-x-2 ${
                  transactionType === 'fourniture' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editingItem && !('balance' in editingItem) ? 'Mettre à jour' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Caisses</h1>
             <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{cashAccounts.length}</div>
                <div className="text-sm text-gray-600">Caisses actives</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(cashAccounts.reduce((sum, caisse) => sum + caisse.balance, 0))}
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{transactions.filter(t => t.type === 'fourniture').length}</div>
                <div className="text-sm text-gray-600">Types de fournitures</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(transactions.filter(t => t.type === 'fourniture').reduce((sum, item) => sum + item.amount, 0))}
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{transactions.filter(t => t.type === 'frais').length}</div>
                <div className="text-sm text-gray-600">Types de frais</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(transactions.filter(t => t.type === 'frais').reduce((sum, item) => sum + item.amount, 0))}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    cashAccounts.reduce((sum, caisse) => sum + caisse.balance, 0) -
                    transactions.reduce((sum, item) => sum + item.amount, 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Solde global</div>
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
      
      {/* Modal pour nouvelle transaction */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem && !('balance' in editingItem) ? 'Modifier une transaction' : 'Nouvelle Transaction'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de transaction
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTransactionType('fourniture')}
                    className={`p-4 border rounded-lg text-left ${
                      transactionType === 'fourniture'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ArrowDownCircle className="w-5 h-5" />
                      <div className="font-medium">Fournitures & Matériel</div>
                    </div>
                    <div className="text-sm text-gray-600">Achats, équipements</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('frais')}
                    className={`p-4 border rounded-lg text-left ${
                      transactionType === 'frais'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ArrowDownCircle className="w-5 h-5" />
                      <div className="font-medium">Frais & Services</div>
                    </div>
                    <div className="text-sm text-gray-600">Charges diverses</div>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {renderFormFields()}
              </div>
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 text-white rounded-lg flex items-center space-x-2 ${
                    transactionType === 'fourniture' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingItem && !('balance' in editingItem) ? 'Mettre à jour' : 'Enregistrer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour nouvelle caisse */}
      {showCaisseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem && 'balance' in editingItem ? 'Modifier une caisse' : 'Nouvelle Caisse'}
              </h2>
              <button
                onClick={() => {
                  setShowCaisseModal(false);
                  setEditingItem(null);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la caisse *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Caisse principale"
                    value={newCaisseData.name}
                    onChange={(e) => handleCaisseInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emplacement *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Bureau principal"
                    value={newCaisseData.location}
                    onChange={(e) => handleCaisseInputChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise *
                  </label>
                  <select
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newCaisseData.currency}
                    onChange={(e) => handleCaisseInputChange('currency', e.target.value)}
                  >
                    <option value="XAF">FCFA (XAF)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">Dollar américain (USD)</option>
                    <option value="GBP">Livre sterling (GBP)</option>
                    <option value="CAD">Dollar canadien (CAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solde initial *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500000"
                    value={newCaisseData.balance}
                    onChange={(e) => handleCaisseInputChange('balance', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personne responsable *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Jean Dupont"
                    value={newCaisseData.responsiblePerson}
                    onChange={(e) => handleCaisseInputChange('responsiblePerson', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut de la caisse
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Active, Fermée, Suspendue..."
                    value={newCaisseData.status || ''}
                    onChange={e => handleCaisseInputChange('status', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document (optionnel)
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                      <Paperclip className="w-4 h-4" />
                      <span>Ajouter un document</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleCaisseDocumentUpload}
                        className="hidden"
                      />
                    </label>
                    {caisseDocumentPreview && (
                      <div className="relative">
                        {caisseDocumentPreview.startsWith('data:image') ? (
                          <img src={caisseDocumentPreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                            <FileText className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setCaisseDocumentPreview(null);
                            handleCaisseInputChange('document', undefined);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCaisseModal(false);
                    setEditingItem(null);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleCreateCaisse}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingItem && 'balance' in editingItem ? 'Mettre à jour' : 'Créer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}