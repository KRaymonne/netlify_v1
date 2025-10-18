import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
}

interface SanctionFormData {
  userId: number;
  sanctionType: string;
  reason: string;
  sanctionDate: string;
  durationDays: number;
  decision: string;
  supportingDocument: string;
}

export function SanctionForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<SanctionFormData>({
    userId: 0,
    sanctionType: '',
    reason: '',
    sanctionDate: '',
    durationDays: 0,
    decision: '',
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
      [name]: name === 'durationDays' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/.netlify/functions/sanctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création de la sanction');
      }

      setSuccess('Sanction créée avec succès');
      setFormData({
        userId: 0,
        sanctionType: '',
        reason: '',
        sanctionDate: '',
        durationDays: 0,
        decision: '',
        supportingDocument: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const isWarningType = formData.sanctionType === 'WARNING';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Créer une Sanction</h2>
      
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
              Type de sanction <span className="text-red-500">*</span>
            </label>
            <select
              name="sanctionType"
              value={formData.sanctionType}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner le type</option>
              <option value="WARNING">Avertissement</option>
              <option value="SUSPENSION">Suspension</option>
              <option value="DEMOTION">Rétrogradation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raison <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Décrivez la raison de cette sanction..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de sanction <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="sanctionDate"
              value={formData.sanctionDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée (en jours)
            </label>
            <input
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleInputChange}
              min="0"
              disabled={isWarningType}
              className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isWarningType ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder={isWarningType ? 'Non applicable pour un avertissement' : '0'}
            />
            {isWarningType && (
              <p className="text-xs text-gray-500 mt-1">Les avertissements n'ont pas de durée</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Décision
          </label>
          <textarea
            name="decision"
            value={formData.decision}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Détails de la décision finale..."
          />
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
              sanctionType: '',
              reason: '',
              sanctionDate: '',
              durationDays: 0,
              decision: '',
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
            {loading ? 'Création...' : 'Créer la sanction'}
          </button>
        </div>
      </form>
    </div>
  );
}
