import React, { useState, useEffect } from 'react';
import styles from '../../styles/Global.module.scss';
import localStyles from './DonHang.module.scss';
import classNames from 'classnames/bind';
import {
  FiEye, FiEdit, FiTrash2, FiSearch, FiPrinter, FiBox
} from 'react-icons/fi';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './Roboto_SemiCondensed-Medium-normal'
import {
  getDonHangByPage,
  updateDonHangStatus,
  getDonHangById,
  updateDonHangPaymentStatus
} from '../../services/donHangService';
import DonHangChiTiet from './DonHangChiTiet';
import Pagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const cxLocal = classNames.bind(localStyles);

const DonHang = () => {
  const [data, setData] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDonHang, setSelectedDonHang] = useState(null);
  const [selectedPrint, setSelectedPrint] = useState(null);
  const [maDonHang, setMaDonHang] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getDonHangByPage(
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
      toast.error('Lỗi khi tải dữ liệu đơn hàng');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
    if (selectedDonHang) {
      console.log('Đơn hàng đã chọn:', selectedDonHang);
    }
  }, [selectedDonHang]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize, searchTerm, statusFilter]);

  const handleStatusUpdate = async (maDonHang, newStatus) => {
    try {
      const res = await updateDonHangStatus(maDonHang, newStatus);

      if (res.success === true) {
        toast.success('Cập nhật trạng thái thành công');
        fetchData();
      } else {
        toast.error(res.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
      console.error('Error updating status:', error);
    }
  };

  const handleStatusPaymentUpdate = async (maDonHang, newStatus) => {
    try {
      await updateDonHangPaymentStatus(maDonHang, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
      console.error('Error updating status:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchData();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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
  const exportInvoiceToPDF = (donHang, chiTietDonHang) => {
    const doc = new jsPDF();
    doc.setFont('Roboto_SemiCondensed-Medium', 'normal');
    console.log(doc.getFontList())
    const {
      ma_don_hang, ten_nguoi_dung, so_dien_thoai, dia_chi_giao,
      thanh_pho_giao, quan_huyen_giao, phuong_xa_giao, quoc_gia_giao,
      ngay_tao, tong_tien, phi_giao_hang, hinh_thuc_thanh_toan
    } = donHang;

    doc.setFontSize(16);
    doc.text("Nhà sách DTBOOK", 14, 6);
    doc.text("Độc lập - Tự do - Hạnh phúc", 130, 6);
    doc.setFontSize(16)
    doc.text("HÓA ĐƠN", 90, 15);

    doc.setFontSize(12);
    doc.text(`Mã đơn hàng: ${ma_don_hang}`, 14, 30);
    doc.text(`Ngày tạo: ${new Date(ngay_tao).toLocaleString('vi-VN')}`, 14, 38);
    doc.text(`Khách hàng: ${ten_nguoi_dung}`, 14, 46);
    doc.text(`SĐT: ${so_dien_thoai}`, 14, 54);
    doc.text(`Địa chỉ giao: ${dia_chi_giao}, ${phuong_xa_giao}, ${quan_huyen_giao}, ${thanh_pho_giao}`, 14, 62);
    doc.text(`Hình thức thanh toán: ${hinh_thuc_thanh_toan.toUpperCase()}`, 14, 74);

    const tableData = chiTietDonHang.map((item, index) => [
      index + 1,
      item.tieu_de,
      Number(item.don_gia).toLocaleString(),
      Number(item.giam_gia).toLocaleString(),
      item.so_luong,
      (Number(item.don_gia) - Number(item.giam_gia)).toLocaleString(),
      (item.so_luong * (Number(item.don_gia) - Number(item.giam_gia))).toLocaleString()
    ]);

    autoTable(doc, {
      startY: 86,
      head: [['STT', 'Sản phẩm', 'Đơn giá', 'Giảm', 'Số lượng', 'Đơn giá sau giảm', 'Thành tiền']],
      body: tableData,
      styles: {
        font: 'Roboto_SemiCondensed-Medium',
        fontStyle: 'normal',
        fontSize: 10
      },
      headStyles: {
        font: 'Roboto_SemiCondensed-Medium',
        fontStyle: 'normal',
        fontSize: 10,
        textColor: [0, 0, 0]
      }
    });


    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Phí giao hàng: ${Number(phi_giao_hang).toLocaleString()} đ`, 14, finalY);
    doc.text(`Tổng thanh toán: ${Number(tong_tien).toLocaleString()} đ`, 14, finalY + 10);

    doc.save(`HoaDon_${ma_don_hang}.pdf`);
  };
  const handlePrintInvoice = async (maDonHang) => {
    try {
      const data = await getDonHangById(maDonHang);
      setSelectedPrint(data);
      if (selectedPrint) {
        exportInvoiceToPDF(selectedPrint.donhang[0], selectedPrint.chi_tiet);
      }
    } catch (error) {
      console.error("Lỗi khi in hóa đơn:", error);
      toast.error("Không thể in hóa đơn. Vui lòng thử lại.");
    }
  };

  return (
    <div className={cx('don-hang')}>
      <div className={cx('header')}>
        <h1><FiBox />Quản Lý Đơn Hàng</h1>
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn hoặc tên KH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={cx('search-btn')}>
            <FiSearch />
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className={cx('filter-select')}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="cho_xu_ly">Chờ xử lý</option>
          <option value="dang_xu_ly">Đang xử lý</option>
          <option value="dang_giao">Đang giao</option>
          <option value="da_giao">Đã giao</option>
          <option value="da_huy">Đã hủy</option>
        </select>
      </div>

      <div className={cx('card')}>
        {loading ? (
          <div className={cx('loading')}>Đang tải dữ liệu...</div>
        ) : (
          <div className={cx('table-responsive')}>
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
                        className={cxLocal('status-badge')}
                        style={{ backgroundColor: getStatusColor(item.trang_thai_don) }}
                      >
                        {getStatusText(item.trang_thai_don)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={cxLocal('status-payment')}
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
                        <button
                          onClick={() => handlePrintInvoice(item.ma_don_hang)}
                          className={cx('print-btn')}
                          title="In hóa đơn"
                        >
                          🖨️
                        </button>
                        <select
                          value={item.trang_thai_don}
                          onChange={(e) => handleStatusUpdate(item.ma_don_hang, e.target.value)}
                          className={cxLocal('status-select')}
                          style={{ borderColor: getStatusColor(item.trang_thai_don) }}
                        >
                          <option value="cho_xu_ly">Chờ xử lý</option>
                          <option value="dang_xu_ly">Đang xử lý</option>
                          <option value="dang_giao">Đang giao</option>
                          <option value="da_giao">Đã giao</option>
                          <option value="da_huy">Đã hủy</option>
                        </select>
                        <select
                          value={item.trang_thai_thanh_toan}
                          onChange={(e) => handleStatusPaymentUpdate(item.ma_don_hang, e.target.value)}
                          className={cxLocal('status-select')}
                          style={{ borderColor: getPaymentStatusColor(item.trang_thai_thanh_toan) }}
                        >
                          <option value="cho_thanh_toan">Chờ thanh toán</option>
                          <option value="da_thanh_toan">Đã thanh toán</option>
                          <option value="that_bai">Thanh toán thất bại</option>
                          <option value="hoan_tien">Hoàn tiền</option>
                        </select>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
    </div>
  );
};

export default DonHang;