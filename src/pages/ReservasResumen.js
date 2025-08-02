import React, { useEffect, useState } from 'react';

export default function ReservasResumen() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/reservations')
      .then(res => res.json())
      .then(data => {
        setReservas(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Resumen de todas las reservas</h2>
      {loading ? <div>Cargando...</div> : (
        reservas.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
                <th>Personas</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.reservation_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{r.reservation_id}</td>
                  <td>{r.nombre || r.name}</td>
                  <td>{r.telefono || r.phone_number}</td>
                  <td>{r.tipo_cabaña || r.alojamiento}</td>
                  <td>{r.fecha_entrada || r.start_date}</td>
                  <td>{r.fecha_salida || r.end_date}</td>
                  <td>{r.estado || r.status}</td>
                  <td>{r.personas}</td>
                  <td>{r.precioTotal || r.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div>No hay reservas registradas.</div>
      )}
    </div>
  );
}
