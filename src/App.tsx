import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Personnel } from './pages/Personnel';
import { Contacts } from './pages/Contacts';
import Alerts from './pages/Alerts';
import Offers from './pages/Offers';
import Business from './pages/Business';
import Invoices from './pages/Invoices';
import { Banks } from './pages/Banks';
import Taxes from './pages/Taxes';
import { RedirectHandler } from './components/RedirectHandler';
import { NotFound } from './pages/NotFound';
import Vehicles from './pages/Vehicles';
import { UsersCreate } from './Formscomponents/PersonnelForms/UsersCreate';
import Equipment from './pages/Equipment';
import Register from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import { RoleBasedDashboard } from './pages/RoleBasedDashboard';
import { Home } from './pages/Home';



function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <RedirectHandler />
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Redirect root to signin */}
              <Route path="/" element={<Navigate to="/signin" replace />} />
              
              {/* Public routes - Redirigent vers dashboard si déjà connecté */}
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              <Route path="/signin" element={
                <PublicRoute>
                  <Signin />
                </PublicRoute>
              } />

              {/* Dashboard route */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              } />

              {/* Protected routes with role-based access */}
              <Route path="/home" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF']}>
                    <Home />
                  </ProtectedRoute>
                } />
                {/* Personnel - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT */}
                <Route path="personnel" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT']}>
                    <Personnel />
                  </ProtectedRoute>
                } />
                {/* Contacts - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="contacts" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Contacts />
                  </ProtectedRoute>
                } />
                {/* Equipements - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="equipements" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Equipment />
                  </ProtectedRoute>
                } />
                {/* Offres - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="offres" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Offers />
                  </ProtectedRoute>
                } />
                {/* Affaires - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="affaires" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Business />
                  </ProtectedRoute>
                } />
                {/* Alertes - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="alertes" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Alerts />
                  </ProtectedRoute>
                } />
                {/* Parc Auto - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="parc-auto" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Vehicles />
                  </ProtectedRoute>
                } />
                {/* Factures - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, SECRETARY, ACCOUNTANT, EMPLOYEE */}
                <Route path="factures" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'SECRETARY', 'ACCOUNTANT', 'EMPLOYEE']}>
                    <Invoices />
                  </ProtectedRoute>
                } />
                {/* Banques - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, ACCOUNTANT */}
                <Route path="banques" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'ACCOUNTANT']}>
                    <Banks />
                  </ProtectedRoute>
                } />
                {/* Registres - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, ACCOUNTANT */}
                <Route path="registres" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'ACCOUNTANT']}>
                    <Register />
                  </ProtectedRoute>
                } />
                {/* Impôts - Accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF, ACCOUNTANT */}
                <Route path="impots" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF', 'ACCOUNTANT']}>
                    <Taxes />
                  </ProtectedRoute>
                } />
                {/* Users Create - Only accessible by: SUPER_ADMIN, ADMIN, DIRECTEUR_TECHNIQUE, DIRECTEUR_ADMINISTRATIF */}
                <Route path="users/create" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_ADMINISTRATIF']}>
                    <UsersCreate />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Route 404 pour toutes les autres URLs */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;