import React, { useEffect, useState } from 'react';

type Invoice = {
  id: number;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: string;
  description?: string | null;
  createdAt: string;
};

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/invoices');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setInvoices(data);
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
        <h1 className="text-2xl font-semibold">Factures</h1>
        <a href="/invoices/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Numéro</th>
                <th className="p-2 border">Client</th>
                <th className="p-2 border">Montant</th>
                <th className="p-2 border">Devise</th>
                <th className="p-2 border">Date d'émission</th>
                <th className="p-2 border">Date d'échéance</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{invoice.id}</td>
                  <td className="p-2 border">{invoice.invoiceNumber}</td>
                  <td className="p-2 border">{invoice.clientName}</td>
                  <td className="p-2 border">{invoice.amount.toLocaleString()}</td>
                  <td className="p-2 border">{invoice.currency}</td>
                  <td className="p-2 border">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{invoice.status}</td>
                  <td className="p-2 border">{new Date(invoice.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
