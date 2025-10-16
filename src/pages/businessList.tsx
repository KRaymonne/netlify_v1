import React, { useEffect, useState } from 'react';

type Business = {
  id: number;
  name: string;
  description?: string | null;
  type: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: string;
  createdAt: string;
};

export function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/businesses');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setBusinesses(data);
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
        <h1 className="text-2xl font-semibold">Affaires</h1>
        <a href="/business/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
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
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Téléphone</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(business => (
                <tr key={business.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{business.id}</td>
                  <td className="p-2 border">{business.name}</td>
                  <td className="p-2 border">{business.type}</td>
                  <td className="p-2 border">{business.email || '-'}</td>
                  <td className="p-2 border">{business.phone || '-'}</td>
                  <td className="p-2 border">{business.status}</td>
                  <td className="p-2 border">{new Date(business.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
