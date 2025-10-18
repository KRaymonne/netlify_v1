import React, { useMemo, useState } from 'react';

const ROLE_OPTIONS = [
  'SUPER_ADMIN','ADMIN','ACCOUNTANT','DIRECTOR','EMPLOYEE','HR','SECRETARY','TECHNICIAN','SENIOR_TECHNICIAN','ENGINEER','EXECUTIVE','INTERN'
];
const STATUS_OPTIONS = ['ON_HOLIDAY','SUSPENDED','FIRED','ACTIVE'];
const GENDER_OPTIONS = ['MALE','FEMALE'];
const MARITAL_OPTIONS = ['SINGLE','MARRIED','DIVORCED','WIDOWED'];
const IDENTITY_TYPE_OPTIONS = ['NATIONAL_ID_CARD','PASSPORT','DRIVER_LICENSE'];
const WORKCOUNTRY_OPTIONS = ['IVORY_COAST','GHANA','BENIN','CAMEROON','TOGO','ROMANIE','ITALIE'];

interface UsersCreateProps {
  onUserCreated?: () => void;
}

export function UsersCreate({ onUserCreated }: UsersCreateProps = {}) {
  const [form, setForm] = useState<Record<string, any>>({
    // identifiers
    employeeNumber: '',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    // personal
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    civilityDropdown: 'MALE',
    maritalStatus: 'SINGLE',
    nationality: '',
    identityType: 'NATIONAL_ID_CARD',
    identity: '',
    workcountry: 'IVORY_COAST',
    // contact
    address: '',
    phone: '',
    mobile: '',
    // removed tel/gender/country to avoid duplicates with other fields
    // emergency
    emergencyName: '',
    emergencyContact: '',
    childrenCount: 0,
    // job
    department: '',
    salary: '',
    hireDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requiredKeys = useMemo(() => [
    'employeeNumber','role','status','firstName','lastName','email','dateOfBirth','placeOfBirth','civilityDropdown','maritalStatus','nationality','identityType','identity','workcountry','address','phone','mobile','emergencyName','emergencyContact','department','salary'
  ], []);

  const onChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // simple required check
      const missing = requiredKeys.filter(k => form[k] === '' || form[k] === null || form[k] === undefined);
      if (missing.length) {
        throw new Error(`Champs manquants: ${missing.join(', ')}`);
      }

      const res = await fetch('/.netlify/functions/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Échec de la création');
      }
      setSuccess('Utilisateur créé avec succès');
      // Call the callback to refresh data if provided
      if (onUserCreated) {
        onUserCreated();
      }
      // reset core fields, keep some defaults
      setForm(prev => ({ ...prev, employeeNumber: '', firstName: '', lastName: '', email: '', dateOfBirth: '', placeOfBirth: '', nationality: '', identity: '', address: '', phone: '', mobile: '', emergencyName: '', emergencyContact: '', childrenCount: 0, department: '', salary: '', hireDate: '' }));
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Créer un utilisateur</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Matricule</label>
            <input type="text" value={form.employeeNumber} onChange={(e) => onChange('employeeNumber', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input type="text" value={form.firstName} onChange={(e) => onChange('firstName', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input type="text" value={form.lastName} onChange={(e) => onChange('lastName', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rôle</label>
            <select value={form.role} onChange={(e) => onChange('role', e.target.value)} className="w-full border rounded px-3 py-2">
              {ROLE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select value={form.status} onChange={(e) => onChange('status', e.target.value)} className="w-full border rounded px-3 py-2">
              {STATUS_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date de naissance</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => onChange('dateOfBirth', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu de naissance</label>
            <input type="text" value={form.placeOfBirth} onChange={(e) => onChange('placeOfBirth', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Civilité</label>
            <select value={form.civilityDropdown} onChange={(e) => onChange('civilityDropdown', e.target.value)} className="w-full border rounded px-3 py-2">
              {GENDER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut matrimonial</label>
            <select value={form.maritalStatus} onChange={(e) => onChange('maritalStatus', e.target.value)} className="w-full border rounded px-3 py-2">
              {MARITAL_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nationalité</label>
            <input type="text" value={form.nationality} onChange={(e) => onChange('nationality', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type de pièce</label>
            <select value={form.identityType} onChange={(e) => onChange('identityType', e.target.value)} className="w-full border rounded px-3 py-2">
              {IDENTITY_TYPE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Numéro de pièce</label>
            <input type="text" value={form.identity} onChange={(e) => onChange('identity', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pays de travail</label>
            <select value={form.workcountry} onChange={(e) => onChange('workcountry', e.target.value)} className="w-full border rounded px-3 py-2">
              {WORKCOUNTRY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <input type="text" value={form.address} onChange={(e) => onChange('address', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input type="text" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input type="text" value={form.mobile} onChange={(e) => onChange('mobile', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          

          <div>
            <label className="block text-sm font-medium mb-1">Contact d'urgence (Nom)</label>
            <input type="text" value={form.emergencyName} onChange={(e) => onChange('emergencyName', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact d'urgence (Téléphone)</label>
            <input type="text" value={form.emergencyContact} onChange={(e) => onChange('emergencyContact', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre d'enfants</label>
            <input type="number" value={form.childrenCount} onChange={(e) => onChange('childrenCount', Number(e.target.value))} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Département</label>
            <input type="text" value={form.department} onChange={(e) => onChange('department', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salaire (brut)</label>
            <input type="number" step="0.01" value={form.salary} onChange={(e) => onChange('salary', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date d'embauche</label>
            <input type="date" value={form.hireDate} onChange={(e) => onChange('hireDate', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {loading ? 'En cours...' : 'Créer'}
          </button>
          <a href="/users" className="px-4 py-2 bg-gray-100 border rounded">Annuler</a>
        </div>
      </form>
    </div>
  );
}

