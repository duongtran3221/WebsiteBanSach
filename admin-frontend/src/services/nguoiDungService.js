import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getAllNguoiDung = async () => {
  try {
    const response = await axios.get(`${API_URL}/nguoidung/getall`);
    return response.data.result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

export const getNguoiDungByPage = async (page, pageSize) => {
  try {
    const response = await axios.get(`${API_URL}/nguoidung/paged`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phân trang:', error);
    throw error;
  }
};

export const addNguoiDung = async (nguoiDungData) => {
  try {
    const response = await axios.post(`${API_URL}/nguoidung/add`, nguoiDungData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm người dùng:', error);
    throw error;
  }
};

export const updateNguoiDung = async (nguoiDungData) => {
  try {
    const response = await axios.put(`${API_URL}/nguoidung/update`, nguoiDungData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw error;
  }
};

export const deleteNguoiDung = async (ma_nguoi_dung) => {
  try {
    const response = await axios.delete(`${API_URL}/nguoidung/delete/${ma_nguoi_dung}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;
  }
};