import React, { useState, useEffect } from 'react';
import TacGiaForm from './TacGiaForm';
import styles from '../../styles/Global.module.scss';
import classNames from 'classnames/bind';
import {
  FiUsers, FiUserPlus, FiEdit2, FiTrash2,
  FiSearch
} from 'react-icons/fi';
import Pagination from '../../components/Pagination/Pagination';
import {
  getAllTacGia,
  addTacGia,
  updateTacGia,
  deleteTacGia,
  getTacGiaByPage
} from '../../services/tacGiaService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const TacGia = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0
  });

  useEffect(() => {
    fetchData();
  }, [pagination.page, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getTacGiaByPage(pagination.page, pagination.pageSize, searchTerm);
      setData(result.data);
      setPagination(prev => ({
        ...prev,
        totalItems: result.totalRecords
      }));
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tác giả:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (rowData) => {
    setEditData(rowData);
    setShowForm(true);
  };

  const handleDelete = async (ma_tac_gia) => {
    try {
      if (window.confirm("Bạn có muốn xóa tác giả này không?")) {
        await deleteTacGia(ma_tac_gia);
        toast.success('Xóa tác giả thành công');
        fetchData();
      }

    } catch (error) {
      console.error('Lỗi khi xóa tác giả:', error);
      toast.error('Lỗi khi xóa tác giả');

    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateTacGia(formData);
        toast.success('Cập nhập tác giả thành công');

      } else {
        await addTacGia(formData);
        toast.success('Thêm tác giả thành công');

      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi lưu tác giả:', error);
      toast.error('Lỗi');

    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className={cx('tac-gia')}>
      <div className={cx('header')}>
        <h1><FiUsers /> Quản Lý Tác Giả</h1>
        <button className={cx('add-btn')} onClick={handleAdd}>
          <FiUserPlus /> Thêm Mới
        </button>
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên tác giả"
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
          <div className={cx('table-responsive')}>
            <table className={cx('table')}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên tác giả</th>
                  <th>Tiểu sử</th>
                  <th>Ngày sinh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.ma_tac_gia}>
                    <td>{++index}</td>
                    <td>{item.ten_tac_gia}</td>
                    <td>{item.tieu_su?.substring(0, 50)}</td>
                    <td>{item.ngay_sinh ? new Date(item.ngay_sinh).toLocaleDateString("vi-VN") : 'N/A'}</td>
                    <td>
                      <div className={cx('actions')}>
                        <button
                          onClick={() => handleEdit(item)}
                          className={cx('edit-btn')}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(item.ma_tac_gia)}
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
        )}
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <TacGiaForm
          initialData={editData}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TacGia;