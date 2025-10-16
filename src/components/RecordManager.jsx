import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

export const RecordManager = ({ 
  entityType, 
  fields, 
  onRecordsChange,
  initialRecords = [],
  onRecordAdd,
  onRecordUpdate,
  onRecordDelete
}) => {
  const [records, setRecords] = useState(initialRecords);
  const [filteredRecords, setFilteredRecords] = useState(initialRecords);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form data structure
  useEffect(() => {
    const initialFormData = {};
    fields.forEach(field => {
      initialFormData[field.name] = field.defaultValue || '';
    });
    setFormData(initialFormData);
  }, [fields]);

  // Update records when initialRecords change
  useEffect(() => {
    setRecords(initialRecords);
    setFilteredRecords(initialRecords);
  }, [initialRecords]);

  // Filter records based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => {
        return Object.values(record).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} est requis`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    
    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Call external handler if provided
    if (onRecordAdd) {
      try {
        const addedRecord = await onRecordAdd(newRecord);
        if (addedRecord) {
          newRecord.id = addedRecord.id || newRecord.id;
        }
      } catch (error) {
        console.error('Error adding record:', error);
        // You might want to show an error message to the user
      }
    }
    
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    onRecordsChange(updatedRecords);
    
    // Reset form
    const resetFormData = {};
    fields.forEach(field => {
      resetFormData[field.name] = field.defaultValue || '';
    });
    setFormData(resetFormData);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({ ...record });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    const updatedRecord = { ...formData, updatedAt: new Date().toISOString() };
    
    // Call external handler if provided
    if (onRecordUpdate) {
      try {
        await onRecordUpdate(editingId, updatedRecord);
      } catch (error) {
        console.error('Error updating record:', error);
        // You might want to show an error message to the user
      }
    }
    
    const updatedRecords = records.map(record => 
      record.id === editingId ? updatedRecord : record
    );
    
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    onRecordsChange(updatedRecords);
    setEditingId(null);
    
    // Reset form
    const resetFormData = {};
    fields.forEach(field => {
      resetFormData[field.name] = field.defaultValue || '';
    });
    setFormData(resetFormData);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) return;
    
    // Call external handler if provided
    if (onRecordDelete) {
      try {
        await onRecordDelete(id);
      } catch (error) {
        console.error('Error deleting record:', error);
        // You might want to show an error message to the user
        return; // Don't proceed with local deletion if backend deletion failed
      }
    }
    
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    onRecordsChange(updatedRecords);
    
    if (editingId === id) {
      setEditingId(null);
      // Reset form
      const resetFormData = {};
      fields.forEach(field => {
        resetFormData[field.name] = field.defaultValue || '';
      });
      setFormData(resetFormData);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    // Reset form
    const resetFormData = {};
    fields.forEach(field => {
      resetFormData[field.name] = field.defaultValue || '';
    });
    setFormData(resetFormData);
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={field.placeholder}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            rows="3"
            placeholder={field.placeholder}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Modifier' : 'Ajouter'} un enregistrement
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Mettre à jour
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          )}
        </div>
      </div>
      
      {/* Search and Records Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Enregistrements ({filteredRecords.length})
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fields.map(field => (
                  <th 
                    key={field.name} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  {fields.map(field => (
                    <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {field.type === 'date' && record[field.name] 
                        ? new Date(record[field.name]).toLocaleDateString('fr-FR')
                        : record[field.name]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun enregistrement trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};