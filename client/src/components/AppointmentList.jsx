import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

export default function AppointmentList({ 
  appointments, 
  patients, 
  onDelete, 
  onUpdate,
  onFilterChange, // New prop
  activeFilter // New prop
}) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const statusOptions = ['All', 'Scheduled', 'Completed', 'Canceled'];

  const startEdit = (appointment) => {
    setEditingId(appointment.id);
    setFormData({ ...appointment });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    onUpdate(formData);
    setEditingId(null);
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    return patient ? patient.name : 'Unknown';
  };

  return (
    <div className="card">
      <h3>Appointments ({appointments.length})</h3>

      {/* New Filter Bar */}
      <div className="filter-tabs">
        {statusOptions.map(status => (
          <button 
            key={status} 
            className={activeFilter === status ? 'active' : ''}
            onClick={() => onFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
      {/* End Filter Bar */}

      {appointments.length === 0 ? (
        <div className="no-items-msg">
          <p>No appointments match the current filter/search.</p>
        </div>
      ) : (
        <ul>
          {appointments.map((ap) => (
            <li key={ap.id}>
              {editingId === ap.id ? (
                <div className="edit-form-inline">
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="reason"
                    placeholder="Reason"
                    value={formData.reason}
                    onChange={handleChange}
                  />
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                  <button className="icon-btn success" onClick={saveEdit}>
                    <FaCheck />
                  </button>
                  <button className="icon-btn danger" onClick={() => setEditingId(null)}>
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <div className="appointment-info">
                    <strong>{getPatientName(ap.patientId)}</strong> - {new Date(ap.datetime).toLocaleString()}
                    <br />
                    <small>{ap.reason}</small>
                    <span className={`status-badge ${ap.status.toLowerCase()}`}>{ap.status}</span>
                  </div>
                  <div className="actions">
                    <FaEdit className="icon edit" onClick={() => startEdit(ap)} title="Edit" />
                    <FaTrash className="icon delete" onClick={() => onDelete(ap.id)} title="Delete" />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}