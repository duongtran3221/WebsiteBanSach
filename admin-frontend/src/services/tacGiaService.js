import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getAllTacGia = async () => {
  try {
    const response = await axios.get(`${API_URL}/tacgia/getall`);
    return response.data.result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tác giả:', error);
    throw error;
  }
};

export const getTacGiaByPage = async (page, pageSize,searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/tacgia/paged`, {
      params: { page, pageSize: pageSize ,searchTerm}
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phân trang:', error);
    throw error;
  }
};

export const addTacGia = async (tacGiaData) => {
  try {
    const response = await axios.post(`${API_URL}/tacgia/add`, tacGiaData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm tác giả:', error);
    throw error;
  }
};

export const updateTacGia = async (tacGiaData) => {
  try {
    const response = await axios.put(`${API_URL}/tacgia/update`, tacGiaData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật tác giả:', error);
    throw error;
  }
};

export const deleteTacGia = async (ma_tac_gia) => {
  try {
    const response = await axios.delete(`${API_URL}/tacgia/delete/${ma_tac_gia}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa tác giả:', error);
    throw error;
  }
};