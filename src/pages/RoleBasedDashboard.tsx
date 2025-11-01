import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SuperAdminDashboard } from './dashboard/SuperAdminDashboard';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { DirectorDashboard } from './dashboard/DirectorDashboard';
import { EmployeeDashboard } from './dashboard/EmployeeDashboard';
import { SecretaryDashboard } from './dashboard/SecretaryDashboard';

export function RoleBasedDashboard() {
  const { role } = useAuth();

  switch (role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DIRECTOR':
      return <DirectorDashboard />;
    case 'EMPLOYEE':
      return <EmployeeDashboard />;
    case 'SECRETARY':
      return <SecretaryDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
            <p className="text-gray-600">Vous n'avez pas les permissions nécessaires.</p>
          </div>
        </div>
      );
  }
}

