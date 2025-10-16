import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { Card } from '../components/Common/Card';
import { Table } from '../components/Common/Table';
import { Button } from '../components/Common/Button';
import { useApp } from '../context/AppContext';
import { Vehicle, Driver, Garage, VehicleAuthorization, Contentieux, VehicleIntervention } from '../types';
import { Plus, Edit, Trash2, Search, Car, Trash, Download, Upload, Eye, Calendar, FileText, User, Wrench, AlertTriangle, Clock, Save, X, Filter, CreditCard, Settings, File } from 'lucide-react';

// Ajout d'un type pour les données de réforme
interface VehicleReform {
  id: string;
  vehicleId: string;
  reformDate: string;
  reformReason: string;
  salePrice?: string;
  buyer?: string;
  buyerNumber?: string;
  buyerAddress?: string;
  disposalMethod: 'vente' | 'destruction' | 'don';
  reformReport?: File | null;
  reformCertificate?: File | null;
}

// Composant Modal réutilisable
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Composant de formulaire amélioré
const FormField = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export function Vehicles() {
  const { state, deleteVehicle, addVehicle, updateVehicle, addDriver, updateDriver, deleteDriver, addGarage, updateGarage, deleteGarage, addVehicleAuthorization, updateVehicleAuthorization, deleteVehicleAuthorization, addContentieux, updateContentieux, deleteContentieux, addVehicleIntervention, updateVehicleIntervention, deleteVehicleIntervention } = useApp();
  
  // États principaux
  const [mainTab, setMainTab] = useState('search');
  const [creationSubTab, setCreationSubTab] = useState('vehicles'); // Changé pour correspondre à "vehicles"
  const [searchSubTab, setSearchSubTab] = useState('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // États pour les modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  
  // États pour les recherches spécifiques
  const [driversSearchTerm, setDriversSearchTerm] = useState('');
  const [garagesSearchTerm, setGaragesSearchTerm] = useState('');
  const [authorizationsSearchTerm, setAuthorizationsSearchTerm] = useState('');
  const [contentieuxSearchTerm, setContentieuxSearchTerm] = useState('');
  const [interventionsSearchTerm, setInterventionsSearchTerm] = useState('');
  const [decommissionedSearchTerm, setDecommissionedSearchTerm] = useState('');
  const [reformedSearchTerm, setReformedSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [maintenanceCalendarSearchTerm, setMaintenanceCalendarSearchTerm] = useState('');
  const [paymentCardsSearchTerm, setPaymentCardsSearchTerm] = useState('');
  const [vehiclePiecesSearchTerm, setVehiclePiecesSearchTerm] = useState('');
  const [vehicleExpensesSearchTerm, setVehicleExpensesSearchTerm] = useState('');
  const [fuelManagementsSearchTerm, setFuelManagementsSearchTerm] = useState('');
  const [cardOperationsSearchTerm, setCardOperationsSearchTerm] = useState('');
  const [stateVehiclesSearchTerm, setStateVehiclesSearchTerm] = useState('');
  
  // États pour les nouvelles fonctionnalités
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState('');
  const [vehicleHistoryData, setVehicleHistoryData] = useState<any[]>([]);
  
  // Ajout d'un état pour stocker les données de réforme
  const [reformsData, setReformsData] = useState<VehicleReform[]>([]);
  
  const [reformData, setReformData] = useState({
    vehicleId: '',
    reformDate: '',
    reformReason: '',
    salePrice: '',
    buyer: '',
    buyerNumber: '',
    buyerAddress: '',
    disposalMethod: 'vente' as 'vente' | 'destruction' | 'don',
    reformReport: null as File | null,
    reformCertificate: null as File | null
  });
  
  // États pour les formulaires - Modifiés pour correspondre exactement aux tableaux
  const [vehicleData, setVehicleData] = useState({
    id: '',
    licensePlate: '',
    brand: '',
    model: '',
    type: 'car' as 'car' | 'truck' | 'van' | 'motorcycle' | 'other',
    year: new Date().getFullYear(),
    mileage: 0,
    civilRegistration: '',
    administrativeRegistration: '',
    acquisitionDate: '',
    usingEntity: '',
    holder: '',
    chassisNumber: '',
    status: 'available' as 'available' | 'in-use' | 'maintenance' | 'retired' | 'decommissioned' | 'reformed',
    assignedTo: '',
    fuelType: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
    fullName: '',
    fuel: '',
    vehicleType: ''
  });
  
  // État spécifique pour les véhicules de l'État - Modifié pour correspondre exactement au tableau
  const [stateVehicleData, setStateVehicleData] = useState({
    id: '',
    licensePlate: '',
    brand: '',
    model: '',
    type: 'car' as 'car' | 'truck' | 'van' | 'motorcycle' | 'other',
    year: new Date().getFullYear(),
    mileage: 0,
    ministry: '',
    department: '',
    service: '',
    budgetAllocation: '',
    statePropertyNumber: '',
    status: 'available' as 'available' | 'in-use' | 'maintenance' | 'retired' | 'decommissioned' | 'reformed',
    fullName: '',
    fuel: '',
    vehicleType: '',
    usingEntity: '',
    holder: 'État',
    acquisitionDate: '',
    civilRegistration: '',
    administrativeRegistration: '',
    chassisNumber: '',
    assignedTo: '',
    fuelType: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  });
  
  const [driverData, setDriverData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    status: 'active' as 'active' | 'suspended' | 'inactive',
    assignedVehicleId: ''
  });
  
  const [garageData, setGarageData] = useState({
    id: '',
    name: '',
    address: '',
    phoneNumber: '',
    manager: '',
    capacity: 0,
    type: 'public' as 'public' | 'private' | 'authorized'
  });
  
  const [authorizationData, setAuthorizationData] = useState({
    id: '',
    vehicleId: '',
    authorizationNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    purpose: '',
    status: 'active' as 'active' | 'expired' | 'revoked'
  });
  
  const [contentieuxData, setContentieuxData] = useState({
    id: '',
    vehicleId: '',
    incidentDate: '',
    description: '',
    faultAttribution: 'undetermined' as 'state' | 'holder' | 'undetermined',
    conclusion: '',
    status: 'open' as 'open' | 'in_progress' | 'resolved' | 'closed',
    resolutionDate: ''
  });
  
  const [interventionData, setInterventionData] = useState({
    id: '',
    vehicleId: '',
    garageId: '',
    interventionDate: '',
    type: 'maintenance' as 'maintenance' | 'repair' | 'inspection' | 'other',
    description: '',
    cost: 0,
    technician: '',
    status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    nextInterventionDate: ''
  });
  
  // États pour les nouveaux formulaires
  const [paymentCardData, setPaymentCardData] = useState({
    id: '',
    dateAchat: '',
    typeBadge: '',
    typeBadgeLibre: '',
    numBadge: '',
    description: '',
    montant: '',
    dateMiseEnService: '',
    fichierJoint: null as File | null
  });
  
  const [vehiclePieceData, setVehiclePieceData] = useState({
    id: '',
    type: '',
    typeLibre: '',
    description: '',
    montant: '',
    dateDebut: '',
    dateFin: '',
    dateProchaine: '',
    fichierJoint: null as File | null
  });
  
  const [vehicleExpenseData, setVehicleExpenseData] = useState({
    id: '',
    date: '',
    nextDate: '',
    code: '',
    description: '',
    distance: '',
    amount: '',
    statut: 'non-payé',
    fichierJoint: null as File | null
  });
  
  const [fuelManagementData, setFuelManagementData] = useState({
    id: '',
    date: '',
    typePaiement: '',
    distance: '',
    quantity: '',
    amount: '',
    prixLitre: '',
    station: '',
    fichierJoint: null as File | null
  });
  
  // Données depuis le contexte
  const vehiclesData = state.vehicles;
  const driversData = state.drivers;
  const garagesData = state.garages;
  const authorizationsData = state.vehicleAuthorizations;
  const contentieuxDataList = state.contentieux;
  const interventionsData = state.vehicleInterventions;
  
  // Données filtrées
  const decommissionedVehiclesData = state.vehicles.filter(vehicle => vehicle.status === 'decommissioned');
  const reformedVehiclesData = state.vehicles.filter(vehicle => vehicle.status === 'reformed');
  const stateVehiclesData = state.vehicles.filter(vehicle => vehicle.holder === 'État');
  
  // Données statiques
  const [paymentCardsData, setPaymentCardsData] = useState<any[]>([]);
  const [vehiclePiecesData, setVehiclePiecesData] = useState<any[]>([]);
  const [vehicleExpensesData, setVehicleExpensesData] = useState<any[]>([]);
  const [fuelManagementsData, setFuelManagementsData] = useState<any[]>([]);
  
  // Fonction pour obtenir les véhicules réformés avec leurs détails
  const getReformedVehiclesWithDetails = () => {
    return reformedVehiclesData.map(vehicle => {
      const reform = reformsData.find(r => r.vehicleId === vehicle.id);
      return {
        ...vehicle,
        reformDate: reform?.reformDate || '',
        reformReason: reform?.reformReason || '',
        disposalMethod: reform?.disposalMethod || 'vente',
        salePrice: reform?.salePrice || '',
        buyer: reform?.buyer || '',
        buyerNumber: reform?.buyerNumber || '',
        buyerAddress: reform?.buyerAddress || '',
        reformReport: reform?.reformReport || null,
        reformCertificate: reform?.reformCertificate || null
      };
    });
  };
  
  // Fonction pour sauvegarder les données de réforme
  const handleSaveReform = () => {
    if (reformData.vehicleId) {
      // Créer un nouvel objet de réforme
      const newReform: VehicleReform = {
        id: Date.now().toString(),
        vehicleId: reformData.vehicleId,
        reformDate: reformData.reformDate,
        reformReason: reformData.reformReason,
        salePrice: reformData.salePrice,
        buyer: reformData.buyer,
        buyerNumber: reformData.buyerNumber,
        buyerAddress: reformData.buyerAddress,
        disposalMethod: reformData.disposalMethod,
        reformReport: reformData.reformReport,
        reformCertificate: reformData.reformCertificate
      };
      
      // Ajouter aux données de réforme
      setReformsData([...reformsData, newReform]);
      
      // Mettre à jour le statut du véhicule à "réformé"
      updateVehicle({ ...state.vehicles.find(v => v.id === reformData.vehicleId)!, status: 'reformed' });
      
      // Réinitialiser le formulaire
      setReformData({
        vehicleId: '',
        reformDate: '',
        reformReason: '',
        salePrice: '',
        buyer: '',
        buyerNumber: '',
        buyerAddress: '',
        disposalMethod: 'vente',
        reformReport: null,
        reformCertificate: null
      });
      
      alert('Véhicule réformé avec succès!');
    } else {
      alert('Veuillez sélectionner un véhicule à réformer');
    }
  };
  
  // Fonctions CRUD pour les véhicules
  const handleAddVehicle = () => {
    setVehicleData({
      id: '',
      licensePlate: '',
      brand: '',
      model: '',
      type: 'car',
      year: new Date().getFullYear(),
      mileage: 0,
      civilRegistration: '',
      administrativeRegistration: '',
      acquisitionDate: '',
      usingEntity: '',
      holder: '',
      chassisNumber: '',
      status: 'available',
      assignedTo: '',
      fuelType: 'gasoline',
      fullName: '',
      fuel: '',
      vehicleType: ''
    });
    setModalTitle('Ajouter un véhicule');
    setModalContent(renderVehicleForm());
    setIsModalOpen(true);
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicleData({
      id: vehicle.id || '',
      licensePlate: vehicle.licensePlate || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      type: vehicle.type || 'car',
      year: vehicle.year || new Date().getFullYear(),
      mileage: vehicle.mileage || 0,
      civilRegistration: vehicle.civilRegistration || '',
      administrativeRegistration: vehicle.administrativeRegistration || '',
      acquisitionDate: vehicle.acquisitionDate || '',
      usingEntity: vehicle.usingEntity || '',
      holder: vehicle.holder || '',
      chassisNumber: vehicle.chassisNumber || '',
      status: vehicle.status || 'available',
      assignedTo: vehicle.assignedTo || '',
      fuelType: vehicle.fuelType || 'gasoline',
      fullName: '',
      fuel: '',
      vehicleType: ''
    });
    setModalTitle('Modifier un véhicule');
    setModalContent(renderVehicleForm());
    setIsModalOpen(true);
  };
  
  const handleSaveVehicle = () => {
    if (vehicleData.id) {
      updateVehicle(vehicleData);
    } else {
      addVehicle(vehicleData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les véhicules de l'État
  const handleAddStateVehicle = () => {
    setStateVehicleData({
      id: '',
      licensePlate: '',
      brand: '',
      model: '',
      type: 'car',
      year: new Date().getFullYear(),
      mileage: 0,
      ministry: '',
      department: '',
      service: '',
      budgetAllocation: '',
      statePropertyNumber: '',
      status: 'available',
      fullName: '',
      fuel: '',
      vehicleType: '',
      usingEntity: '',
      holder: 'État',
      acquisitionDate: '',
      civilRegistration: '',
      administrativeRegistration: '',
      chassisNumber: '',
      assignedTo: '',
      fuelType: 'gasoline'
    });
    setModalTitle('Ajouter un véhicule de l\'État');
    setModalContent(renderStateVehicleForm());
    setIsModalOpen(true);
  };
  
  const handleEditStateVehicle = (vehicle: Vehicle) => {
    setStateVehicleData({
      id: vehicle.id || '',
      licensePlate: vehicle.licensePlate || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      type: vehicle.type || 'car',
      year: vehicle.year || new Date().getFullYear(),
      mileage: vehicle.mileage || 0,
      ministry: '',
      department: '',
      service: '',
      budgetAllocation: '',
      statePropertyNumber: '',
      status: vehicle.status || 'available',
      fullName: '',
      fuel: '',
      vehicleType: '',
      usingEntity: vehicle.usingEntity || '',
      holder: vehicle.holder || 'État',
      acquisitionDate: vehicle.acquisitionDate || '',
      civilRegistration: vehicle.civilRegistration || '',
      administrativeRegistration: vehicle.administrativeRegistration || '',
      chassisNumber: vehicle.chassisNumber || '',
      assignedTo: vehicle.assignedTo || '',
      fuelType: vehicle.fuelType || 'gasoline'
    });
    setModalTitle('Modifier un véhicule de l\'État');
    setModalContent(renderStateVehicleForm());
    setIsModalOpen(true);
  };
  
  const handleSaveStateVehicle = () => {
    if (stateVehicleData.id) {
      updateVehicle(stateVehicleData);
    } else {
      addVehicle(stateVehicleData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les chauffeurs
  const handleAddDriver = () => {
    setDriverData({
      id: '',
      firstName: '',
      lastName: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      status: 'active',
      assignedVehicleId: ''
    });
    setModalTitle('Ajouter un chauffeur');
    setModalContent(renderDriverForm());
    setIsModalOpen(true);
  };
  
  const handleEditDriver = (driver: Driver) => {
    setDriverData({
      id: driver.id || '',
      firstName: driver.firstName || '',
      lastName: driver.lastName || '',
      licenseNumber: driver.licenseNumber || '',
      licenseExpiryDate: driver.licenseExpiryDate || '',
      dateOfBirth: driver.dateOfBirth || '',
      phoneNumber: driver.phoneNumber || '',
      address: driver.address || '',
      status: driver.status || 'active',
      assignedVehicleId: driver.assignedVehicleId || ''
    });
    setModalTitle('Modifier un chauffeur');
    setModalContent(renderDriverForm());
    setIsModalOpen(true);
  };
  
  const handleSaveDriver = () => {
    if (driverData.id) {
      updateDriver(driverData);
    } else {
      addDriver(driverData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les garages
  const handleAddGarage = () => {
    setGarageData({
      id: '',
      name: '',
      address: '',
      phoneNumber: '',
      manager: '',
      capacity: 0,
      type: 'public'
    });
    setModalTitle('Ajouter un garage');
    setModalContent(renderGarageForm());
    setIsModalOpen(true);
  };
  
  const handleEditGarage = (garage: Garage) => {
    setGarageData({
      id: garage.id || '',
      name: garage.name || '',
      address: garage.address || '',
      phoneNumber: garage.phoneNumber || '',
      manager: garage.manager || '',
      capacity: garage.capacity || 0,
      type: garage.type || 'public'
    });
    setModalTitle('Modifier un garage');
    setModalContent(renderGarageForm());
    setIsModalOpen(true);
  };
  
  const handleSaveGarage = () => {
    if (garageData.id) {
      updateGarage(garageData);
    } else {
      addGarage(garageData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les autorisations
  const handleAddAuthorization = () => {
    setAuthorizationData({
      id: '',
      vehicleId: '',
      authorizationNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      purpose: '',
      status: 'active'
    });
    setModalTitle('Générer une autorisation');
    setModalContent(renderAuthorizationForm());
    setIsModalOpen(true);
  };
  
  const handleEditAuthorization = (authorization: VehicleAuthorization) => {
    setAuthorizationData({
      id: authorization.id || '',
      vehicleId: authorization.vehicleId || '',
      authorizationNumber: authorization.authorizationNumber || '',
      issueDate: authorization.issueDate || '',
      expiryDate: authorization.expiryDate || '',
      issuingAuthority: authorization.issuingAuthority || '',
      purpose: authorization.purpose || '',
      status: authorization.status || 'active'
    });
    setModalTitle('Modifier une autorisation');
    setModalContent(renderAuthorizationForm());
    setIsModalOpen(true);
  };
  
  const handleSaveAuthorization = () => {
    if (authorizationData.id) {
      updateVehicleAuthorization(authorizationData);
    } else {
      addVehicleAuthorization(authorizationData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les contentieux
  const handleAddContentieux = () => {
    setContentieuxData({
      id: '',
      vehicleId: '',
      incidentDate: '',
      description: '',
      faultAttribution: 'undetermined',
      conclusion: '',
      status: 'open',
      resolutionDate: ''
    });
    setModalTitle('Enregistrer un contentieux');
    setModalContent(renderContentieuxForm());
    setIsModalOpen(true);
  };
  
  const handleEditContentieux = (contentieux: Contentieux) => {
    setContentieuxData({
      id: contentieux.id || '',
      vehicleId: contentieux.vehicleId || '',
      incidentDate: contentieux.incidentDate || '',
      description: contentieux.description || '',
      faultAttribution: contentieux.faultAttribution || 'undetermined',
      conclusion: contentieux.conclusion || '',
      status: contentieux.status || 'open',
      resolutionDate: contentieux.resolutionDate || ''
    });
    setModalTitle('Modifier un contentieux');
    setModalContent(renderContentieuxForm());
    setIsModalOpen(true);
  };
  
  const handleSaveContentieux = () => {
    if (contentieuxData.id) {
      updateContentieux(contentieuxData);
    } else {
      addContentieux(contentieuxData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les interventions
  const handleAddIntervention = () => {
    setInterventionData({
      id: '',
      vehicleId: '',
      garageId: '',
      interventionDate: '',
      type: 'maintenance',
      description: '',
      cost: 0,
      technician: '',
      status: 'scheduled',
      nextInterventionDate: ''
    });
    setModalTitle('Enregistrer une intervention');
    setModalContent(renderInterventionForm());
    setIsModalOpen(true);
  };
  
  const handleEditIntervention = (intervention: VehicleIntervention) => {
    setInterventionData({
      id: intervention.id || '',
      vehicleId: intervention.vehicleId || '',
      garageId: intervention.garageId || '',
      interventionDate: intervention.interventionDate || '',
      type: intervention.type || 'maintenance',
      description: intervention.description || '',
      cost: intervention.cost || 0,
      technician: intervention.technician || '',
      status: intervention.status || 'scheduled',
      nextInterventionDate: intervention.nextInterventionDate || ''
    });
    setModalTitle('Modifier une intervention');
    setModalContent(renderInterventionForm());
    setIsModalOpen(true);
  };
  
  const handleSaveIntervention = () => {
    if (interventionData.id) {
      updateVehicleIntervention(interventionData);
    } else {
      addVehicleIntervention(interventionData);
    }
    setIsModalOpen(false);
  };
  
  // Fonctions CRUD pour les cartes de paiement
  const handleAddPaymentCard = () => {
    setPaymentCardData({
      id: '',
      dateAchat: '',
      typeBadge: '',
      typeBadgeLibre: '',
      numBadge: '',
      description: '',
      montant: '',
      dateMiseEnService: '',
      fichierJoint: null
    });
    setModalTitle('Ajouter une carte de paiement');
    setModalContent(renderPaymentCardForm());
    setIsModalOpen(true);
  };
  
  const handleEditPaymentCard = (card: any) => {
    setPaymentCardData({ ...card });
    setModalTitle('Modifier une carte de paiement');
    setModalContent(renderPaymentCardForm());
    setIsModalOpen(true);
  };
  
  const handleSavePaymentCard = () => {
    if (paymentCardData.id) {
      const updatedCards = paymentCardsData.map(card => 
        card.id === paymentCardData.id ? paymentCardData : card
      );
      setPaymentCardsData(updatedCards);
    } else {
      const newCard = { ...paymentCardData, id: Date.now().toString() };
      setPaymentCardsData([...paymentCardsData, newCard]);
    }
    
    setPaymentCardData({
      id: '',
      dateAchat: '',
      typeBadge: '',
      typeBadgeLibre: '',
      numBadge: '',
      description: '',
      montant: '',
      dateMiseEnService: '',
      fichierJoint: null
    });
    
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    
    alert('Carte de paiement enregistrée avec succès!');
  };
  
  const handleDeletePaymentCard = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte de paiement ?')) {
      const updatedCards = paymentCardsData.filter(card => card.id !== id);
      setPaymentCardsData(updatedCards);
      alert('Carte de paiement supprimée avec succès!');
    }
  };
  
  // Fonctions CRUD pour les pièces du véhicule
  const handleAddVehiclePiece = () => {
    setVehiclePieceData({
      id: '',
      type: '',
      typeLibre: '',
      description: '',
      montant: '',
      dateDebut: '',
      dateFin: '',
      dateProchaine: '',
      fichierJoint: null
    });
    setModalTitle('Ajouter une pièce du véhicule');
    setModalContent(renderVehiclePieceForm());
    setIsModalOpen(true);
  };
  
  const handleEditVehiclePiece = (piece: any) => {
    setVehiclePieceData({ ...piece });
    setModalTitle('Modifier une pièce du véhicule');
    setModalContent(renderVehiclePieceForm());
    setIsModalOpen(true);
  };
  
  const handleSaveVehiclePiece = () => {
    if (vehiclePieceData.id) {
      const updatedPieces = vehiclePiecesData.map(piece => 
        piece.id === vehiclePieceData.id ? vehiclePieceData : piece
      );
      setVehiclePiecesData(updatedPieces);
    } else {
      const newPiece = { ...vehiclePieceData, id: Date.now().toString() };
      setVehiclePiecesData([...vehiclePiecesData, newPiece]);
    }
    
    setVehiclePieceData({
      id: '',
      type: '',
      typeLibre: '',
      description: '',
      montant: '',
      dateDebut: '',
      dateFin: '',
      dateProchaine: '',
      fichierJoint: null
    });
    
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    
    alert('Pièce enregistrée avec succès!');
  };
  
  const handleDeleteVehiclePiece = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
      const updatedPieces = vehiclePiecesData.filter(piece => piece.id !== id);
      setVehiclePiecesData(updatedPieces);
      alert('Pièce supprimée avec succès!');
    }
  };
  
  // Fonctions CRUD pour les frais
  const handleAddVehicleExpense = () => {
    setVehicleExpenseData({
      id: '',
      date: '',
      nextDate: '',
      code: '',
      description: '',
      distance: '',
      amount: '',
      statut: 'non-payé',
      fichierJoint: null
    });
    setModalTitle('Ajouter une dépense');
    setModalContent(renderVehicleExpenseForm());
    setIsModalOpen(true);
  };
  
  const handleEditVehicleExpense = (expense: any) => {
    setVehicleExpenseData({ ...expense });
    setModalTitle('Modifier une dépense');
    setModalContent(renderVehicleExpenseForm());
    setIsModalOpen(true);
  };
  
  const handleSaveVehicleExpense = () => {
    if (vehicleExpenseData.id) {
      const updatedExpenses = vehicleExpensesData.map(expense => 
        expense.id === vehicleExpenseData.id ? vehicleExpenseData : expense
      );
      setVehicleExpensesData(updatedExpenses);
    } else {
      const newExpense = { ...vehicleExpenseData, id: Date.now().toString() };
      setVehicleExpensesData([...vehicleExpensesData, newExpense]);
    }
    
    setVehicleExpenseData({
      id: '',
      date: '',
      nextDate: '',
      code: '',
      description: '',
      distance: '',
      amount: '',
      statut: 'non-payé',
      fichierJoint: null
    });
    
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    
    alert('Dépense enregistrée avec succès!');
  };
  
  const handleDeleteVehicleExpense = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      const updatedExpenses = vehicleExpensesData.filter(expense => expense.id !== id);
      setVehicleExpensesData(updatedExpenses);
      alert('Dépense supprimée avec succès!');
    }
  };
  
  // Fonctions CRUD pour la gestion du carburant
  const handleAddFuelManagement = () => {
    setFuelManagementData({
      id: '',
      date: '',
      typePaiement: '',
      distance: '',
      quantity: '',
      amount: '',
      prixLitre: '',
      station: '',
      fichierJoint: null
    });
    setModalTitle('Ajouter un enregistrement de carburant');
    setModalContent(renderFuelManagementForm());
    setIsModalOpen(true);
  };
  
  const handleEditFuelManagement = (fuel: any) => {
    setFuelManagementData({ ...fuel });
    setModalTitle('Modifier un enregistrement de carburant');
    setModalContent(renderFuelManagementForm());
    setIsModalOpen(true);
  };
  
  const handleSaveFuelManagement = () => {
    if (fuelManagementData.id) {
      const updatedFuels = fuelManagementsData.map(fuel => 
        fuel.id === fuelManagementData.id ? fuelManagementData : fuel
      );
      setFuelManagementsData(updatedFuels);
    } else {
      const newFuel = { ...fuelManagementData, id: Date.now().toString() };
      setFuelManagementsData([...fuelManagementsData, newFuel]);
    }
    
    setFuelManagementData({
      id: '',
      date: '',
      typePaiement: '',
      distance: '',
      quantity: '',
      amount: '',
      prixLitre: '',
      station: '',
      fichierJoint: null
    });
    
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    
    alert('Enregistrement de carburant enregistré avec succès!');
  };
  
  const handleDeleteFuelManagement = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement de carburant ?')) {
      const updatedFuels = fuelManagementsData.filter(fuel => fuel.id !== id);
      setFuelManagementsData(updatedFuels);
      alert('Enregistrement de carburant supprimé avec succès!');
    }
  };
  
  // Fonctions pour les formulaires - Modifiées pour correspondre exactement aux tableaux
  const renderVehicleForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="N° Plaque (Immat)" required>
          <input type="text" name="licensePlate" value={vehicleData.licensePlate} onChange={(e) => setVehicleData({...vehicleData, licensePlate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Marque">
          <select name="brand" value={vehicleData.brand} onChange={(e) => setVehicleData({...vehicleData, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Choisir</option>
            <option value="Toyota">Toyota</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Peugeot">Peugeot</option>
            <option value="Renault">Renault</option>
            <option value="Autres">Autres</option>
          </select>
        </FormField>
        
        <FormField label="Modèle">
          <input type="text" name="model" value={vehicleData.model} onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type de véhicule">
          <select name="type" value={vehicleData.type} onChange={(e) => setVehicleData({...vehicleData, type: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="car">Voiture</option>
            <option value="truck">Camion</option>
            <option value="van">Camionnette</option>
            <option value="motorcycle">Moto</option>
            <option value="other">Autre</option>
          </select>
        </FormField>
        
        <FormField label="Année">
          <input type="number" name="year" value={vehicleData.year} onChange={(e) => setVehicleData({...vehicleData, year: parseInt(e.target.value) || 2020})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Kilométrage">
          <input type="number" name="mileage" value={vehicleData.mileage} onChange={(e) => setVehicleData({...vehicleData, mileage: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Immatriculation Civile">
          <input type="text" name="civilRegistration" value={vehicleData.civilRegistration} onChange={(e) => setVehicleData({...vehicleData, civilRegistration: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Immatriculation Administrative">
          <input type="text" name="administrativeRegistration" value={vehicleData.administrativeRegistration} onChange={(e) => setVehicleData({...vehicleData, administrativeRegistration: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Date d'acquisition">
          <input type="date" name="acquisitionDate" value={vehicleData.acquisitionDate} onChange={(e) => setVehicleData({...vehicleData, acquisitionDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Entité utilisatrice">
          <input type="text" name="usingEntity" value={vehicleData.usingEntity} onChange={(e) => setVehicleData({...vehicleData, usingEntity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Détenteur">
          <input type="text" name="holder" value={vehicleData.holder} onChange={(e) => setVehicleData({...vehicleData, holder: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Numéro de châssis">
          <input type="text" name="chassisNumber" value={vehicleData.chassisNumber} onChange={(e) => setVehicleData({...vehicleData, chassisNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Statut">
          <select name="status" value={vehicleData.status} onChange={(e) => setVehicleData({...vehicleData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="available">Disponible</option>
            <option value="in-use">En utilisation</option>
            <option value="maintenance">Maintenance</option>
            <option value="decommissioned">Déclassé</option>
            <option value="reformed">Réformé</option>
          </select>
        </FormField>
        
        <FormField label="Affecté à">
          <input type="text" name="assignedTo" value={vehicleData.assignedTo} onChange={(e) => setVehicleData({...vehicleData, assignedTo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type carburant">
          <select name="fuelType" value={vehicleData.fuelType} onChange={(e) => setVehicleData({...vehicleData, fuelType: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="gasoline">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Électrique</option>
            <option value="hybrid">Hybride</option>
          </select>
        </FormField>
        
        <FormField label="Nom complet">
          <input type="text" name="fullName" value={vehicleData.fullName} onChange={(e) => setVehicleData({...vehicleData, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Carburant">
          <input type="text" name="fuel" value={vehicleData.fuel} onChange={(e) => setVehicleData({...vehicleData, fuel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type de véhicule">
          <input type="text" name="vehicleType" value={vehicleData.vehicleType} onChange={(e) => setVehicleData({...vehicleData, vehicleType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  // Formulaire spécifique pour les véhicules de l'État - Modifié pour correspondre exactement au tableau
  const renderStateVehicleForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="N° Plaque (Immat)" required>
          <input type="text" name="licensePlate" value={stateVehicleData.licensePlate} onChange={(e) => setStateVehicleData({...stateVehicleData, licensePlate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Marque">
          <select name="brand" value={stateVehicleData.brand} onChange={(e) => setStateVehicleData({...stateVehicleData, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Choisir</option>
            <option value="Toyota">Toyota</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Peugeot">Peugeot</option>
            <option value="Renault">Renault</option>
            <option value="Autres">Autres</option>
          </select>
        </FormField>
        
        <FormField label="Modèle">
          <input type="text" name="model" value={stateVehicleData.model} onChange={(e) => setStateVehicleData({...stateVehicleData, model: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type de véhicule">
          <select name="type" value={stateVehicleData.type} onChange={(e) => setStateVehicleData({...stateVehicleData, type: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="car">Voiture</option>
            <option value="truck">Camion</option>
            <option value="van">Camionnette</option>
            <option value="motorcycle">Moto</option>
            <option value="other">Autre</option>
          </select>
        </FormField>
        
        <FormField label="Année">
          <input type="number" name="year" value={stateVehicleData.year} onChange={(e) => setStateVehicleData({...stateVehicleData, year: parseInt(e.target.value) || 2020})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Kilométrage">
          <input type="number" name="mileage" value={stateVehicleData.mileage} onChange={(e) => setStateVehicleData({...stateVehicleData, mileage: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Ministère">
          <input type="text" name="ministry" value={stateVehicleData.ministry} onChange={(e) => setStateVehicleData({...stateVehicleData, ministry: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Département">
          <input type="text" name="department" value={stateVehicleData.department} onChange={(e) => setStateVehicleData({...stateVehicleData, department: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Service">
          <input type="text" name="service" value={stateVehicleData.service} onChange={(e) => setStateVehicleData({...stateVehicleData, service: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Allocation budgétaire">
          <input type="text" name="budgetAllocation" value={stateVehicleData.budgetAllocation} onChange={(e) => setStateVehicleData({...stateVehicleData, budgetAllocation: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="N° du bien de l'État">
          <input type="text" name="statePropertyNumber" value={stateVehicleData.statePropertyNumber} onChange={(e) => setStateVehicleData({...stateVehicleData, statePropertyNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Statut">
          <select name="status" value={stateVehicleData.status} onChange={(e) => setStateVehicleData({...stateVehicleData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="available">Disponible</option>
            <option value="in-use">En utilisation</option>
            <option value="maintenance">Maintenance</option>
            <option value="decommissioned">Déclassé</option>
            <option value="reformed">Réformé</option>
          </select>
        </FormField>
        
        <FormField label="Nom complet">
          <input type="text" name="fullName" value={stateVehicleData.fullName} onChange={(e) => setStateVehicleData({...stateVehicleData, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Carburant">
          <input type="text" name="fuel" value={stateVehicleData.fuel} onChange={(e) => setStateVehicleData({...stateVehicleData, fuel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type de véhicule">
          <input type="text" name="vehicleType" value={stateVehicleData.vehicleType} onChange={(e) => setStateVehicleData({...stateVehicleData, vehicleType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Entité utilisatrice">
          <input type="text" name="usingEntity" value={stateVehicleData.usingEntity} onChange={(e) => setStateVehicleData({...stateVehicleData, usingEntity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Détenteur">
          <input type="text" name="holder" value={stateVehicleData.holder} onChange={(e) => setStateVehicleData({...stateVehicleData, holder: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date d'acquisition">
          <input type="date" name="acquisitionDate" value={stateVehicleData.acquisitionDate} onChange={(e) => setStateVehicleData({...stateVehicleData, acquisitionDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Immatriculation Civile">
          <input type="text" name="civilRegistration" value={stateVehicleData.civilRegistration} onChange={(e) => setStateVehicleData({...stateVehicleData, civilRegistration: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Immatriculation Administrative">
          <input type="text" name="administrativeRegistration" value={stateVehicleData.administrativeRegistration} onChange={(e) => setStateVehicleData({...stateVehicleData, administrativeRegistration: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Numéro de châssis">
          <input type="text" name="chassisNumber" value={stateVehicleData.chassisNumber} onChange={(e) => setStateVehicleData({...stateVehicleData, chassisNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Affecté à">
          <input type="text" name="assignedTo" value={stateVehicleData.assignedTo} onChange={(e) => setStateVehicleData({...stateVehicleData, assignedTo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type carburant">
          <select name="fuelType" value={stateVehicleData.fuelType} onChange={(e) => setStateVehicleData({...stateVehicleData, fuelType: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="gasoline">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Électrique</option>
            <option value="hybrid">Hybride</option>
          </select>
        </FormField>
      </div>
    </div>
  );
  
  const renderDriverForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Prénom" required>
          <input type="text" name="firstName" value={driverData.firstName} onChange={(e) => setDriverData({...driverData, firstName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Nom" required>
          <input type="text" name="lastName" value={driverData.lastName} onChange={(e) => setDriverData({...driverData, lastName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="N° Permis" required>
          <input type="text" name="licenseNumber" value={driverData.licenseNumber} onChange={(e) => setDriverData({...driverData, licenseNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date d'expiration permis">
          <input type="date" name="licenseExpiryDate" value={driverData.licenseExpiryDate} onChange={(e) => setDriverData({...driverData, licenseExpiryDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Date de naissance">
          <input type="date" name="dateOfBirth" value={driverData.dateOfBirth} onChange={(e) => setDriverData({...driverData, dateOfBirth: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Téléphone">
          <input type="text" name="phoneNumber" value={driverData.phoneNumber} onChange={(e) => setDriverData({...driverData, phoneNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Adresse">
          <textarea name="address" value={driverData.address} onChange={(e) => setDriverData({...driverData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Statut">
          <select name="status" value={driverData.status} onChange={(e) => setDriverData({...driverData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="inactive">Inactif</option>
          </select>
        </FormField>
        
        <FormField label="Véhicule assigné">
          <select name="assignedVehicleId" value={driverData.assignedVehicleId} onChange={(e) => setDriverData({...driverData, assignedVehicleId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Aucun</option>
            {vehiclesData.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} - {vehicle.licensePlate}</option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
  
  const renderGarageForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Nom" required>
          <input type="text" name="name" value={garageData.name} onChange={(e) => setGarageData({...garageData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Adresse">
          <textarea name="address" value={garageData.address} onChange={(e) => setGarageData({...garageData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Téléphone">
          <input type="text" name="phoneNumber" value={garageData.phoneNumber} onChange={(e) => setGarageData({...garageData, phoneNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Responsable">
          <input type="text" name="manager" value={garageData.manager} onChange={(e) => setGarageData({...garageData, manager: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Capacité">
          <input type="number" name="capacity" value={garageData.capacity} onChange={(e) => setGarageData({...garageData, capacity: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type">
          <select name="type" value={garageData.type} onChange={(e) => setGarageData({...garageData, type: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="public">Public</option>
            <option value="private">Privé</option>
            <option value="authorized">Autorisé</option>
          </select>
        </FormField>
      </div>
    </div>
  );
  
  const renderAuthorizationForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Véhicule" required>
          <select name="vehicleId" value={authorizationData.vehicleId} onChange={(e) => setAuthorizationData({...authorizationData, vehicleId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Sélectionner un véhicule</option>
            {vehiclesData.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} - {vehicle.licensePlate}</option>
            ))}
          </select>
        </FormField>
        
        <FormField label="N° Autorisation" required>
          <input type="text" name="authorizationNumber" value={authorizationData.authorizationNumber} onChange={(e) => setAuthorizationData({...authorizationData, authorizationNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date d'émission" required>
          <input type="date" name="issueDate" value={authorizationData.issueDate} onChange={(e) => setAuthorizationData({...authorizationData, issueDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date d'expiration" required>
          <input type="date" name="expiryDate" value={authorizationData.expiryDate} onChange={(e) => setAuthorizationData({...authorizationData, expiryDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Autorité émettrice">
          <input type="text" name="issuingAuthority" value={authorizationData.issuingAuthority} onChange={(e) => setAuthorizationData({...authorizationData, issuingAuthority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Objet">
          <textarea name="purpose" value={authorizationData.purpose} onChange={(e) => setAuthorizationData({...authorizationData, purpose: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Statut">
          <select name="status" value={authorizationData.status} onChange={(e) => setAuthorizationData({...authorizationData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="active">Active</option>
            <option value="expired">Expirée</option>
            <option value="revoked">Révoquée</option>
          </select>
        </FormField>
      </div>
    </div>
  );
  
  const renderContentieuxForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Véhicule" required>
          <select name="vehicleId" value={contentieuxData.vehicleId} onChange={(e) => setContentieuxData({...contentieuxData, vehicleId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Sélectionner un véhicule</option>
            {vehiclesData.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} - {vehicle.licensePlate}</option>
            ))}
          </select>
        </FormField>
        
        <FormField label="Date de l'incident" required>
          <input type="date" name="incidentDate" value={contentieuxData.incidentDate} onChange={(e) => setContentieuxData({...contentieuxData, incidentDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Description" required>
          <textarea name="description" value={contentieuxData.description} onChange={(e) => setContentieuxData({...contentieuxData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
      </div>
      
      <div>
        <FormField label="Attribution de la faute">
          <select name="faultAttribution" value={contentieuxData.faultAttribution} onChange={(e) => setContentieuxData({...contentieuxData, faultAttribution: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="state">État</option>
            <option value="holder">Détenteur</option>
            <option value="undetermined">Indéterminée</option>
          </select>
        </FormField>
        
        <FormField label="Conclusion">
          <textarea name="conclusion" value={contentieuxData.conclusion} onChange={(e) => setContentieuxData({...contentieuxData, conclusion: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Statut">
          <select name="status" value={contentieuxData.status} onChange={(e) => setContentieuxData({...contentieuxData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>
        </FormField>
        
        <FormField label="Date de résolution">
          <input type="date" name="resolutionDate" value={contentieuxData.resolutionDate} onChange={(e) => setContentieuxData({...contentieuxData, resolutionDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  const renderInterventionForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Véhicule" required>
          <select name="vehicleId" value={interventionData.vehicleId} onChange={(e) => setInterventionData({...interventionData, vehicleId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Sélectionner un véhicule</option>
            {vehiclesData.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} - {vehicle.licensePlate}</option>
            ))}
          </select>
        </FormField>
        
        <FormField label="Garage" required>
          <select name="garageId" value={interventionData.garageId} onChange={(e) => setInterventionData({...interventionData, garageId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Sélectionner un garage</option>
            {garagesData.map(garage => (
              <option key={garage.id} value={garage.id}>{garage.name}</option>
            ))}
          </select>
        </FormField>
        
        <FormField label="Date d'intervention" required>
          <input type="date" name="interventionDate" value={interventionData.interventionDate} onChange={(e) => setInterventionData({...interventionData, interventionDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type d'intervention">
          <select name="type" value={interventionData.type} onChange={(e) => setInterventionData({...interventionData, type: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="maintenance">Maintenance</option>
            <option value="repair">Réparation</option>
            <option value="inspection">Inspection</option>
            <option value="other">Autre</option>
          </select>
        </FormField>
      </div>
      
      <div>
        <FormField label="Description">
          <textarea name="description" value={interventionData.description} onChange={(e) => setInterventionData({...interventionData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Coût (FCFA)">
          <input type="number" name="cost" value={interventionData.cost} onChange={(e) => setInterventionData({...interventionData, cost: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Technicien">
          <input type="text" name="technician" value={interventionData.technician} onChange={(e) => setInterventionData({...interventionData, technician: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Statut">
          <select name="status" value={interventionData.status} onChange={(e) => setInterventionData({...interventionData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="scheduled">Programmé</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </FormField>
        
        <FormField label="Prochaine intervention">
          <input type="date" name="nextInterventionDate" value={interventionData.nextInterventionDate} onChange={(e) => setInterventionData({...interventionData, nextInterventionDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  const renderPaymentCardForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Date d'achat" required>
          <input type="date" name="dateAchat" value={paymentCardData.dateAchat} onChange={(e) => setPaymentCardData({...paymentCardData, dateAchat: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type de badge" required>
          <select name="typeBadge" value={paymentCardData.typeBadge} onChange={(e) => setPaymentCardData({...paymentCardData, typeBadge: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Choisir</option>
            <option value="Total">Total</option>
            <option value="Shell">Shell</option>
            <option value="Autre">Autre</option>
          </select>
        </FormField>
        
        <FormField label="Type libre">
          <input type="text" name="typeBadgeLibre" value={paymentCardData.typeBadgeLibre} onChange={(e) => setPaymentCardData({...paymentCardData, typeBadgeLibre: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Numéro de badge" required>
          <input type="text" name="numBadge" value={paymentCardData.numBadge} onChange={(e) => setPaymentCardData({...paymentCardData, numBadge: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Description">
          <textarea name="description" value={paymentCardData.description} onChange={(e) => setPaymentCardData({...paymentCardData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Montant (FCFA)">
          <input type="number" name="montant" value={paymentCardData.montant} onChange={(e) => setPaymentCardData({...paymentCardData, montant: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date de mise en service">
          <input type="date" name="dateMiseEnService" value={paymentCardData.dateMiseEnService} onChange={(e) => setPaymentCardData({...paymentCardData, dateMiseEnService: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Fichier joint">
          <input type="file" name="fichierJoint" onChange={(e) => setPaymentCardData({...paymentCardData, fichierJoint: e.target.files?.[0] || null})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  const renderVehiclePieceForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Type" required>
          <select name="type" value={vehiclePieceData.type} onChange={(e) => setVehiclePieceData({...vehiclePieceData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Choisir</option>
            <option value="Assurance">Assurance</option>
            <option value="Visite technique">Visite technique</option>
            <option value="Carte grise">Carte grise</option>
            <option value="Autre">Autre</option>
          </select>
        </FormField>
        
        <FormField label="Type libre">
          <input type="text" name="typeLibre" value={vehiclePieceData.typeLibre} onChange={(e) => setVehiclePieceData({...vehiclePieceData, typeLibre: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Description">
          <textarea name="description" value={vehiclePieceData.description} onChange={(e) => setVehiclePieceData({...vehiclePieceData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
        
        <FormField label="Montant (FCFA)">
          <input type="number" name="montant" value={vehiclePieceData.montant} onChange={(e) => setVehiclePieceData({...vehiclePieceData, montant: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Date de début">
          <input type="date" name="dateDebut" value={vehiclePieceData.dateDebut} onChange={(e) => setVehiclePieceData({...vehiclePieceData, dateDebut: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date de fin">
          <input type="date" name="dateFin" value={vehiclePieceData.dateFin} onChange={(e) => setVehiclePieceData({...vehiclePieceData, dateFin: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date prochaine">
          <input type="date" name="dateProchaine" value={vehiclePieceData.dateProchaine} onChange={(e) => setVehiclePieceData({...vehiclePieceData, dateProchaine: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Fichier joint">
          <input type="file" name="fichierJoint" onChange={(e) => setVehiclePieceData({...vehiclePieceData, fichierJoint: e.target.files?.[0] || null})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  const renderVehicleExpenseForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Date" required>
          <input type="date" name="date" value={vehicleExpenseData.date} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Date prochaine">
          <input type="date" name="nextDate" value={vehicleExpenseData.nextDate} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, nextDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Code" required>
          <input type="text" name="code" value={vehicleExpenseData.code} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, code: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Description">
          <textarea name="description" value={vehicleExpenseData.description} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </FormField>
      </div>
      
      <div>
        <FormField label="Distance (km)">
          <input type="number" name="distance" value={vehicleExpenseData.distance} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, distance: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Montant (FCFA)">
          <input type="number" name="amount" value={vehicleExpenseData.amount} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Statut">
          <select name="statut" value={vehicleExpenseData.statut} onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, statut: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="non-payé">Non payé</option>
            <option value="payé">Payé</option>
            <option value="remboursé">Remboursé</option>
          </select>
        </FormField>
        
        <FormField label="Fichier joint">
          <input type="file" name="fichierJoint" onChange={(e) => setVehicleExpenseData({...vehicleExpenseData, fichierJoint: e.target.files?.[0] || null})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  const renderFuelManagementForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormField label="Date" required>
          <input type="date" name="date" value={fuelManagementData.date} onChange={(e) => setFuelManagementData({...fuelManagementData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Type de paiement">
          <select name="typePaiement" value={fuelManagementData.typePaiement} onChange={(e) => setFuelManagementData({...fuelManagementData, typePaiement: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Choisir</option>
            <option value="carte">Carte</option>
            <option value="espèces">Espèces</option>
            <option value="virement">Virement</option>
          </select>
        </FormField>
        
        <FormField label="Distance (km)">
          <input type="number" name="distance" value={fuelManagementData.distance} onChange={(e) => setFuelManagementData({...fuelManagementData, distance: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Quantité (L)">
          <input type="number" name="quantity" value={fuelManagementData.quantity} onChange={(e) => setFuelManagementData({...fuelManagementData, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
      
      <div>
        <FormField label="Montant (FCFA)">
          <input type="number" name="amount" value={fuelManagementData.amount} onChange={(e) => setFuelManagementData({...fuelManagementData, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Prix au litre (FCFA)">
          <input type="number" name="prixLitre" value={fuelManagementData.prixLitre} onChange={(e) => setFuelManagementData({...fuelManagementData, prixLitre: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Station">
          <input type="text" name="station" value={fuelManagementData.station} onChange={(e) => setFuelManagementData({...fuelManagementData, station: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
        
        <FormField label="Fichier joint">
          <input type="file" name="fichierJoint" onChange={(e) => setFuelManagementData({...fuelManagementData, fichierJoint: e.target.files?.[0] || null})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </FormField>
      </div>
    </div>
  );
  
  // Filtrage des données
  const filteredVehicles = vehiclesData.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  const filteredStateVehicles = stateVehiclesData.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(stateVehiclesSearchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(stateVehiclesSearchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(stateVehiclesSearchTerm.toLowerCase()) ||
      (vehicle.usingEntity && vehicle.usingEntity.toLowerCase().includes(stateVehiclesSearchTerm.toLowerCase())) ||
      (vehicle.holder && vehicle.holder.toLowerCase().includes(stateVehiclesSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredDrivers = driversData.filter(driver => {
    const matchesSearch = driver.firstName.toLowerCase().includes(driversSearchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(driversSearchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(driversSearchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  const filteredGarages = garagesData.filter(garage => {
    const matchesSearch = garage.name.toLowerCase().includes(garagesSearchTerm.toLowerCase()) ||
      (garage.address && garage.address.toLowerCase().includes(garagesSearchTerm.toLowerCase())) ||
      (garage.manager && garage.manager.toLowerCase().includes(garagesSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredAuthorizations = authorizationsData.filter(authorization => {
    const matchesSearch = authorization.authorizationNumber.toLowerCase().includes(authorizationsSearchTerm.toLowerCase()) ||
      authorization.issuingAuthority.toLowerCase().includes(authorizationsSearchTerm.toLowerCase()) ||
      (authorization.purpose && authorization.purpose.toLowerCase().includes(authorizationsSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredContentieux = contentieuxDataList.filter(contentieux => {
    const matchesSearch = contentieux.description.toLowerCase().includes(contentieuxSearchTerm.toLowerCase()) ||
      (contentieux.conclusion && contentieux.conclusion.toLowerCase().includes(contentieuxSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredInterventions = interventionsData.filter(intervention => {
    const matchesSearch = (intervention.description && intervention.description.toLowerCase().includes(interventionsSearchTerm.toLowerCase())) ||
      (intervention.technician && intervention.technician.toLowerCase().includes(interventionsSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredDecommissioned = decommissionedVehiclesData.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(decommissionedSearchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(decommissionedSearchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(decommissionedSearchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Mise à jour du filtrage pour les véhicules réformés
  const filteredReformed = getReformedVehiclesWithDetails().filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(reformedSearchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(reformedSearchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(reformedSearchTerm.toLowerCase()) ||
      (vehicle.reformReason && vehicle.reformReason.toLowerCase().includes(reformedSearchTerm.toLowerCase())) ||
      (vehicle.buyer && vehicle.buyer.toLowerCase().includes(reformedSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredHistory = vehicleHistoryData.filter(history => {
    const matchesSearch = history.driver.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      history.purpose.toLowerCase().includes(historySearchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  const filteredMaintenanceCalendar = interventionsData.filter(maintenance => {
    const matchesSearch = maintenance.type.toLowerCase().includes(maintenanceCalendarSearchTerm.toLowerCase()) ||
      (maintenance.technician && maintenance.technician.toLowerCase().includes(maintenanceCalendarSearchTerm.toLowerCase())) ||
      (maintenance.description && maintenance.description.toLowerCase().includes(maintenanceCalendarSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const filteredPaymentCards = paymentCardsData.filter(card => 
    card.typeBadge.toLowerCase().includes(paymentCardsSearchTerm.toLowerCase()) ||
    card.numBadge.toLowerCase().includes(paymentCardsSearchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(paymentCardsSearchTerm.toLowerCase())
  );
  
  const filteredVehiclePieces = vehiclePiecesData.filter(piece => 
    piece.type.toLowerCase().includes(vehiclePiecesSearchTerm.toLowerCase()) ||
    piece.description.toLowerCase().includes(vehiclePiecesSearchTerm.toLowerCase())
  );
  
  const filteredVehicleExpenses = vehicleExpensesData.filter(expense => 
    expense.code.toLowerCase().includes(vehicleExpensesSearchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(vehicleExpensesSearchTerm.toLowerCase())
  );
  
  const filteredFuelManagements = fuelManagementsData.filter(fuel => 
    fuel.station.toLowerCase().includes(fuelManagementsSearchTerm.toLowerCase()) ||
    fuel.typePaiement.toLowerCase().includes(fuelManagementsSearchTerm.toLowerCase())
  );
  
  const filteredCardOperations = paymentCardsData.filter(card => 
    card.typeBadge.toLowerCase().includes(cardOperationsSearchTerm.toLowerCase()) ||
    card.numBadge.toLowerCase().includes(cardOperationsSearchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(cardOperationsSearchTerm.toLowerCase())
  );
  
  // Calculs
  const calculateExpensesTotal = () => {
    return vehicleExpensesData.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0);
  };
  
  const calculateFuelTotal = () => {
    return fuelManagementsData.reduce((total, fuel) => {
      return total + (parseFloat(fuel.amount) || 0);
    }, 0);
  };
  
  // Colonnes des tableaux avec tous les champs
  const vehicleColumns = [
    { key: 'licensePlate', title: 'N° Plaque' },
    { key: 'brand', title: 'Marque' },
    { key: 'model', title: 'Modèle' },
    { key: 'type', title: 'Type', render: (value: string) => {
      const typeLabels = {
        car: 'Voiture',
        truck: 'Camion',
        van: 'Camionnette',
        motorcycle: 'Moto',
        other: 'Autre'
      };
      return typeLabels[value as keyof typeof typeLabels];
    }},
    { key: 'year', title: 'Année' },
    { key: 'mileage', title: 'Kilométrage', render: (value: number) => `${value.toLocaleString()} km` },
    { key: 'civilRegistration', title: 'Immat. Civile' },
    { key: 'administrativeRegistration', title: 'Immat. Admin.' },
    { key: 'acquisitionDate', title: 'Date acquisition' },
    { key: 'usingEntity', title: 'Entité utilisatrice' },
    { key: 'holder', title: 'Détenteur' },
    { key: 'chassisNumber', title: 'N° châssis' },
    { key: 'status', title: 'Statut', render: (value: string) => {
      const statusColors = {
        available: 'bg-green-100 text-green-800',
        'in-use': 'bg-blue-100 text-blue-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        decommissioned: 'bg-red-100 text-red-800',
        reformed: 'bg-gray-100 text-gray-800'
      };
      
      const statusLabels = {
        available: 'Disponible',
        'in-use': 'En utilisation',
        maintenance: 'Maintenance',
        decommissioned: 'Déclassé',
        reformed: 'Réformé'
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    { key: 'assignedTo', title: 'Affecté à' },
    { key: 'fuelType', title: 'Type carburant', render: (value: string) => {
      const fuelLabels = {
        gasoline: 'Essence',
        diesel: 'Diesel',
        electric: 'Électrique',
        hybrid: 'Hybride'
      };
      return fuelLabels[value as keyof typeof fuelLabels];
    }},
    // Ajout des champs manquants par rapport au formulaire
    { key: 'fullName', title: 'Nom complet' },
    { key: 'fuel', title: 'Carburant' },
    { key: 'vehicleType', title: 'Type de véhicule' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: Vehicle) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditVehicle(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                deleteVehicle(record.id);
              }
            }}
            className="text-red-500 hover:bg-red-50"
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];
  
  // Colonnes spécifiques pour les véhicules de l'État
  const stateVehicleColumns = [
    { key: 'licensePlate', title: 'N° Plaque' },
    { key: 'brand', title: 'Marque' },
    { key: 'model', title: 'Modèle' },
    { key: 'type', title: 'Type', render: (value: string) => {
      const typeLabels = {
        car: 'Voiture',
        truck: 'Camion',
        van: 'Camionnette',
        motorcycle: 'Moto',
        other: 'Autre'
      };
      return typeLabels[value as keyof typeof typeLabels];
    }},
    { key: 'year', title: 'Année' },
    { key: 'mileage', title: 'Kilométrage', render: (value: number) => `${value.toLocaleString()} km` },
    { key: 'ministry', title: 'Ministère' },
    { key: 'department', title: 'Département' },
    { key: 'service', title: 'Service' },
    { key: 'budgetAllocation', title: 'Allocation budgétaire' },
    { key: 'statePropertyNumber', title: 'N° bien État' },
    { key: 'status', title: 'Statut', render: (value: string) => {
      const statusColors = {
        available: 'bg-green-100 text-green-800',
        'in-use': 'bg-blue-100 text-blue-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        decommissioned: 'bg-red-100 text-red-800',
        reformed: 'bg-gray-100 text-gray-800'
      };
      
      const statusLabels = {
        available: 'Disponible',
        'in-use': 'En utilisation',
        maintenance: 'Maintenance',
        decommissioned: 'Déclassé',
        reformed: 'Réformé'
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    // Ajout des champs manquants par rapport au formulaire
    { key: 'fullName', title: 'Nom complet' },
    { key: 'fuel', title: 'Carburant' },
    { key: 'vehicleType', title: 'Type de véhicule' },
    { key: 'usingEntity', title: 'Entité utilisatrice' },
    { key: 'holder', title: 'Détenteur' },
    { key: 'acquisitionDate', title: 'Date acquisition' },
    { key: 'civilRegistration', title: 'Immat. Civile' },
    { key: 'administrativeRegistration', title: 'Immat. Admin.' },
    { key: 'chassisNumber', title: 'N° châssis' },
    { key: 'assignedTo', title: 'Affecté à' },
    { key: 'fuelType', title: 'Type carburant', render: (value: string) => {
      const fuelLabels = {
        gasoline: 'Essence',
        diesel: 'Diesel',
        electric: 'Électrique',
        hybrid: 'Hybride'
      };
      return fuelLabels[value as keyof typeof fuelLabels];
    }},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: Vehicle) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditStateVehicle(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                deleteVehicle(record.id);
              }
            }}
            className="text-red-500 hover:bg-red-50"
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];
  
  const driversColumns = [
    { key: 'firstName', title: 'Prénom' },
    { key: 'lastName', title: 'Nom' },
    { key: 'licenseNumber', title: 'N° Permis' },
    { key: 'licenseExpiryDate', title: 'Expiration permis' },
    { key: 'dateOfBirth', title: 'Date de naissance' },
    { key: 'phoneNumber', title: 'Téléphone' },
    { key: 'address', title: 'Adresse' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          suspended: 'bg-yellow-100 text-yellow-800',
          inactive: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          active: 'Actif',
          suspended: 'Suspendu',
          inactive: 'Inactif'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { key: 'assignedVehicleId', title: 'Véhicule assigné', render: (value: string) => {
      if (!value) return 'Aucun';
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditDriver(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
                deleteDriver(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const garagesColumns = [
    { key: 'name', title: 'Nom' },
    { key: 'address', title: 'Adresse' },
    { key: 'phoneNumber', title: 'Téléphone' },
    { key: 'manager', title: 'Responsable' },
    { key: 'capacity', title: 'Capacité' },
    { 
      key: 'type', 
      title: 'Type', 
      render: (value: string) => {
        const typeLabels = {
          public: 'Public',
          private: 'Privé',
          authorized: 'Autorisé'
        };
        return typeLabels[value as keyof typeof typeLabels];
      }
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditGarage(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce garage ?')) {
                deleteGarage(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const authorizationsColumns = [
    { key: 'authorizationNumber', title: 'N° Autorisation' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'issueDate', title: 'Date d\'émission' },
    { key: 'expiryDate', title: 'Date d\'expiration' },
    { key: 'issuingAuthority', title: 'Autorité émettrice' },
    { key: 'purpose', title: 'Objet' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          expired: 'bg-red-100 text-red-800',
          revoked: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          active: 'Active',
          expired: 'Expirée',
          revoked: 'Révoquée'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Eye}>
            Voir
          </Button>
          <Button variant="primary" size="sm" icon={FileText}>
            Générer
          </Button>
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditAuthorization(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette autorisation ?')) {
                deleteVehicleAuthorization(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const contentieuxColumns = [
    { key: 'incidentDate', title: 'Date incident' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'description', title: 'Description' },
    { 
      key: 'faultAttribution', 
      title: 'Attribution faute', 
      render: (value: string) => {
        const faultLabels = {
          state: 'État',
          holder: 'Détenteur',
          undetermined: 'Indéterminée'
        };
        return faultLabels[value as keyof typeof faultLabels];
      }
    },
    { key: 'conclusion', title: 'Conclusion' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          open: 'bg-yellow-100 text-yellow-800',
          'in_progress': 'bg-blue-100 text-blue-800',
          resolved: 'bg-green-100 text-green-800',
          closed: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          open: 'Ouvert',
          'in_progress': 'En cours',
          resolved: 'Résolu',
          closed: 'Fermé'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { key: 'resolutionDate', title: 'Date résolution' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditContentieux(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contentieux ?')) {
                deleteContentieux(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const interventionsColumns = [
    { key: 'interventionDate', title: 'Date intervention' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'garageId', title: 'Garage', render: (value: string) => {
      const garage = garagesData.find(g => g.id === value);
      return garage ? garage.name : 'Inconnu';
    }},
    { 
      key: 'type', 
      title: 'Type', 
      render: (value: string) => {
        const typeLabels = {
          maintenance: 'Maintenance',
          repair: 'Réparation',
          inspection: 'Inspection',
          other: 'Autre'
        };
        return typeLabels[value as keyof typeof typeLabels];
      }
    },
    { key: 'description', title: 'Description' },
    { key: 'cost', title: 'Coût (FCFA)', render: (value: number) => value?.toLocaleString() },
    { key: 'technician', title: 'Technicien' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          scheduled: 'bg-yellow-100 text-yellow-800',
          'in_progress': 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          scheduled: 'Programmé',
          'in_progress': 'En cours',
          completed: 'Terminé',
          cancelled: 'Annulé'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { key: 'nextInterventionDate', title: 'Prochaine intervention' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditIntervention(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
                deleteVehicleIntervention(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const paymentCardsColumns = [
    { key: 'dateAchat', title: 'Date d\'achat' },
    { key: 'typeBadge', title: 'Type Badge' },
    { key: 'typeBadgeLibre', title: 'Type libre' },
    { key: 'numBadge', title: 'N° Badge' },
    { key: 'description', title: 'Description' },
    { key: 'montant', title: 'Montant', render: (value: any) => `${parseFloat(value || 0).toFixed(2)} FCFA` },
    { key: 'dateMiseEnService', title: 'Mise en service' },
    { key: 'fichierJoint', title: 'Fichier joint', render: (value: any) => value ? 'Oui' : 'Non' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditPaymentCard(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => handleDeletePaymentCard(record.id)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const vehiclePiecesColumns = [
    { key: 'type', title: 'Type' },
    { key: 'typeLibre', title: 'Type libre' },
    { key: 'description', title: 'Description' },
    { key: 'montant', title: 'Montant', render: (value: any) => `${parseFloat(value || 0).toFixed(2)} FCFA` },
    { key: 'dateDebut', title: 'Date début' },
    { key: 'dateFin', title: 'Date fin' },
    { key: 'dateProchaine', title: 'Date prochaine' },
    { key: 'fichierJoint', title: 'Fichier joint', render: (value: any) => value ? 'Oui' : 'Non' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditVehiclePiece(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => handleDeleteVehiclePiece(record.id)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const vehicleExpensesColumns = [
    { key: 'date', title: 'Date' },
    { key: 'nextDate', title: 'Date prochaine' },
    { key: 'code', title: 'Code' },
    { key: 'description', title: 'Description' },
    { key: 'distance', title: 'Distance (km)' },
    { key: 'amount', title: 'Montant', render: (value: any) => `${parseFloat(value || 0).toFixed(2)} FCFA` },
    { key: 'statut', title: 'Statut', render: (value: string) => {
      const statusColors = {
        'non-payé': 'bg-red-100 text-red-800',
        'payé': 'bg-green-100 text-green-800',
        'remboursé': 'bg-blue-100 text-blue-800',
      };
      
      const statusLabels = {
        'non-payé': 'Non payé',
        'payé': 'Payé',
        'remboursé': 'Remboursé',
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    { key: 'fichierJoint', title: 'Fichier joint', render: (value: any) => value ? 'Oui' : 'Non' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditVehicleExpense(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => handleDeleteVehicleExpense(record.id)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const fuelManagementsColumns = [
    { key: 'date', title: 'Date' },
    { key: 'station', title: 'Station' },
    { key: 'typePaiement', title: 'Type paiement' },
    { key: 'distance', title: 'Distance (km)' },
    { key: 'quantity', title: 'Quantité (L)' },
    { key: 'amount', title: 'Montant', render: (value: any) => `${parseFloat(value || 0).toFixed(2)} FCFA` },
    { key: 'prixLitre', title: 'Prix/L (FCFA)', render: (value: any) => `${parseFloat(value || 0).toFixed(2)}` },
    { key: 'fichierJoint', title: 'Fichier joint', render: (value: any) => value ? 'Oui' : 'Non' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditFuelManagement(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => handleDeleteFuelManagement(record.id)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const historyColumns = [
    { key: 'date', title: 'Date' },
    { key: 'driver', title: 'Chauffeur' },
    { key: 'distance', title: 'Distance parcourue (km)' },
    { key: 'purpose', title: 'Motif' },
    { key: 'startTime', title: 'Heure de début' },
    { key: 'endTime', title: 'Heure de fin' }
  ];
  
  // Colonnes complètes pour le calendrier de maintenance
  const maintenanceCalendarColumns = [
    { key: 'interventionDate', title: 'Date intervention' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'garageId', title: 'Garage', render: (value: string) => {
      const garage = garagesData.find(g => g.id === value);
      return garage ? garage.name : 'Inconnu';
    }},
    { 
      key: 'type', 
      title: 'Type intervention', 
      render: (value: string) => {
        const typeLabels = {
          maintenance: 'Maintenance',
          repair: 'Réparation',
          inspection: 'Inspection',
          other: 'Autre'
        };
        return typeLabels[value as keyof typeof typeLabels];
      }
    },
    { key: 'description', title: 'Description' },
    { key: 'cost', title: 'Coût (FCFA)', render: (value: number) => value?.toLocaleString() },
    { key: 'technician', title: 'Technicien' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          scheduled: 'bg-yellow-100 text-yellow-800',
          'in_progress': 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          scheduled: 'Programmé',
          'in_progress': 'En cours',
          completed: 'Terminé',
          cancelled: 'Annulé'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { key: 'nextInterventionDate', title: 'Prochaine intervention' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditIntervention(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
                deleteVehicleIntervention(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  // Colonnes améliorées pour les tableaux de recherche
  const vehicleSearchColumns = [
    { key: 'licensePlate', title: 'N° Plaque' },
    { key: 'brand', title: 'Marque' },
    { key: 'model', title: 'Modèle' },
    { key: 'type', title: 'Type', render: (value: string) => {
      const typeLabels = {
        car: 'Voiture',
        truck: 'Camion',
        van: 'Camionnette',
        motorcycle: 'Moto',
        other: 'Autre'
      };
      return typeLabels[value as keyof typeof typeLabels];
    }},
    { key: 'year', title: 'Année' },
    { key: 'status', title: 'Statut', render: (value: string) => {
      const statusColors = {
        available: 'bg-green-100 text-green-800',
        'in-use': 'bg-blue-100 text-blue-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        decommissioned: 'bg-red-100 text-red-800',
        reformed: 'bg-gray-100 text-gray-800'
      };
      
      const statusLabels = {
        available: 'Disponible',
        'in-use': 'En utilisation',
        maintenance: 'Maintenance',
        decommissioned: 'Déclassé',
        reformed: 'Réformé'
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    // Ajout des champs manquants
    { key: 'fullName', title: 'Nom complet' },
    { key: 'fuel', title: 'Carburant' },
    { key: 'vehicleType', title: 'Type de véhicule' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: Vehicle) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditVehicle(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                deleteVehicle(record.id);
              }
            }}
            className="text-red-500 hover:bg-red-50"
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];
  
  const stateVehicleSearchColumns = [
    { key: 'licensePlate', title: 'N° Plaque' },
    { key: 'brand', title: 'Marque' },
    { key: 'model', title: 'Modèle' },
    { key: 'ministry', title: 'Ministère' },
    { key: 'department', title: 'Département' },
    { key: 'status', title: 'Statut', render: (value: string) => {
      const statusColors = {
        available: 'bg-green-100 text-green-800',
        'in-use': 'bg-blue-100 text-blue-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        decommissioned: 'bg-red-100 text-red-800',
        reformed: 'bg-gray-100 text-gray-800'
      };
      
      const statusLabels = {
        available: 'Disponible',
        'in-use': 'En utilisation',
        maintenance: 'Maintenance',
        decommissioned: 'Déclassé',
        reformed: 'Réformé'
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    // Ajout des champs manquants
    { key: 'fullName', title: 'Nom complet' },
    { key: 'fuel', title: 'Carburant' },
    { key: 'vehicleType', title: 'Type de véhicule' },
    { key: 'usingEntity', title: 'Entité utilisatrice' },
    { key: 'holder', title: 'Détenteur' },
    { key: 'acquisitionDate', title: 'Date acquisition' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: Vehicle) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditStateVehicle(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                deleteVehicle(record.id);
              }
            }}
            className="text-red-500 hover:bg-red-50"
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];
  
  const driversSearchColumns = [
    { key: 'firstName', title: 'Prénom' },
    { key: 'lastName', title: 'Nom' },
    { key: 'licenseNumber', title: 'N° Permis' },
    { key: 'phoneNumber', title: 'Téléphone' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          suspended: 'bg-yellow-100 text-yellow-800',
          inactive: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          active: 'Actif',
          suspended: 'Suspendu',
          inactive: 'Inactif'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { key: 'assignedVehicleId', title: 'Véhicule assigné', render: (value: string) => {
      if (!value) return 'Aucun';
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditDriver(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
                deleteDriver(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const garagesSearchColumns = [
    { key: 'name', title: 'Nom' },
    { key: 'type', title: 'Type', render: (value: string) => {
      const typeLabels = {
        public: 'Public',
        private: 'Privé',
        authorized: 'Autorisé'
      };
      return typeLabels[value as keyof typeof typeLabels];
    }},
    { key: 'capacity', title: 'Capacité' },
    { key: 'manager', title: 'Responsable' },
    { key: 'phoneNumber', title: 'Téléphone' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditGarage(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2}
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce garage ?')) {
                deleteGarage(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const authorizationsSearchColumns = [
    { key: 'authorizationNumber', title: 'N° Autorisation' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'issueDate', title: 'Date émission' },
    { key: 'expiryDate', title: 'Date expiration' },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          expired: 'bg-red-100 text-red-800',
          revoked: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          active: 'Active',
          expired: 'Expirée',
          revoked: 'Révoquée'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Eye}>
            Voir
          </Button>
          <Button variant="primary" size="sm" icon={FileText}>
            Générer
          </Button>
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditAuthorization(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette autorisation ?')) {
                deleteVehicleAuthorization(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const contentieuxSearchColumns = [
    { key: 'incidentDate', title: 'Date incident' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'description', title: 'Description', render: (value: string) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    )},
    { 
      key: 'faultAttribution', 
      title: 'Attribution faute', 
      render: (value: string) => {
        const faultLabels = {
          state: 'État',
          holder: 'Détenteur',
          undetermined: 'Indéterminée'
        };
        return faultLabels[value as keyof typeof faultLabels];
      }
    },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          open: 'bg-yellow-100 text-yellow-800',
          'in_progress': 'bg-blue-100 text-blue-800',
          resolved: 'bg-green-100 text-green-800',
          closed: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          open: 'Ouvert',
          'in_progress': 'En cours',
          resolved: 'Résolu',
          closed: 'Fermé'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditContentieux(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contentieux ?')) {
                deleteContentieux(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const interventionsSearchColumns = [
    { key: 'interventionDate', title: 'Date intervention' },
    { key: 'vehicleId', title: 'Véhicule', render: (value: string) => {
      const vehicle = vehiclesData.find(v => v.id === value);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}` : 'Inconnu';
    }},
    { key: 'garageId', title: 'Garage', render: (value: string) => {
      const garage = garagesData.find(g => g.id === value);
      return garage ? garage.name : 'Inconnu';
    }},
    { 
      key: 'type', 
      title: 'Type', 
      render: (value: string) => {
        const typeLabels = {
          maintenance: 'Maintenance',
          repair: 'Réparation',
          inspection: 'Inspection',
          other: 'Autre'
        };
        return typeLabels[value as keyof typeof typeLabels];
      }
    },
    { 
      key: 'status', 
      title: 'Statut', 
      render: (value: string) => {
        const statusColors = {
          scheduled: 'bg-yellow-100 text-yellow-800',
          'in_progress': 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-gray-100 text-gray-800'
        };
        
        const statusLabels = {
          scheduled: 'Programmé',
          'in_progress': 'En cours',
          completed: 'Terminé',
          cancelled: 'Annulé'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditIntervention(record)}>
            Modifier
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
                deleteVehicleIntervention(record.id);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];
  
  const decommissionedSearchColumns = [
    { key: 'licensePlate', title: 'N° Plaque' },
    { key: 'brand', title: 'Marque' },
    { key: 'model', title: 'Modèle' },
    { key: 'year', title: 'Année' },
    { key: 'mileage', title: 'Kilométrage', render: (value: number) => `${value.toLocaleString()} km` },
    { key: 'status', title: 'Statut', render: (value: string) => {
      const statusColors = {
        decommissioned: 'bg-red-100 text-red-800',
        reformed: 'bg-gray-100 text-gray-800'
      };
      
      const statusLabels = {
        decommissioned: 'Déclassé',
        reformed: 'Réformé'
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: Vehicle) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditVehicle(record)}>
            Modifier
          </Button>
          {record.status === 'decommissioned' && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => {
                setReformData({
                  vehicleId: record.id,
                  reformDate: '',
                  reformReason: '',
                  salePrice: '',
                  buyer: '',
                  buyerNumber: '',
                  buyerAddress: '',
                  disposalMethod: 'vente',
                  reformReport: null,
                  reformCertificate: null
                });
                setMainTab('creation');
                setCreationSubTab('reformed');
              }}
            >
              Réformer
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  // Mise à jour des colonnes pour le tableau de réforme
  const reformedSearchColumns = [
    { key: 'licensePlate', title: 'N° Plaque' },
    { key: 'brand', title: 'Marque' },
    { key: 'model', title: 'Modèle' },
    { key: 'year', title: 'Année' },
    { key: 'reformDate', title: 'Date de réforme' },
    { key: 'reformReason', title: 'Motif de réforme' },
    { key: 'disposalMethod', title: 'Méthode de disposition', render: (value: string) => {
      const methodLabels = {
        vente: 'Vente',
        destruction: 'Destruction',
        don: 'Don'
      };
      return methodLabels[value as keyof typeof methodLabels];
    }},
    { key: 'salePrice', title: 'Prix de vente (FCFA)', render: (value: string) => value ? `${parseFloat(value || '0').toFixed(2)} FCFA` : '-' },
    { key: 'buyer', title: 'Acheteur' },
    { key: 'buyerNumber', title: 'N° Téléphone acheteur' },
    { key: 'buyerAddress', title: 'Adresse acheteur' },
    { key: 'reformReport', title: 'Rapport de réforme', render: (value: any) => value ? 'Oui' : 'Non' },
    { key: 'reformCertificate', title: 'Certificat de réforme', render: (value: any) => value ? 'Oui' : 'Non' },
    { key: 'status', title: 'Statut', render: (value: string) => {
      const statusColors = {
        decommissioned: 'bg-red-100 text-red-800',
        reformed: 'bg-gray-100 text-gray-800'
      };
      
      const statusLabels = {
        decommissioned: 'Déclassé',
        reformed: 'Réformé'
      };
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      );
    }},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleEditVehicle(record)}>
            Modifier
          </Button>
        </div>
      ),
    },
  ];
  
  const historySearchColumns = [
    { key: 'date', title: 'Date' },
    { key: 'driver', title: 'Chauffeur' },
    { key: 'distance', title: 'Distance (km)' },
    { key: 'purpose', title: 'Motif', render: (value: string) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    )},
    { key: 'startTime', title: 'Début' },
    { key: 'endTime', title: 'Fin' },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" icon={Eye}>
            Détails
          </Button>
        </div>
      )
    }
  ];
  
  // Rendu du contenu principal
  const renderSearchContent = () => {
    return (
      <div className="p-6">
        {/* Onglets de recherche */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {[
            { id: 'vehicles', label: 'Véhicules', icon: Car },
            { id: 'stateVehicles', label: 'Véhicules de l\'État', icon: Car },
            { id: 'drivers', label: 'Chauffeurs', icon: User },
            { id: 'garages', label: 'Garages', icon: Wrench },
            { id: 'authorizations', label: 'Autorisations', icon: FileText },
            { id: 'contentieux', label: 'Contentieux', icon: AlertTriangle },
            { id: 'interventions', label: 'Interventions', icon: Wrench },
            { id: 'decommissioned', label: 'Déclassés', icon: Trash2 },
            { id: 'reformed', label: 'Réformés', icon: Trash },
            { id: 'history', label: 'Historique', icon: Clock },
            { id: 'maintenanceCalendar', label: 'Calendrier maintenance', icon: Calendar },
            { id: 'paymentCards', label: 'Cartes de paiement', icon: CreditCard },
            { id: 'vehiclePieces', label: 'Pièces du véhicule', icon: File },
            { id: 'vehicleExpenses', label: 'Gestion des frais', icon: Settings },
            { id: 'fuelManagements', label: 'Gestion du carburant', icon: Settings },
            { id: 'cardOperations', label: 'Opérations de carte', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-medium flex items-center ${searchSubTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSearchSubTab(tab.id)}
            >
              {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Contenu selon l'onglet sélectionné */}
        {searchSubTab === 'vehicles' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de véhicules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Marque, modèle, plaque..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="available">Disponible</option>
                    <option value="in-use">En utilisation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="decommissioned">Déclassé</option>
                    <option value="reformed">Réformé</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button variant="primary" icon={Filter} className="w-full">
                    Filtrer
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des véhicules</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddVehicle}>
                Ajouter un véhicule
              </Button>
            </div>
            
            <Table data={filteredVehicles} columns={vehicleColumns} />
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun véhicule trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'stateVehicles' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de véhicules de l'État</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Marque, modèle, plaque, ministère..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={stateVehiclesSearchTerm}
                      onChange={(e) => setStateVehiclesSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des véhicules de l'État</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddStateVehicle}>
                Ajouter un véhicule de l'État
              </Button>
            </div>
            
            <Table data={filteredStateVehicles} columns={stateVehicleColumns} />
            
            {filteredStateVehicles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun véhicule de l'État trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'drivers' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de chauffeurs</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Nom, prénom, numéro de permis..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={driversSearchTerm}
                      onChange={(e) => setDriversSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des chauffeurs</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddDriver}>
                Ajouter un chauffeur
              </Button>
            </div>
            
            <Table data={filteredDrivers} columns={driversColumns} />
            
            {filteredDrivers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun chauffeur trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'garages' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de garages</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Nom, adresse, responsable..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={garagesSearchTerm}
                      onChange={(e) => setGaragesSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des garages</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddGarage}>
                Ajouter un garage
              </Button>
            </div>
            
            <Table data={filteredGarages} columns={garagesColumns} />
            
            {filteredGarages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun garage trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'authorizations' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche d'autorisations</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Numéro d'autorisation, autorité émettrice..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={authorizationsSearchTerm}
                      onChange={(e) => setAuthorizationsSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des autorisations</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddAuthorization}>
                Générer une autorisation
              </Button>
            </div>
            
            <Table data={filteredAuthorizations} columns={authorizationsColumns} />
            
            {filteredAuthorizations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune autorisation trouvée</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'contentieux' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de contentieux</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Description, conclusion..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={contentieuxSearchTerm}
                      onChange={(e) => setContentieuxSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des contentieux</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddContentieux}>
                Enregistrer un contentieux
              </Button>
            </div>
            
            <Table data={filteredContentieux} columns={contentieuxColumns} />
            
            {filteredContentieux.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun contentieux trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'interventions' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche d'interventions</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Description, technicien..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={interventionsSearchTerm}
                      onChange={(e) => setInterventionsSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Liste des interventions</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddIntervention}>
                Enregistrer une intervention
              </Button>
            </div>
            
            <Table data={filteredInterventions} columns={interventionsColumns} />
            
            {filteredInterventions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune intervention trouvée</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'decommissioned' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de véhicules déclassés</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Marque, modèle, plaque..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={decommissionedSearchTerm}
                      onChange={(e) => setDecommissionedSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Véhicules à déclasser</h2>
            
            <Table data={filteredDecommissioned} columns={decommissionedSearchColumns} />
            
            {filteredDecommissioned.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun véhicule à déclasser trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'reformed' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche de véhicules réformés</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Marque, modèle, plaque, motif..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reformedSearchTerm}
                      onChange={(e) => setReformedSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Véhicules réformés</h2>
              <Button variant="primary" icon={Plus}>
                Enregistrer résultats enchères
              </Button>
            </div>
            
            <Table data={filteredReformed} columns={reformedSearchColumns} />
            
            {filteredReformed.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun véhicule réformé trouvé</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'history' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche dans l'historique</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Chauffeur, motif..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={historySearchTerm}
                      onChange={(e) => setHistorySearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Historique d'utilisation du véhicule</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner un véhicule</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedVehicleForHistory}
                onChange={(e) => setSelectedVehicleForHistory(e.target.value)}
              >
                <option value="">Choisir un véhicule</option>
                {vehiclesData.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} - {vehicle.licensePlate}</option>
                ))}
              </select>
            </div>

            {selectedVehicleForHistory && (
              <Table data={filteredHistory} columns={historyColumns} />
            )}

            {!selectedVehicleForHistory && (
              <div className="text-center py-8">
                <p className="text-gray-500">Veuillez sélectionner un véhicule pour afficher son historique</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'maintenanceCalendar' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche dans le calendrier de maintenance</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Type d'intervention, garage, technicien, description..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={maintenanceCalendarSearchTerm}
                      onChange={(e) => setMaintenanceCalendarSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Calendrier de maintenance</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddIntervention}>
                Ajouter une intervention
              </Button>
            </div>
            
            <Table data={filteredMaintenanceCalendar} columns={maintenanceCalendarColumns} />
            
            {filteredMaintenanceCalendar.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune maintenance planifiée</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'paymentCards' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Cartes de paiement</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddPaymentCard}>
                Ajouter une carte
              </Button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une carte..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={paymentCardsSearchTerm}
                    onChange={(e) => setPaymentCardsSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="primary" icon={Search}>
                Rechercher
              </Button>
            </div>
            
            <Table data={filteredPaymentCards} columns={paymentCardsColumns} />
            
            {filteredPaymentCards.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune carte de paiement trouvée</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'vehiclePieces' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Pièces du véhicule</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddVehiclePiece}>
                Ajouter une pièce
              </Button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une pièce..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={vehiclePiecesSearchTerm}
                    onChange={(e) => setVehiclePiecesSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="primary" icon={Search}>
                Rechercher
              </Button>
            </div>
            
            <Table data={filteredVehiclePieces} columns={vehiclePiecesColumns} />
            
            {filteredVehiclePieces.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune pièce trouvée</p>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'vehicleExpenses' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Gestion des frais</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddVehicleExpense}>
                Ajouter une dépense
              </Button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une dépense..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={vehicleExpensesSearchTerm}
                    onChange={(e) => setVehicleExpensesSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="primary" icon={Search}>
                Rechercher
              </Button>
            </div>
            
            <Table data={filteredVehicleExpenses} columns={vehicleExpensesColumns} />
            
            {filteredVehicleExpenses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune dépense trouvée</p>
              </div>
            )}
            
            {filteredVehicleExpenses.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Total des dépenses</h4>
                  <p className="text-2xl font-bold text-blue-600">{calculateExpensesTotal().toFixed(2)} FCFA</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" icon={Download}>
                    Exporter
                  </Button>
                  <Button variant="primary" icon={Upload}>
                    Importer
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'fuelManagements' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Gestion du carburant</h2>
              <Button variant="primary" icon={Plus} onClick={handleAddFuelManagement}>
                Ajouter un enregistrement
              </Button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un plein..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={fuelManagementsSearchTerm}
                    onChange={(e) => setFuelManagementsSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="primary" icon={Search}>
                Rechercher
              </Button>
            </div>
            
            <Table data={filteredFuelManagements} columns={fuelManagementsColumns} />
            
            {filteredFuelManagements.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun enregistrement de carburant trouvé</p>
              </div>
            )}
            
            {filteredFuelManagements.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Total carburant</h4>
                  <p className="text-2xl font-bold text-green-600">{calculateFuelTotal().toFixed(2)} FCFA</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Consommation moyenne: {fuelManagementsData.length > 0 ? (fuelManagementsData.reduce((total, fuel) => total + (parseFloat(fuel.quantity) || 0), 0) / fuelManagementsData.length).toFixed(2) : '0.00'} L/plein</p>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {searchSubTab === 'cardOperations' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recherche d'opérations de carte</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Rechercher une opération..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={cardOperationsSearchTerm}
                      onChange={(e) => setCardOperationsSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="primary" icon={Search}>
                  Rechercher
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Opérations de carte</h2>
            
            <Table data={filteredCardOperations} columns={paymentCardsColumns} />
            
            {filteredCardOperations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune opération de carte trouvée</p>
              </div>
            )}
          </Card>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    if (mainTab === 'search') {
      return renderSearchContent();
    }
    
    if (mainTab === 'creation') {
      return (
        <div className="p-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
            {[
              { id: 'vehicles', label: 'Informations Générales' },
              { id: 'stateVehicles', label: 'Véhicules de l\'État' },
              { id: 'vehiclePieces', label: 'Pièces du véhicule' },
              { id: 'paymentCards', label: 'Carte de paiement' },
              { id: 'fuelManagements', label: 'Gestion du carburant' },
              { id: 'vehicleExpenses', label: 'Gestion des frais' },
              { id: 'cardOperations', label: 'Opérations de Carte/Badge' },
              { id: 'maintenanceCalendar', label: 'Maintenance' },
              { id: 'drivers', label: 'Chauffeurs' },
              { id: 'garages', label: 'Garages' },
              { id: 'authorizations', label: 'Autorisations' },
              { id: 'contentieux', label: 'Contentieux' },
              { id: 'interventions', label: 'Interventions' },
              { id: 'decommissioned', label: 'Déclassés' },
              { id: 'reformed', label: 'Réformés' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium ${creationSubTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setCreationSubTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {creationSubTab === 'vehicles' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations générales du véhicule</h2>
              {renderVehicleForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveVehicle}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'stateVehicles' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Véhicules de l'État</h2>
              {renderStateVehicleForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveStateVehicle}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'vehiclePieces' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Ajouter une pièce du véhicule</h2>
              {renderVehiclePieceForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setVehiclePieceData({
                    id: '',
                    type: '',
                    typeLibre: '',
                    description: '',
                    montant: '',
                    dateDebut: '',
                    dateFin: '',
                    dateProchaine: '',
                    fichierJoint: null
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveVehiclePiece}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'paymentCards' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Ajouter une carte de paiement</h2>
              {renderPaymentCardForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setPaymentCardData({
                    id: '',
                    dateAchat: '',
                    typeBadge: '',
                    typeBadgeLibre: '',
                    numBadge: '',
                    description: '',
                    montant: '',
                    dateMiseEnService: '',
                    fichierJoint: null
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSavePaymentCard}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'fuelManagements' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Ajouter un enregistrement de carburant</h2>
              {renderFuelManagementForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setFuelManagementData({
                    id: '',
                    date: '',
                    typePaiement: '',
                    distance: '',
                    quantity: '',
                    amount: '',
                    prixLitre: '',
                    station: '',
                    fichierJoint: null
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveFuelManagement}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'vehicleExpenses' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Gestion des frais</h2>
              {renderVehicleExpenseForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setVehicleExpenseData({
                    id: '',
                    date: '',
                    nextDate: '',
                    code: '',
                    description: '',
                    distance: '',
                    amount: '',
                    statut: 'non-payé',
                    fichierJoint: null
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveVehicleExpense}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'cardOperations' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Opérations de Carte/Badge</h2>
              {renderPaymentCardForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setPaymentCardData({
                    id: '',
                    dateAchat: '',
                    typeBadge: '',
                    typeBadgeLibre: '',
                    numBadge: '',
                    description: '',
                    montant: '',
                    dateMiseEnService: '',
                    fichierJoint: null
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSavePaymentCard}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'maintenanceCalendar' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Maintenance</h2>
              {renderInterventionForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setInterventionData({
                    id: '',
                    vehicleId: '',
                    garageId: '',
                    interventionDate: '',
                    type: 'maintenance',
                    description: '',
                    cost: 0,
                    technician: '',
                    status: 'scheduled',
                    nextInterventionDate: ''
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveIntervention}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'drivers' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Chauffeurs</h2>
              {renderDriverForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setDriverData({
                    id: '',
                    firstName: '',
                    lastName: '',
                    licenseNumber: '',
                    licenseExpiryDate: '',
                    dateOfBirth: '',
                    phoneNumber: '',
                    address: '',
                    status: 'active',
                    assignedVehicleId: ''
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveDriver}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'garages' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Garages</h2>
              {renderGarageForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setGarageData({
                    id: '',
                    name: '',
                    address: '',
                    phoneNumber: '',
                    manager: '',
                    capacity: 0,
                    type: 'public'
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveGarage}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'authorizations' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Autorisations</h2>
              {renderAuthorizationForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setAuthorizationData({
                    id: '',
                    vehicleId: '',
                    authorizationNumber: '',
                    issueDate: '',
                    expiryDate: '',
                    issuingAuthority: '',
                    purpose: '',
                    status: 'active'
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveAuthorization}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'contentieux' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Contentieux</h2>
              {renderContentieuxForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setContentieuxData({
                    id: '',
                    vehicleId: '',
                    incidentDate: '',
                    description: '',
                    faultAttribution: 'undetermined',
                    conclusion: '',
                    status: 'open',
                    resolutionDate: ''
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveContentieux}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'interventions' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Interventions</h2>
              {renderInterventionForm()}
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setInterventionData({
                    id: '',
                    vehicleId: '',
                    garageId: '',
                    interventionDate: '',
                    type: 'maintenance',
                    description: '',
                    cost: 0,
                    technician: '',
                    status: 'scheduled',
                    nextInterventionDate: ''
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveIntervention}>
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'decommissioned' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Déclassés</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Pour déclasser un véhicule, veuillez modifier son statut dans la section "Véhicules" et le passer à "Déclassé".
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun formulaire spécifique pour cette section</p>
              </div>
            </Card>
          )}
          
          {creationSubTab === 'reformed' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Formulaire de réforme de véhicule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField label="Véhicule à réformer" required>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reformData.vehicleId}
                      onChange={(e) => setReformData({...reformData, vehicleId: e.target.value})}
                    >
                      <option value="">Sélectionner un véhicule</option>
                      {vehiclesData.filter(v => v.status === 'decommissioned').map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  
                  <FormField label="Date de réforme" required>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reformData.reformDate}
                      onChange={(e) => setReformData({...reformData, reformDate: e.target.value})}
                    />
                  </FormField>
                  
                  <FormField label="Motif de la réforme" required>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={reformData.reformReason}
                      onChange={(e) => setReformData({...reformData, reformReason: e.target.value})}
                      placeholder="Expliquer les raisons de la réforme (vieillissement, accident, etc.)"
                    />
                  </FormField>
                  
                  <FormField label="Méthode de disposition" required>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={reformData.disposalMethod}
                      onChange={(e) => setReformData({...reformData, disposalMethod: e.target.value as any})}
                    >
                      <option value="vente">Vente aux enchères</option>
                      <option value="destruction">Destruction</option>
                      <option value="don">Don</option>
                    </select>
                  </FormField>
                  
                  <FormField label="Rapport de réforme">
                    <input 
                      type="file" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setReformData({...reformData, reformReport: e.target.files?.[0] || null})}
                    />
                  </FormField>
                </div>
                
                <div>
                  {reformData.disposalMethod === 'vente' && (
                    <>
                      <FormField label="Prix de vente (FCFA)">
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={reformData.salePrice}
                          onChange={(e) => setReformData({...reformData, salePrice: e.target.value})}
                        />
                      </FormField>
                      
                      <FormField label="Acheteur">
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={reformData.buyer}
                          onChange={(e) => setReformData({...reformData, buyer: e.target.value})}
                        />
                      </FormField>
                      
                      <FormField label="Numéro de l'acheteur">
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={reformData.buyerNumber}
                          onChange={(e) => setReformData({...reformData, buyerNumber: e.target.value})}
                        />
                      </FormField>
                      
                      <FormField label="Adresse de l'acheteur">
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={reformData.buyerAddress}
                          onChange={(e) => setReformData({...reformData, buyerAddress: e.target.value})}
                        />
                      </FormField>
                    </>
                  )}
                  
                  <FormField label="Certificat de réforme">
                    <input 
                      type="file" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setReformData({...reformData, reformCertificate: e.target.files?.[0] || null})}
                    />
                  </FormField>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Après validation, le statut du véhicule passera à "Réformé" et il sera retiré du parc actif.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => {
                  setReformData({
                    vehicleId: '',
                    reformDate: '',
                    reformReason: '',
                    salePrice: '',
                    buyer: '',
                    buyerNumber: '',
                    buyerAddress: '',
                    disposalMethod: 'vente',
                    reformReport: null,
                    reformCertificate: null
                  });
                }}>
                  Annuler
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveReform}>
                  Valider la réforme
                </Button>
              </div>
            </Card>
          )}
        </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Gestion du Matériel Roulant"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${mainTab === 'search' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setMainTab('search')}
              >
                Recherche
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${mainTab === 'creation' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setMainTab('creation')}
              >
                Création
              </button>
            </nav>
          </div>
        </div>
        
        {renderContent()}
      </div>
      
      {/* Modal pour les formulaires */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        {modalContent}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" icon={Save} onClick={() => {
            if (modalTitle.includes('véhicule')) handleSaveVehicle();
            else if (modalTitle.includes('véhicule de l\'État')) handleSaveStateVehicle();
            else if (modalTitle.includes('chauffeur')) handleSaveDriver();
            else if (modalTitle.includes('garage')) handleSaveGarage();
            else if (modalTitle.includes('autorisation')) handleSaveAuthorization();
            else if (modalTitle.includes('contentieux')) handleSaveContentieux();
            else if (modalTitle.includes('intervention')) handleSaveIntervention();
            else if (modalTitle.includes('carte de paiement')) handleSavePaymentCard();
            else if (modalTitle.includes('pièce')) handleSaveVehiclePiece();
            else if (modalTitle.includes('dépense')) handleSaveVehicleExpense();
            else if (modalTitle.includes('carburant')) handleSaveFuelManagement();
          }}>
            Enregistrer
          </Button>
        </div>
      </Modal>
    </div>
  );
}