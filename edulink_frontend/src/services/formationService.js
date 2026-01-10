import api from './api'; // Ton instance Axios

export const formationService = {
    // Récupérer tout
    getAll: async () => {
        const response = await api.get('/formations');
        return response.data;
    },
    // Récupérer un seul
    getById: async (id) => {
        const response = await api.get(`/formations/${id}`);
        return response.data;
    }
};