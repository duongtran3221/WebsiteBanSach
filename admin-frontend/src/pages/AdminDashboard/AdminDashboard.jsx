import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.scss';
import classNames from 'classnames/bind';
import { FcComments, FcSalesPerformance, FcBusiness, FcRules } from "react-icons/fc";
import { getDonHangGanDay, getThongKeHomNay, getBestSellingBooks } from '../../services/dashboard';
const cx = classNames.bind(styles);

const AdminDashboard = () => {

  const [order, setOrder] = useState([]);
  const [thongke, setthongke] = useState({});
  const [bestbook, setbestbook] = useState([]);

  const fetchDonhangganday = async () => {
    try {
      const data = await getDonHangGanDay();
      const tk = await getThongKeHomNay();
      const books = await getBestSellingBooks();
      setOrder(data);
      setthongke(tk);
      setbestbook(books)
    } catch (error) {
      console.error("Lỗi lấy đơn hàng gần đây, thống kê")
    }
  }


  useEffect(() => {
    fetchDonhangganday();
  }, [])

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
  return (
    <div className={cx('dashboard-container')}>

      <div className={cx('stats-cards')}>

        <div className={cx('stat-card', 'orders')}>
          <div className={cx('stat-icon')}><FcRules ></FcRules ></div>
          <div className={cx('stat-content')}>
            <h3>Đơn hàng hôm nay</h3>
            <p className={cx('stat-value')}>{thongke?.don_hang_hom_nay}</p>
          </div>
        </div>

        <div className={cx('stat-card', 'sales')}>
          <div className={cx('stat-icon')}><FcBusiness ></FcBusiness></div>
          <div className={cx('stat-content')}>
            <h3>Sản phẩm đã bán</h3>
            <p className={cx('stat-value')}>{thongke?.san_pham_da_ban}</p>
          </div>
        </div>

        <div className={cx('stat-card', 'revenue')}>
          <div className={cx('stat-icon')}><FcSalesPerformance></FcSalesPerformance></div>
          <div className={cx('stat-content')}>
            <h3>Doanh thu hôm nay</h3>
            <p className={cx('stat-value')}>{Number(thongke?.doanh_thu_hom_nay).toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className={cx('stat-card', 'feedback')}>
          <div className={cx('stat-icon')}><FcComments></FcComments></div>
          <div className={cx('stat-content')}>
            <h3>Phản hồi mới</h3>
            <p className={cx('stat-value')}>{thongke?.phan_hoi_moi}</p>
          </div>
        </div>
      </div>

      <div className={cx('dashboard-content')}>
        <div className={cx('recent-orders')}>
          <h2>Đơn hàng gần đây</h2>
          <div className={cx('order-list')}>
            {order?.map((item) => {
              return (
                <div key={item.ma_don_hang} className={cx('order-item')}>
                  <span className={cx('order-id')}>{item?.ma_don_hang}</span>
                  <span className={cx('order-customer')}>{item?.ho + " " + item?.ten}</span>
                  <span className={cx('order-date')}>{new Date(item?.ngay_tao).toLocaleDateString("vi-VN")}</span>
                  <span className={cx('order-amount')}>{Number(item?.tong_tien).toLocaleString("vi-VN")} đ</span>
                  <span
                    className={cx('status-badge')}
                    style={{ backgroundColor: getStatusColor(item.trang_thai_don) }}
                  >
                    {getStatusText(item.trang_thai_don)}
                  </span>
                </div>
              );
            })}


          </div>
        </div>

        <div className={cx('quick-stats')}>
          <h2>Sản phẩm bán chạy</h2>
          <div className={cx('bestsellers')}>
            {bestbook.map((item, index) => (
            <div className={cx('bestseller-item')}>
              <span className={cx('book-rank')}>{++index}</span>
              <span className={cx('book-title')}>{item.tieu_de}</span>
              <span className={cx('book-sales')}>{item.so_luong_ban}</span>
            </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;