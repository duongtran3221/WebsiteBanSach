import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export const getAllNhaXuatBan = async () => {
  try {
    const response = await axios.get(`${API_URL}/nhaxuatban/getall`);
    return response.data[0];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NXB:', error);
    throw error;
  }
};

export const getNhaXuatBanByPage = async (page, pageSize,searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/nhaxuatban/paged`, {
      params: { page, size: pageSize ,searchTerm}
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phân trang:', error);
    throw error;
  }
};

export const addNhaXuatBan = async (nhaXuatBanData) => {
  try {
    const response = await axios.post(`${API_URL}/nhaxuatban/add`, nhaXuatBanData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm NXB:', error);
    throw error;
  }
};

export const updateNhaXuatBan = async (nhaXuatBanData) => {
  try {
    const response = await axios.put(`${API_URL}/nhaxuatban/update`, nhaXuatBanData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật NXB:', error);
    throw error;
  }
};

export const deleteNhaXuatBan = async (ma_nxb) => {
  try {
    const response = await axios.delete(`${API_URL}/nhaxuatban/delete/${ma_nxb}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa NXB:', error);
    throw error;
  }
};