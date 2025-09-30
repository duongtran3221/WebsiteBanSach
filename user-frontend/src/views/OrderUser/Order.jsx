import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './Order.module.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Pagination from '../../components/Pagination/Pagination';
import DonHangChiTiet from './DonHangChiTiet';
import axios from 'axios';
import {
  FiEye, FiEdit, FiTrash2, FiSearch, FiPrinter
} from 'react-icons/fi';
import { FaUser, FaLock, FaShoppingBag, FaComment } from "react-icons/fa";
import { Link } from 'react-router-dom';

import { getByUserID, getDonHangById, updateDonHangStatus } from '../../services/order';

const cx = classnames.bind(styles);

const OrderPage = () => {
  const ma_nguoi_dung = localStorage.getItem('ma_nguoi_dung');
  const [data, setData] = useState([]);
  const [selectedDonHang, setSelectedDonHang] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [maDonHang, setMaDonHang] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0
  });
  const fetchData = async () => {
    try {
      const result = await getByUserID(
        ma_nguoi_dung,
        pagination.page,
        pagination.pageSize,
        searchTerm,
        statusFilter
      );
      setData(result.data);
      setPagination(prev => ({
        ...prev,
        totalItems: result.pagination.totalItems
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDonHang = async (maDonHang) => {
    try {
      const data = await getDonHangById(maDonHang);
      setSelectedDonHang(data);
    } catch (error) {
      console.error("Lấy đơn hàng thất bại:", error);
    }
  };
  useEffect(() => {
    if (maDonHang) {
      fetchDonHang(maDonHang);

    }
  }, [maDonHang]);
  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize, searchTerm, statusFilter]);
  const [user, setUserInfo] = useState({
    ma_nguoi_dung: 'ND001',
    ho: 'Nguyễn',
    ten: 'Văn A',
    email: 'nguyenvana@example.com',
    so_dien_thoai: '0987654321',
    dia_chi: '123 Đường ABC, Phường XYZ',
    thanh_pho: 'Hà Nội',
    tinh: 'Hà Nội',
    quoc_gia: 'Việt Nam',
    chuc_quyen: 'Customer',
    ngay_dang_ky: '2023-01-15T00:00:00.000Z',
  });

  
  const handleStatusUpdate = async (maDonHang, newStatus) => {
    try {
      if (window.confirm('Bạn có muốn hủy đơn hàng này không?')) {
        await updateDonHangStatus(maDonHang, newStatus);
        alert('Cập nhật trạng thái thành công');
        fetchData();
        window.location.reload();
      }

    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  const menuItems = [
    { title: 'Hồ sơ cá nhân', icon: <FaUser />, to: "/profile" },
    { title: 'Đơn hàng của tôi', icon: <FaShoppingBag />, to: "/order" }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case 'cho_xu_ly': return 'orange';
      case 'dang_xu_ly': return 'blue';
      case 'dang_giao': return 'purple';
      case 'da_giao': return 'green';
      case 'da_huy': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'cho_xu_ly': return 'Chờ xử lý';
      case 'dang_xu_ly': return 'Đang xử lý';
      case 'dang_giao': return 'Đang giao';
      case 'da_giao': return 'Đã giao';
      case 'da_huy': return 'Đã hủy';
      default: return status;
    }
  };
  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'da_thanh_toan': return 'Đã thanh toán';
      case 'cho_thanh_toan': return 'Chờ thanh toán';
      case 'that_bai': return 'Thanh toán thất bại';
      case 'hoan_tien': return 'Đã hoàn tiền';
      default: return 'Không xác định';
    }
  };
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'da_thanh_toan': return 'green';
      case 'cho_thanh_toan': return 'orange';
      case 'that_bai': return 'red';
      case 'hoan_tien': return 'blue';
      default: return 'gray';
    }
  };
  return (
    <>
      <Header></Header>
      <div className={cx('profile-wrapper')}>
        <div className={cx('profile-layout')}>
          <aside className={cx('profile-sidebar')}>

            <nav className={cx('profile-menu')}>
              <h3 className={cx('menu-title')}>Thông tin tài khoản</h3>
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index} className={cx('menu-item')}>
                    <Link to={item.to} className={cx('menu-link')}>
                      {item.icon}
                      <span style={{ marginLeft: "5px" }}>{item.title}</span>

                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className={cx('order-main')}>
            <div className={cx('order-container')}>
              <table className={cx('table')}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ngày tạo</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thanh toán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.ma_don_hang}>
                      <td>{++index}</td>
                      <td>{new Date(item.ngay_tao).toLocaleDateString('vi-VN')}</td>
                      <td>{item.ten_nguoi_dung}</td>
                      <td style={{ textAlign: "right" }}>{Number(item.tong_tien)?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                      }</td>
                      <td>
                        <span
                          className={cx('status-badge')}
                          style={{ backgroundColor: getStatusColor(item.trang_thai_don) }}
                        >
                          {getStatusText(item.trang_thai_don)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={cx('status-payment')}
                          style={{ backgroundColor: getPaymentStatusColor(item.trang_thai_thanh_toan) }}
                        >
                          {getPaymentStatusText(item.trang_thai_thanh_toan)}
                        </span>
                      </td>

                      <td>
                        <div className={cx('actions')}>
                          <button
                            onClick={() => {
                              setMaDonHang(item.ma_don_hang);;
                              setShowDetail(true);
                            }}
                            className={cx('view-btn')}
                          >
                            <FiEye />
                          </button>
                          {
                            item.trang_thai_don === 'cho_xu_ly' && (
                              <button
                                className={cx('delete-btn')}
                                onClick={() => handleStatusUpdate(item.ma_don_hang, 'da_huy')}
                              >
                                <FiTrash2 />
                              </button>
                            )
                          }

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
            {showDetail && selectedDonHang && (
              <div className={cx('modal-overlay')}>
                <div className={cx('modal')}>
                  <button
                    onClick={() => setShowDetail(false)}
                    className={cx('close-button')}
                  >
                    &times;
                  </button>
                  <DonHangChiTiet
                    donHang={selectedDonHang.donhang[0]}
                    chiTiet={selectedDonHang.chi_tiet}
                    onClose={() => setShowDetail(false)}
                  />

                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer></Footer>
    </>

  );
};

export default OrderPage;