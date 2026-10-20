import React, { useEffect, useState } from 'react';
import API from '../api';
import TaskForm from './TaskForm';
import ActivityLog from './ActivityLog';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    const res = await API.get('tasks/');
    setTasks(res.data);
  };
  
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    if (editing) {
      await API.put(`tasks/${editing.id}/`, { ...data, status: editing.status });
      setEditing(null);
    } else {
      await API.post('tasks/', data);
    }
    load();
  };

  const toggle = async (t) => {
    await API.put(`tasks/${t.id}/`, { ...t, status: t.status === 'pending' ? 'completed' : 'pending' });
    load();
  };

  const remove = async (id) => { 
    await API.delete(`tasks/${id}/`); 
    load(); 
  };

  const filtered = tasks.filter(t => filter === 'all' ? true : t.status === filter);

  return (
    <div>
      <TaskForm onSave={save} editing={editing} />
      
      <div className="btn-group mb-3">
        {['all', 'pending', 'completed'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {filtered.length === 0 && <li className="list-group-item text-muted">No tasks</li>}
        {filtered.map(t => (
          <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" className="form-check-input me-2"
                     checked={t.status === 'completed'} onChange={() => toggle(t)} />
              <span style={{ textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>
                <strong>{t.title}</strong>
                {t.description && <small className="text-muted"> — {t.description}</small>}
              </span>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setEditing(t)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => remove(t.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <ActivityLog />
    </div>
  );
}