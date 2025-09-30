import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getByUserID = async (ma_nguoi_dung,page, pageSize, searchTerm = '', statusFilter = '') => {
  try {
    const response = await axios.get(`${API_URL}/donhang/getByUserId`, {
      params: { ma_nguoi_dung,page, pageSize, search: searchTerm, status: statusFilter }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getDonHangById = async (maDonHang) => {
  try {
    const response = await axios.get(`${API_URL}/${maDonHang}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const updateDonHangStatus = async (maDonHang, newStatus) => {
  try {
    const response = await axios.put(
      `${API_URL}/donhang/${maDonHang}/status`,
      { trangThai: newStatus }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};