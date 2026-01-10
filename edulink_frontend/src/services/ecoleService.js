import api from './api';

export const ecoleService = {
    getAll: async () => {
        const response = await api.get('/ecoles');
        return response.data;
    }
};