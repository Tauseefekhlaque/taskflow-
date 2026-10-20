import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSave, editing }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description);
    }
  }, [editing]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description });
    setTitle(''); setDescription('');
  };

  return (
    <form onSubmit={submit} className="input-group mb-3">
      <input className="form-control" placeholder="Task title"
             value={title} onChange={e => setTitle(e.target.value)} />
      <input className="form-control" placeholder="Description"
             value={description} onChange={e => setDescription(e.target.value)} />
      <button className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
    </form>
  );
}