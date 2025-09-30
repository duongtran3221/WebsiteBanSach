import React, { useState, useEffect } from 'react';
import styles from '../../styles/Global.module.scss';
import classNames from 'classnames/bind';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,FiBookOpen
} from 'react-icons/fi';
import {
  getSachByPage,
  addSach,
  updateSach,
  deleteSach,
  uploadImages
} from '../../services/sachService';
import { getAllNhaXuatBan } from '../../services/nhaXuatBanService';
import { getAllTheLoai } from '../../services/theLoaiService'
import { getAllTacGia } from '../../services/tacGiaService'
import SachForm from './SachForm';
import Pagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const Sach = () => {
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
  const [nxbList, setNxbList] = useState([]);
  const [theloaiList, settheloaiList] = useState([]);
  const [tacgiaList, settacgiaList] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getSachByPage(
        pagination.page,
        pagination.pageSize,
        searchTerm
      );
      setData(result.data);
      setPagination(prev => ({
        ...prev,
        totalItems: result.totalRecords
      }));
      const nxbResponse = await getAllNhaXuatBan();
      setNxbList(nxbResponse);
      const theloaiResponse = await getAllTheLoai();
      settheloaiList(theloaiResponse.result);
      const tacgiaResponse = await getAllTacGia();
      settacgiaList(tacgiaResponse);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu sách');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  console.log("theloaiList đã cập nhật:", theloaiList);
}, [theloaiList]);

useEffect(() => {
  console.log("tacgiaList đã cập nhật:", tacgiaList);
}, [tacgiaList]);

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

  const handleDelete = async (ma_sach) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      try {
        await deleteSach(ma_sach);
        toast.success('Xóa sách thành công');
        fetchData();
      } catch (error) {
        toast.error('Lỗi khi xóa sách');
        console.error('Error deleting:', error);
      }
    }
  };

  const handleSubmit = async (formData, imageFiles) => {
    try {
      let savedBook;

      if (editData) {
        await updateSach(formData); 
        savedBook = [{ ma_sach: formData.ma_sach }];
      } else {
        savedBook = await addSach(formData);
      }

      const maSach = savedBook?.[0]?.ma_sach;
      if (!maSach) {
        throw new Error('Không lấy được mã sách sau khi lưu');
      }

      const existingImages = formData.anh ? formData.anh.split('|').filter(Boolean) : [];
      const imagesToDelete = formData.imagesToDelete || [];
      let finalImages = existingImages.filter(img => !imagesToDelete.includes(img));

      if (imageFiles && imageFiles.length > 0) {
        const uploadedImages = await uploadImages(maSach, imageFiles);
        finalImages = [...finalImages, ...uploadedImages];
      }

      const isImageChanged = imagesToDelete.length > 0 || (imageFiles && imageFiles.length > 0);
      if (isImageChanged) {
        await updateSach({
          ...formData,
          ma_sach: maSach,
          anh: finalImages.join('|')
        });
      }

      toast.success(editData ? 'Cập nhật sách thành công' : 'Thêm sách thành công');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu sách');
      console.error('Lỗi xử lý sách:', error);
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
    <div className={cx('sach')}>
      <div className={cx('header')}>
        <h1><FiBookOpen size={20}/>Quản Lý Sách</h1>
        <button className={cx('add-btn')} onClick={handleAdd}>
          <FiPlus /> Thêm Mới
        </button>
      </div>

      <div className={cx('toolbar')}>
        <form onSubmit={handleSearch} className={cx('search-form')}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách..."
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
                  <th>Tiêu Đề</th>
                  <th>Ảnh</th>
                  <th>NXB</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.ma_sach}>
                    <td>{index + 1}</td>
                    <td>{item.tieu_de}</td>
                    <td>
                      {item.anh && item.anh.split('|').map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:3000/images/${item.ma_sach}/${img}`}
                          alt={`Sách ${idx}`}
                          className={cx('book-image')}
                          style={{ width: '50px', height: 'auto', marginRight: '5px' }}
                        />
                      ))}
                    </td>
                    <td>{nxbList.find(nxb => nxb.ma_nxb === item.ma_nxb)?.ten_nxb || item.ma_nxb}</td>
                    <td style={{ textAlign: "right" }}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                      }).format(item.giahientai)}
                    </td>
                    <td style={{ textAlign: "right" }}>{new Intl.NumberFormat('vi-VN', {
                      minimumFractionDigits: 0,
                    }).format(item.so_luong_kho)}</td>
                    <td>
                      <div className={cx('actions')}>
                        <button
                          onClick={() => handleEdit(item)}
                          className={cx('edit-btn')}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(item.ma_sach)}
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
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>



      {showForm && (
        <SachForm
          initialData={editData}
          nxbList={nxbList}
          theloaiList={theloaiList}
          tacgiaList={tacgiaList}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Sach;