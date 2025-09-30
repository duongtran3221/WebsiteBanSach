import axios from 'axios';

const API_URL = 'http://localhost:3000'; 
export const getAllTheLoai = async () => {
  try {
    const response = await axios.get(`${API_URL}/theloai/getall`);
    return response.data.result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thể loại:', error);
    throw error;
  }
};

export const getByTheLoai = async (ten_the_loai, page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/sach/getByTheLoai/${encodeURIComponent(ten_the_loai)}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách theo thể loại:', error);
    throw error;
  }
};

