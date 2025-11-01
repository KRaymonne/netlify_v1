






/////////////////////////////////////////////////////////

 utilise fileupload comme dans personele et sur le modal met le button voir pour que une fois clicker sa nous dirige ver un onglrt blanc avec omme valeur url

 



 ////////////////////////////////////////

 Correction pour insert country et insert identity 

 j'ai ajouter 2 champs en  base de donner dans chaque model il s'agit de 
 
  Inserteridentity       
 InserterCountry 

 Il est question d'ajuster  donc les different formuliare de l'application pour que tous injecte ces valeur dans leur different formuliare pour ainsi etre stocker en base de donner et donc ca doit passer par les route netlify l faudra ajuster egalement le model netlify lier a chaque formulaire et chaque route pour ainsi faire  cette update et une fois cela fait il faudrai maintenant que a la recupereation c'est a dire au moment du get egalement , il est question de donc afficher chaque donnes de chaque model sur son listing page et il faut ajouter le filtrage par insertercountry qui sera un select des pays suivant IVORY_COAST GHANA  BENIN CAMEROON TOGO ROMANIE ITALIE le model actuellement completement implementer et fonctionel est celui de personelle  tu peu prendre exemple sur lui et nous allons commencer par corriger les formulaire des model suivant:
 Register
Transaction

regarde les dans VehicleForms et leur page generale c'est Register.tsx



User
AccountantProfile
DirectorProfile
EmployeeProfile
SecretaryProfile
DriverProfile

Contract 
Absence
Bonus
Sanction
MedicalRecord
Affectation

Vehicles
Statevehicles
Garages
Vehicleauthorizations
Contentieux
Vehicleinterventions
Vehiclepieces
Vehicleexpenses
Vehiclereforms
Fuelmanagements
Paymentcards
Cardoperations

Equipment
Assignment
EquipmentRevisions
Calibration
Maintenance
Repair
EquipmentExpense

Register
Transaction

Business

Contact

ProfessionalService
CompanyExpense
OtherInvoice

TaxDeclaration

Alert

Bank
BankTransaction

OffreDevis
OffreDAO
OffreAMI