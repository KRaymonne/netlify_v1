import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
}

interface MedicalRecordFormData {
  userId: number;
  visitDate: string;
  description: string;
  diagnosis: string;
  testsPerformed: string;
  testResults: string;
  prescribedAction: string;
  notes: string;
  nextVisitDate: string;
  medicalFile: string;
}

export function MedicalRecordForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    userId: 0,
    visitDate: '',
    description: '',
    diagnosis: '',
    testsPerformed: '',
    testResults: '',
    prescribedAction: '',
    notes: '',
    nextVisitDate: '',
    medicalFile: ''
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
      const res = await fetch('/.netlify/functions/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création du dossier médical');
      }

      setSuccess('Dossier médical créé avec succès');
      setFormData({
        userId: 0,
        visitDate: '',
        description: '',
        diagnosis: '',
        testsPerformed: '',
        testResults: '',
        prescribedAction: '',
        notes: '',
        nextVisitDate: '',
        medicalFile: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Créer un Dossier Médical</h2>
      
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
              Date de visite <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description de la visite
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Décrivez les symptômes ou la raison de la visite..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnostic
          </label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Diagnostic médical..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tests effectués
            </label>
            <textarea
              name="testsPerformed"
              value={formData.testsPerformed}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Liste des tests effectués..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Résultats des tests
            </label>
            <textarea
              name="testResults"
              value={formData.testResults}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Résultats des tests..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action prescrite
          </label>
          <textarea
            name="prescribedAction"
            value={formData.prescribedAction}
            onChange={handleInputChange}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Médicaments prescrits, traitement recommandé..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes médicales
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Notes supplémentaires du médecin..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prochaine visite
          </label>
          <input
            type="date"
            name="nextVisitDate"
            value={formData.nextVisitDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fichier médical
          </label>
          <input
            type="file"
            name="medicalFile"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({ ...prev, medicalFile: file.name }));
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
              visitDate: '',
              description: '',
              diagnosis: '',
              testsPerformed: '',
              testResults: '',
              prescribedAction: '',
              notes: '',
              nextVisitDate: '',
              medicalFile: ''
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
            {loading ? 'Création...' : 'Créer le dossier médical'}
          </button>
        </div>
      </form>
    </div>
  );
}
