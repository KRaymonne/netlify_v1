import React, { useEffect, useState } from 'react';

type Equipment = {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  status: string;
  createdAt: string;
};

export function EquipmentsList() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/equipments');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setEquipments(data);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Équipements</h1>
        <a href="/equipments/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Nom</th>
                <th className="p-2 border">Catégorie</th>
                <th className="p-2 border">Marque</th>
                <th className="p-2 border">Modèle</th>
                <th className="p-2 border">Prix d'achat</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map(equipment => (
                <tr key={equipment.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{equipment.id}</td>
                  <td className="p-2 border">{equipment.name}</td>
                  <td className="p-2 border">{equipment.category}</td>
                  <td className="p-2 border">{equipment.brand || '-'}</td>
                  <td className="p-2 border">{equipment.model || '-'}</td>
                  <td className="p-2 border">{equipment.purchasePrice ? equipment.purchasePrice.toLocaleString() : '-'}</td>
                  <td className="p-2 border">{equipment.status}</td>
                  <td className="p-2 border">{new Date(equipment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
