import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getByPage = (page, pageSize, searchTerm = '') => {
  return axios.get(`${API_URL}/danhgia/paged`, {
    params: {
      page,
      size: pageSize,
      search: searchTerm
    }
  })
  .then(response => ({
    data: response.data.data,
    totalRecords: response.data.totalRecords
  }))
  .catch(error => {
    console.error('Error fetching reviews:', error);
    throw error;
  });
};

export const deleteDanhGia = (maDanhGia) => {
  return axios.delete(`${API_URL}/danhgia/delete/${maDanhGia}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting review:', error);
      throw error;
    });
};
