import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const auth = async (so_dien_thoai, mat_khau_hash) => {
  try {
    const response = await axios.post(`${API_URL}/nguoidung/login`, {
      so_dien_thoai:so_dien_thoai,
      mat_khau_hash:mat_khau_hash,
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};
