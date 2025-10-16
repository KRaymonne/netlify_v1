import React, { useEffect, useState } from 'react';

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  address?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
};

export function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/contacts');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setContacts(data);
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
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <a href="/contacts/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Nom complet</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Téléphone</th>
                <th className="p-2 border">Entreprise</th>
                <th className="p-2 border">Poste</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{contact.id}</td>
                  <td className="p-2 border">{contact.firstName} {contact.lastName}</td>
                  <td className="p-2 border">{contact.email || '-'}</td>
                  <td className="p-2 border">{contact.phone || '-'}</td>
                  <td className="p-2 border">{contact.company || '-'}</td>
                  <td className="p-2 border">{contact.position || '-'}</td>
                  <td className="p-2 border">{contact.status}</td>
                  <td className="p-2 border">{new Date(contact.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
