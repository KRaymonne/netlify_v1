import React, { useEffect, useState } from 'react';

type Bank = {
  id: number;
  name: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
};

export function BanksList() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/banks');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setBanks(data);
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
        <h1 className="text-2xl font-semibold">Comptes Bancaires</h1>
        <a href="/banks/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
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
                <th className="p-2 border">Numéro de compte</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Solde</th>
                <th className="p-2 border">Devise</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {banks.map(bank => (
                <tr key={bank.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{bank.id}</td>
                  <td className="p-2 border">{bank.name}</td>
                  <td className="p-2 border">{bank.accountNumber}</td>
                  <td className="p-2 border">{bank.accountType}</td>
                  <td className="p-2 border">{bank.balance.toLocaleString()}</td>
                  <td className="p-2 border">{bank.currency}</td>
                  <td className="p-2 border">{bank.status}</td>
                  <td className="p-2 border">{new Date(bank.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
