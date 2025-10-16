import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Contact, Wrench, Package, 
  Briefcase, AlertTriangle, Car, FileText, 
  Banknote, Wallet, Calculator, Building2
} from 'lucide-react';

const menuItems = [
  { icon:Building2, label: 'Login', path: '/login' },
  { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/' },
  { icon: Users, label: 'Personnel', path: '/personnel' },
  { icon: Contact, label: 'Contacts', path: '/contacts' },
  { icon: Wrench, label: 'Équipements', path: '/equipements' },
  { icon: Package, label: 'Offres', path: '/offres' },
  { icon: Briefcase, label: 'Affaires', path: '/affaires' },
  { icon: AlertTriangle, label: 'Alertes Échéances', path: '/alertes' },
  { icon: Car, label: 'Parc Auto', path: '/parc-auto' },
  { icon: FileText, label: 'Factures', path: '/factures' },
  { icon: Banknote, label: 'Banques', path: '/banques' },
  { icon: Wallet, label: 'Caisses', path: '/caisses' },
  { icon: Calculator, label: 'Impôts et Taxes', path: '/impots' },
];

interface SidebarProps {
  country: string;
}

export function Sidebar({ country }: SidebarProps) {
  const location = useLocation();
  const [logoPath, setLogoPath] = useState('https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  const [companyName, setCompanyName] = useState('SITINFRA');

  useEffect(() => {
    // Mettre à jour le logo et le nom de l'entreprise lorsque le pays change
    switch(country) {
      case 'cameroun':
        setLogoPath('/image/logo_sitinfra_C.png');
        setCompanyName('SITINFRA');
        break;
      case 'coteIvoire':
        setLogoPath('/image/logo_sitinfra_CI.png');
        setCompanyName('SITINFRA');
        break;
      case 'italie':
      case 'romanie':
      case 'sierraLeone':
        setLogoPath('/image/logo_sitinfra_I.png');
        setCompanyName('SITALIA');
        break;
      case 'benin':
      case 'togo':
        setLogoPath('/image/geotop.png');
        setCompanyName('GEOTOP');
        break;
      default:
        setLogoPath('/image/logo_sitinfra_C.png');
        setCompanyName('SITINFRA');
    }
  }, [country]);

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Logo de l'entreprise */}
          <img 
            src={logoPath} 
            alt={`Logo ${companyName}`} 
            className="w-12 h-12 object-contain" 
            onError={(e) => {
              console.error(`Erreur de chargement du logo: ${logoPath}`);
              e.currentTarget.src = 'image/logo_sitinfra_C.png'; // Image de secours
            }}
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">{companyName}</h1>
            <p className="text-xs text-gray-500 capitalize">{country}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}