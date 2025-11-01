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

              {/* Protected routes - Only accessible by SUPER_ADMIN and ADMIN */}
              <Route path="/home" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="personnel" element={<Personnel />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="equipements" element={<Equipment />} />
                <Route path="offres" element={<Offers />} />
                <Route path="affaires" element={<Business />} />
                <Route path="alertes" element={<Alerts />} />
                <Route path="parc-auto" element={<Vehicles />} />
                <Route path="factures" element={<Invoices />} />
                <Route path="banques" element={<Banks />} />
                <Route path="registres" element={<Register />} />
                <Route path="impots" element={<Taxes />} />
                <Route path="users/create" element={<UsersCreate />} />
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