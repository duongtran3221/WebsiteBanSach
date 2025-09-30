import axios from 'axios';

const API_URL = 'http://localhost:3000';

const detailsService = {
  getById: async (ma_sach) => {
    try {
      const response = await axios.get(`${API_URL}/sach/getbyid/${ma_sach}`);
      return response.data.data[0];
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      throw error;
    }
  },
  addDanhgia: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/danhgia/add`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      throw error;
    }
  },
  getBySach: async (ma_sach) => {
    try {
      const response = await axios.get(`${API_URL}/danhgia/sach/${ma_sach}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá theo sách:", error);
      throw error;
    }
  },
};

export default detailsService;
