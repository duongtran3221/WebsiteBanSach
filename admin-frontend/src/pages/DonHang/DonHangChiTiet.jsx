import React from 'react';
import { FiUser, FiMapPin, FiTruck, FiCreditCard, FiX } from 'react-icons/fi';
import styles from './DonHangChiTiet.module.scss';

const DonHangChiTiet = ({ donHang, chiTiet, onClose }) => {
  const getPaymentMethod = (method) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'banktransfer': return 'Chuyển khoản ngân hàng';
      case 'momo': return 'Ví điện tử MoMo';
      default: return method;
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
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn hàng: {donHang.ma_don_hang}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.detailSection}>
            <h3><FiUser /> Thông tin khách hàng</h3>
            <div className={styles.detailGrid}>
              <div>
                <span className={styles.label}>Họ tên:</span>
                <span>{donHang.ten_nguoi_dung}</span>
              </div>
              <div>
                <span className={styles.label}>Mã KH:</span>
                <span>{donHang.ma_nguoi_dung}</span>
              </div>
              <div>
                <span className={styles.label}>Email:</span>
                <span>{donHang.email || 'N/A'}</span>
              </div>
              <div>
                <span className={styles.label}>SĐT:</span>
                <span>{donHang.so_dien_thoai}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3><FiMapPin /> Địa chỉ giao hàng</h3>
            <div className={styles.address}>
              {`${donHang.dia_chi_giao}, ${donHang.phuong_xa_giao}, ${donHang.quan_huyen_giao}, ${donHang.thanh_pho_giao}`}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3><FiTruck /> Thông tin vận chuyển</h3>
            <div className={styles.detailGrid}>
              <div>
                <span className={styles.label}>Trạng thái:</span>
                <span className={styles.statusBadge}>{getStatusText(donHang.trang_thai_don)}</span>
              </div>
              <div>
                <span className={styles.label}>Phí vận chuyển:</span>
                <span>{Number(donHang.phi_giao_hang).toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3><FiCreditCard /> Thông tin thanh toán</h3>
            <div className={styles.detailGrid}>
              <div>
                <span className={styles.label}>Hình thức:</span>
                <span>{getPaymentMethod(donHang.hinh_thuc_thanh_toan)}</span>
              </div>
              <div>
                <span className={styles.label}>Trạng thái:</span>
                <span className={donHang.trang_thai_thanh_toan === 'da_thanh_toan' ? styles.paid : styles.pending}>
                  {donHang.trang_thai_thanh_toan === 'da_thanh_toan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              <div>
                <span className={styles.label}>Tổng tiền:</span>
                <span className={styles.totalPrice}>{Number(donHang.tong_tien).toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Chi tiết sản phẩm</h3>
            <div className={styles.productsTable}>
              <div className={styles.tableHeader}>
                <div>STT</div>
                <div>Sản phẩm</div>
                <div>Đơn giá</div>
                <div>Số lượng</div>
                <div>Thành tiền</div>
              </div>
              {chiTiet.map((item, index) => (
                <div className={styles.tableRow} key={index}>
                  <div>{++index}</div>
                  <div>{item.tieu_de}</div>
                  <div>{Number(item.don_gia).toLocaleString()} đ</div>
                  <div>{item.so_luong}</div>
                  <div>{(Number(item.don_gia) * item.so_luong).toLocaleString()} đ</div>
                </div>
              ))}

              <div className={styles.tableFooter}>
                <div colSpan="3">Tổng cộng:</div>
                <div>{Number(donHang.tong_tien).toLocaleString()} đ</div>
              </div>
            </div>
          </div>

          {donHang.ghi_chu && (
            <div className={styles.noteSection}>
              <h3>Ghi chú</h3>
              <p>{donHang.ghi_chu}</p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.closeBtn}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonHangChiTiet;