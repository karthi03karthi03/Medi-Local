import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Registering all necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function PatientDemographics({ patients, ageData }) {
  // --- Gender Data (Pie Chart) ---
  const genderCounts = patients.reduce((acc, patient) => {
    acc[patient.gender] = (acc[patient.gender] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(genderCounts),
    datasets: [
      {
        label: 'Patients by Gender',
        data: Object.values(genderCounts),
        backgroundColor: ['#1a73e8', '#e84188', '#888'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 1,
      },
    ],
  };

  // --- Age Data (Bar Chart) ---
  const barData = {
    labels: Object.keys(ageData),
    datasets: [
      {
        label: 'Patients by Age Group',
        data: Object.values(ageData),
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        borderWidth: 1,
      },
    ],
  };

  // --- Chart Options for Sizing Fix ---
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false, // Key for responsive sizing
    plugins: {
      title: { display: false },
    },
  };

  const barOptions = {
    ...commonOptions,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      legend: {
        position: 'bottom', // Moving legend down helps with horizontal space (Fix)
        labels: { boxWidth: 10, padding: 10 }
      },
    }
  };
  // ------------------------------------


  if (patients.length === 0) {
    return (
      <div className="card analytics-card no-data-state">
        <h3>Patient Demographics</h3>
        <p>Add patients to see demographic data.</p>
      </div>
    );
  }

  return (
    <div className="card analytics-card-grid">
      <div className="chart-wrapper">
        <h4 className="chart-title">Gender Distribution</h4>
        <div className="chart-inner-container"> 
            <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div className="chart-wrapper">
        <h4 className="chart-title">Age Group Breakdown</h4>
        <div className="chart-inner-container">
            <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}