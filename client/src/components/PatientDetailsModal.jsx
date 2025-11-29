import React from 'react';

export default function PatientDetailsModal({ patient, appointments, onClose }) {
  const patientAppointments = appointments.filter(ap => ap.patientId === patient.id);

  if (!patient) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{patient.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Contact:</strong> {patient.contact || 'N/A'}</p>

          <div className="history-section">
            <h4>Appointment History ({patientAppointments.length})</h4>
            {patientAppointments.length > 0 ? (
              <ul>
                {patientAppointments.map(ap => (
                  <li key={ap.id}>
                    <strong>Date:</strong> {new Date(ap.datetime).toLocaleString()}
                    <br />
                    <strong>Reason:</strong> {ap.reason || 'N/A'}
                    <span className={`status-badge ${ap.status.toLowerCase()}`}>{ap.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No past appointments for this patient.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}