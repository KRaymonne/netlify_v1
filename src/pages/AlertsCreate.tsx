import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';

export function AlertsCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [type, setType] = useState('Facture Client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const alertTypes = [
    "Facture Client",
    "Facture Fournisseur", 
    "Personnel",
    "Parc auto",
    "Équipement",
    "Affaire/Chantier"
  ];

  const priorityLevels = [
    { value: 'high', label: 'Élevée' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'low', label: 'Faible' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/.netlify/functions/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          dueDate, 
          priority, 
          type
          // Le statut est géré par défaut par l'API
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création');
      }
      
      setSuccess('Alerte créée avec succès');
      // Réinitialiser le formulaire
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setType('Facture Client');
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-red-500" />
        Créer une alerte
      </h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre de l'alerte *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ex: Échéance facture client"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 h-24"
            placeholder="Description détaillée de l'alerte"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Date d'échéance *</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Priorité</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {priorityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Type d'alerte *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            {alertTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded flex items-center disabled:opacity-60"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'En cours...' : 'Créer'}
        </button>
      </form>
    </div>
  );
}