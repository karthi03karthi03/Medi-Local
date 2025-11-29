import React, { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import PatientList from './components/PatientList';
import AppointmentList from './components/AppointmentList';
import PatientDetailsModal from './components/PatientDetailsModal';
import PatientDemographics from './components/PatientDemographics';
import './styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaSearch } from 'react-icons/fa';

// --- Local Storage Hooks ---
const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Error loading state from localStorage', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};
// -----------------------------

export default function App() {
  const [patients, setPatients] = useLocalStorageState('patients', []);
  const [appointments, setAppointments] = useLocalStorageState('appointments', []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAppointmentFilter, setActiveAppointmentFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading delay to show the loader
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); 
  }, []);

  // --- Handlers (with UX Improvement: Auto-Switch Tab) ---
  const handleAddPatient = (patient) => {
    setPatients([...patients, { ...patient, id: Date.now() }]);
    toast.success('Patient added successfully!');
    setActiveTab('dashboard'); // UX Improvement: Switch to dashboard
  };

  const handleUpdatePatient = (updatedPatient) => {
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
    toast.info('Patient updated successfully!');
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
    setAppointments(appointments.filter((a) => a.patientId !== id.toString()));
    toast.error('Patient and their appointments deleted!');
  };

  const handleAddAppointment = (appointment) => {
    setAppointments([...appointments, { ...appointment, id: Date.now() }]);
    toast.success('Appointment booked successfully!');
    setActiveTab('dashboard'); // UX Improvement: Switch to dashboard
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(appointments.map((a) => (a.id === updatedAppointment.id ? updatedAppointment : a)));
    toast.info('Appointment updated!');
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    toast.error('Appointment canceled!');
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };
  // ---------------------------------------------------------------------

  // --- Filtering Logic ---
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contact.includes(searchQuery)
  );

  const appointmentsBySearch = appointments.filter(appointment => {
    const patient = patients.find(p => p.id === parseInt(appointment.patientId));
    const patientName = patient ? patient.name : '';
    const date = new Date(appointment.datetime).toLocaleString();
    return (
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      date.includes(searchQuery)
    );
  });
  
  const filteredAppointments = appointmentsBySearch.filter(appointment => 
    activeAppointmentFilter === 'All' || appointment.status === activeAppointmentFilter
  );
  // -----------------------

  // --- Dashboard Stats & Age Grouping (New Feature Logic) ---
  const totalCompleted = appointments.filter(a => a.status === 'Completed').length;
  const totalScheduled = appointments.filter(a => a.status === 'Scheduled').length;
  
  const getAgeGroup = (age) => {
    if (age <= 18) return '0-18 (Child/Teen)';
    if (age <= 45) return '19-45 (Adult)';
    if (age <= 65) return '46-65 (Senior)';
    return '65+ (Elderly)';
  };

  const ageData = patients.reduce((acc, patient) => {
    const group = getAgeGroup(parseInt(patient.age));
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
  // ----------------------------------------

  return (
    <div className="container">
      <header>
        <h1>MediLocal - Clinic & Diagnostics</h1>
      </header>

      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading Data from Local Storage...</p>
        </div>
      ) : (
        <>
          <div className="tabs">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </button>
            <button className={activeTab === 'patient' ? 'active' : ''} onClick={() => setActiveTab('patient')}>
              Add Patient
            </button>
            <button className={activeTab === 'appointment' ? 'active' : ''} onClick={() => setActiveTab('appointment')}>
              Book Appointment
            </button>
          </div>

          {activeTab === 'patient' && (
            <div className="card">
              <PatientForm onSubmit={handleAddPatient} />
            </div>
          )}

          {activeTab === 'appointment' && (
            <div className="card">
              <AppointmentForm patients={patients} onSubmit={handleAddAppointment} />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              <div className="search-bar-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search patients or appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="dashboard-grid">
                <PatientDemographics patients={patients} ageData={ageData} />
                <div className="stat-card">
                  <h2>{patients.length}</h2>
                  <p>Total Patients</p>
                </div>
                <div className="stat-card blue">
                  <h2>{totalScheduled}</h2>
                  <p>Scheduled Appointments</p>
                </div>
                <div className="stat-card green">
                  <h2>{totalCompleted}</h2>
                  <p>Appointments Completed</p>
                </div>
              </div>
              <PatientList
                patients={filteredPatients}
                onDelete={handleDeletePatient}
                onUpdate={handleUpdatePatient}
                onSelectPatient={handleSelectPatient}
              />
              <AppointmentList
                appointments={filteredAppointments}
                patients={patients}
                onDelete={handleDeleteAppointment}
                onUpdate={handleUpdateAppointment}
                onFilterChange={setActiveAppointmentFilter}
                activeFilter={activeAppointmentFilter}
              />
            </>
          )}

          {selectedPatient && (
            <PatientDetailsModal
              patient={selectedPatient}
              appointments={appointments}
              onClose={() => setSelectedPatient(null)}
            />
          )}
        </>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}