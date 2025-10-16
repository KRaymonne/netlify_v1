import React, { useState } from 'react';
import { 
  User, 
  AlertCircle, 
  FileText, 
  Users, 
  Car, 
  Package, 
  Briefcase, 
  TrendingUp, 
  CreditCard, 
  Building, 
  Shield,
  Plus,
  Search,
  FileDown,
  Calendar,
  File,
  FilePlus
} from 'lucide-react';

export function Personnel() {
  const [activeMainTab, setActiveMainTab] = useState('Recherche');
  const [activeTab, setActiveTab] = useState('Absences');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const menuItems = [
    { icon: User, label: 'TABLEAU DE BORD', color: 'text-blue-600' },
    { icon: AlertCircle, label: 'ALERTE ECHÉANCES', color: 'text-blue-600' },
    { icon: FileText, label: 'GESTION DES CONTRATS', color: 'text-blue-600' },
    { icon: Users, label: 'GESTION DU PERSONNEL', color: 'text-blue-600', active: true },
    { icon: Car, label: 'GESTION DU PARC AUTO', color: 'text-blue-600' },
    { icon: Package, label: 'GESTION DES ÉQUIPEMENTS', color: 'text-blue-600' },
    { icon: Briefcase, label: 'GESTION DES OFFRES', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'GESTION DES AFFAIRES', color: 'text-blue-600' },
    { icon: CreditCard, label: 'GESTION DES FACTURES', color: 'text-blue-600' },
    { icon: Building, label: 'GESTION DES BANQUES', color: 'text-blue-600' },
    { icon: Shield, label: 'GESTION DES CAISSES', color: 'text-blue-600' },
    { icon: Shield, label: 'GESTION IMPÔTS ET TAXES', color: 'text-blue-600' }
  ];

  const tabs = [
    'Informations personnelles',
    'Contrats', 
    'Affectations',
    'Absences',
    'Primes',
    'Sanctions',
    'Dossier Médical'
  ];

  // Données d'exemple pour la recherche
  const sampleData = {
    'Informations personnelles': [
      { id: 1, nom: 'Kouassi', prenom: 'Jean', dateEntree: '2023-01-15', categorie: 'Technicien', telephone: '0123456789', email: 'jean.kouassi@example.com' },
      { id: 2, nom: 'Diabaté', prenom: 'Marie', dateEntree: '2022-09-10', categorie: 'Ingénieur', telephone: '0187654321', email: 'marie.diabate@example.com' },
      { id: 3, nom: 'Traoré', prenom: 'Ahmed', dateEntree: '2023-03-20', categorie: 'Administration', telephone: '0165432198', email: 'ahmed.traore@example.com' }
    ],
    'Contrats': [
      { id: 1, employe: 'Kouassi Jean', type: 'CDI', service: 'Informatique', poste: 'Développeur', salaireNet: 450000, dateDebut: '2023-01-15' },
      { id: 2, employe: 'Diabaté Marie', type: 'CDI', service: 'Ingénierie', poste: 'Ingénieur Civil', salaireNet: 800000, dateDebut: '2022-09-10' },
      { id: 3, employe: 'Traoré Ahmed', type: 'CDD', service: 'Administration', poste: 'Assistant RH', salaireNet: 300000, dateDebut: '2023-03-20' }
    ],
    'Affectations': [
      { id: 1, employe: 'Kouassi Jean', lieu: 'SIÈGE ING', chantier: 'Chantier A', dateDebut: '2023-01-15', dateFin: '2023-12-31' },
      { id: 2, employe: 'Diabaté Marie', lieu: 'CHANTIER', chantier: 'Chantier B', dateDebut: '2022-09-10', dateFin: '2024-03-15' },
      { id: 3, employe: 'Traoré Ahmed', lieu: 'SIÈGE ADMINISTRATION', chantier: '-', dateDebut: '2023-03-20', dateFin: '2023-09-20' }
    ],
    'Absences': [
      { id: 1, employe: 'Kouassi Jean', type: 'Congé annuel', dateDebut: '2023-07-15', jours: 5, dateFin: '2023-07-20' },
      { id: 2, employe: 'Diabaté Marie', type: 'Maladie', dateDebut: '2023-06-10', jours: 2, dateFin: '2023-06-12' },
      { id: 3, employe: 'Traoré Ahmed', type: 'Permission autorisée', dateDebut: '2023-08-05', jours: 1, dateFin: '2023-08-05' }
    ],
    'Primes': [
      { id: 1, employe: 'Kouassi Jean', type: 'Performance', montant: 50000, dateAttribution: '2023-06-30', statut: 'Approuvé' },
      { id: 2, employe: 'Diabaté Marie', type: 'Ancienneté', montant: 100000, dateAttribution: '2023-09-10', statut: 'Approuvé' },
      { id: 3, employe: 'Traoré Ahmed', type: 'Spéciale', montant: 25000, dateAttribution: '2023-07-15', statut: 'En attente' }
    ],
    'Sanctions': [
      { id: 1, employe: 'Kouassi Jean', type: 'Avertissement', motif: 'Retard répétitif', date: '2023-05-15', duree: 0, decision: 'Avertissement écrit' },
      { id: 2, employe: 'Traoré Ahmed', type: 'Suspension', motif: 'Absence non justifiée', date: '2023-04-20', duree: 2, decision: 'Suspension de 2 jours' }
    ],
    'Dossier Médical': [
      { id: 1, employe: 'Kouassi Jean', dateVisite: '2023-01-20', description: 'Visite médicale d\'embauche', diagnostic: 'Apte au travail' },
      { id: 2, employe: 'Diabaté Marie', dateVisite: '2023-03-15', description: 'Contrôle annuel', diagnostic: 'Aucun problème détecté' }
    ]
  };

  // Rendu des tableaux de recherche
  const renderSearchTable = () => {
    const data = sampleData[activeTab] || [];

    switch (activeTab) {
      case 'Informations personnelles':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Entrée</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.nom}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.prenom}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateEntree}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.categorie}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.telephone}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.email}</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Contrats':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire Net</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.employe}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.type}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.service}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.poste}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.salaireNet.toLocaleString()} FCFA</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateDebut}</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Affectations':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu d'affectation</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chantier</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.employe}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.lieu}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.chantier}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateDebut}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateFin}</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Absences':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Absence</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.employe}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.type}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateDebut}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.jours}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateFin}</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Primes':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Prime</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Attribution</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.employe}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.type}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.montant.toLocaleString()} FCFA</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateAttribution}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        row.statut === 'Approuvé' ? 'bg-green-100 text-green-800' :
                        row.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.statut}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Sanctions':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Sanction</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.employe}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.type}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.motif}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.date}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.duree} jours</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Dossier Médical':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Visite</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnostic</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{row.employe}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.dateVisite}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.description}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{row.diagnostic}</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="text-center py-8 text-gray-500">Aucune donnée disponible</div>;
    }
  };

  // Contenu pour chaque page de création
  const renderCreationPageContent = () => {
    switch (activeTab) {
      case 'Sanctions':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs md:text-sm flex items-center space-x-2 transition-colors">
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1000px] md:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type Sanction
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motif
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Décision
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fichier Joint
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="Avertissement">Avertissement</option>
                        <option value="Suspension" selected>Suspension</option>
                        <option value="Rétrogradation">Rétrogradation</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <textarea 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[40px]"
                        placeholder="Motif de la sanction..."
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          className="border border-gray-300 rounded pl-8 pr-2 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input 
                        type="number" 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Jours"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <textarea 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[40px]"
                        placeholder="Décision prise..."
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-100 text-blue-600 p-1 md:p-2 rounded">
                          <File size={14} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Choisir</span>
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Primes':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs md:text-sm flex items-center space-x-2 transition-colors">
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1000px] md:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type Prime
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Attribution
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motif
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode de paiement 
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fichier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="Performance" selected>Performance</option>
                        <option value="Ancienneté">Ancienneté</option>
                        <option value="Spéciale">Spéciale</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input 
                        type="number" 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Montant"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          className="border border-gray-300 rounded pl-8 pr-2 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <textarea 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[40px]"
                        placeholder="Motif de la prime..."
                      />
                    </td>
                     <td className="px-3 py-2 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="Performance" selected>cash</option>
                        <option value="Ancienneté">virement</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="En attente">En attente</option>
                        <option value="Approuvé" selected>Approuvé</option>
                        <option value="Rejeté">Rejeté</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-100 text-blue-600 p-1 md:p-2 rounded">
                          <File size={14} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Choisir</span>
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Absences':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs md:text-sm flex items-center space-x-2 transition-colors">
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1000px] md:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type Absence
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date début
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jours
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Fin
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date retour
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fichier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="">Sélectionner...</option>
                        <option>Maladie</option>
                        <option>Congé annuel</option>
                        <option>Permission autorisée</option>
                        <option>Demi-journée</option>
                        <option>Congé non-justifier</option>
                        <option>Congé Materniter</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <textarea 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[40px]"
                        placeholder="Description..."
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          className="border border-gray-300 rounded pl-8 pr-2 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input 
                        type="number" 
                        className="border border-gray-300 rounded px-2 md:px-3 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          className="border border-gray-300 rounded pl-8 pr-2 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          className="border border-gray-300 rounded pl-8 pr-2 py-1.5 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-100 text-blue-600 p-1 md:p-2 rounded">
                          <File size={14} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Choisir</span>
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Dossier Médical':  
        return (
          <div className="space-y-4">
            <div className="bg-white border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1200px] md:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Visite</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diagnostic</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tests effectués</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Résultat de test</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action prescrite</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date prescrite</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom fichier</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fichier Joint</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-3 py-2 text-sm text-gray-600">1</td>
                    <td className="px-3 py-2">
                      <input type="date" className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="Description..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="Diagnostic..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="Tests effectués..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="Résultat..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="Action prescrite..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <textarea placeholder="Notes..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full min-h-[40px] focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="date" className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="Nom fichier..." className="border rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="px-3 py-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded">+</div>
                        <span className="text-xs text-gray-600">Ajouter</span>
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Contrats': 
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs md:text-sm flex items-center space-x-2 transition-colors">
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1100px] md:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unité</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Salaire net</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Salaire brut</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date début</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date fin</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom fichier</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fichier joint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-3 py-2">
                      <select className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500">
                        <option>CDI</option>
                        <option>CDD</option>
                        <option>Stage</option>
                        <option>Consultant</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500">
                        <option>Sélectionner...</option>
                        <option>Ressources Humaines</option>
                        <option>Comptabilité</option>
                        <option>Informatique</option>
                        <option>Logistique</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input 
                        type="text"
                        placeholder="Unité..."
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input 
                        type="text"
                        placeholder="Poste..."
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input 
                        type="number"
                        placeholder="0"
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input 
                        type="number"
                        placeholder="0"
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input type="date" className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"/>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input type="date" className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"/>
                    </td>
                    <td className="px-3 py-2">
                      <input 
                        type="text"
                        placeholder="Nom fichier..."
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-100 text-blue-600 p-1 rounded">
                          <File size={14} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Ajouter</span>
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                  </tr>
                </tbody>
                </table>
            </div>
          </div>
        );
      case 'Affectations': 
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs md:text-sm flex items-center space-x-2 transition-colors">
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1000px] md:min-w-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lieu d'affectation</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chantier</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Début</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Fin</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fichier</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fichier joint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-3 py-2">
                      <select className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500">
                        <option>SIÈGE ADMINISTRATION</option>
                        <option>SIÈGE ING-TOPO</option>
                        <option>SIÈGE ING</option>
                        <option>CHANTIER</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500">
                        <option>Sélectionner...</option>
                        <option>Chantier A</option>
                        <option>Chantier B</option>
                        <option>Chantier C</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input 
                        type="text"
                        placeholder="Description..."
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input type="date" className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"/>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input type="date" className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"/>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input 
                        type="text"
                        placeholder="Nom du fichier"
                        className="border border-gray-300 rounded px-2 py-1.5 text-xs md:text-sm w-full focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-100 text-blue-600 p-1 rounded">
                          <File size={14} />
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Ajouter</span>
                        <input type="file" className="hidden" />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Informations personnelles':
        return (
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Date d'Entrée:</label>
                <input 
                  type="date"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Catégorie:</label>
                <select className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Choisir</option>
                  <option value="administration">Administration</option>
                  <option value="technicien">Technicien</option>
                  <option value="technicien_superieur">Technicien Supérieur</option>
                  <option value="ingenieur">Ingénieur</option>
                  <option value="cadre">Cadre</option>
                  <option value="stagiaire">Stagiaire</option>
                  <option value="ouvrier">Ouvrier</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Nom:</label>
                <input 
                  type="text"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nom"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Prénom:</label>
                <input 
                  type="text"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Date de naissance:</label>
                <input 
                  type="date"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Lieu de naissance:</label>
                <input 
                  type="text"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Lieu de naissance"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Situation matrimoniale:</label>
                <select className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Choisir</option>
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf(ve)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Civilité:</label>
                <select className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Choisir</option>
                  <option value="mr">Mr</option>
                  <option value="mme">Mme</option>
                  <option value="mlle">Mlle</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Nationalité:</label>
                <select className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Choisir</option>
                  <option value="civ">Côte d'Ivoire</option>
                  <option value="ghana">Ghana</option>
                  <option value="benin">Bénin</option>
                  <option value="guinee">Guinée</option>
                  <option value="bf">Burkina Faso</option>
                  <option value="mali">Mali</option>
                  <option value="cmr">Cameroun</option>
                  <option value="togo">Togo</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Type Pièce:</label>
                <select className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Choisir</option>
                  <option value="cni">Carte Nationale</option>
                  <option value="passport">Passeport</option>
                  <option value="permis">Permis de conduire</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">N° Pièce:</label>
                <input 
                  type="text"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Numéro pièce"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Adresse domicile:</label>
                <input 
                  type="text"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Adresse domicile"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Cellulaire:</label>
                <input 
                  type="tel"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Téléphone"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">E-mail:</label>
                <input 
                  type="email"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="exemple@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Nombre d'enfants:</label>
                <input 
                  type="number"
                  defaultValue={0}
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Contact en cas d'urgence:</label>
                <input 
                  type="tel"
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Contact urgence"
                />
              </div>
            </div>
          </div>
        );
      default:
        return <div>Contenu non disponible</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
       
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Header avec title */}
          <div className="mb-4 md:mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <span>GESTION DU PERSONNEL</span>
            </div>
          </div>

          {/* Main Tabs - Recherche / Création */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveMainTab('Recherche')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeMainTab === 'Recherche'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recherche
                </button>
                <button
                  onClick={() => setActiveMainTab('Création')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeMainTab === 'Création'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Création
                </button>
              </nav>
            </div>

            {/* Content based on main tab */}
            <div className="p-4 md:p-6">
              {/* Secondary Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex -mb-px overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="mb-4 md:mb-6 flex justify-end items-center gap-3">
                {activeMainTab === 'Création' && (
                  <>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center space-x-2 transition-colors">
                      <span>Fermer</span>
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2 transition-colors">
                      <span>Enregistrer</span>
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              {activeMainTab === 'Recherche' ? (
                <div className="space-y-4">
                  {/* Search Section */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center space-x-2 w-full max-w-3xl">
                      <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher un employé..."
                          className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2 transition-colors">
                        <Search size={16} />
                        <span className="hidden sm:inline">Rechercher</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm flex items-center space-x-2 transition-colors">
                        <FileDown size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2 transition-colors">
                        <FilePlus size={16} />
                        <span>Nouveau</span>
                      </button>
                    </div>
                  </div>
                  
                  {renderSearchTable()}
                </div>
              ) : (
                renderCreationPageContent()
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return <Personnel />;
}

export default App;