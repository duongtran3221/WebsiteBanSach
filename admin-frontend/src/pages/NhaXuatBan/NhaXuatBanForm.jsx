import React, { useState, useEffect } from 'react';
import styles from './NhaXuatBanForm.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const NhaXuatBanForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_nxb: '',
    ten_nxb: '',
    dia_chi: '',
    so_dien_thoai: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ma_nxb: initialData.ma_nxb || '',
        ten_nxb: initialData.ten_nxb || '',
        dia_chi: initialData.dia_chi || '',
        so_dien_thoai: initialData.so_dien_thoai || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.ten_nxb.length > 100) {
      alert('Tên nhà xuất bản không vượt quá 100 ký tự');
      return;
    }

    if (formData.dia_chi && formData.dia_chi.length > 65535) {
      alert('Địa chỉ quá dài (tối đa ~65 535 ký tự)');
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (formData.so_dien_thoai && !phonePattern.test(formData.so_dien_thoai)) {
      alert('Số điện thoại không hợp lệ (10 chữ số)');
      return;
    }

    onSubmit(formData);
  };


  return (
    <div className={cx('modal')}>
      <div className={cx('modal-content')}>
        <h2>{initialData ? 'Chỉnh Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản Mới'}</h2>

        <form onSubmit={handleSubmit}>
          {/* {!initialData && (
            <div className={cx('form-group')}>
              <label>Mã NXB *</label>
              <input
                type="text"
                name="ma_nxb"
                value={formData.ma_nxb}
                onChange={handleChange}
                required
              />
            </div>
          )} */}

          <div className={cx('form-group')}>
            <label>Tên NXB *</label>
            <input
              type="text"
              name="ten_nxb"
              value={formData.ten_nxb}
              onChange={handleChange}
              required
            />
          </div>

          <div className={cx('form-group')}>
            <label>Địa chỉ</label>
            <textarea
              name="dia_chi"
              value={formData.dia_chi}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className={cx('form-group')}>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="so_dien_thoai"
              value={formData.so_dien_thoai}
              onChange={handleChange}
              required
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

export default NhaXuatBanForm;