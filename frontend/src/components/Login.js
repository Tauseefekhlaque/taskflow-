import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('token/', { username, password });
      localStorage.setItem('access', res.data.access);
      onLogin(res.data.access);
    } catch { setError('Invalid credentials'); }
  };

  return (
    <form onSubmit={submit} className="card p-4 shadow-sm">
      <h4 className="mb-3">Login</h4>
      {error && <div className="alert alert-danger py-1">{error}</div>}
      <input className="form-control mb-2" placeholder="Username"
             onChange={e => setUsername(e.target.value)} required />
      <input type="password" className="form-control mb-3" placeholder="Password"
             onChange={e => setPassword(e.target.value)} required />
      <button className="btn btn-primary w-100 mb-2">Login</button>
      <small>No account? <a href="#" onClick={onSwitch}>Register</a></small>
    </form>
  );
}