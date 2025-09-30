import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiLock, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './NguoiDung.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const NguoiDungForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_nguoi_dung: '',
    ho: '',
    ten: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: '',
    thanh_pho: '',
    tinh: '',
    quoc_gia: 'Việt Nam',
    chuc_quyen: 'Customer',
    mat_khau_hash: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        mat_khau_hash: '' // Không hiển thị mật khẩu hiện tại
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={cx('modal-overlay')}>
      <div className={cx('modal')}>
        <div className={cx('modal-header')}>
          <h2>{initialData ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}</h2>
          <button onClick={onClose} className={cx('close-btn')}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={cx('form')}>
          <div className={cx('form-grid')}>
            <div className={cx('form-group')}>
              <label>Họ *</label>
              <input
                type="text"
                name="ho"
                value={formData.ho}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={cx('form-group')}>
              <label>Tên *</label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={cx('form-group')}>
              <label>Email *</label>
              <div className={cx('input-with-icon')}>
                <FiMail />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={cx('form-group')}>
              <label>Số Điện Thoại</label>
              <div className={cx('input-with-icon')}>
                <FiPhone />
                <input
                  type="tel"
                  name="so_dien_thoai"
                  value={formData.so_dien_thoai}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {!initialData && (
              <div className={cx('form-group')}>
                <label>Mật Khẩu *</label>
                <div className={cx('input-with-icon')}>
                  <FiLock />
                  <input
                    type="password"
                    name="mat_khau_hash"
                    value={formData.mat_khau_hash}
                    onChange={handleChange}
                    required={!initialData}
                    minLength="6"
                  />
                </div>
              </div>
            )}
            
            <div className={cx('form-group')}>
              <label>Quyền</label>
              <select
                name="chuc_quyen"
                value={formData.chuc_quyen}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            
            <div className={cx('form-group', 'span-2')}>
              <label>Địa Chỉ</label>
              <div className={cx('input-with-icon')}>
                <FiMapPin />
                <input
                  type="text"
                  name="dia_chi"
                  value={formData.dia_chi}
                  onChange={handleChange}
                  placeholder="Số nhà, đường..."
                />
              </div>
            </div>
            
            <div className={cx('form-group')}>
              <label>Thành Phố</label>
              <input
                type="text"
                name="thanh_pho"
                value={formData.thanh_pho}
                onChange={handleChange}
              />
            </div>
            
            <div className={cx('form-group')}>
              <label>Tỉnh</label>
              <input
                type="text"
                name="tinh"
                value={formData.tinh}
                onChange={handleChange}
              />
            </div>
            
            <div className={cx('form-group')}>
              <label>Quốc Gia</label>
              <input
                type="text"
                name="quoc_gia"
                value={formData.quoc_gia}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className={cx('form-actions')}>
            <button type="button" onClick={onClose} className={cx('cancel-btn')}>
              Hủy
            </button>
            <button type="submit" className={cx('save-btn')}>
              <FiSave /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NguoiDungForm;