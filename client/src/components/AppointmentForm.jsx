import React, { useState } from 'react';

export default function AppointmentForm({ patients, onSubmit }) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    datetime: '',
    reason: '',
    status: 'Scheduled', // New status field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patientId') {
      const selectedPatient = patients.find((p) => p.id.toString() === value);
      setFormData({
        ...formData,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.datetime) {
      alert('Please select a patient and appointment date/time.');
      return;
    }
    onSubmit(formData);
    setFormData({ patientId: '', patientName: '', datetime: '', reason: '', status: 'Scheduled' });
  };

  if (patients.length === 0) {
    return (
      <div className="no-patients-msg">
        <h3>No patients found</h3>
        <p>Please add a patient before booking an appointment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Book an Appointment</h2>
      <label>Patient *</label>
      <select name="patientId" value={formData.patientId} onChange={handleChange} required>
        <option value="">-- Select Patient --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.contact || 'No Contact'})
          </option>
        ))}
      </select>

      <label>Date & Time *</label>
      <input type="datetime-local" name="datetime" value={formData.datetime} onChange={handleChange} required />

      <label>Reason for Visit</label>
      <input type="text" name="reason" placeholder="e.g., Fever, Follow-up, General Checkup" value={formData.reason} onChange={handleChange} />

      <button type="submit" className="submit">Confirm Appointment</button>
    </form>
  );
}