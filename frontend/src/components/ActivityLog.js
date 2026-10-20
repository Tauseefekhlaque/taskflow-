import React, { useEffect, useState } from 'react';
import API from '../api';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => { 
    API.get('logs/').then(r => setLogs(r.data)).catch(() => {}); 
  }, []);
  
  if (!logs.length) return null;
  
  return (
    <div className="mt-4">
      <h6 className="text-muted">📋 Recent Activity (MongoDB)</h6>
      <ul className="list-group list-group-flush">
        {logs.map((l, i) => (
          <li key={i} className="list-group-item py-1 small">
            <span className="badge bg-secondary me-2">{l.action}</span>{l.details}
          </li>
        ))}
      </ul>
    </div>
  );
}