import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiUserPlus, FiEdit2, FiTrash2, 
  FiSearch, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import styles from './NguoiDung.module.scss';
import classNames from 'classnames/bind';
import {
  getAllNguoiDung,
  getNguoiDungByPage,
  addNguoiDung,
  updateNguoiDung,
  deleteNguoiDung
} from '../../services/nguoiDungService';
import Pagination from '../../components/Pagination/Pagination';
import NguoiDungForm from './NguoiDungForm';
import { toast } from 'react-toastify';
import Avatar from '../../components/Avatar/Avatar';

const cx = classNames.bind(styles);

const NguoiDung = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalItems: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getNguoiDungByPage(
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
      toast.error('Lỗi khi tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, searchTerm]);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditData(user);
    setShowForm(true);
  };

  const handleDelete = async (ma_nguoi_dung) => {
    if (window.confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteNguoiDung(ma_nguoi_dung);
        toast.success('Xóa người dùng thành công');
        fetchData();
      } catch (error) {
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
  };
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h1><FiUsers /> Quản Lý Người Dùng</h1>
        {/* <button className={cx('add-btn')} onClick={handleAdd}>
          <FiUserPlus /> Thêm Mới
        </button> */}
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
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
              <table className={cx('user-table')}>
                <thead>
                  <tr>
                    <th >STT</th>
                    <th>Họ Tên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Địa Chỉ</th>
                    <th>Quyền</th>
                    {/* <th>Thao Tác</th> */}
                  </tr>
                </thead>
                <tbody>
                  {data.map((user,index) => (
                    <tr key={user.ma_nguoi_dung}>
                      <td>{++index}</td>
                      <td>
                        <div className={cx('user-info')}>
                          <strong>{`${user.ho} ${user.ten}`}</strong>
                          <small>ID: {user.ma_nguoi_dung}</small>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.so_dien_thoai || 'N/A'}</td>
                      <td>
                        {user.dia_chi && (
                          <span className={cx('address')}>
                            {`${user.dia_chi}, ${user.thanh_pho}`}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={cx('role', user.chuc_quyen?.toLowerCase())}>
                          {user?.chuc_quyen}
                        </span>
                      </td>
                      {/* <td>
                        <div className={cx('actions')}>
                          <button 
                            onClick={() => handleEdit(user)}
                            className={cx('edit-btn')}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(user.ma_nguoi_dung)}
                            className={cx('delete-btn')}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination pagination={pagination} onPageChange={handlePageChange}></Pagination>
          </>
        )}
      </div>

      {showForm && (
        <NguoiDungForm
          initialData={editData}
          onSubmit={async (formData) => {
            try {
              if (editData) {
                await updateNguoiDung(formData);
                toast.success('Cập nhật người dùng thành công');
              } else {
                await addNguoiDung(formData);
                toast.success('Thêm người dùng thành công');
              }
              setShowForm(false);
              fetchData();
            } catch (error) {
              toast.error(error.response?.data?.message || 'Lỗi khi lưu người dùng');
            }
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default NguoiDung;