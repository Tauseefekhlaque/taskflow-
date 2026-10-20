import React, { useState } from 'react';
import API from '../api';

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('register/', form);
      setMsg('Registered! Now login.');
    } catch { setMsg('Registration failed'); }
  };

  return (
    <form onSubmit={submit} className="card p-4 shadow-sm">
      <h4 className="mb-3">Register</h4>
      {msg && <div className="alert alert-info py-1">{msg}</div>}
      <input className="form-control mb-2" placeholder="Username"
             onChange={e => setForm({ ...form, username: e.target.value })} required />
      <input className="form-control mb-2" placeholder="Email" type="email"
             onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input type="password" className="form-control mb-3" placeholder="Password"
             onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button className="btn btn-success w-100 mb-2">Register</button>
      <small>Have account? <a href="#" onClick={onSwitch}>Login</a></small>
    </form>
  );
}