
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const addOrder = (orderData) => {
  return axios.post(`${API_URL}/donhang/add`, orderData);
};

