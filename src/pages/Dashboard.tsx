import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, Building, Truck, AlertTriangle,
  DollarSign, Calendar, FileText, Settings, Bell, Search,
  ArrowUp, ArrowDown, Activity, Target, Zap, Shield, Download
} from 'lucide-react';
import ApiConnectionTest from '../components/ApiConnectionTest';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Données de performance
  const kpiData = [
    {
      title: "Chiffre d'affaires",
      value: "524,000",
      unit: "FCFA",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Employés actifs",
      value: "3",
      unit: "",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Alertes en cours",
      value: "3",
      unit: "",
      change: "-2",
      trend: "down",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      title: "Croissance",
      value: "8.2%",
      unit: "",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  // Données évolution des ventes
  const salesData = [
    { month: 'Jan', objectif: 65000, ventes: 68000, budget: 60000 },
    { month: 'Fév', objectif: 70000, ventes: 75000, budget: 65000 },
    { month: 'Mar', objectif: 75000, ventes: 78000, budget: 70000 },
    { month: 'Avr', objectif: 80000, ventes: 85000, budget: 75000 },
    { month: 'Mai', objectif: 82000, ventes: 88000, budget: 78000 },
    { month: 'Jun', objectif: 85000, ventes: 92000, budget: 80000 }
  ];

  // Données équipements
  const equipmentData = [
    { name: 'Disponible', value: 50, color: '#22c55e' },
    { name: 'En utilisation', value: 50, color: '#3b82f6' },
    { name: 'Maintenance', value: 0, color: '#ef4444' }
  ];

  // Données financières par catégorie
  const financialData = [
    { category: 'Personnel', montant: 6650000, pourcentage: 35 },
    { category: 'Fournitures', montant: 2880000, pourcentage: 15 },
    { category: 'Services', montant: 4965000, pourcentage: 26 },
    { category: 'Taxes', montant: 3250000, pourcentage: 17 },
    { category: 'Autres', montant: 1305000, pourcentage: 7 }
  ];

  // Données de trésorerie
  const cashFlowData = [
    { month: 'Jan', entrees: 12500000, sorties: 8200000, solde: 4300000 },
    { month: 'Fév', entrees: 15200000, sorties: 9800000, solde: 5400000 },
    { month: 'Mar', entrees: 18700000, sorties: 11200000, solde: 7500000 },
    { month: 'Avr', entrees: 16800000, sorties: 10500000, solde: 6300000 },
    { month: 'Mai', entrees: 19200000, sorties: 12800000, solde: 6400000 },
    { month: 'Jun', entrees: 22100000, sorties: 14200000, solde: 7900000 }
  ];

  // Alertes récentes avec priorités
  const alertes = [
    {
      id: 1,
      type: "Échéance contrat TechCorp",
      description: "Renouvellement du contrat annuel",
      echeance: "2024-03-30",
      priorite: "Urgent",
      status: "urgent"
    },
    {
      id: 2,
      type: "Maintenance véhicule AB-123-CD",
      description: "Révision des 20 000 km",
      echeance: "2024-02-15",
      priorite: "Moyen",
      status: "moyen"
    },
    {
      id: 3,
      type: "Renouvellement assurance véhicules",
      description: "Police d'assurance flotte",
      echeance: "2024-04-01",
      priorite: "Urgent",
      status: "urgent"
    },
    {
      id: 4,
      type: "Formation sécurité personnel",
      description: "Mise à jour certification",
      echeance: "2024-03-15",
      priorite: "Normal",
      status: "normal"
    }
  ];

  // Projets en cours
  const projetsEnCours = [
    {
      nom: "Construction Route N°4",
      avancement: 75,
      budget: 85000000,
      utilise: 63750000,
      echeance: "2024-06-30",
      status: "en_cours"
    },
    {
      nom: "Réhabilitation Pont Wouri",
      avancement: 45,
      budget: 120000000,
      utilise: 54000000,
      echeance: "2024-09-15",
      status: "en_cours"
    },
    {
      nom: "Terrassement Zone Industrielle",
      avancement: 90,
      budget: 65000000,
      utilise: 58500000,
      echeance: "2024-04-20",
      status: "finalisation"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA');
  };

  // Fonction pour exporter les rapports
  const handleExport = (period: string) => {
    // Dans une application réelle, on enverrait une requête au serveur
    // pour générer le rapport dans le format choisi
    console.log(`Exporting ${exportFormat} report for period: ${period}`);
    
    // Simulation de téléchargement
    alert(`Rapport ${period} exporté en format ${exportFormat.toUpperCase()}`);
  };

  const KPICard = ({ title, value, unit, change, trend, icon: Icon, color }: {
    title: string;
    value: string;
    unit: string;
    change: string;
    trend: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value} <span className="text-lg text-gray-500">{unit}</span>
          </p>
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            <span>{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${
          color === 'green' ? 'bg-green-100' :
          color === 'blue' ? 'bg-blue-100' :
          color === 'orange' ? 'bg-orange-100' :
          'bg-purple-100'
        }`}>
          <Icon className={`w-8 h-8 ${
            color === 'green' ? 'text-green-600' :
            color === 'blue' ? 'text-blue-600' :
            color === 'orange' ? 'text-orange-600' :
            'text-purple-600'
          }`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vue d'ensemble des performances de l'entreprise</h2>
          </div>
          
          {/* Contrôles d'export */}
          <div className="flex items-center space-x-4">
            <select className="border rounded p-2">
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i; // années décroissantes (actuelle → -10 ans)
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            
            <button 
              onClick={() => handleExport(selectedPeriod)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>

        {/* Test de connexion API */}
        <div className="mb-8">
          <ApiConnectionTest />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Évolution des ventes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Évolution des ventes</h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Ventes réalisées</span>
                <div className="w-3 h-3 bg-gray-400 rounded ml-4"></div>
                <span>Objectifs</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="objectif" fill="#9ca3af" />
                <Bar dataKey="ventes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* État des équipements */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">État des équipements</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={equipmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {equipmentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {equipmentData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Répartition des dépenses */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des dépenses</h3>
            <div className="space-y-4">
              {financialData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-gray-600">{item.pourcentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.pourcentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.montant)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projets en cours */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Projets en cours</h3>
            <div className="space-y-4">
              {projetsEnCours.map((projet, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{projet.nom}</h4>
                      <p className="text-sm text-gray-600">Échéance: {projet.echeance}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      projet.status === 'finalisation' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {projet.avancement}% complété
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{projet.avancement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          projet.status === 'finalisation' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${projet.avancement}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Budget total:</span>
                      <div className="font-medium">{formatCurrency(projet.budget)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Utilisé:</span>
                      <div className="font-medium">{formatCurrency(projet.utilise)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution trésorerie */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution de la trésorerie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Area 
                  type="monotone" 
                  dataKey="entrees" 
                  stackId="1" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="sorties" 
                  stackId="2" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Alertes récentes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Alertes récentes</h3>
            <div className="space-y-4">
              {alertes.map((alerte) => (
                <div key={alerte.id} className="flex items-start space-x-3 p-3 rounded-lg border-l-4 border-l-orange-400 bg-gray-50">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alerte.status === 'urgent' ? 'text-red-500' :
                    alerte.status === 'moyen' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alerte.type}</p>
                    <p className="text-sm text-gray-600">{alerte.description}</p>
                    <p className="text-xs text-gray-500">Échéance: {alerte.echeance}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alerte.status === 'urgent' ? 'bg-red-100 text-red-800' :
                    alerte.status === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alerte.priorite}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}