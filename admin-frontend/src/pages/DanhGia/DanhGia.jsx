import React, { useState, useEffect } from 'react';
import styles from '../../styles/Global.module.scss';
import classNames from 'classnames/bind';
import {
  FiStar, FiEdit2, FiTrash2, FiSearch
} from 'react-icons/fi';
import Pagination from '../../components/Pagination/Pagination';
import {
  getByPage,
  deleteDanhGia
} from '../../services/danhGiaService';
import { toast } from 'react-toastify'
const cx = classNames.bind(styles);

const DanhGia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalItems: 0
  });

  useEffect(() => {
    fetchDanhGia();
  }, [pagination.page, searchTerm]);

  const fetchDanhGia = async () => {
    try {
      setLoading(true);
      const result = await getByPage(
        pagination.page,
        pagination.pageSize,
        searchTerm
      );
      setData(result.data);
      setPagination(prev => ({
        ...prev,
        totalItems: result.totalRecords
      }));
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (maDanhGia) => {
    try {
      await deleteDanhGia(maDanhGia);
      window.confirm("Bạn có muốn xóa đánh giá này không?");

      fetchDanhGia();
      toast.success("Xóa thành công đánh giá này!")
    } catch (error) {
      console.error('Lỗi khi xóa đánh giá:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDanhGia();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const renderStarRating = (diem) => {
    return (
      <div className={cx('star-rating')}>
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={cx(i < diem ? 'star-filled' : 'star-empty')}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cx('danh-gia')}>
      <div className={cx('header')}>
        <h1><FiStar /> Quản Lý Đánh Giá</h1>
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách, người dùng hoặc bình luận"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={cx('search-btn')}>
            <FiSearch />
          </button>
        </form>
      </div>

      <div className={cx('card')}>
        {loading ? (
          <div className={cx('loading')}>Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className={cx('table-responsive')}>
              <table className={cx('table')}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sách</th>
                    <th>Người đánh giá</th>
                    <th>Điểm</th>
                    <th>Bình luận</th>
                    <th>Ngày đánh giá</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.ma_danh_gia}>
                      <td>{++index}</td>
                      <td>
                        <div className={cx('book-info')}>
                          {item.sach_hinh_anh && (
                            <img
                              src={item.sach_hinh_anh}
                              alt={item.ten_sach}
                              className={cx('book-image')}
                            />
                          )}
                          <span>{item.tieu_de}</span>
                        </div>
                      </td>
                      <td>
                        <div className={cx('user-info')}>
                          <span>{item.ho_ten}</span>
                          <small>{item.email}</small>
                        </div>
                      </td>
                      <td>
                        {renderStarRating(item.diem_danh_gia)}
                      </td>
                      <td className={cx('comment')} title={item.binh_luan || 'Không có bình luận'}>
                        {item.binh_luan
                          ? item.binh_luan.length > 40
                            ? item.binh_luan.substring(0, 40) + '...'
                            : item.binh_luan
                          : 'Không có bình luận'}
                      </td>
                      <td>
                        {new Date(item.ngay_danh_gia).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <div className={cx('actions')}>

                          <button
                            onClick={() => handleDelete(item.ma_danh_gia)}
                            className={cx('delete-btn')}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DanhGia;