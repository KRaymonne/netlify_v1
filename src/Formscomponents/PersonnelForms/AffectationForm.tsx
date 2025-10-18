import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
}

interface AffectationFormData {
  userId: number;
  workLocation: string;
  site: string;
  affectationtype: string;
  description: string;
  startDate: string;
  endDate: string;
  attached_file: string;
}

export function AffectationForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<AffectationFormData>({
    userId: 0,
    workLocation: '',
    site: '',
    affectationtype: '',
    description: '',
    startDate: '',
    endDate: '',
    attached_file: ''
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
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/.netlify/functions/affectations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création de l\'affectation');
      }

      setSuccess('Affectation créée avec succès');
      setFormData({
        userId: 0,
        workLocation: '',
        site: '',
        affectationtype: '',
        description: '',
        startDate: '',
        endDate: '',
        attached_file: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const isPermanentType = formData.affectationtype === 'PERMANENT';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Créer une Affectation</h2>
      
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
              Type d'affectation <span className="text-red-500">*</span>
            </label>
            <select
              name="affectationtype"
              value={formData.affectationtype}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner le type</option>
              <option value="PERMANENT">Permanente</option>
              <option value="TEMPORARY">Temporaire</option>
              <option value="TRANSFER">Mutation</option>
              <option value="PROJECT_BASED">Basée sur un projet</option>
              <option value="SPECIAL_ASSIGNMENT">Mission spéciale</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de travail <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="workLocation"
              value={formData.workLocation}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: Abidjan, Côte d'Ivoire"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="site"
              value={formData.site}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: Siège social, Bureau principal"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Décrivez la raison de cette affectation..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              disabled={isPermanentType}
              className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isPermanentType ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
            {isPermanentType && (
              <p className="text-xs text-gray-500 mt-1">Les affectations permanentes n'ont pas de date de fin</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document d'affectation
          </label>
          <input
            type="file"
            name="attached_file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({ ...prev, attached_file: file.name }));
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
              workLocation: '',
              site: '',
              affectationtype: '',
              description: '',
              startDate: '',
              endDate: '',
              attached_file: ''
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
            {loading ? 'Création...' : 'Créer l\'affectation'}
          </button>
        </div>
      </form>
    </div>
  );
}
