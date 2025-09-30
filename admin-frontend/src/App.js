import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import TheLoai from './pages/TheLoai/TheLoai';
import TacGia from './pages/TacGia/TacGia';
import NhaXuatBan from './pages/NhaXuatBan/NhaXuatBan';
import Sach from './pages/Sach/Sach';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NguoiDung from './pages/NguoiDung/NguoiDung';
import DonHang from './pages/DonHang/DonHang';
import DanhGia from './pages/DanhGia/DanhGia';
import DangNhap from './pages/DangNhap/DangNhap';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route index element={<DangNhap />} />

        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="the-loai" element={<TheLoai />} />
          <Route path="tac-gia" element={<TacGia />} />
          <Route path="nha-xuat-ban" element={<NhaXuatBan />} />
          <Route path="sach" element={<Sach />} />
          <Route path="nguoidung" element={<NguoiDung />} />
          <Route path="donhang" element={<DonHang />} />
          <Route path="danhgia" element={<DanhGia />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
