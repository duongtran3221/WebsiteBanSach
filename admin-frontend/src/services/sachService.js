import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getAllSach = async () => {
  try {
    const response = await axios.get(`${API_URL}/sach/getall`);
    return response.data.result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
};

export const getSachByPage = async (page, pageSize,searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/sach/paged`, {
      params: { page, size: pageSize ,searchTerm}
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phân trang:', error);
    throw error;
  }
};

export const addSach = async (sachData) => {
  try {
    const response = await axios.post(`${API_URL}/sach/add`, sachData);
    console.log('API Response:', response); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm sách:', error);
    throw error;
  }
};

export const updateSach = async (sachData) => {
  try {
    const response = await axios.put(`${API_URL}/sach/update`, sachData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sách:', error);
    throw error;
  }
};

export const deleteSach = async (ma_sach) => {
  try {
    const response = await axios.delete(`${API_URL}/sach/delete/${ma_sach}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa sách:', error);
    throw error;
  }
};

export const uploadImages = async (ma_sach, files) => {
  try {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await axios.post(
      `${API_URL}/upload-image/${ma_sach}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.fileNames;
  } catch (error) {
    console.error('Lỗi khi tải ảnh lên:', {
      error: error.response?.data || error.message,
      files: files.map(f => f.name)
    });
    throw error;
  }
};