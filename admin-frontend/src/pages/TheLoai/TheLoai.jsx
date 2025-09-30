import React, { useState, useEffect } from 'react';
import TheLoaiForm from './TheloaiForm';
import styles from '../../styles/Global.module.scss';
import classNames from 'classnames/bind';
import {
  FiUsers, FiUserPlus, FiEdit2, FiTrash2,
  FiSearch,FiGrid
} from 'react-icons/fi';
import Pagination from '../../components/Pagination/Pagination';
import {
  getAllTheLoai,
  addTheLoai,
  updateTheLoai,
  deleteTheLoai,
  getByPage
} from '../../services/theLoaiService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);


const TheLoai = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalItems: 0
  });
  useEffect(() => {
    fetchTheLoai();
  }, [pagination.page, searchTerm]);

  const fetchTheLoai = async () => {
    try {
      setLoading(true);
      const result = await getByPage(pagination.page, pagination.pageSize, searchTerm);
      setData(result.data);
      setPagination(prev => ({
        ...prev, totalItems: result.totalRecords
      }))
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
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

  const handleDelete = async (rowData) => {
    try {
      if (window.confirm("Bạn có muốn xóa thể loại không?")) {
        await deleteTheLoai(rowData?.ma_the_loai);
        fetchTheLoai();
        toast.success('Xóa thể loại thành công');
      }

    } catch (error) {
      console.error('Lỗi khi xóa thể loại:', error);
      toast.error('Lỗi khi xóa thể loại');

    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateTheLoai(formData);
        toast.success('Cập nhật thể loại thành công');

      } else {
        await addTheLoai(formData);
        toast.success('Thêm thể loại thành công');

      }
      setShowForm(false);
      fetchTheLoai();
    } catch (error) {
      console.error('Lỗi khi lưu thể loại:', error);
      toast.error('Lỗi');

    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTheLoai();
  };
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  return (
    <div className={cx('the-loai')}>
      <div className={cx('header')}>
        <h1><FiGrid size={20}/> Quản Lý Thể Loại</h1>
        <button className={cx('add-btn')} onClick={handleAdd}>
          <FiUserPlus /> Thêm Mới
        </button>
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên"
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
                    <th>Tên thể loại</th>
                    <th>Mô tả</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data, index) => (
                    <tr key={data.ma_the_loai}>
                      <td>
                        <span>{++index}</span>
                      </td>
                      <td>
                        <span>{data.ten_the_loai}</span>
                      </td>
                      <td>{data.mo_ta}</td>
                      <td>
                        <div className={cx('actions')}>
                          <button
                            onClick={() => handleEdit(data)}
                            className={cx('edit-btn')}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(data)}
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
      {showForm && (
        <TheLoaiForm
          initialData={editData}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TheLoai;