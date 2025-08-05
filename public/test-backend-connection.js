// Test de conexión frontend -> backend
console.log('🔍 PROBANDO CONEXIÓN FRONTEND -> BACKEND');

async function testFrontendConnection() {
  try {
    console.log('1. Probando endpoint de test...');
    const testResponse = await fetch('http://localhost:4000/test');
    const testData = await testResponse.json();
    console.log('✅ Test endpoint:', testData);

    console.log('\n2. Probando login...');
    const loginResponse = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);

    if (loginData.success) {
      const token = loginData.data.token;
      console.log('\n3. Probando endpoint de reservas con token...');
      
      const reservasResponse = await fetch('http://localhost:4000/admin/reservations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const reservasData = await reservasResponse.json();
      console.log('✅ Reservas response:', reservasData);
      
      if (reservasData.success) {
        console.log('\n📊 DATOS REALES DEL BACKEND:');
        reservasData.data.slice(0, 3).forEach(r => {
          console.log(`- ${r.user_name} en ${r.cabin_name} (${r.start_date} - ${r.end_date}) $${r.total_price}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('Este error es la razón por la que el frontend usa datos mock');
  }
}

testFrontendConnection();
