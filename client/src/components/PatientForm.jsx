import React, { useState } from 'react';

export default function PatientForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', age: '', gender: '', contact: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Add New Patient</h2>
      <label>
        Name *
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Age *
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <label>
        Gender *
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Contact
        <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
      </label>
      <button type="submit" className="submit">Add Patient</button>
    </form>
  );
}