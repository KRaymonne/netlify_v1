import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { Card } from '../components/Common/Card';
import { Table } from '../components/Common/Table';
import { Button } from '../components/Common/Button';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';
import { Plus, Edit, Trash2, Search as SearchIcon, Download, FileText, FileSpreadsheet, Save, X, Globe, User, Calendar, Clock, Wrench } from 'lucide-react';

export function EquipmentPage() {
  const { state, deleteEquipment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeMainTab, setActiveMainTab] = useState('search'); // Changé pour 'search' par défaut
  const [activeSearchTab, setActiveSearchTab] = useState('equipment'); // Nouvel état pour les onglets de recherche
  const [activeCreationTab, setActiveCreationTab] = useState('equipment'); // Nouvel état pour les onglets de création
  const [activeCalibrationTab, setActiveCalibrationTab] = useState('revision');
  const [activeFraisTab, setActiveFraisTab] = useState('maintenance');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // États pour les données fictives
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [affectationData, setAffectationData] = useState<any[]>([]);
  const [revisionData, setRevisionData] = useState<any[]>([]);
  const [calibrationData, setCalibrationData] = useState<any[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<any[]>([]);
  const [reparationData, setReparationData] = useState<any[]>([]);
  const [autresFraisData, setAutresFraisData] = useState<any[]>([]);
  
  // États pour les formulaires d'ajout
  const [formData, setFormData] = useState({
    category: '',
    brand: '',
    serialNumber: '',
    reference: '',
    purchaseAmount: '',
    status: '',
    version: '',
    supplier: '',
    observation: '',
    type: '',
    idNumber: '',
    internalCode: '',
    purchaseDate: '',
    deliveryDate: '',
    ownership: ''
  });
  
  // États pour les différents formulaires
  const [affectationForm, setAffectationForm] = useState({
    dateAchat: '',
    typeBadge: '',
    numeroBadge: '',
    description: '',
    montantAchat: '',
    dateMiseEnService: '',
    currency: 'XAF'
  });
  const [revisionForm, setRevisionForm] = useState({
    reference: '',
    dateRevision: '',
    dateValidite: '',
    montant: '',
    fournisseur: '',
    status: 'En attente',
    description: '',
    nextRevisionDate: '',
    currency: 'XAF'
  });
  const [calibrationForm, setCalibrationForm] = useState({
    reference: '',
    dateCalibration: '',
    dateValidite: '',
    montant: '',
    fournisseur: '',
    description: '',
    nextCalibrationDate: '',
    currency: 'XAF'
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    dateFrais: '',
    typeMaintenance: '',
    description: '',
    montant: '',
    fournisseur: '',
    technician: '',
    repairHours: '',
    nextMaintenanceDate: '',
    currency: 'XAF'
  });
  const [reparationForm, setReparationForm] = useState({
    dateFrais: '',
    typeReparation: '',
    description: '',
    montant: '',
    fournisseur: '',
    technician: '',
    repairedPart: '',
    repairPeriod: '',
    currency: 'XAF'
  });
  const [autresFraisForm, setAutresFraisForm] = useState({
    dateFrais: '',
    typeFrais: '',
    description: '',
    montant: '',
    fournisseur: '',
    invoiceNumber: '',
    currency: 'XAF'
  });
  
  // Initialiser les données fictives
  useEffect(() => {
    // Données fictives pour les équipements
    setEquipmentData([
      {
        id: '1',
        name: 'Station Totale Leica',
        type: 'STATION TOTALE',
        reference: 'ST-LEICA-001',
        category: 'MATÉRIELS TOPOGRAPHIQUES',
        brand: 'LEICA',
        supplier: 'DELUXE C',
        purchaseAmount: 2500000,
        purchaseDate: '2023-01-15',
        deliveryDate: '2023-02-10',
        registrationDate: '2023-01-15T00:00:00.000Z',
        status: 'Bon'
      },
      {
        id: '2',
        name: 'GPS Trimble R12',
        type: 'GPS',
        reference: 'GPS-TRIMBLE-002',
        category: 'MATÉRIELS TOPOGRAPHIQUES',
        brand: 'TRIMBLE',
        supplier: 'STIALA C',
        purchaseAmount: 3500000,
        purchaseDate: '2023-02-20',
        deliveryDate: '2023-03-15',
        registrationDate: '2023-02-20T00:00:00.000Z',
        status: 'Bon'
      },
      {
        id: '3',
        name: 'Niveau Optique',
        type: 'NIVEAU',
        reference: 'NIV-LEICA-003',
        category: 'MATÉRIELS TOPOGRAPHIQUES',
        brand: 'LEICA',
        supplier: 'DIGITOP',
        purchaseAmount: 1200000,
        purchaseDate: '2023-03-10',
        deliveryDate: '2023-03-25',
        registrationDate: '2023-03-10T00:00:00.000Z',
        status: 'En panne'
      }
    ]);
    // Données fictives pour les affectations
    setAffectationData([
      {
        id: '1',
        dateAchat: '2023-01-15',
        typeBadge: 'Carte',
        numeroBadge: 'C001',
        description: 'Carte d\'accès bureau',
        montantAchat: 5000,
        dateMiseEnService: '2023-01-20',
        currency: 'XAF'
      },
      {
        id: '2',
        dateAchat: '2023-02-10',
        typeBadge: 'Badge',
        numeroBadge: 'B002',
        description: 'Badge d\'accès parking',
        montantAchat: 3500,
        dateMiseEnService: '2023-02-15',
        currency: 'XAF'
      }
    ]);
    // Données fictives pour les révisions
    setRevisionData([
      {
        id: '1',
        reference: 'REV-001',
        dateRevision: '2023-01-10',
        dateValidite: '2024-01-10',
        montant: 50000,
        fournisseur: 'STIALIA',
        status: 'Complété',
        description: 'Révision annuelle complète',
        nextRevisionDate: '2024-01-10',
        currency: 'XAF'
      },
      {
        id: '2',
        reference: 'REV-002',
        dateRevision: '2023-02-15',
        dateValidite: '2024-02-15',
        montant: 75000,
        fournisseur: 'GEOTOP',
        status: 'En attente',
        description: 'Révision des composants électroniques',
        nextRevisionDate: '2024-02-15',
        currency: 'XAF'
      }
    ]);
    // Données fictives pour les calibrations
    setCalibrationData([
      {
        id: '1',
        reference: 'CAL-001',
        dateCalibration: '2023-01-20',
        dateValidite: '2023-07-20',
        montant: 85000,
        fournisseur: 'GEOTOP',
        description: 'Calibration des capteurs',
        nextCalibrationDate: '2023-07-20',
        currency: 'XAF'
      },
      {
        id: '2',
        reference: 'CAL-002',
        dateCalibration: '2023-02-25',
        dateValidite: '2023-08-25',
        montant: 95000,
        fournisseur: 'CODECI',
        description: 'Calibration de précision',
        nextCalibrationDate: '2023-08-25',
        currency: 'XAF'
      }
    ]);
    // Données fictives pour les maintenances
    setMaintenanceData([
      {
        id: '1',
        dateFrais: '2023-01-12',
        typeMaintenance: 'Préventive',
        description: 'Nettoyage et calibrage',
        montant: 25000,
        fournisseur: 'STIALIA',
        technician: 'Jean Dupont',
        repairHours: '4',
        nextMaintenanceDate: '2023-07-12',
        currency: 'XAF'
      },
      {
        id: '2',
        dateFrais: '2023-02-18',
        typeMaintenance: 'Préventive',
        description: 'Vérification des composants',
        montant: 35000,
        fournisseur: 'GEOTOP',
        technician: 'Pierre Martin',
        repairHours: '6',
        nextMaintenanceDate: '2023-08-18',
        currency: 'XAF'
      }
    ]);
    // Données fictives pour les réparations
    setReparationData([
      {
        id: '1',
        dateFrais: '2023-01-25',
        typeReparation: 'Électronique',
        description: 'Remplacement écran',
        montant: 45000,
        fournisseur: 'CODECI',
        technician: 'Paul Lambert',
        repairedPart: 'Écran tactile',
        repairPeriod: '2 jours',
        currency: 'XAF'
      },
      {
        id: '2',
        dateFrais: '2023-02-28',
        typeReparation: 'Mécanique',
        description: 'Réparation du trépied',
        montant: 30000,
        fournisseur: 'STIALIA',
        technician: 'Jacques Durand',
        repairedPart: 'Joint de trépied',
        repairPeriod: '1 jour',
        currency: 'XAF'
      }
    ]);
    // Données fictives pour les autres frais
    setAutresFraisData([
      {
        id: '1',
        dateFrais: '2023-01-30',
        typeFrais: 'Accessoires',
        description: 'Achat de câbles',
        montant: 15000,
        fournisseur: 'GEOTOP',
        invoiceNumber: 'INV-2023-001',
        currency: 'XAF'
      },
      {
        id: '2',
        dateFrais: '2023-02-20',
        typeFrais: 'Consommables',
        description: 'Batteries de rechange',
        montant: 25000,
        fournisseur: 'CODECI',
        invoiceNumber: 'INV-2023-002',
        currency: 'XAF'
      }
    ]);
  }, []);
  
  // Gestionnaires d'événements pour les formulaires
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAffectationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAffectationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRevisionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRevisionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCalibrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCalibrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReparationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReparationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAutresFraisChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAutresFraisForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDeleteEquipment = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    setIsDeleting(id);
    try {
      await deleteEquipment(id);
      // Supprimer également des données fictives
      if (activeSearchTab === 'equipment') {
        setEquipmentData(prev => prev.filter(item => item.id !== id));
      } else if (activeSearchTab === 'affectations') {
        setAffectationData(prev => prev.filter(item => item.id !== id));
      } else if (activeSearchTab === 'calibration') {
        if (activeCalibrationTab === 'revision') {
          setRevisionData(prev => prev.filter(item => item.id !== id));
        } else {
          setCalibrationData(prev => prev.filter(item => item.id !== id));
        }
      } else if (activeSearchTab === 'frais') {
        if (activeFraisTab === 'maintenance') {
          setMaintenanceData(prev => prev.filter(item => item.id !== id));
        } else if (activeFraisTab === 'reparation') {
          setReparationData(prev => prev.filter(item => item.id !== id));
        } else {
          setAutresFraisData(prev => prev.filter(item => item.id !== id));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer un nouvel équipement avec les données du formulaire
    const newEquipment = {
      id: Date.now().toString(),
      name: `${formData.brand} ${formData.type}`,
      type: formData.type,
      reference: formData.reference || `REF-${Date.now()}`,
      category: formData.category,
      brand: formData.brand,
      supplier: formData.supplier,
      purchaseAmount: parseFloat(formData.purchaseAmount) || 0,
      purchaseDate: formData.purchaseDate,
      deliveryDate: formData.deliveryDate,
      registrationDate: new Date().toISOString(),
      status: formData.status || 'Bon'
    };
    
    // Ajouter aux données fictives
    setEquipmentData(prev => [...prev, newEquipment]);
    
    // Réinitialiser le formulaire
    setFormData({
      category: '',
      brand: '',
      serialNumber: '',
      reference: '',
      purchaseAmount: '',
      status: '',
      version: '',
      supplier: '',
      observation: '',
      type: '',
      idNumber: '',
      internalCode: '',
      purchaseDate: '',
      deliveryDate: '',
      ownership: ''
    });
  };
  
  const handleSaveAffectation = () => {
    // Créer une nouvelle affectation avec les données du formulaire
    const newAffectation = {
      id: Date.now().toString(),
      dateAchat: affectationForm.dateAchat,
      typeBadge: affectationForm.typeBadge,
      numeroBadge: affectationForm.numeroBadge,
      description: affectationForm.description,
      montantAchat: parseFloat(affectationForm.montantAchat) || 0,
      dateMiseEnService: affectationForm.dateMiseEnService,
      currency: affectationForm.currency
    };
    
    // Ajouter aux données fictives
    setAffectationData(prev => [...prev, newAffectation]);
    
    // Réinitialiser le formulaire
    setAffectationForm({
      dateAchat: '',
      typeBadge: '',
      numeroBadge: '',
      description: '',
      montantAchat: '',
      dateMiseEnService: '',
      currency: 'XAF'
    });
  };
  
  const handleSaveRevision = () => {
    // Créer une nouvelle révision avec les données du formulaire
    const newRevision = {
      id: Date.now().toString(),
      reference: revisionForm.reference || `REV-${Date.now()}`,
      dateRevision: revisionForm.dateRevision,
      dateValidite: revisionForm.dateValidite,
      montant: parseFloat(revisionForm.montant) || 0,
      fournisseur: revisionForm.fournisseur,
      status: revisionForm.status,
      description: revisionForm.description,
      nextRevisionDate: revisionForm.nextRevisionDate,
      currency: revisionForm.currency
    };
    
    // Ajouter aux données fictives
    setRevisionData(prev => [...prev, newRevision]);
    
    // Réinitialiser le formulaire
    setRevisionForm({
      reference: '',
      dateRevision: '',
      dateValidite: '',
      montant: '',
      fournisseur: '',
      status: 'En attente',
      description: '',
      nextRevisionDate: '',
      currency: 'XAF'
    });
  };
  
  const handleSaveCalibration = () => {
    // Créer une nouvelle calibration avec les données du formulaire
    const newCalibration = {
      id: Date.now().toString(),
      reference: calibrationForm.reference || `CAL-${Date.now()}`,
      dateCalibration: calibrationForm.dateCalibration,
      dateValidite: calibrationForm.dateValidite,
      montant: parseFloat(calibrationForm.montant) || 0,
      fournisseur: calibrationForm.fournisseur,
      description: calibrationForm.description,
      nextCalibrationDate: calibrationForm.nextCalibrationDate,
      currency: calibrationForm.currency
    };
    
    // Ajouter aux données fictives
    setCalibrationData(prev => [...prev, newCalibration]);
    
    // Réinitialiser le formulaire
    setCalibrationForm({
      reference: '',
      dateCalibration: '',
      dateValidite: '',
      montant: '',
      fournisseur: '',
      description: '',
      nextCalibrationDate: '',
      currency: 'XAF'
    });
  };
  
  const handleSaveMaintenance = () => {
    // Créer une nouvelle maintenance avec les données du formulaire
    const newMaintenance = {
      id: Date.now().toString(),
      dateFrais: maintenanceForm.dateFrais,
      typeMaintenance: maintenanceForm.typeMaintenance,
      description: maintenanceForm.description,
      montant: parseFloat(maintenanceForm.montant) || 0,
      fournisseur: maintenanceForm.fournisseur,
      technician: maintenanceForm.technician,
      repairHours: maintenanceForm.repairHours,
      nextMaintenanceDate: maintenanceForm.nextMaintenanceDate,
      currency: maintenanceForm.currency
    };
    
    // Ajouter aux données fictives
    setMaintenanceData(prev => [...prev, newMaintenance]);
    
    // Réinitialiser le formulaire
    setMaintenanceForm({
      dateFrais: '',
      typeMaintenance: '',
      description: '',
      montant: '',
      fournisseur: '',
      technician: '',
      repairHours: '',
      nextMaintenanceDate: '',
      currency: 'XAF'
    });
  };
  
  const handleSaveReparation = () => {
    // Créer une nouvelle réparation avec les données du formulaire
    const newReparation = {
      id: Date.now().toString(),
      dateFrais: reparationForm.dateFrais,
      typeReparation: reparationForm.typeReparation,
      description: reparationForm.description,
      montant: parseFloat(reparationForm.montant) || 0,
      fournisseur: reparationForm.fournisseur,
      technician: reparationForm.technician,
      repairedPart: reparationForm.repairedPart,
      repairPeriod: reparationForm.repairPeriod,
      currency: reparationForm.currency
    };
    
    // Ajouter aux données fictives
    setReparationData(prev => [...prev, newReparation]);
    
    // Réinitialiser le formulaire
    setReparationForm({
      dateFrais: '',
      typeReparation: '',
      description: '',
      montant: '',
      fournisseur: '',
      technician: '',
      repairedPart: '',
      repairPeriod: '',
      currency: 'XAF'
    });
  };
  
  const handleSaveAutresFrais = () => {
    // Créer un nouveau frais avec les données du formulaire
    const newAutresFrais = {
      id: Date.now().toString(),
      dateFrais: autresFraisForm.dateFrais,
      typeFrais: autresFraisForm.typeFrais,
      description: autresFraisForm.description,
      montant: parseFloat(autresFraisForm.montant) || 0,
      fournisseur: autresFraisForm.fournisseur,
      invoiceNumber: autresFraisForm.invoiceNumber,
      currency: autresFraisForm.currency
    };
    
    // Ajouter aux données fictives
    setAutresFraisData(prev => [...prev, newAutresFrais]);
    
    // Réinitialiser le formulaire
    setAutresFraisForm({
      dateFrais: '',
      typeFrais: '',
      description: '',
      montant: '',
      fournisseur: '',
      invoiceNumber: '',
      currency: 'XAF'
    });
  };
  
  // Filtrer les données en fonction de la recherche et du filtre
  const getFilteredData = () => {
    let data;
    
    if (activeSearchTab === 'equipment') {
      data = equipmentData;
    } else if (activeSearchTab === 'affectations') {
      data = affectationData;
    } else if (activeSearchTab === 'calibration') {
      if (activeCalibrationTab === 'revision') {
        data = revisionData;
      } else {
        data = calibrationData;
      }
    } else if (activeSearchTab === 'frais') {
      if (activeFraisTab === 'maintenance') {
        data = maintenanceData;
      } else if (activeFraisTab === 'reparation') {
        data = reparationData;
      } else {
        data = autresFraisData;
      }
    } else {
      return [];
    }
    
    if (!searchTerm) return data;
    
    return data.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  
  const filteredData = getFilteredData();
  
  // Définir les colonnes pour chaque type de tableau
  const equipmentColumns = [
    { 
      key: 'enregistreLe', 
      title: 'Enregistré le', 
      render: (value: any, record: Equipment) => 
        <span>{new Date(record.registrationDate).toLocaleDateString('fr-FR')}</span> 
    },
    { key: 'reference', title: 'Référence', render: (value: any, record: Equipment) => <span>{record.reference}</span> },
    { key: 'categorie', title: 'Catégorie', render: (value: any, record: Equipment) => <span>{record.category}</span> },
    { key: 'type', title: 'Type', render: (value: any, record: Equipment) => <span>{record.type}</span> },
    { key: 'marque', title: 'Marque', render: (value: any, record: Equipment) => <span>{record.brand}</span> },
    { key: 'fournisseur', title: 'Fournisseur', render: (value: any, record: Equipment) => <span>{record.supplier}</span> },
    { key: 'dateAchat', title: "Date d'achat", render: (value: any, record: Equipment) => 
      <span>{new Date(record.purchaseDate).toLocaleDateString('fr-FR')}</span> 
    },
    { key: 'montantAchat', title: 'Montant d\'achat', render: (value: any, record: Equipment) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.purchaseAmount)} CFA</span> 
    },
    { 
      key: 'actions', 
      title: 'Action', 
      align: 'right',
      render: (_: any, record: Equipment) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit}>Modifier</Button>
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  const affectationColumns = [
    { key: 'dateAchat', title: "Date d'achat" },
    { key: 'typeBadge', title: 'Type Badge' },
    { key: 'numeroBadge', title: 'N° Badge' },
    { key: 'description', title: 'Description' },
    { key: 'montantAchat', title: 'Montant d\'achat', render: (value: any, record: any) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.montantAchat)} {record.currency}</span> 
    },
    { key: 'dateMiseEnService', title: 'Date mise en service' },
    { key: 'fichierJoint', title: 'Fichier joint', render: () => (
      <Button variant="secondary" size="sm">Télécharger</Button>
    )},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit} />
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  const revisionColumns = [
    { key: 'reference', title: 'Référence' },
    { key: 'dateRevision', title: 'Date Révision' },
    { key: 'dateValidite', title: 'Date Validité' },
    { key: 'status', title: 'Statut', render: (value: any, record: any) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        record.status === 'Complété' ? 'bg-green-100 text-green-800' :
        record.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
        record.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {record.status}
      </span>
    )},
    { key: 'description', title: 'Description' },
    { key: 'nextRevisionDate', title: 'Prochaine révision', render: (value: any, record: any) => 
      <span>{record.nextRevisionDate || '-'}</span> 
    },
    { key: 'montant', title: 'Montant', render: (value: any, record: any) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.montant)} {record.currency}</span> 
    },
    { key: 'fournisseur', title: 'Fournisseur' },
    { key: 'fichierJoint', title: 'Fichier joint', render: () => (
      <Button variant="secondary" size="sm">Télécharger</Button>
    )},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit} />
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  const calibrationColumns = [
    { key: 'reference', title: 'Référence' },
    { key: 'dateCalibration', title: 'Date Calibration' },
    { key: 'dateValidite', title: 'Date Validité' },
    { key: 'description', title: 'Description' },
    { key: 'nextCalibrationDate', title: 'Prochaine calibration', render: (value: any, record: any) => 
      <span>{record.nextCalibrationDate || '-'}</span> 
    },
    { key: 'montant', title: 'Montant', render: (value: any, record: any) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.montant)} {record.currency}</span> 
    },
    { key: 'fournisseur', title: 'Fournisseur' },
    { key: 'fichierJoint', title: 'Fichier joint', render: () => (
      <Button variant="secondary" size="sm">Télécharger</Button>
    )},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit} />
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  const maintenanceColumns = [
    { key: 'dateFrais', title: 'Date Frais' },
    { key: 'typeMaintenance', title: 'Type Maintenance' },
    { key: 'description', title: 'Description' },
    { key: 'technician', title: 'Technicien', render: (value: any, record: any) => 
      <span>{record.technician || '-'}</span> 
    },
    { key: 'repairHours', title: 'Heures de réparation', render: (value: any, record: any) => 
      <span>{record.repairHours ? `${record.repairHours}h` : '-'}</span> 
    },
    { key: 'nextMaintenanceDate', title: 'Prochaine maintenance', render: (value: any, record: any) => 
      <span>{record.nextMaintenanceDate || '-'}</span> 
    },
    { key: 'montant', title: 'Montant', render: (value: any, record: any) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.montant)} {record.currency}</span> 
    },
    { key: 'fournisseur', title: 'Fournisseur' },
    { key: 'fichierJoint', title: 'Fichier joint', render: () => (
      <Button variant="secondary" size="sm">Télécharger</Button>
    )},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit} />
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  const reparationColumns = [
    { key: 'dateFrais', title: 'Date Frais' },
    { key: 'typeReparation', title: 'Type Réparation' },
    { key: 'description', title: 'Description' },
    { key: 'technician', title: 'Technicien', render: (value: any, record: any) => 
      <span>{record.technician || '-'}</span> 
    },
    { key: 'repairedPart', title: 'Pièce réparée', render: (value: any, record: any) => 
      <span>{record.repairedPart || '-'}</span> 
    },
    { key: 'repairPeriod', title: 'Période de réparation', render: (value: any, record: any) => 
      <span>{record.repairPeriod || '-'}</span> 
    },
    { key: 'montant', title: 'Montant', render: (value: any, record: any) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.montant)} {record.currency}</span> 
    },
    { key: 'fournisseur', title: 'Fournisseur' },
    { key: 'fichierJoint', title: 'Fichier joint', render: () => (
      <Button variant="secondary" size="sm">Télécharger</Button>
    )},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit} />
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  const autresFraisColumns = [
    { key: 'dateFrais', title: 'Date Frais' },
    { key: 'typeFrais', title: 'Type Frais' },
    { key: 'description', title: 'Description' },
    { key: 'invoiceNumber', title: 'N° Facture', render: (value: any, record: any) => 
      <span>{record.invoiceNumber || '-'}</span> 
    },
    { key: 'montant', title: 'Montant', render: (value: any, record: any) => 
      <span>{new Intl.NumberFormat('fr-FR').format(record.montant)} {record.currency}</span> 
    },
    { key: 'fournisseur', title: 'Fournisseur' },
    { key: 'fichierJoint', title: 'Fichier joint', render: () => (
      <Button variant="secondary" size="sm">Télécharger</Button>
    )},
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" icon={Edit} />
          <Button 
            variant="danger" 
            size="sm" 
            icon={Trash2} 
            onClick={() => handleDeleteEquipment(record.id)}
            disabled={isDeleting === record.id}
            loading={isDeleting === record.id}
          >
            {isDeleting === record.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )
    },
  ];
  
  // Obtenir les colonnes appropriées en fonction de l'onglet actif
  const getColumns = () => {
    if (activeSearchTab === 'equipment') {
      return equipmentColumns;
    } else if (activeSearchTab === 'affectations') {
      return affectationColumns;
    } else if (activeSearchTab === 'calibration') {
      if (activeCalibrationTab === 'revision') {
        return revisionColumns;
      } else {
        return calibrationColumns;
      }
    } else if (activeSearchTab === 'frais') {
      if (activeFraisTab === 'maintenance') {
        return maintenanceColumns;
      } else if (activeFraisTab === 'reparation') {
        return reparationColumns;
      } else {
        return autresFraisColumns;
      }
    }
    return [];
  };
  
  const columns = getColumns();
  
  // Formulaire de création d'équipement
  const renderEquipmentCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter un nouvel équipement</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir</option>
                <option value="MATÉRIELS TOPOGRAPHIQUES">MATÉRIELS TOPOGRAPHIQUES</option>
                <option value="MATÉRIELS INFORMATIQUES">MATÉRIELS INFORMATIQUES</option>
                <option value="AUTRES">AUTRES</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir</option>
                <option value="STATION TOTALE">STATION TOTALE</option>
                <option value="GPS">GPS</option>
                <option value="NIVEAU">NIVEAU</option>
                <option value="TABLETTE">TABLETTE</option>
                <option value="AUTRES">AUTRES</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <select 
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir</option>
                <option value="LEICA">LEICA</option>
                <option value="TRIMBLE">TRIMBLE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° Série <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
              <input 
                type="text" 
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant d'achat <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  name="purchaseAmount"
                  value={formData.purchaseAmount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">CFA</span>
                </div>
              </div>
            </div>
            <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={affectationForm.currency}
            onChange={handleAffectationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">État équipement</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir</option>
                <option value="Bon">Bon</option>
                <option value="Mauvais">Mauvais</option>
                <option value="En panne">En panne</option>
                <option value="Réformé">Réformé</option>
                <option value="Perdu">Perdu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur <span className="text-red-500">*</span></label>
              <select 
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir</option>
                <option value="DELUXE C">DELUXE C</option>
                <option value="STIALA C">STIALA C</option>
                <option value="DIGITOP">DIGITOP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'achat <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Propriété</label>
              <select 
                name="ownership"
                value={formData.ownership}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir</option>
                <option value="Privé">Privé</option>
                <option value="Société">Société</option>
                <option value="Locataire">Locataire</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observation</label>
              <textarea 
                name="observation"
                value={formData.observation}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary">
            Annuler
          </Button>
          <Button type="submit" variant="primary" icon={Save}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
  
  // Formulaire de création d'affectation
  const renderAffectationCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter une nouvelle affectation</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'achat</label>
          <input 
            type="date" 
            name="dateAchat"
            value={affectationForm.dateAchat}
            onChange={handleAffectationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type Badge</label>
          <select 
            name="typeBadge"
            value={affectationForm.typeBadge}
            onChange={handleAffectationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="Carte">Carte</option>
            <option value="Badge">Badge</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">N° Badge</label>
          <input 
            type="text" 
            name="numeroBadge"
            value={affectationForm.numeroBadge}
            onChange={handleAffectationChange}
            placeholder="N°..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input 
            type="text" 
            name="description"
            value={affectationForm.description}
            onChange={handleAffectationChange}
            placeholder="Description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={affectationForm.currency}
            onChange={handleAffectationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant d'achat</label>
          <div className="relative">
            <input 
              type="number" 
              name="montantAchat"
              value={affectationForm.montantAchat}
              onChange={handleAffectationChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{affectationForm.currency}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date mise en service</label>
          <input 
            type="date" 
            name="dateMiseEnService"
            value={affectationForm.dateMiseEnService}
            onChange={handleAffectationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">
          Annuler
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSaveAffectation}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
  
  // Formulaire de création de révision
  const renderRevisionCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter une nouvelle révision</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
          <input 
            type="text" 
            name="reference"
            value={revisionForm.reference}
            onChange={handleRevisionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Révision</label>
          <input 
            type="date" 
            name="dateRevision"
            value={revisionForm.dateRevision}
            onChange={handleRevisionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Validité</label>
          <input 
            type="date" 
            name="dateValidite"
            value={revisionForm.dateValidite}
            onChange={handleRevisionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select 
            name="status"
            value={revisionForm.status}
            onChange={handleRevisionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Complété">Complété</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description"
            value={revisionForm.description}
            onChange={handleRevisionChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine date de révision</label>
          <div className="relative">
            <input 
              type="date" 
              name="nextRevisionDate"
              value={revisionForm.nextRevisionDate}
              onChange={handleRevisionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={revisionForm.currency}
            onChange={handleRevisionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <div className="relative">
            <input 
              type="number" 
              name="montant"
              value={revisionForm.montant}
              onChange={handleRevisionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{revisionForm.currency}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select 
            name="fournisseur"
            value={revisionForm.fournisseur}
            onChange={handleRevisionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="STIALIA">STIALIA</option>
            <option value="GEOTOP">GEOTOP</option>
            <option value="CODECI">CODECI</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">
          Annuler
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSaveRevision}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
  
  // Formulaire de création de calibration
  const renderCalibrationCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter une nouvelle calibration</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
          <input 
            type="text" 
            name="reference"
            value={calibrationForm.reference}
            onChange={handleCalibrationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Calibration</label>
          <input 
            type="date" 
            name="dateCalibration"
            value={calibrationForm.dateCalibration}
            onChange={handleCalibrationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Validité</label>
          <input 
            type="date" 
            name="dateValidite"
            value={calibrationForm.dateValidite}
            onChange={handleCalibrationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description"
            value={calibrationForm.description}
            onChange={handleCalibrationChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine date de calibration</label>
          <div className="relative">
            <input 
              type="date" 
              name="nextCalibrationDate"
              value={calibrationForm.nextCalibrationDate}
              onChange={handleCalibrationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={calibrationForm.currency}
            onChange={handleCalibrationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <div className="relative">
            <input 
              type="number" 
              name="montant"
              value={calibrationForm.montant}
              onChange={handleCalibrationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{calibrationForm.currency}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select 
            name="fournisseur"
            value={calibrationForm.fournisseur}
            onChange={handleCalibrationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="STIALIA">STIALIA</option>
            <option value="GEOTOP">GEOTOP</option>
            <option value="CODECI">CODECI</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">
          Annuler
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSaveCalibration}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
  
  // Formulaire de création de maintenance
  const renderMaintenanceCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter une nouvelle maintenance</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Frais</label>
          <input 
            type="date" 
            name="dateFrais"
            value={maintenanceForm.dateFrais}
            onChange={handleMaintenanceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type Maintenance</label>
          <select 
            name="typeMaintenance"
            value={maintenanceForm.typeMaintenance}
            onChange={handleMaintenanceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="Préventive">Préventive</option>
            <option value="Corrective">Corrective</option>
            <option value="Prédictive">Prédictive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description"
            value={maintenanceForm.description}
            onChange={handleMaintenanceChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
          <div className="relative">
            <input 
              type="text" 
              name="technician"
              value={maintenanceForm.technician}
              onChange={handleMaintenanceChange}
              placeholder="Nom du technicien"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heures de réparation</label>
          <div className="relative">
            <input 
              type="text" 
              name="repairHours"
              value={maintenanceForm.repairHours}
              onChange={handleMaintenanceChange}
              placeholder="Ex: 4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine date de maintenance</label>
          <div className="relative">
            <input 
              type="date" 
              name="nextMaintenanceDate"
              value={maintenanceForm.nextMaintenanceDate}
              onChange={handleMaintenanceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={maintenanceForm.currency}
            onChange={handleMaintenanceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <div className="relative">
            <input 
              type="number" 
              name="montant"
              value={maintenanceForm.montant}
              onChange={handleMaintenanceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{maintenanceForm.currency}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select 
            name="fournisseur"
            value={maintenanceForm.fournisseur}
            onChange={handleMaintenanceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="STIALIA">STIALIA</option>
            <option value="GEOTOP">GEOTOP</option>
            <option value="CODECI">CODECI</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">
          Annuler
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSaveMaintenance}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
  
  // Formulaire de création de réparation
  const renderReparationCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter une nouvelle réparation</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Frais</label>
          <input 
            type="date" 
            name="dateFrais"
            value={reparationForm.dateFrais}
            onChange={handleReparationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type Réparation</label>
          <select 
            name="typeReparation"
            value={reparationForm.typeReparation}
            onChange={handleReparationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="Électronique">Électronique</option>
            <option value="Mécanique">Mécanique</option>
            <option value="Logicielle">Logicielle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description"
            value={reparationForm.description}
            onChange={handleReparationChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
          <div className="relative">
            <input 
              type="text" 
              name="technician"
              value={reparationForm.technician}
              onChange={handleReparationChange}
              placeholder="Nom du technicien"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pièce réparée</label>
          <div className="relative">
            <input 
              type="text" 
              name="repairedPart"
              value={reparationForm.repairedPart}
              onChange={handleReparationChange}
              placeholder="Nom de la pièce"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Wrench className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Période de réparation</label>
          <div className="relative">
            <input 
              type="text" 
              name="repairPeriod"
              value={reparationForm.repairPeriod}
              onChange={handleReparationChange}
              placeholder="Ex: 2 jours"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={reparationForm.currency}
            onChange={handleReparationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <div className="relative">
            <input 
              type="number" 
              name="montant"
              value={reparationForm.montant}
              onChange={handleReparationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{reparationForm.currency}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select 
            name="fournisseur"
            value={reparationForm.fournisseur}
            onChange={handleReparationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="STIALIA">STIALIA</option>
            <option value="GEOTOP">GEOTOP</option>
            <option value="CODECI">CODECI</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">
          Annuler
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSaveReparation}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
  
  // Formulaire de création d'autres frais
  const renderAutresFraisCreationForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Ajouter d'autres frais</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Frais</label>
          <input 
            type="date" 
            name="dateFrais"
            value={autresFraisForm.dateFrais}
            onChange={handleAutresFraisChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type Frais</label>
          <select 
            name="typeFrais"
            value={autresFraisForm.typeFrais}
            onChange={handleAutresFraisChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="Accessoires">Accessoires</option>
            <option value="Consommables">Consommables</option>
            <option value="Transport">Transport</option>
            <option value="Divers">Divers</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description"
            value={autresFraisForm.description}
            onChange={handleAutresFraisChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de facture</label>
          <input 
            type="text" 
            name="invoiceNumber"
            value={autresFraisForm.invoiceNumber}
            onChange={handleAutresFraisChange}
            placeholder="Ex: INV-2023-001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select 
            name="currency"
            value={autresFraisForm.currency}
            onChange={handleAutresFraisChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="XAF">FCFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
            <option value="GBP">Livre sterling (GBP)</option>
            <option value="CAD">Dollar canadien (CAD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <div className="relative">
            <input 
              type="number" 
              name="montant"
              value={autresFraisForm.montant}
              onChange={handleAutresFraisChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">{autresFraisForm.currency}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select 
            name="fournisseur"
            value={autresFraisForm.fournisseur}
            onChange={handleAutresFraisChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choisir</option>
            <option value="STIALIA">STIALIA</option>
            <option value="GEOTOP">GEOTOP</option>
            <option value="CODECI">CODECI</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">
          Annuler
        </Button>
        <Button variant="primary" icon={Save} onClick={handleSaveAutresFrais}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
  
  // Formulaire de recherche avec tableau
  const renderSearchForm = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          {activeSearchTab === 'equipment' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les états</option>
              <option value="Bon">Bon</option>
              <option value="Mauvais">Mauvais</option>
              <option value="En panne">En panne</option>
              <option value="Réformé">Réformé</option>
              <option value="Perdu">Perdu</option>
            </select>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {filteredData.length} élément(s) trouvé(s)
        </span>
      </div>
      
      <Table data={filteredData} columns={columns} />
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun élément trouvé</p>
        </div>
      )}
      
      {filteredData.length > 0 && (
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" icon={FileText}>PDF</Button>
          <Button variant="secondary" icon={FileSpreadsheet}>EXCEL</Button>
          <Button variant="secondary" icon={Download}>CSV</Button>
        </div>
      )}
    </div>
  );
  
  // Rendu principal du contenu selon l'onglet actif
  const renderContent = () => {
    // Onglet principal Recherche
    if (activeMainTab === 'search') {
      return (
        <div>
          {/* Sous-onglets pour la recherche */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`px-4 py-2 font-medium ${activeSearchTab === 'equipment' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => setActiveSearchTab('equipment')}
            >
              Équipement
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeSearchTab === 'affectations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => setActiveSearchTab('affectations')}
            >
              Affectations
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeSearchTab === 'calibration' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => {
                setActiveSearchTab('calibration');
                setActiveCalibrationTab('revision');
              }}
            >
              Calibration
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeSearchTab === 'frais' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => {
                setActiveSearchTab('frais');
                setActiveFraisTab('maintenance');
              }}
            >
              Frais
            </button>
          </div>
          {/* Contenu des sous-onglets de recherche */}
          {activeSearchTab === 'equipment' && renderSearchForm()}
          {activeSearchTab === 'affectations' && renderSearchForm()}
          
          {activeSearchTab === 'calibration' && (
            <div>
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  className={`px-4 py-2 font-medium ${activeCalibrationTab === 'revision' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveCalibrationTab('revision')}
                >
                  Révision
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeCalibrationTab === 'calibration' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveCalibrationTab('calibration')}
                >
                  Calibration
                </button>
              </div>
              {renderSearchForm()}
            </div>
          )}
          
          {activeSearchTab === 'frais' && (
            <div>
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  className={`px-4 py-2 font-medium ${activeFraisTab === 'maintenance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveFraisTab('maintenance')}
                >
                  Maintenance
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeFraisTab === 'reparation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveFraisTab('reparation')}
                >
                  Réparation
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeFraisTab === 'autres' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveFraisTab('autres')}
                >
                  Autres Frais
                </button>
              </div>
              {renderSearchForm()}
            </div>
          )}
        </div>
      );
    }
    
    // Onglet principal Création
    if (activeMainTab === 'creation') {
      return (
        <div>
          {/* Sous-onglets pour la création */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`px-4 py-2 font-medium ${activeCreationTab === 'equipment' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => setActiveCreationTab('equipment')}
            >
              Équipement
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeCreationTab === 'affectations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => setActiveCreationTab('affectations')}
            >
              Affectations
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeCreationTab === 'calibration' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => {
                setActiveCreationTab('calibration');
                setActiveCalibrationTab('revision');
              }}
            >
              Calibration
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeCreationTab === 'frais' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
              onClick={() => {
                setActiveCreationTab('frais');
                setActiveFraisTab('maintenance');
              }}
            >
              Frais
            </button>
          </div>
          {/* Contenu des sous-onglets de création */}
          {activeCreationTab === 'equipment' && renderEquipmentCreationForm()}
          {activeCreationTab === 'affectations' && renderAffectationCreationForm()}
          
          {activeCreationTab === 'calibration' && (
            <div>
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  className={`px-4 py-2 font-medium ${activeCalibrationTab === 'revision' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveCalibrationTab('revision')}
                >
                  Révision
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeCalibrationTab === 'calibration' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveCalibrationTab('calibration')}
                >
                  Calibration
                </button>
              </div>
              {activeCalibrationTab === 'revision' && renderRevisionCreationForm()}
              {activeCalibrationTab === 'calibration' && renderCalibrationCreationForm()}
            </div>
          )}
          
          {activeCreationTab === 'frais' && (
            <div>
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  className={`px-4 py-2 font-medium ${activeFraisTab === 'maintenance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveFraisTab('maintenance')}
                >
                  Maintenance
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeFraisTab === 'reparation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveFraisTab('reparation')}
                >
                  Réparation
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeFraisTab === 'autres' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
                  onClick={() => setActiveFraisTab('autres')}
                >
                  Autres Frais
                </button>
              </div>
              {activeFraisTab === 'maintenance' && renderMaintenanceCreationForm()}
              {activeFraisTab === 'reparation' && renderReparationCreationForm()}
              {activeFraisTab === 'autres' && renderAutresFraisCreationForm()}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div>
      <PageHeader 
        title="Gestion des Équipements"
      />
      
      <Card>
        {/* Navigation principale */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-6 py-3 font-medium ${activeMainTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveMainTab('search')}
          >
            Recherche
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeMainTab === 'creation' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} 
            onClick={() => setActiveMainTab('creation')}
          >
            Création
          </button>
        </div>
        
        {renderContent()}
      </Card>
    </div>
  );
}