import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
}

interface BonusFormData {
  userId: number;
  bonusType: string;
  amount: number;
  currency: string;
  awardDate: string;
  reason: string;
  paymentMethod: string;
  status: string;
  supportingDocument: string;
}

export function BonusForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<BonusFormData>({
    userId: 0,
    bonusType: '',
    amount: 0,
    currency: 'XOF',
    awardDate: '',
    reason: '',
    paymentMethod: '',
    status: 'PENDING',
    supportingDocument: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('/.netlify/functions/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };
    loadUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/.netlify/functions/bonuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création de la prime');
      }

      setSuccess('Prime créée avec succès');
      setFormData({
        userId: 0,
        bonusType: '',
        amount: 0,
        currency: 'XOF',
        awardDate: '',
        reason: '',
        paymentMethod: '',
        status: 'PENDING',
        supportingDocument: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Créer une Prime</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employé <span className="text-red-500">*</span>
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Sélectionner un employé</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de prime <span className="text-red-500">*</span>
            </label>
            <select
              name="bonusType"
              value={formData.bonusType}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner le type</option>
              <option value="PERFORMANCE">Prime de performance</option>
              <option value="SENIORITY">Prime d'ancienneté</option>
              <option value="SPECIAL">Prime spéciale</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise <span className="text-red-500">*</span>
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="XOF">XOF (Franc CFA)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="USD">USD (Dollar US)</option>
              <option value="GHS">GHS (Cedi Ghanéen)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'attribution <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="awardDate"
              value={formData.awardDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raison
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Décrivez la raison de cette prime..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Méthode de paiement <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner la méthode</option>
              <option value="CASH">Espèces</option>
              <option value="BANK_TRANSFER">Virement bancaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvée</option>
              <option value="REJECTED">Rejetée</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document justificatif
          </label>
          <input
            type="file"
            name="supportingDocument"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({ ...prev, supportingDocument: file.name }));
              }
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setFormData({
              userId: 0,
              bonusType: '',
              amount: 0,
              currency: 'XOF',
              awardDate: '',
              reason: '',
              paymentMethod: '',
              status: 'PENDING',
              supportingDocument: ''
            })}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 hover:bg-blue-700"
          >
            {loading ? 'Création...' : 'Créer la prime'}
          </button>
        </div>
      </form>
    </div>
  );
}
