import React, { useState, useEffect } from 'react';
import styles from './TheLoaiForm.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const TheLoaiForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_the_loai: '',
    ten_the_loai: '',
    mo_ta: '',
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ma_the_loai: '',
        ten_the_loai: '',
        mo_ta: '',
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.ma_the_loai.trim()) {
    alert('Mã thể loại không được để trống');
    return;
  }

  if (!formData.ten_the_loai.trim()) {
    alert('Tên thể loại không được để trống');
    return;
  }
  if (formData.ten_the_loai.length > 100) {
    alert('Tên thể loại không được vượt quá 100 ký tự');
    return;
  }

  if (formData.mo_ta && formData.mo_ta.length > 65535) {
    alert('Mô tả quá dài (tối đa 65 535 ký tự)');
    return;
  }

  onSubmit(formData);
};

  
  return (
    <div className={cx('modal')}>
      <div className={cx('modal-content')}>
        <h2>{initialData ? 'Chỉnh Sửa Thể Loại' : 'Thêm Thể Loại Mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={cx('form-group')}>
            <label>Mã Thể Loại</label>
            <input
              type="text"
              name="ma_the_loai"
              value={formData.ma_the_loai}
              onChange={handleChange}
              required
              disabled={!!initialData}
            />
          </div>
          
          <div className={cx('form-group')}>
            <label>Tên Thể Loại</label>
            <input
              type="text"
              name="ten_the_loai"
              value={formData.ten_the_loai}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={cx('form-group')}>
            <label>Mô Tả</label>
            <textarea
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className={cx('form-actions')}>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit">
              {initialData ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TheLoaiForm;