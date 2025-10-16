import React, { useEffect, useState } from 'react';

type Offer = {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  validUntil: string;
  status: string;
  createdAt: string;
};

export function OffersList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/offers');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setOffers(data);
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
        <h1 className="text-2xl font-semibold">Offres</h1>
        <a href="/offers/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Titre</th>
                <th className="p-2 border">Prix</th>
                <th className="p-2 border">Devise</th>
                <th className="p-2 border">Valide jusqu'au</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{offer.id}</td>
                  <td className="p-2 border">{offer.title}</td>
                  <td className="p-2 border">{offer.price.toLocaleString()}</td>
                  <td className="p-2 border">{offer.currency}</td>
                  <td className="p-2 border">{new Date(offer.validUntil).toLocaleDateString()}</td>
                  <td className="p-2 border">{offer.status}</td>
                  <td className="p-2 border">{new Date(offer.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
