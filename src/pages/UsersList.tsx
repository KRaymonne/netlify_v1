import React, { useEffect, useState } from 'react';

type User = {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department: string;
  workcountry: string;
  hireDate: string | null;
  createdAt: string;
};

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/users');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setUsers(data);
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
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <a href="/users/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Matricule</th>
                <th className="p-2 border">Prénom</th>
                <th className="p-2 border">Nom</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Rôle</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Département</th>
                <th className="p-2 border">Pays</th>
                <th className="p-2 border">Embauché le</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{u.id}</td>
                  <td className="p-2 border">{u.employeeNumber}</td>
                  <td className="p-2 border">{u.firstName}</td>
                  <td className="p-2 border">{u.lastName}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">{u.status}</td>
                  <td className="p-2 border">{u.department}</td>
                  <td className="p-2 border">{u.workcountry}</td>
                  <td className="p-2 border">{u.hireDate ? new Date(u.hireDate).toLocaleDateString() : '-'}</td>
                  <td className="p-2 border">{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


