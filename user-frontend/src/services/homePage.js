import axios from 'axios';

const API_URL = 'http://10.90.224.205:8080';

const sachService = {
    getRandom10Sach: async () => {
        try {
            const response = await axios.get(`${API_URL}/sach/random10`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi gọi API getRandom10Sach:', error);
            throw error;
        }
    },
    get10SachNew: async () => {
        try {
            const response = await axios.get(`${API_URL}/sach/get10sachnew`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi gọi API get10sachnew:', error);
            throw error;
        }
    },

    searchSach: async (page,pageSize,searchTerm) => {
        try {
            const response = await axios.get(`${API_URL}/sach/paged`,{
                params:{page,pageSize,searchTerm}
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
};

export default sachService;
