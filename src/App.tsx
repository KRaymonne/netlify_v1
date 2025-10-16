import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Personnel } from './pages/Personnel';
import { Contacts } from './pages/Contacts';
import { EquipmentPage } from './pages/Equipment';
import { Vehicles } from './pages/Vehicles';
import { Alerts } from './pages/Alerts';
import { Offers } from './pages/Offers';
import { BusinessPage } from './pages/Business';
import { Invoices } from './pages/Invoices';
import { Login } from './pages/login';
import { UsersCreate } from './pages/UsersCreate';
import { UsersList } from './pages/UsersList';
import { Banks } from './pages/Banks';
import { CashRegisters } from './pages/CashRegisters';
import { Taxes } from './pages/Taxes';

// Import des pages List
import { BanksList } from './pages/BanksList';
import { BusinessList } from './pages/businessList';
import { CashRegistersList } from './pages/CashRegistersList';
import { ContactsList } from './pages/ContactsList';
import { EquipmentsList } from './pages/EquipmentsList';
import { InvoicesList } from './pages/InvoicesList';
import { OffersList } from './pages/OffersList';
import { PersonnelList } from './pages/PersonnelList';
import { TaxesList } from './pages/TaxesList';
import { VehiclesList } from './pages/VehiclesList';

// Import des pages Create
import { BanksCreate } from './pages/BanksCreate';
import { BusinessCreate } from './pages/businessCreate';
import { CashRegistersCreate } from './pages/CashRegistersCreate';
import { ContactsCreate } from './pages/ContactsCreate';
import { EquipmentsCreate } from './pages/EquipmentsCreate';
import { InvoicesCreate } from './pages/InvoicesCreate';
import { OffersCreate } from './pages/OffersCreate';
import { PersonnelCreate } from './pages/PersonnelCreate';
import { TaxesCreate } from './pages/TaxesCreate';
import { VehiclesCreate } from './pages/VehiclesCreate';
import { RedirectHandler } from './components/RedirectHandler';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <Router>
        <RedirectHandler />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="personnel" element={<Personnel />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="equipements" element={<EquipmentPage />} />
              <Route path="offres" element={<Offers />} />
              <Route path="affaires" element={<BusinessPage />} />
              <Route path="alertes" element={<Alerts />} />
              <Route path="parc-auto" element={<Vehicles />} />
              <Route path="factures" element={<Invoices />} />
              <Route path="banques" element={<Banks />} />
              <Route path="caisses" element={<CashRegisters />} />
              <Route path="impots" element={<Taxes />} />
              <Route path="login" element={<Login/>} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/create" element={<UsersCreate />} />
              
              {/* Routes pour les pages List */}
              <Route path="banks/list" element={<BanksList />} />
              <Route path="business/list" element={<BusinessList />} />
              <Route path="cash-registers/list" element={<CashRegistersList />} />
              <Route path="contacts/list" element={<ContactsList />} />
              <Route path="equipments/list" element={<EquipmentsList />} />
              <Route path="invoices/list" element={<InvoicesList />} />
              <Route path="offers/list" element={<OffersList />} />
              <Route path="personnel/list" element={<PersonnelList />} />
              <Route path="taxes/list" element={<TaxesList />} />
              <Route path="vehicles/list" element={<VehiclesList />} />
              
              {/* Routes pour les pages Create */}
              <Route path="banks/create" element={<BanksCreate />} />
              <Route path="business/create" element={<BusinessCreate />} />
              <Route path="cash-registers/create" element={<CashRegistersCreate />} />
              <Route path="contacts/create" element={<ContactsCreate />} />
              <Route path="equipments/create" element={<EquipmentsCreate />} />
              <Route path="invoices/create" element={<InvoicesCreate />} />
              <Route path="offers/create" element={<OffersCreate />} />
              <Route path="personnel/create" element={<PersonnelCreate />} />
              <Route path="taxes/create" element={<TaxesCreate />} />
              <Route path="vehicles/create" element={<VehiclesCreate />} />
            </Route>
            {/* Route 404 pour toutes les autres URLs */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;