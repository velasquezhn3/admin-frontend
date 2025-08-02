import React, { useEffect, useState } from 'react';

export default function LogsLimpiezaReservas() {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/logs/limpieza-reservas')
      .then(res => res.json())
      .then(data => {
        setLog(data.log);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Historial de reservas eliminadas automáticamente</h2>
      {loading ? <div>Cargando...</div> : (
        log ? <pre style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, fontSize: 16 }}>{log}</pre>
            : <div>No hay registros de limpieza este mes.</div>
      )}
    </div>
  );
}
