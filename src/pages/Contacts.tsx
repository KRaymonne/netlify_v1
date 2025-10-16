import React, { useState } from "react";
import { PageHeader } from "../components/Common/PageHeader";
import { Card } from "../components/Common/Card";
import { Table } from "../components/Common/Table";
import { Button } from "../components/Common/Button";
import { useApp } from "../context/AppContext";
import { Contact } from "../types";
import {
  Plus,
  Edit,
  Trash2,
  Search as SearchIcon,
  Download,
  FileText,
  FileSpreadsheet,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  Globe,
} from "lucide-react";

export function Contacts() {
  const { state, deleteContact, addContact } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("search");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    type: "",
    notes: "",
    tags: [],
    socialMedia: {
      linkedin: "",
      website: "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested socialMedia fields
    if (name.startsWith("socialMedia.")) {
      const socialMediaField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialMediaField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?"))
      return;

    setIsDeleting(id);
    try {
      // Get token from localStorage or context
      const token = localStorage.getItem("authToken");

      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Update local state after successful API deletion
      deleteContact(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du contact");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get token from localStorage or context
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YmViYjZjYzI2Njc3ZjFlMTdmOGE2NiIsImlhdCI6MTc1NzMzMDI4NCwiZXhwIjoxNzU3OTM1MDg0fQ.5i6mL538GFNX8c76itoXvvRA7bnOFwYiIu3exLYKZm0`;

      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Erreur lors de la création du contact");
      }

      const newContact = await response.json();

      // Update local state with the contact returned from API
      addContact(newContact);

      // Réinitialiser le formulaire
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        type: "",
        notes: "",
        tags: [],
        socialMedia: {
          linkedin: "",
          website: "",
        },
      });

      // Revenir à la vue recherche
      setView("search");
      alert("Contact créé avec succès!");
    } catch (error) {
      console.log(error);

      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création du contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContacts = state.contacts.filter((contact) => {
    const matchesSearch =
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company &&
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.address &&
        contact.address.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const columns = [
    {
      key: "date",
      title: "Date",
      render: (value: any, record: Contact) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-1" />
          {new Date(record.createdAt).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      key: "nom",
      title: "Nom",
      render: (value: any, record: Contact) => (
        <div>
          <div className="font-medium">{record.lastName}</div>
          <div className="text-sm text-gray-500">{record.firstName}</div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (value: any, record: Contact) => (
        <span className="capitalize bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {record.type}
        </span>
      ),
    },
    {
      key: "entreprise",
      title: "Entreprise",
      render: (value: any, record: Contact) => (
        <div className="flex items-center">
          <Building size={14} className="mr-1 text-gray-500" />
          <span>{record.company || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "coordonnees",
      title: "Coordonnées",
      render: (value: any, record: Contact) => (
        <div>
          <div className="flex items-center text-sm">
            <Mail size={14} className="mr-1 text-gray-500" />
            <span className="text-blue-600">{record.email}</span>
          </div>
          {record.address && (
            <div className="flex items-center text-sm mt-1">
              <MapPin size={14} className="mr-1 text-gray-500" />
              <span className="text-gray-600">{record.address}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "numero",
      title: "Numéro",
      render: (value: any, record: Contact) => (
        <div className="flex flex-col">
          {record.phone && (
            <div className="flex items-center text-sm">
              <Phone size={14} className="mr-1 text-gray-500" />
              <span className="font-medium">{record.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, record: Contact) => (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit}
            className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteContact(record._id || record.id)}
            disabled={isDeleting === (record._id || record.id)}
            loading={isDeleting === (record._id || record.id)}
            className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
          >
            {isDeleting === (record._id || record.id)
              ? "Suppression..."
              : "Supprimer"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestion des Contacts"
        actions={
          <Button
            icon={Plus}
            onClick={() => setView("creation")}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ajouter un contact
          </Button>
        }
      />
      <Card>
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              view === "search"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setView("search")}
          >
            Recherche
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              view === "creation"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setView("creation")}
          >
            Création
          </button>
        </div>
        {view === "search" && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Rechercher un contact
              </h2>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="flex">
                    <div className="relative flex-1">
                      <SearchIcon
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        id="searchTerm"
                        placeholder="Nom, prénom, entreprise, email, type, numéro..."
                        className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="primary"
                      className="ml-2"
                      icon={SearchIcon}
                    >
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Liste des contacts
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">
                  {filteredContacts.length} contact(s) trouvé(s)
                </span>
                {filteredContacts.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="secondary" icon={FileText} size="sm">
                      PDF
                    </Button>
                    <Button
                      variant="secondary"
                      icon={FileSpreadsheet}
                      size="sm"
                    >
                      EXCEL
                    </Button>
                    <Button variant="secondary" icon={Download} size="sm">
                      CSV
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {filteredContacts.length > 0 ? (
              <>
                <Table data={filteredContacts} columns={columns} />
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg mt-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  Aucun contact trouvé
                </p>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setView("creation")}
                >
                  Ajouter un contact
                </Button>
              </div>
            )}
          </div>
        )}
        {view === "creation" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
              <User size={24} className="mr-2" />
              Ajouter un nouveau contact
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-end space-x-4 mb-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setView("search")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Informations personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User size={14} className="mr-1" />
                      Prénom <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User size={14} className="mr-1" />
                      Nom <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Building size={14} className="mr-1" />
                      Type de contact{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choisir</option>
                      <option value="client">Client</option>
                      <option value="supplier">Fournisseur</option>
                      <option value="partner">Partenaire</option>
                      <option value="prospect">Prospect</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Building size={14} className="mr-1" />
                      Entreprise
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Coordonnées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Mail size={14} className="mr-1" />
                      E-mail <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Phone size={14} className="mr-1" />
                      Téléphone <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: +225 07 08 09 10 11"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Réseaux sociaux
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Globe size={14} className="mr-1" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Globe size={14} className="mr-1" />
                      Site web
                    </label>
                    <input
                      type="url"
                      name="socialMedia.website"
                      value={formData.socialMedia.website}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Informations supplémentaires
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
