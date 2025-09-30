import axios from 'axios';

const API_URL = 'http://localhost:3000'; 
export const getAllTheLoai = async () => {
  try {
    const response = await axios.get(`${API_URL}/theloai/getall`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thể loại:', error);
    throw error;
  }
};

export const addTheLoai = async (theLoaiData) => {
  try {
    const response = await axios.post(`${API_URL}/theloai/add`, theLoaiData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm thể loại:', error);
    throw error;
  }
};

export const updateTheLoai = async (theLoaiData) => {
  try {
    const response = await axios.put(`${API_URL}/theloai/update`, theLoaiData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thể loại:', error);
    throw error;
  }
};

export const deleteTheLoai = async (ma_the_loai) => {
  try {
    const response = await axios.delete(`${API_URL}/theloai/delete/${ma_the_loai}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa thể loại:', error);
    throw error;
  }
};

export const getByPage = async (page,pageSize,search) =>{
  try {
    const response = await axios.get(`${API_URL}/theloai/paged`, {
      params: { page, size: pageSize ,search}
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phân trang:', error);
    throw error;
  }
}