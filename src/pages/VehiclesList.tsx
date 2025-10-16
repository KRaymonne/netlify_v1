import React, { useEffect, useState } from 'react';

type Vehicle = {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string | null;
  color?: string | null;
  mileage?: number | null;
  fuelType?: string | null;
  status: string;
  createdAt: string;
};

export function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/vehicles');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Échec du chargement');
        }
        const data = await res.json();
        setVehicles(data);
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
        <h1 className="text-2xl font-semibold">Véhicules</h1>
        <a href="/vehicles/create" className="px-3 py-2 bg-blue-600 text-white rounded">Créer</a>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Marque</th>
                <th className="p-2 border">Modèle</th>
                <th className="p-2 border">Année</th>
                <th className="p-2 border">Plaque</th>
                <th className="p-2 border">Couleur</th>
                <th className="p-2 border">Kilométrage</th>
                <th className="p-2 border">Carburant</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{vehicle.id}</td>
                  <td className="p-2 border">{vehicle.make}</td>
                  <td className="p-2 border">{vehicle.model}</td>
                  <td className="p-2 border">{vehicle.year}</td>
                  <td className="p-2 border">{vehicle.licensePlate}</td>
                  <td className="p-2 border">{vehicle.color || '-'}</td>
                  <td className="p-2 border">{vehicle.mileage ? vehicle.mileage.toLocaleString() : '-'}</td>
                  <td className="p-2 border">{vehicle.fuelType || '-'}</td>
                  <td className="p-2 border">{vehicle.status}</td>
                  <td className="p-2 border">{new Date(vehicle.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
