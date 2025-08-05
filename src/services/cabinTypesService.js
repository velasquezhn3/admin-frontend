// services/cabinTypesService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

class CabinTypesService {
  
  /**
   * Obtener todos los tipos de cabañas
   */
  async getAllCabinTypes() {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/admin/cabin-types`);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/cabin-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching cabin types:', error);
      throw error;
    }
  }

  /**
   * Obtener un tipo específico por clave
   */
  async getCabinTypeByKey(typeKey) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/cabin-types/${typeKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cabin type:', error);
      throw error;
    }
  }

  /**
   * Actualizar un tipo de cabaña
   */
  async updateCabinType(typeKey, data) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/cabin-types/${typeKey}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating cabin type:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo tipo de cabaña
   */
  async createCabinType(data) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/cabin-types`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating cabin type:', error);
      throw error;
    }
  }

  /**
   * Activar/desactivar un tipo de cabaña
   */
  async toggleCabinType(typeKey, activo) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/cabin-types/${typeKey}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error toggling cabin type:', error);
      throw error;
    }
  }

  /**
   * Obtener vista previa del menú
   */
  async getMenuPreview() {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/cabin-types/preview/menu`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu preview:', error);
      throw error;
    }
  }
}

export default new CabinTypesService();
