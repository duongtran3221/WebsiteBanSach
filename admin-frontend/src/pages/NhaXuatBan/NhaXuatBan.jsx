import React, { useState, useEffect } from 'react';
import styles from '../../styles/Global.module.scss';
import classNames from 'classnames/bind';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,FiUsers
} from 'react-icons/fi';
import {
  getNhaXuatBanByPage,
  addNhaXuatBan,
  updateNhaXuatBan,
  deleteNhaXuatBan
} from '../../services/nhaXuatBanService';
import NhaXuatBanForm from './NhaXuatBanForm';
import Pagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const NhaXuatBan = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getNhaXuatBanByPage(
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
      toast.error('Lỗi khi tải dữ liệu nhà xuất bản');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize, searchTerm]);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (rowData) => {
    setEditData(rowData);
    setShowForm(true);
  };

  const handleDelete = async (ma_nxb) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
      try {
        await deleteNhaXuatBan(ma_nxb);
        toast.success('Xóa nhà xuất bản thành công');
        fetchData();
      } catch (error) {
        toast.error('Lỗi khi xóa nhà xuất bản');
        console.error('Error deleting:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateNhaXuatBan(formData);
        toast.success('Cập nhật nhà xuất bản thành công');
      } else {
        await addNhaXuatBan(formData);
        toast.success('Thêm nhà xuất bản thành công');
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu nhà xuất bản');
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
    <div className={cx('nha-xuat-ban')}>
      <div className={cx('header')}>
        <h1><FiUsers/>Quản Lý Nhà Xuất Bản</h1>
        <button className={cx('add-btn')} onClick={handleAdd}>
          <FiPlus /> Thêm Mới
        </button>
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên NXB..."
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
                  <th>Tên NXB</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item,index) => (
                  <tr key={item.ma_nxb}>
                    <td>{++index}</td>
                    <td>{item.ten_nxb}</td>
                    <td>{item.dia_chi}</td>
                    <td>{item.so_dien_thoai}</td>
                    <td>
                      <div className={cx('actions')}>
                        <button
                          onClick={() => handleEdit(item)}
                          className={cx('edit-btn')}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(item.ma_nxb)}
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
        <NhaXuatBanForm
          initialData={editData}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default NhaXuatBan;