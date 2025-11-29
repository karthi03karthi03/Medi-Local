import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function PatientList({ patients, onDelete, onUpdate, onSelectPatient }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const startEdit = (patient) => {
    setEditingId(patient.id);
    setFormData({ ...patient });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    onUpdate(formData);
    setEditingId(null);
  };

  return (
    <div className="card">
      <h3>Patients ({patients.length})</h3>
      <ul className="patient-list">
        {patients.map((p) => (
          <li key={p.id}>
            {editingId === p.id ? (
              <div className="edit-form-inline">
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
                <button className="submit" onClick={saveEdit}>Save</button>
                <button className="cancel" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="patient-info" onClick={() => onSelectPatient(p)}>
                  <strong>{p.name}</strong> ({p.age}, {p.gender})
                  <br />
                  <small>{p.contact}</small>
                </div>
                <div className="actions">
                  <FaEdit className="icon edit" onClick={() => startEdit(p)} title="Edit" />
                  <FaTrash className="icon delete" onClick={() => onDelete(p.id)} title="Delete" />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}