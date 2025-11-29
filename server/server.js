const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { patients: [], appointments: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Patients
app.get('/api/patients', async (req, res) => {
  const data = await readData();
  res.json(data.patients);
});

app.post('/api/patients', async (req, res) => {
  const patient = req.body;
  patient.id = Date.now().toString() + Math.floor(Math.random() * 1000);
  const data = await readData();
  data.patients.push(patient);
  await writeData(data);
  res.json(patient);
});

app.put('/api/patients/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const data = await readData();
  const idx = data.patients.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.patients[idx] = { ...data.patients[idx], ...updates };
  await writeData(data);
  res.json(data.patients[idx]);
});

app.delete('/api/patients/:id', async (req, res) => {
  const id = req.params.id;
  const data = await readData();
  const before = data.patients.length;
  data.patients = data.patients.filter((p) => p.id !== id);
  if (data.patients.length === before) return res.status(404).json({ error: 'Not found' });
  await writeData(data);
  res.json({ ok: true });
});

// Appointments
app.get('/api/appointments', async (req, res) => {
  const data = await readData();
  res.json(data.appointments);
});

app.post('/api/appointments', async (req, res) => {
  const appt = req.body;
  appt.id = Date.now().toString() + Math.floor(Math.random() * 1000);
  const data = await readData();
  data.appointments.push(appt);
  await writeData(data);
  res.json(appt);
});

app.delete('/api/appointments/:id', async (req, res) => {
  const id = req.params.id;
  const data = await readData();
  const before = data.appointments.length;
  data.appointments = data.appointments.filter((a) => a.id !== id);
  if (data.appointments.length === before) return res.status(404).json({ error: 'Not found' });
  await writeData(data);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
