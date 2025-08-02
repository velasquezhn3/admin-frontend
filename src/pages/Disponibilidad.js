import React, { useState } from 'react';

const tipos = [
  { value: 'tortuga', label: 'Tortuga (3 personas)' },
  { value: 'delfin', label: 'Delfín (3 personas)' },
  { value: 'tiburon', label: 'Tiburón (8 personas)' }
];

export default function Disponibilidad() {
  const [tipo, setTipo] = useState('tortuga');
  const [entrada, setEntrada] = useState('');
  const [salida, setSalida] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    try {
      const res = await fetch('/api/disponibilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_cabaña: tipo,
          fecha_entrada: entrada,
          fecha_salida: salida
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error');
      setResultado(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Verificar disponibilidad de cabañas</h2>
      <form onSubmit={handleSubmit}>
        <label>Tipo de cabaña:<br />
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <br /><br />
        <label>Fecha de entrada:<br />
          <input type="datetime-local" value={entrada} onChange={e => setEntrada(e.target.value.replace('T', 'T'))} required />
        </label>
        <br /><br />
        <label>Fecha de salida:<br />
          <input type="datetime-local" value={salida} onChange={e => setSalida(e.target.value.replace('T', 'T'))} required />
        </label>
        <br /><br />
        <button type="submit">Consultar</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {resultado && (
        <div style={{ marginTop: 20, color: resultado.disponible ? 'green' : 'red' }}>
          <b>{resultado.mensaje}</b><br />
          Disponibles: {resultado.disponibles}
        </div>
      )}
    </div>
  );
}
