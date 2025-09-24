const API_BASE_URL = process.env.REACT_APP_API_URL;

const activitiesService = {
  // Obtener todas las actividades
  getAllActivities: async () => {
    try {
      console.log('🔄 Fetching activities from:', `${API_BASE_URL}/admin/activities`);
      const token = localStorage.getItem('adminToken');
      console.log('🔑 Token exists:', !!token);
      
      const response = await fetch(`${API_BASE_URL}/admin/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Activities response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      throw error;
    }
  },

  // Obtener una actividad específica
  getActivity: async (activityKey) => {
    try {
      console.log(`🔄 Fetching activity: ${activityKey}`);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/activities/${activityKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Activity fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching activity:', error);
      throw error;
    }
  },

  // Actualizar actividad
  updateActivity: async (activityKey, updateData) => {
    try {
      console.log(`🔄 Updating activity: ${activityKey}`, updateData);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/activities/${activityKey}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Activity updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating activity:', error);
      throw error;
    }
  },

  // Cambiar estado activo/inactivo
  toggleActivity: async (activityKey, activo) => {
    try {
      console.log(`🔄 Toggling activity: ${activityKey} to ${activo}`);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/activities/${activityKey}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Activity toggled successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error toggling activity:', error);
      throw error;
    }
  },

  // Crear nueva actividad
  createActivity: async (activityData) => {
    try {
      console.log('🔄 Creating new activity:', activityData);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating activity:', error);
      throw error;
    }
  },

  // Obtener vista previa del menú dinámico para el bot
  getMenuPreview: async () => {
    try {
      console.log('🔄 Fetching activities menu preview...');
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/activities/menu/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Menu preview fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching menu preview:', error);
      throw error;
    }
  }
};

export default activitiesService;
