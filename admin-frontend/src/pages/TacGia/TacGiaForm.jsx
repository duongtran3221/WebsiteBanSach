import React, { useState, useEffect } from 'react';
import styles from './TacGiaForm.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const TacGiaForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_tac_gia: '',
    ten_tac_gia: '',
    tieu_su: '',
    ngay_sinh: '',
    quoc_tich: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ma_tac_gia: initialData.ma_tac_gia || '',
        ten_tac_gia: initialData.ten_tac_gia || '',
        tieu_su: initialData.tieu_su || '',
        ngay_sinh: initialData.ngay_sinh ? 
          initialData.ngay_sinh.split('T')[0] : '',
        quoc_tich: initialData.quoc_tich || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();



  if (formData.ten_tac_gia.length > 100) {
    alert('Tên tác giả không được quá 100 ký tự');
    return;
  }

  if (formData.tieu_su && formData.tieu_su.length > 65535) {
    alert('Tiểu sử quá dài (tối đa 65 535 ký tự)');
    return;
  }

   if (formData.ngay_sinh) {
    const selected = new Date(formData.ngay_sinh);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected > today) {
      alert('Ngày sinh không được lớn hơn ngày hôm nay');
      return;
    }
  }

  if (formData.quoc_tich && formData.quoc_tich.length > 50) {
    alert('Quốc tịch không vượt quá 50 ký tự');
    return;
  }

  onSubmit(formData);
};


  return (
    <div className={cx('modal')}>
      <div className={cx('modal-content')}>
        <h2>{initialData ? 'Chỉnh Sửa Tác Giả' : 'Thêm Tác Giả Mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* {!initialData && (
            <div className={cx('form-group')}>
              <label>Mã Tác Giả *</label>
              <input
                type="text"
                name="ma_tac_gia"
                value={formData.ma_tac_gia}
                onChange={handleChange}
                required
              />
            </div>
          )} */}

          <div className={cx('form-group')}>
            <label>Tên Tác Giả *</label>
            <input
              type="text"
              name="ten_tac_gia"
              value={formData.ten_tac_gia}
              onChange={handleChange}
              required
            />
          </div>

          <div className={cx('form-group')}>
            <label>Ngày Sinh</label>
            <input
              type="date"
              name="ngay_sinh"
              value={formData.ngay_sinh}
              onChange={handleChange}
            />
          </div>

          <div className={cx('form-group')}>
            <label>Quốc Tịch</label>
            <input
              type="text"
              name="quoc_tich"
              value={formData.quoc_tich}
              onChange={handleChange}
            />
          </div>

          <div className={cx('form-group')}>
            <label>Tiểu Sử</label>
            <textarea
              name="tieu_su"
              value={formData.tieu_su}
              onChange={handleChange}
              rows="5"
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

export default TacGiaForm;