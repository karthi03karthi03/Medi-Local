const BASE = 'http://localhost:5000/api'
let mode = 'server'

export const API = {
  setMode(m) {
    mode = m
  },

  async readLocal() {
    const raw = localStorage.getItem('medilocal_data')
    if (!raw) {
      const init = { patients: [], appointments: [] }
      localStorage.setItem('medilocal_data', JSON.stringify(init))
      return init
    }
    try {
      return JSON.parse(raw)
    } catch (e) {
      const init = { patients: [], appointments: [] }
      localStorage.setItem('medilocal_data', JSON.stringify(init))
      return init
    }
  },

  async writeLocal(data) {
    localStorage.setItem('medilocal_data', JSON.stringify(data))
  },

  // Patients
  async getPatients() {
    if (mode === 'local') {
      const data = await this.readLocal()
      return data.patients
    }
    const res = await fetch(`${BASE}/patients`)
    if (!res.ok) return []
    return res.json()
  },

  async addPatient(patient) {
    if (mode === 'local') {
      const data = await this.readLocal()
      const id = Date.now().toString() + Math.floor(Math.random() * 1000)
      const p = { ...patient, id }
      data.patients.push(p)
      await this.writeLocal(data)
      return p
    }
    const res = await fetch(`${BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    })
    return res.ok ? res.json() : null
  },

  async updatePatient(id, updates) {
    if (mode === 'local') {
      const data = await this.readLocal()
      const idx = data.patients.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error('not found')
      data.patients[idx] = { ...data.patients[idx], ...updates }
      await this.writeLocal(data)
      return data.patients[idx]
    }
    const res = await fetch(`${BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return res.ok ? res.json() : null
  },

  async deletePatient(id) {
    if (mode === 'local') {
      const data = await this.readLocal()
      data.patients = data.patients.filter((p) => p.id !== id)
      await this.writeLocal(data)
      return { ok: true }
    }
    const res = await fetch(`${BASE}/patients/${id}`, { method: 'DELETE' })
    return res.ok ? res.json() : null
  },

  // Appointments
  async getAppointments() {
    if (mode === 'local') {
      const data = await this.readLocal()
      return data.appointments
    }
    const res = await fetch(`${BASE}/appointments`)
    if (!res.ok) return []
    return res.json()
  },

  async addAppointment(appt) {
    if (mode === 'local') {
      const data = await this.readLocal()
      const id = Date.now().toString() + Math.floor(Math.random() * 1000)
      const a = { ...appt, id }
      data.appointments.push(a)
      await this.writeLocal(data)
      return a
    }
    const res = await fetch(`${BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt)
    })
    return res.ok ? res.json() : null
  },

  async deleteAppointment(id) {
    if (mode === 'local') {
      const data = await this.readLocal()
      data.appointments = data.appointments.filter((a) => a.id !== id)
      await this.writeLocal(data)
      return { ok: true }
    }
    const res = await fetch(`${BASE}/appointments/${id}`, { method: 'DELETE' })
    return res.ok ? res.json() : null
  }
}
