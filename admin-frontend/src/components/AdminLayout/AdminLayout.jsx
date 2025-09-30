import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar/SideBar';
import Header from '../Header/Header';
import styles from './AdminLayout.module.scss';
import classNames from 'classnames/bind';
import { ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const maNguoiDung = localStorage.getItem('ma_nguoi_dung');
    if (!maNguoiDung) {
      navigate('/', { replace: true }); 
    }
  }, [navigate]);

  return (
    <div className={cx('admin-layout')}>
      <Header />
      <div className={cx('body')}>
        <Sidebar />
        <div className={cx('content')}>
          <Outlet />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
