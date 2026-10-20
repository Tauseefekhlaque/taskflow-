import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access'));
  const [showRegister, setShowRegister] = useState(false);

  const logout = () => { localStorage.clear(); setToken(null); };

  if (!token) {
    return (
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <h2 className="text-center mb-4">TaskFlow</h2>
        {showRegister
          ? <Register onSwitch={() => setShowRegister(false)} />
          : <Login onLogin={setToken} onSwitch={() => setShowRegister(true)} />}
      </div>
    );
  }
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <span className="navbar-brand">TaskFlow</span>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
      </nav>
      <div className="container mt-4"><TaskList /></div>
    </div>
  );
}
export default App;