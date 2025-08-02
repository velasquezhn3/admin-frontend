import React, { useState, useEffect } from 'react';

const CABIN_TYPES = [
  { key: 'tortuga', label: 'Tortuga (3 disponibles)' },
  { key: 'delfin', label: 'Delfín (2 disponibles)' },
  { key: 'tiburon', label: 'Tiburón (7 disponibles)' }
];

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export default function DisponibilidadDashboard() {
  const [tipo, setTipo] = useState('tortuga');
  const [entrada, setEntrada] = useState(formatDate(new Date()));
  const [salida, setSalida] = useState(formatDate(new Date(Date.now() + 86400000)));
  const [disponibles, setDisponibles] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [reservar, setReservar] = useState(false);
  const [reservaStatus, setReservaStatus] = useState('');

  useEffect(() => {
    setReservar(false);
    setReservaStatus('');
    setMensaje('');
    setDisponibles(null);
  }, [tipo, entrada, salida]);

  const consultarDisponibilidad = async () => {
    setMensaje('Consultando...');
    setDisponibles(null);
    try {
      const res = await fetch('/api/disponibilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_cabaña: tipo,
          fecha_entrada: `${entrada}T14:00:00`,
          fecha_salida: `${salida}T11:00:00`
        })
      });
      const data = await res.json();
      setDisponibles(data.disponibles);
      setMensaje(data.mensaje);
      setReservar(data.disponible);
    } catch (err) {
      setMensaje('Error consultando disponibilidad');
    }
  };

  const reservarCabana = async () => {
    setReservaStatus('Reservando...');
    // Simulación de reserva (aquí deberías llamar a tu endpoint real de reserva)
    setTimeout(() => {
      setReservaStatus('Reserva realizada correctamente.');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Disponibilidad de Cabañas</h2>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <label>Tipo de cabaña</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }}>
            {CABIN_TYPES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Fecha de entrada</label>
          <input type="date" value={entrada} onChange={e => setEntrada(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Fecha de salida</label>
          <input type="date" value={salida} onChange={e => setSalida(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }} />
        </div>
      </div>
      <button onClick={consultarDisponibilidad} style={{ width: '100%', padding: 12, background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18 }}>Consultar disponibilidad</button>
      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 18, color: reservar ? '#27ae60' : '#c0392b' }}>
        {mensaje}
        {disponibles !== null && <div style={{ fontSize: 22, fontWeight: 700 }}>Disponibles: {disponibles}</div>}
      </div>
      {reservar && (
        <button onClick={reservarCabana} style={{ marginTop: 24, width: '100%', padding: 12, background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18 }}>Reservar ahora</button>
      )}
      {reservaStatus && <div style={{ marginTop: 18, textAlign: 'center', color: '#2980b9', fontWeight: 600 }}>{reservaStatus}</div>}
    </div>
  );
}
