import React, { useState, useMemo, useEffect } from 'react';
import api from '../api';
import { utils as XLSXUtils, writeFile as writeXLSX } from 'xlsx';
import { BankAccount } from '../types';
// @ts-ignore
import { RecordManager } from '../components/RecordManager';
import { 
  CreditCard, 
  Plus, 
  Eye,
  Edit,
  Download,
  Search,
  ArrowRight,
  Trash2,
  X,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Camera,
  Image,
  FileText,
} from 'lucide-react';

// Composant pour formater la devise
const formatCurrency = (amount: number, currency = 'XAF') => {
  const isoCode = currency === 'FCFA' ? 'XAF' : currency;
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: isoCode,
    minimumFractionDigits: 0
  }).format(amount);
  // Affiche "FCFA" pour XAF côté UI
  return isoCode === 'XAF' ? formatted.replace('XAF', 'FCFA') : formatted;
};

// Formater en YYYY-MM-DD pour affichage/tableau/export
const formatDateYMD = (value: any) => {
  try {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      // si déjà "YYYY-MM-DD"
      const s = String(value);
      return /\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0,10) : '';
    }
    return d.toISOString().slice(0,10);
  } catch {
    return '';
  }
};


export function Banks() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<BankAccount | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]); // TODO: type properly when backend transaction structure is clear
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [bankRecords, setBankRecords] = useState<any[]>([]);

  const getAxiosErrorText = (err: any) => {
    const data = err?.response?.data;
    if (!data) return err?.message || 'Erreur inconnue';
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    try { return JSON.stringify(data); } catch { return String(data); }
  };

  // Fetch accounts from backend
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/bank');
        if (res.data && res.data.data) {
          // Map _id to id for frontend compatibility
          const mapped = res.data.data.map((acc: any) => ({ ...acc, id: acc._id }));
          setAccounts(mapped);
        }
      } catch (err: any) {
        const msg = getAxiosErrorText(err);
        console.error('Erreur fetch accounts:', err.response?.data || err.message);
        setError(`Erreur lors du chargement des comptes bancaires: ${msg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // Fetch transactions for selected account (to be implemented)
  // const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null); // Not used

  // Ajouter un compte via l'API
  const handleAddAccount = async (newAccountData: any) => {
    setIsSubmitting(true);
    setError('');
    try {
      // Adapter les champs pour l'API backend
      const typeMap: Record<string, string> = {
        'Compte courant': 'checking',
        'Compte épargne': 'savings',
        'Compte entreprise': 'business',
        'Compte investissement': 'investment',
        // déjà enums
        'checking': 'checking',
        'savings': 'savings',
        'business': 'business',
        'investment': 'investment',
      };
      const payload = {
        name: newAccountData.name,
        type: typeMap[newAccountData.type] || 'checking',
        balance: parseFloat(newAccountData.balance),
        currency: newAccountData.currency,
        accountNumber: newAccountData.accountNumber,
        bankName: newAccountData.bankName || undefined,
      };
      const res = await api.post('/bank', payload);
      if (res.data && res.data.data) {
        const newAcc = { ...res.data.data, id: res.data.data._id };
        setAccounts(prev => [...prev, newAcc]);
        setIsNewAccountModalOpen(false);
      }
    } catch (err: any) {
      const msg = getAxiosErrorText(err);
      console.error('Erreur création compte:', err.response?.data || err.message);
      setError(`Erreur lors de la création du compte bancaire: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer l'ajout d'une nouvelle transaction
  const handleAddTransaction = async (newTransactionData: any) => {
    if (!selectedAccount) {
      setError('Aucun compte sélectionné');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/bank/${selectedAccount.id}/transactions`, newTransactionData);
      if (res.data && res.data.data) {
        // Mettre à jour le compte avec les nouvelles données
        const updatedAccount = { ...res.data.data, id: res.data.data._id };
        setAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? updatedAccount : acc));
        setSelectedAccount(updatedAccount);
        setIsNewTransactionModalOpen(false);
      }
    } catch (err: any) {
      const msg = getAxiosErrorText(err);
      console.error('Erreur ajout transaction:', err.response?.data || err.message);
      setError(`Erreur lors de l'ajout de la transaction: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer une transaction
  const handleDeleteTransaction = async (transactionId: string) => {
    if (!selectedAccount) return;
    
    setIsSubmitting(true);
    setError('');
    try {
      const res = await api.delete(`/bank/${selectedAccount.id}/transactions/${transactionId}`);
      if (res.data && res.data.data) {
        // Mettre à jour le compte avec les nouvelles données
        const updatedAccount = { ...res.data.data, id: res.data.data._id };
        setAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? updatedAccount : acc));
        setSelectedAccount(updatedAccount);
      }
    } catch (err: any) {
      const msg = getAxiosErrorText(err);
      console.error('Erreur suppression transaction:', err.response?.data || err.message);
      setError(`Erreur lors de la suppression de la transaction: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exporter les données d'une banque spécifique (à adapter après CRUD transactions)
  const exportBankData = (bankId: string) => {
    const bank = accounts.find(acc => acc.id === bankId);
    // Utiliser exactement les lignes visibles dans le tableau (après recherche)
    const source = selectedAccount && selectedAccount.id === bankId ? filteredTransactions : (bank?.transactions || []);
    const headers = ['Date','Nom','Description','Type','Numéro de compte','Devise','Montant','Reçu'];
    const rows = source.map(tx => ({
      Date: formatDateYMD(tx.date),
      Nom: (tx as any).name || '',
      Description: tx.description || '',
      Type: tx.amount > 0 ? 'Revenu' : 'Dépense',
      'Numéro de compte': (tx as any).accountNumber || '',
      Devise: (tx as any).currency || (bank?.currency ?? ''),
      Montant: tx.amount,
      Reçu: (tx as any).receipt ? 'Oui' : 'Non'
    }));

    const filenameBase = `export_${bank?.name || 'banque'}_${new Date().toISOString().slice(0,10)}`;
    exportData(exportFormat, rows, filenameBase, bank, headers);
  };

  const createCSV = (rows: any[]): string => {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const escape = (val: any) => (
      '"' + String(val ?? '').replace(/"/g, '""') + '"'
    );
    const csv = [headers.map(h => escape(h)).join(',')]
      .concat(rows.map(r => headers.map(h => escape(r[h])).join(',')))
      .join('\n');
    // Ajouter BOM pour compat Excel
    return '\uFEFF' + csv;
  };

  const createExcelHtml = (title: string, rows: any[]): string => {
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    const headerHtml = headers.map(h => `<th style="border:1px solid #ccc;padding:6px;text-align:left">${h}</th>`).join('');
    const bodyHtml = rows.map(r => `<tr>${headers.map(h => `<td style="border:1px solid #ccc;padding:6px;">${r[h] ?? ''}</td>`).join('')}</tr>`).join('');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body>
    <h3>${title}</h3>
    <table style="border-collapse:collapse">${rows.length ? `<thead><tr>${headerHtml}</tr></thead>` : ''}<tbody>${bodyHtml}</tbody></table>
    </body></html>`;
  };

  const createPdfHtml = (title: string, bankMeta?: BankAccount | null, rows?: any[]): string => {
    const meta = bankMeta ? `
      <div style="margin-bottom:12px;">
        <div><strong>Banque:</strong> ${bankMeta.name}</div>
        <div><strong>Type:</strong> ${bankMeta.type}</div>
        <div><strong>Devise:</strong> ${bankMeta.currency}</div>
        <div><strong>Solde:</strong> ${formatCurrency(bankMeta.balance, bankMeta.currency)}</div>
      </div>
    ` : '';
    const headers = rows && rows.length ? Object.keys(rows[0]) : [];
    const headerHtml = headers.map(h => `<th style="border:1px solid #ccc;padding:6px;text-align:left">${h}</th>`).join('');
    const bodyHtml = rows ? rows.map(r => `<tr>${headers.map(h => `<td style="border:1px solid #ccc;padding:6px;">${r[h] ?? ''}</td>`).join('')}</tr>`).join('') : '';
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
      <style>@media print { @page { margin: 16mm; } body { font-family: Arial, sans-serif; } }</style>
    </head><body>
      <h2>${title}</h2>
      ${meta}
      ${rows ? `<table style="border-collapse:collapse;width:100%">${rows.length ? `<thead><tr>${headerHtml}</tr></thead>` : ''}<tbody>${bodyHtml}</tbody></table>` : ''}
      <script>window.onload = function(){ window.print(); setTimeout(()=>window.close(), 300); };</script>
    </body></html>`;
  };

  const downloadBlob = (content: BlobPart, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportData = (format: string, rows: any[], filenameBase: string, bank?: BankAccount | null, headers?: string[]) => {
    if (format === 'csv') {
      const csv = createCSV(rows);
      return downloadBlob(csv, 'text/csv;charset=utf-8;', `${filenameBase}.csv`);
    }
    if (format === 'excel') {
      const workbook = XLSXUtils.book_new();
      const sheet = XLSXUtils.json_to_sheet(rows, { header: headers });
      // Largeurs de colonnes auto (approx)
      const headerList = headers && headers.length ? headers : (rows[0] ? Object.keys(rows[0]) : []);
      const cols = headerList.map((h) => ({ wch: Math.max(12, String(h).length + 4, ...rows.map(r => String(r[h] ?? '').length + 2)) }));
      (sheet as any)['!cols'] = cols;
      XLSXUtils.book_append_sheet(workbook, sheet, 'Transactions');
      return writeXLSX(workbook, `${filenameBase}.xlsx`);
    }
    // PDF: si un compte est fourni, appeler l'endpoint backend pour un vrai PDF
    if (bank && bank.id) {
      fetch(`/bank/${bank.id}/export/pdf`, { method: 'GET' })
        .then(async (res) => {
          if (!res.ok) throw new Error('Export PDF échoué');
          const blob = await res.blob();
          downloadBlob(blob, 'application/pdf', `${filenameBase}.pdf`);
        })
        .catch(() => {
          // fallback HTML si endpoint indisponible
          const html = createPdfHtml(filenameBase, bank || null, rows);
          downloadBlob(html, 'text/html', `${filenameBase}.html`);
        });
      return;
    }
    // fallback global
    const html = createPdfHtml(filenameBase, bank || null, rows);
    downloadBlob(html, 'text/html', `${filenameBase}.html`);
  };

  // Supprimer un compte bancaire
  const handleDeleteAccount = async (accountId: string) => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/bank/${accountId}`);
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      if (selectedAccount && selectedAccount.id === accountId) {
        setSelectedAccount(null);
      }
    } catch (err) {
      setError('Erreur lors de la suppression du compte bancaire');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un compte bancaire (à brancher sur le bouton Modifier)
  const handleUpdateAccount = async (accountId: string, updateData: any) => {
    setLoading(true);
    setError('');
    try {
      // Mapper les types français -> enums backend
      const typeMap: Record<string, string> = {
        'Compte courant': 'checking',
        'Compte épargne': 'savings',
        'Compte entreprise': 'business',
        'Compte investissement': 'investment',
        'checking': 'checking',
        'savings': 'savings',
        'business': 'business',
        'investment': 'investment'
      };
      const payload = {
        name: updateData.name,
        type: typeMap[updateData.type] || updateData.type,
        balance: typeof updateData.balance === 'string' ? parseFloat(updateData.balance) : updateData.balance,
        currency: updateData.currency,
        description: updateData.description,
        accountNumber: updateData.accountNumber,
        bankName: updateData.bankName
      };
      const res = await api.put(`/bank/${accountId}`, payload);
      if (res.data && res.data.data) {
  const updatedAcc = { ...res.data.data, id: res.data.data._id };
  setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAcc : acc));
        if (selectedAccount && selectedAccount.id === accountId) {
          setSelectedAccount(updatedAcc);
        }
        setIsEditAccountModalOpen(false);
        setAccountToEdit(null);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du compte bancaire');
    } finally {
      setLoading(false);
    }
  };

  // Exporter toutes les banques et transactions (format JSON simplifié)
  const exportAllData = () => {
    // Exporter exactement les colonnes du tableau des transactions
    const headers = ['Date','Nom','Description','Type','Numéro de compte','Devise','Montant','Reçu','Banque'];
    const rows = accounts.flatMap(acc => (
      (acc.transactions || [])
        .map(tx => ({
          Date: formatDateYMD(tx.date),
          Nom: (tx as any).name || '',
          Description: tx.description || '',
          Type: tx.amount > 0 ? 'Revenu' : 'Dépense',
          'Numéro de compte': (tx as any).accountNumber || '',
          Devise: (tx as any).currency || acc.currency,
          Montant: tx.amount,
          Reçu: (tx as any).receipt ? 'Oui' : 'Non',
          Banque: acc.name
        }))
    ));
    const filenameBase = `export_banques_${new Date().toISOString().slice(0,10)}`;
    exportData(exportFormat, rows, filenameBase, null, headers);
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedAccount || !selectedAccount.transactions) return [];
    return selectedAccount.transactions
      .filter((tx: any) => 
        (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.name && tx.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.accountNumber && tx.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [selectedAccount, searchTerm]);

  const transactionSummary = useMemo(() => {
    const revenues = filteredTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = filteredTransactions
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    return {
      revenues,
      expenses
    };
  }, [filteredTransactions]);

  const AccountDetails = ({ account }: { account: BankAccount }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Détails du compte</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Nom de la banque</h4>
          <p className="text-lg font-semibold text-gray-900">{account.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Type de compte</h4>
          <p className="text-lg font-semibold text-gray-900">{account.type}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Devise</h4>
          <p className="text-lg font-semibold text-gray-900">{account.currency}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Solde actuel</h4>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(account.balance, account.currency)}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium text-gray-500">Description</h4>
          <p className="text-lg font-semibold text-gray-900">{account.description}</p>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
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
          onClick={() => account.id && exportBankData(account.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Exporter les données</span>
        </button>
        <button 
          onClick={() => { setAccountToEdit(account); setIsEditAccountModalOpen(true); }}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Modifier</span>
        </button>
        <button 
          onClick={() => account.id && handleDeleteAccount(account.id)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Trash2 className="w-4 h-4" />
          <span>Supprimer</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestion Bancaire</h1>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="2024">Année 2024</option>
              <option value="2023">Année 2023</option>
              <option value="2022">Année 2022</option>
              <option value="all">Toutes les années</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowRecords(!showRecords)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md hover:bg-blue-700 transition-colors"
            >
              <span className="font-medium">{showRecords ? 'Retour aux comptes' : 'Enregistrements'}</span>
            </button>
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <button onClick={exportAllData} className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <Download className="w-5 h-5" />
              <span className="font-medium hidden md:inline">Exporter tout</span>
            </button>
            <button 
              onClick={() => setIsNewTransactionModalOpen(true)}
              disabled={!selectedAccount}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium hidden md:inline">Créer une opération</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Erreur:</strong> {error}
          </div>
        )}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setIsNewAccountModalOpen(true)}
              className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau compte</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div 
                key={account.id} 
                onClick={() => setSelectedAccount(account)}
                className={`group bg-gray-100 p-5 rounded-lg shadow border border-gray-200 cursor-pointer hover:bg-gray-200 transition-all transform hover:scale-105 ${selectedAccount?.id === account.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{account.name}</h3>
                    <p className="text-xs text-gray-600 font-medium">{account.type}</p>
                  </div>
                  <CreditCard className="w-7 h-7 text-blue-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-xl md:text-2xl font-extrabold text-green-600 mb-2">
                  {formatCurrency(account.balance, account.currency)}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{account.description}</p>
              </div>
            ))}
          </div>
          
          {/* Affichage des détails du compte sélectionné EN BAS */}
          {selectedAccount && (
            <AccountDetails account={selectedAccount} />
          )}
        </section>
        
        {selectedAccount && (
          <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedAccount(null)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Transactions du compte</h2>
                <span className="text-gray-500 text-lg">({selectedAccount.name})</span>
              </div>
            </div>
            
            {/* Section de synthèse */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
                <Banknote className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Solde actuel</h4>
                  <p className="text-xl font-bold text-blue-900">{formatCurrency(selectedAccount.balance, selectedAccount.currency)}</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
                <ArrowUpRight className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Revenus</h4>
                  <p className="text-xl font-bold text-green-900">{formatCurrency(transactionSummary.revenues, selectedAccount.currency)}</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-4">
                <ArrowDownLeft className="w-8 h-8 text-red-600" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Dépenses</h4>
                  <p className="text-xl font-bold text-red-900">{formatCurrency(Math.abs(transactionSummary.expenses), selectedAccount.currency)}</p>
                </div>
              </div>
            </div>
            
            {/* Liste des transactions */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Historique des transactions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro Compte</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devise</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reçu</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions
                      .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateYMD(transaction.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(transaction as any).name || transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(transaction as any).accountNumber || ''}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(transaction as any).currency || selectedAccount.currency}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                            <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(transaction.amount, selectedAccount.currency)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {(transaction as any).receipt ? (
                              <Image className="w-5 h-5 text-green-600" />
                            ) : (
                              <span className="text-gray-400">Aucun</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => { setSelectedTransaction(transaction); setIsNewTransactionModalOpen(true); }} className="text-blue-600 hover:text-blue-900 mr-2">
                              <Edit className="w-4 h-4 inline" />
                            </button>
                            <button onClick={() => handleDeleteTransaction((transaction as any)._id || transaction.id)} className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-lg italic">
                        Aucune transaction trouvée pour ce compte.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      
      {/* Modale "Créer un nouveau compte" */}
      {isNewAccountModalOpen && (
        <Modal title="Créer un nouveau compte" onClose={() => setIsNewAccountModalOpen(false)}>
          <NewAccountForm onSubmit={handleAddAccount} />
        </Modal>
      )}
      
      {/* Modale "Créer une nouvelle opération" avec upload de reçu */}
      {isNewTransactionModalOpen && (
        <Modal title={selectedTransaction ? "Modifier l'opération" : "Créer une nouvelle opération"} onClose={() => { setIsNewTransactionModalOpen(false); setSelectedTransaction(null); }}>
          <NewTransactionForm 
            onSubmit={selectedTransaction ? async (data) => {
              if (!selectedAccount || !selectedTransaction) return;
              setIsSubmitting(true);
              setError('');
              try {
                const res = await api.put(`/bank/${selectedAccount.id}/transactions/${selectedTransaction._id}`, data);
                if (res.data && res.data.data) {
                  const updatedAccount = { ...res.data.data, id: res.data.data._id };
                  setAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? updatedAccount : acc));
                  setSelectedAccount(updatedAccount);
                  setIsNewTransactionModalOpen(false);
                  setSelectedTransaction(null);
                }
              } catch (err: any) {
                const msg = getAxiosErrorText(err);
                setError(`Erreur lors de la mise à jour de la transaction: ${msg}`);
              } finally {
                setIsSubmitting(false);
              }
            } : handleAddTransaction} 
            selectedAccount={selectedAccount} 
            initialData={selectedTransaction || undefined}
          />
        </Modal>
      )}

      {/* Modale "Modifier le compte" */}
      {isEditAccountModalOpen && accountToEdit && (
        <Modal title="Modifier le compte" onClose={() => { setIsEditAccountModalOpen(false); setAccountToEdit(null); }}>
          <EditAccountForm 
            account={accountToEdit}
            onSubmit={(data) => accountToEdit && handleUpdateAccount(accountToEdit.id as any, data)}
          />
        </Modal>
      )}

      {/* Plus de modale de détails lors du clic sur Modifier */}
    </div>
  );
}

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4 animate-fade-in-up">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Landmark className="w-6 h-6 mr-2 text-blue-500" />
          {title}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="py-4">
        {children}
      </div>
    </div>
  </div>
);

const NewAccountForm = ({ onSubmit }: { onSubmit: (data: { name: string; accountNumber: string; type: string; balance: string; currency: string; description: string; document: string | null; bankName?: string }) => void }) => {
  const [formData, setFormData] = useState<{ name: string; accountNumber: string; type: string; balance: string; currency: string; description: string; document: string | null; bankName?: string }>({
    name: '',
    accountNumber: '',
    type: 'Compte courant',
    balance: '',
    currency: 'XAF',
    description: '',
    document: null,
  });
  
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const result = ev.target?.result as string;
        setDocumentPreview(result);
        setFormData(prev => ({ ...prev, document: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.balance) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom de la banque</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Type de compte</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option>Compte courant</option>
          <option>Compte épargne</option>
          <option>Compte entreprise</option>
          <option>Compte investissement</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro de compte</label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Devise</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="XAF">FCFA (XAF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar américain (USD)</option>
          <option value="GBP">Livre sterling (GBP)</option>
          <option value="CAD">Dollar canadien (CAD)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Solde initial</label>
        <input
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      
      {/* Upload de document */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Document (optionnel)</label>
        <div className="mt-1 flex items-center space-x-4">
          <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <FileText className="w-4 h-4" />
            <span>Ajouter un document</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleDocumentUpload}
              className="hidden"
            />
          </label>
          {documentPreview && (
            <div className="relative">
              {documentPreview.startsWith('data:image') ? (
                <img src={documentPreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setDocumentPreview(null);
                  setFormData(prev => ({ ...prev, document: null }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Ajouter le compte
        </button>
      </div>
    </form>
  );
};

const NewTransactionForm = ({ onSubmit, selectedAccount, initialData }: { onSubmit: (data: { date: string; name: string; description: string; amount: string; accountNumber: string; receipt: string | null; currency: string }) => void; selectedAccount: BankAccount | null; initialData?: any }) => {
  const [formData, setFormData] = useState<{ date: string; name: string; description: string; amount: string; accountNumber: string; receipt: string | null; currency: string}>({
    date: new Date().toISOString().slice(0, 10),
    name: '',
    description: '',
    amount: '',
    accountNumber: '',
    receipt: null,
    currency: selectedAccount?.currency || 'XAF',
  });
  
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Sync currency when selected account changes
  useEffect(() => {
    if (selectedAccount?.currency) {
      setFormData(prev => ({ ...prev, currency: selectedAccount.currency || 'XAF' }));
    }
  }, [selectedAccount?.currency]);

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date ? formatDateYMD(initialData.date) : new Date().toISOString().slice(0, 10),
        name: initialData.name || '',
        description: initialData.description || '',
        amount: initialData.amount != null ? String(initialData.amount) : '',
        accountNumber: initialData.accountNumber || '',
        receipt: initialData.receipt || null,
        currency: initialData.currency || selectedAccount?.currency || 'XAF'
      });
      setReceiptPreview(initialData.receipt || null);
    }
  }, [initialData, selectedAccount?.currency]);
  
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const result = ev.target?.result as string;
        setReceiptPreview(result);
        setFormData(prev => ({ ...prev, receipt: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      onSubmit({ ...formData });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Devise</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="XAF">FCFA (XAF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar américain (USD)</option>
          <option value="GBP">Livre sterling (GBP)</option>
          <option value="CAD">Dollar canadien (CAD)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {selectedAccount && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Compte bancaire</label>
          <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
            {selectedAccount.name} ({selectedAccount.type})
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro de compte</label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Montant</label>
        <p className="text-xs text-gray-500 mb-1">Utilisez un signe - pour les dépenses (ex: -150000)</p>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Upload de reçu */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Reçu (optionnel)</label>
        <div className="mt-1 flex items-center space-x-4">
          <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <Camera className="w-4 h-4" />
            <span>Ajouter un reçu</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleReceiptUpload}
              className="hidden"
            />
          </label>
          {receiptPreview && (
            <div className="relative">
              {receiptPreview.startsWith('data:image') ? (
                <img src={receiptPreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setReceiptPreview(null);
                  setFormData(prev => ({ ...prev, receipt: null }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {initialData ? "Mettre à jour l'opération" : "Enregistrer l'opération"}
        </button>
      </div>
    </form>
  );
};

const EditAccountForm = ({ account, onSubmit }: { account: any; onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState<{ name: string; type: string; currency: string; balance: number | string; description: string }>({
    name: account?.name || '',
    type: account?.type || 'Compte courant',
    currency: account?.currency || 'XAF',
    balance: account?.balance || 0,
    description: account?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'balance' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom de la banque</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type de compte</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option>Compte courant</option>
          <option>Compte épargne</option>
          <option>Compte projet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Devise</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="XAF">FCFA (XAF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar américain (USD)</option>
          <option value="GBP">Livre sterling (GBP)</option>
          <option value="CAD">Dollar canadien (CAD)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Solde</label>
        <input
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};

const TransactionDetails = ({ transaction, currency }: { transaction: any; currency: string }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Date</h4>
          <p className="text-lg font-semibold text-gray-900">{transaction.date}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Nom</h4>
          <p className="text-lg font-semibold text-gray-900">{transaction.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Type</h4>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {transaction.type}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Montant</h4>
          <p className={`text-lg font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(transaction.amount, currency)}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium text-gray-500">Description</h4>
          <p className="text-lg font-semibold text-gray-900">{transaction.description}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium text-gray-500">Numéro de compte</h4>
          <p className="text-lg font-semibold text-gray-900">{transaction.accountNumber}</p>
        </div>
      </div>
      {transaction.receipt ? (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Reçu</h4>
          {String(transaction.receipt).startsWith('data:image') ? (
            <img src={transaction.receipt} alt="Reçu" className="w-full max-h-96 object-contain rounded border" />
          ) : (
            <a
              href={transaction.receipt}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Ouvrir le reçu
            </a>
          )}
        </div>
      ) : (
        <div className="text-gray-500 italic">Aucun reçu</div>
      )}
    </div>
  );
};