import { useState, useEffect } from 'react';
import { 
  Search,
  FileDown,
  FilePlus
} from 'lucide-react';

// Import form components
import { ContractForm } from '../Formscomponents/PersonnelForms/ContractForm';
import { AbsenceForm } from '../Formscomponents/PersonnelForms/AbsenceForm';
import { BonusForm } from '../Formscomponents/PersonnelForms/BonusForm';
import { SanctionForm } from '../Formscomponents/PersonnelForms/SanctionForm';
import { MedicalRecordForm } from '../Formscomponents/PersonnelForms/MedicalRecordForm';
import { AffectationForm } from '../Formscomponents/PersonnelForms/AffectationForm';
import { UsersCreate } from '../Formscomponents/personnelforms/UsersCreate';

// Data types
interface User {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department: string;
  workcountry: string;
  hireDate: string;
  createdAt: string;
}

interface Contract {
  contractId: number;
  userId: number;
  contractType: string;
  startDate: string;
  endDate: string | null;
  post: string;
  department: string;
  unit: string | null;
  grossSalary: number;
  netSalary: number;
  currency: string;
  contractFile: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

interface Absence {
  absenceId: number;
  userId: number;
  absenceType: string;
  description: string | null;
  startDate: string;
  endDate: string;
  daysCount: number;
  returnDate: string;
  supportingDocument: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

interface Bonus {
  bonusId: number;
  userId: number;
  bonusType: string;
  amount: number;
  currency: string;
  awardDate: string;
  reason: string | null;
  paymentMethod: string;
  status: string;
  supportingDocument: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

interface Sanction {
  sanctionId: number;
  userId: number;
  sanctionType: string;
  reason: string;
  sanctionDate: string;
  durationDays: number | null;
  decision: string | null;
  supportingDocument: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

interface MedicalRecord {
  medicalRecordsId: number;
  userId: number;
  visitDate: string;
  description: string | null;
  diagnosis: string | null;
  testsPerformed: string | null;
  testResults: string | null;
  prescribedAction: string | null;
  notes: string | null;
  nextVisitDate: string | null;
  medicalFile: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

interface Affectation {
  affectationsId: number;
  userId: number;
  workLocation: string;
  site: string;
  affectationtype: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  attached_file: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    email: string;
  };
}

export function Personnel() {
  const [activeMainTab, setActiveMainTab] = useState('Recherche');
  const [activeTab, setActiveTab] = useState('Absences');
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    'Informations personnelles',
    'Contrats', 
    'Affectations',
    'Absences',
    'Primes',
    'Sanctions',
    'Dossier Médical'
  ];

  // Data fetching functions
  const fetchUsers = async () => {
    try {
      const response = await fetch('/.netlify/functions/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch('/.netlify/functions/contracts');
      if (!response.ok) throw new Error('Failed to fetch contracts');
      const data = await response.json();
      setContracts(data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError('Erreur lors du chargement des contrats');
    }
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch('/.netlify/functions/absences');
      if (!response.ok) throw new Error('Failed to fetch absences');
      const data = await response.json();
      setAbsences(data);
    } catch (err) {
      console.error('Error fetching absences:', err);
      setError('Erreur lors du chargement des absences');
    }
  };

  const fetchBonuses = async () => {
    try {
      const response = await fetch('/.netlify/functions/bonuses');
      if (!response.ok) throw new Error('Failed to fetch bonuses');
      const data = await response.json();
      setBonuses(data);
    } catch (err) {
      console.error('Error fetching bonuses:', err);
      setError('Erreur lors du chargement des primes');
    }
  };

  const fetchSanctions = async () => {
    try {
      const response = await fetch('/.netlify/functions/sanctions');
      if (!response.ok) throw new Error('Failed to fetch sanctions');
      const data = await response.json();
      setSanctions(data);
    } catch (err) {
      console.error('Error fetching sanctions:', err);
      setError('Erreur lors du chargement des sanctions');
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch('/.netlify/functions/medical-records');
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      setMedicalRecords(data);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Erreur lors du chargement des dossiers médicaux');
    }
  };

  const fetchAffectations = async () => {
    try {
      const response = await fetch('/.netlify/functions/affectations');
      if (!response.ok) throw new Error('Failed to fetch affectations');
      const data = await response.json();
      setAffectations(data);
    } catch (err) {
      console.error('Error fetching affectations:', err);
      setError('Erreur lors du chargement des affectations');
    }
  };

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchUsers(),
          fetchContracts(),
          fetchAbsences(),
          fetchBonuses(),
          fetchSanctions(),
          fetchMedicalRecords(),
          fetchAffectations()
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'Informations personnelles':
        return users;
      case 'Contrats':
        return contracts;
      case 'Affectations':
        return affectations;
      case 'Absences':
        return absences;
      case 'Primes':
        return bonuses;
      case 'Sanctions':
        return sanctions;
      case 'Dossier Médical':
        return medicalRecords;
      default:
        return [];
    }
  };

  // Rendu des tableaux de recherche
  const renderSearchTable = () => {
    const data = getCurrentData();

    // Show loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Chargement des données...</div>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      );
    }

    // Show empty state
    if (data.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Aucune donnée disponible</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Informations personnelles':
        return (
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays de travail</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'embauche</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(data as User[]).map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{user.id}</td>
                    <td className="px-3 py-2 text-sm text-gray-900 font-medium">{user.employeeNumber}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{user.email}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                        user.status === 'FIRED' ? 'bg-red-100 text-red-800' :
                        user.status === 'ON_HOLIDAY' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'ACTIVE' ? 'Actif' : 
                         user.status === 'SUSPENDED' ? 'Suspendu' : 
                         user.status === 'FIRED' ? 'Licencié' : 
                         user.status === 'ON_HOLIDAY' ? 'En congé' : user.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">{user.department}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{user.workcountry}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(user.hireDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-xs mr-2">Modifier</button>
                      <button className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire Net</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(data as Contract[]).map((contract: Contract) => (
                  <tr key={contract.contractId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{contract.user.firstName} {contract.user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{contract.contractType}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{contract.department}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{contract.post}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{contract.netSalary.toLocaleString()} {contract.currency}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(contract.startDate).toLocaleDateString('fr-FR')}</td>
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Début</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Fin</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(data as Affectation[]).map((affectation: Affectation) => (
                  <tr key={affectation.affectationsId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{affectation.user.firstName} {affectation.user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{affectation.workLocation}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{affectation.site}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{affectation.affectationtype}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(affectation.startDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{affectation.endDate ? new Date(affectation.endDate).toLocaleDateString('fr-FR') : '-'}</td>
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
                {(data as Absence[]).map((absence: Absence) => (
                  <tr key={absence.absenceId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{absence.user.firstName} {absence.user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{absence.absenceType}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(absence.startDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{absence.daysCount}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(absence.endDate).toLocaleDateString('fr-FR')}</td>
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
                {(data as Bonus[]).map((bonus: Bonus) => (
                  <tr key={bonus.bonusId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{bonus.user.firstName} {bonus.user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{bonus.bonusType}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{bonus.amount.toLocaleString()} {bonus.currency}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(bonus.awardDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bonus.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        bonus.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bonus.status === 'APPROVED' ? 'Approuvé' : 
                         bonus.status === 'PENDING' ? 'En attente' : 
                         bonus.status === 'REJECTED' ? 'Rejeté' : bonus.status}
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
                {(data as Sanction[]).map((sanction: Sanction) => (
                  <tr key={sanction.sanctionId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{sanction.user.firstName} {sanction.user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{sanction.sanctionType}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{sanction.reason}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(sanction.sanctionDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{sanction.durationDays ? `${sanction.durationDays} jours` : '-'}</td>
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
                {(data as MedicalRecord[]).map((record: MedicalRecord) => (
                  <tr key={record.medicalRecordsId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{record.user.firstName} {record.user.lastName}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(record.visitDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{record.description || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{record.diagnosis || '-'}</td>
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
        return <SanctionForm />;
      case 'Primes':
        return <BonusForm />;
      case 'Absences':
        return <AbsenceForm />;
      case 'Dossier Médical':  
        return <MedicalRecordForm />;
      case 'Contrats': 
        return <ContractForm />;
      case 'Affectations': 
        return <AffectationForm />;
      case 'Informations personnelles':
        return <UsersCreate onUserCreated={fetchUsers} />;
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