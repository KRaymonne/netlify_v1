import React, { useEffect, useState } from 'react';

type Tax = {
  id: number;
  name: string;
  description?: string | null;
  rate: number;
  type: string;
  status: string;
  createdAt: string;
};

export function TaxesList() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/taxes');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setTaxes(data);
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
        <h1 className="text-2xl font-semibold">Taxes</h1>
        <a href="/taxes/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
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
                <th className="p-2 border">Taux (%)</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map(tax => (
                <tr key={tax.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{tax.id}</td>
                  <td className="p-2 border">{tax.name}</td>
                  <td className="p-2 border">{tax.type}</td>
                  <td className="p-2 border">{(tax.rate * 100).toFixed(2)}%</td>
                  <td className="p-2 border">{tax.description || '-'}</td>
                  <td className="p-2 border">{tax.status}</td>
                  <td className="p-2 border">{new Date(tax.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
