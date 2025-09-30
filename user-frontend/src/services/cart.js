import axios from 'axios';

const API_URL = 'http://localhost:3000/giohang'; 


export const addToCart = (ma_nguoi_dung, ma_sach, so_luong) => {
  return axios.post(`${API_URL}/add`, {
    ma_nguoi_dung,
    ma_sach,
    so_luong
  });
};

export const updateQuantity = (ma_gio_hang, ma_sach, so_luong) => {
  return axios.put(`${API_URL}/update`, {
    ma_gio_hang,
    ma_sach,
    so_luong
  });
};

export const removeFromCart = (ma_gio_hang, ma_sach) => {
  return axios.delete(`${API_URL}/remove`, {
    data: {
      ma_gio_hang,
      ma_sach
    }
  });
};


export const getCartDetails = (ma_nguoi_dung) => {
  return axios.get(`${API_URL}/details/${ma_nguoi_dung}`);
};
