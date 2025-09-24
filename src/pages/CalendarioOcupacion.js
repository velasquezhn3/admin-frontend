import React, { useEffect, useState } from 'react';

function getMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

export default function CalendarioOcupacion() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [cabanas, setCabanas] = useState([]);
  const [ocupacion, setOcupacion] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  fetch(`${process.env.REACT_APP_API_URL}/admin/calendar-occupancy?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        setCabanas(data.cabanas || []);
        setOcupacion(data.ocupacion || {});
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading calendar data:', error);
        setLoading(false);
      });
  }, [year, month]);

  const days = Array.from({ length: getMonthDays(year, month) }, (_, i) => i + 1);

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Mapa de ocupación de cabañas</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
        <button onClick={() => {
          if (month === 1) {
            setMonth(12);
            setYear(y => y - 1);
          } else {
            setMonth(m => m - 1);
          }
        }}>&lt; Mes anterior</button>
        <span style={{ fontWeight: 600, fontSize: 18 }}>{year} - {String(month).padStart(2, '0')}</span>
        <button onClick={() => {
          if (month === 12) {
            setMonth(1);
            setYear(y => y + 1);
          } else {
            setMonth(m => m + 1);
          }
        }}>Mes siguiente &gt;</button>
      </div>
      {loading ? <div>Cargando...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ background: '#3498db', color: '#fff', padding: 8 }}>Cabaña</th>
                {days.map(d => (
                  <th key={d} style={{ background: '#f8f9fa', padding: 4 }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cabanas.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, background: '#f8f9fa', padding: 8 }}>{c.nombre}</td>
                  {days.map(d => {
                    const fecha = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const estado = ocupacion[c.id]?.[fecha] || 'libre';
                    let color = '#eafaf1';
                    if (estado === 'reservada') color = '#e74c3c';
                    if (estado === 'pendiente') color = '#f9e79f';
                    return <td key={fecha} style={{ background: color, textAlign: 'center', padding: 4 }}>{estado === 'libre' ? '' : estado}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: 24, fontSize: 15 }}>
        <span style={{ background: '#e74c3c', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>reservada</span> = Reservada &nbsp;
        <span style={{ background: '#f9e79f', color: '#333', padding: '2px 8px', borderRadius: 4 }}>pendiente</span> = Pendiente &nbsp;
        <span style={{ background: '#eafaf1', color: '#333', padding: '2px 8px', borderRadius: 4 }}>libre</span> = Libre
      </div>
    </div>
  );
}
