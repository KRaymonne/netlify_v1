import React, { useEffect, useState } from 'react';

type CashRegister = {
  id: number;
  name: string;
  location?: string | null;
  initialAmount: number;
  currentAmount: number;
  currency: string;
  status: string;
  createdAt: string;
};

export function CashRegistersList() {
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/cash-registers');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setCashRegisters(data);
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
        <h1 className="text-2xl font-semibold">Caisses</h1>
        <a href="/cash-registers/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
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
                <th className="p-2 border">Localisation</th>
                <th className="p-2 border">Montant initial</th>
                <th className="p-2 border">Montant actuel</th>
                <th className="p-2 border">Devise</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {cashRegisters.map(cashRegister => (
                <tr key={cashRegister.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{cashRegister.id}</td>
                  <td className="p-2 border">{cashRegister.name}</td>
                  <td className="p-2 border">{cashRegister.location || '-'}</td>
                  <td className="p-2 border">{cashRegister.initialAmount.toLocaleString()}</td>
                  <td className="p-2 border">{cashRegister.currentAmount.toLocaleString()}</td>
                  <td className="p-2 border">{cashRegister.currency}</td>
                  <td className="p-2 border">{cashRegister.status}</td>
                  <td className="p-2 border">{new Date(cashRegister.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
