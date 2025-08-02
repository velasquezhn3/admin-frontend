const API_BASE_URL = 'http://localhost:4000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('[API] Making request to:', url);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('[API] Request config:', config);
      const response = await fetch(url, config);
      console.log('[API] Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('[API] Response data:', result);
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Return mock data if backend is not available
      if (error.message.includes('Failed to fetch') || error.message.includes('CONNECTION')) {
        console.warn('Backend not available, returning mock data');
        return this.getMockData(endpoint);
      }
      
      throw error;
    }
  }

  getMockData(endpoint) {
    if (endpoint === '/admin/users') {
      return [
        { user_id: 1, name: 'Juan Pérez', phone_number: '+54911234567', role: 'guest', is_active: 1, created_at: '2024-01-15T10:00:00Z' },
        { user_id: 2, name: 'María García', phone_number: '+54911234568', role: 'guest', is_active: 1, created_at: '2024-02-20T10:00:00Z' },
        { user_id: 3, name: 'Carlos López', phone_number: '+54911234569', role: 'guest', is_active: 0, created_at: '2024-03-10T10:00:00Z' }
      ];
    }
    
    if (endpoint === '/admin/cabins') {
      return [
        // 3 Cabañas Tortuga
        { cabin_id: 1, id: 1, name: 'Cabaña Tortuga 1', nombre: 'Cabaña Tortuga 1', capacity: 3, capacidad: 3, price: 1500, precio_noche: 1500, description: 'Apartamento de 1 cuarto y 1 baño para máximo 3 personas', disponible: 1 },
        { cabin_id: 2, id: 2, name: 'Cabaña Tortuga 2', nombre: 'Cabaña Tortuga 2', capacity: 3, capacidad: 3, price: 1500, precio_noche: 1500, description: 'Apartamento de 1 cuarto y 1 baño para máximo 3 personas', disponible: 1 },
        { cabin_id: 3, id: 3, name: 'Cabaña Tortuga 3', nombre: 'Cabaña Tortuga 3', capacity: 3, capacidad: 3, price: 1500, precio_noche: 1500, description: 'Apartamento de 1 cuarto y 1 baño para máximo 3 personas', disponible: 1 },
        
        // 2 Cabañas Delfín
        { cabin_id: 4, id: 4, name: 'Cabaña Delfín 1', nombre: 'Cabaña Delfín 1', capacity: 6, capacidad: 6, price: 4500, precio_noche: 4500, description: 'Cabaña amplia de 2 cuartos y 2 baños para máximo 6 personas', disponible: 1 },
        { cabin_id: 5, id: 5, name: 'Cabaña Delfín 2', nombre: 'Cabaña Delfín 2', capacity: 6, capacidad: 6, price: 4500, precio_noche: 4500, description: 'Cabaña amplia de 2 cuartos y 2 baños para máximo 6 personas', disponible: 1 },
        
        // 8 Cabañas Tiburón
        { cabin_id: 6, id: 6, name: 'Cabaña Tiburón 1', nombre: 'Cabaña Tiburón 1', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 7, id: 7, name: 'Cabaña Tiburón 2', nombre: 'Cabaña Tiburón 2', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 8, id: 8, name: 'Cabaña Tiburón 3', nombre: 'Cabaña Tiburón 3', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 9, id: 9, name: 'Cabaña Tiburón 4', nombre: 'Cabaña Tiburón 4', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 10, id: 10, name: 'Cabaña Tiburón 5', nombre: 'Cabaña Tiburón 5', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 11, id: 11, name: 'Cabaña Tiburón 6', nombre: 'Cabaña Tiburón 6', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 12, id: 12, name: 'Cabaña Tiburón 7', nombre: 'Cabaña Tiburón 7', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 },
        { cabin_id: 13, id: 13, name: 'Cabaña Tiburón 8', nombre: 'Cabaña Tiburón 8', capacity: 9, capacidad: 9, price: 6000, precio_noche: 6000, description: 'Cabaña grande de 3 cuartos y 3 baños para máximo 9 personas', disponible: 1 }
      ];
    }
    
    if (endpoint === '/admin/reservations') {
      return [
        { 
          reservation_id: 1, 
          user_id: 1,
          user_name: 'Ana Martínez', 
          phone_number: '+54911234570',
          cabin_id: 1,
          cabin_name: 'Cabaña Tortuga 1',
          start_date: '2024-08-15', 
          end_date: '2024-08-20', 
          status: 'confirmado', 
          total_price: 7500,
          personas: 3,
          comprobante_nombre_archivo: null
        },
        { 
          reservation_id: 2, 
          user_id: 2,
          user_name: 'Roberto Silva', 
          phone_number: '+54911234571',
          cabin_id: 2,
          cabin_name: 'Cabaña Delfín 1',
          start_date: '2024-08-22', 
          end_date: '2024-08-25', 
          status: 'pendiente', 
          total_price: 5400,
          personas: 2,
          comprobante_nombre_archivo: null
        }
      ];
    }

    if (endpoint === '/admin/calendar-occupancy') {
      return {
        cabanas: [
          { cabin_id: 1, name: 'Cabaña Tortuga 1' },
          { cabin_id: 2, name: 'Cabaña Tortuga 2' },
          { cabin_id: 3, name: 'Cabaña Tortuga 3' },
          { cabin_id: 4, name: 'Cabaña Delfín 1' },
          { cabin_id: 5, name: 'Cabaña Delfín 2' },
          { cabin_id: 6, name: 'Cabaña Tiburón 1' },
          { cabin_id: 7, name: 'Cabaña Tiburón 2' },
          { cabin_id: 8, name: 'Cabaña Tiburón 3' },
          { cabin_id: 9, name: 'Cabaña Tiburón 4' },
          { cabin_id: 10, name: 'Cabaña Tiburón 5' },
          { cabin_id: 11, name: 'Cabaña Tiburón 6' },
          { cabin_id: 12, name: 'Cabaña Tiburón 7' },
          { cabin_id: 13, name: 'Cabaña Tiburón 8' }
        ],
        ocupacion: [
          { cabin_id: 1, fecha: '2025-08-05', status: 'confirmado' },
          { cabin_id: 1, fecha: '2025-08-06', status: 'confirmado' },
          { cabin_id: 4, fecha: '2025-08-10', status: 'pendiente' },
          { cabin_id: 6, fecha: '2025-08-15', status: 'confirmado' }
        ]
      };
    }
    
    return [];
  }

  // Users endpoints
  async getUsers() {
    return this.request('/admin/users');
  }

  async createUser(user) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id, user) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  // Cabins endpoints
  async getCabins() {
    return this.request('/admin/cabins');
  }

  async createCabin(cabin) {
    const formData = new FormData();
    Object.keys(cabin).forEach(key => {
      if (cabin[key] !== null && cabin[key] !== undefined) {
        formData.append(key, cabin[key]);
      }
    });

    return this.request('/admin/cabins', {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });
  }

  async updateCabin(id, cabin) {
    const formData = new FormData();
    Object.keys(cabin).forEach(key => {
      if (cabin[key] !== null && cabin[key] !== undefined) {
        formData.append(key, cabin[key]);
      }
    });

    return this.request(`/admin/cabins/${id}`, {
      method: 'PUT',
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });
  }

  async deleteCabin(id) {
    return this.request(`/admin/cabins/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservations endpoints
  async getReservations() {
    return this.request('/admin/reservations');
  }

  async createReservation(reservation) {
    // Mapear los campos al formato correcto del backend
    const requestData = {
      cabin_id: reservation.cabin_id,
      user_id: reservation.user_id,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      status: reservation.status,
      total_price: reservation.total_price,
      number_of_people: reservation.personas || reservation.number_of_people
    };
    
    return this.request('/admin/reservations', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateReservation(id, reservation) {
    // Mapear los campos al formato correcto del backend
    const requestData = {
      cabin_id: reservation.cabin_id,
      user_id: reservation.user_id,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      status: reservation.status,
      total_price: reservation.total_price,
      number_of_people: reservation.personas || reservation.number_of_people
    };
    
    return this.request(`/admin/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async deleteReservation(id) {
    return this.request(`/admin/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getDashboardRecentActivity() {
    return this.request('/admin/dashboard/recent-activity');
  }

  // Activities endpoints
  async getActivities() {
    return this.request('/admin/activities');
  }

  async createActivity(activity) {
    return this.request('/admin/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  async updateActivity(id, activity) {
    return this.request(`/admin/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activity),
    });
  }

  async deleteActivity(id) {
    return this.request(`/admin/activities/${id}`, {
      method: 'DELETE',
    });
  }

  // Calendar endpoints
  async getCalendarOccupancy(year, month) {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month.toString().padStart(2, '0'));
    
    const endpoint = `/admin/calendar-occupancy${params.toString() ? '?' + params.toString() : ''}`;
    return this.request(endpoint);
  }

  // Conversation States endpoints
  async getConversationStates() {
    return this.request('/admin/conversation-states');
  }

  async createConversationState(state) {
    return this.request('/admin/conversation-states', {
      method: 'POST',
      body: JSON.stringify(state),
    });
  }

  async updateConversationState(id, state) {
    return this.request(`/admin/conversation-states/${id}`, {
      method: 'PUT',
      body: JSON.stringify(state),
    });
  }

  async deleteConversationState(id) {
    return this.request(`/admin/conversation-states/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
