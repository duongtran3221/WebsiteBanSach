import React, { useState, useEffect } from 'react';
import styles from './SachForm.module.scss';
import classNames from 'classnames/bind';
import { FiX, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const SachForm = ({ initialData, nxbList, theloaiList, tacgiaList, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    ma_sach: '',
    tieu_de: '',
    ma_nxb: '',
    nam_xuat_ban: '',
    so_trang: '',
    ngon_ngu: 'Tiếng Việt',
    mo_ta: '',
    anh: '',
    giacu: 0,
    giahientai: 0,
    so_luong_kho: 0,
    ma_tac_gia: '',
    ma_the_loai: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ma_sach: initialData.ma_sach || '',
        tieu_de: initialData.tieu_de || '',
        ma_nxb: initialData.ma_nxb || '',
        nam_xuat_ban: initialData.nam_xuat_ban ?
          initialData.nam_xuat_ban.split('T')[0] : '',
        so_trang: initialData.so_trang || '',
        ngon_ngu: initialData.ngon_ngu || 'Tiếng Việt',
        mo_ta: initialData.mo_ta || '',
        anh: initialData.anh || '',
        giacu: initialData.giacu || 0,
        giahientai: initialData.giahientai || 0,
        so_luong_kho: initialData.so_luong_kho || 0,
        ma_tac_gia: initialData.ma_tac_gia || '',
        ma_the_loai: initialData.ma_the_loai || ''
      });

      if (initialData.anh) {
        const images = initialData.anh.split('|').filter(img => img.trim() !== '');
        setExistingImages(images);
        setPreviewImages(images.map(img => `http://localhost:3000/images/${initialData.ma_sach}/${img}`));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImageFiles = [...imageFiles, ...files];
      setImageFiles(newImageFiles);

      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setImagesToDelete(prev => [...prev, existingImages[index]]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newIndex));
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(previewImages[index]);
    }
  };
  const decimalPattern = /^\d+(\.\d{1,2})?$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tieu_de.length > 255) {
      alert('Tiêu đề không được vượt quá 255 ký tự');
      return;
    }

    if (!formData.ma_nxb) {
      alert('Vui lòng chọn Nhà xuất bản');
      return;
    }
    if (!formData.ma_tac_gia) {
      alert('Vui lòng chọn Tác giả');
      return;
    }
    if (!formData.ma_the_loai) {
      alert('Vui lòng chọn Thể loại');
      return;
    }

    if (formData.nam_xuat_ban) {
      const selected = new Date(formData.nam_xuat_ban);
      if (isNaN(selected.getTime())) {
        alert('Ngày xuất bản không hợp lệ');
        return;
      }

      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected > today) {
        alert('Ngày xuất bản không được lớn hơn ngày hôm nay');
        return;
      }
    }

    if (!Number.isInteger(Number(formData.so_trang)) || Number(formData.so_trang) < 1) {
      alert('Số trang không hợp lệ (≥ 1)');
      return;
    }

    if (!decimalPattern.test(String(formData.giacu))) {
      alert('Giá cũ không hợp lệ (tối đa 2 chữ số thập phân)');
      return;
    }
    if (Number(formData.giacu) <= 0) {
      alert('Giá cũ phải lớn hơn 0');
      return;
    }

    if (!decimalPattern.test(String(formData.giahientai))) {
      alert('Giá hiện tại không hợp lệ (tối đa 2 chữ số thập phân)');
      return;
    }
    if (Number(formData.giahientai) <= 0) {
      alert('Giá hiện tại phải lớn hơn 0');
      return;
    }


    if (!Number.isInteger(Number(formData.so_luong_kho)) || Number(formData.so_luong_kho) < 0) {
      alert('Số lượng kho không hợp lệ');
      return;
    }

    const anh = existingImages
      .filter(img => !imagesToDelete.includes(img))
      .join('|');

    if (anh.length > 255) {
      alert('Chuỗi đường dẫn hình ảnh quá dài');
      return;
    }

    const imageCount = existingImages.filter(img => !imagesToDelete.includes(img)).length;
    if (imageCount > 10) {
      alert('Chỉ được phép chọn tối đa 10 ảnh');
      return;
    }

    const bookData = { ...formData, anh };
    try {
      await onSubmit(bookData, imageFiles);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu sách');
      console.error(err);
    }
  };



  return (
    <div className={cx('modal')}>
      <div className={cx('modal-content')}>
        <div className={cx('modal-header')}>
          <h2>{initialData ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới'}</h2>
          <button className={cx('close-btn')} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={cx('form-columns')}>
            <div className={cx('form-column')}>
              {/* {!initialData && (
                <div className={cx('form-group')}>
                  <label>Mã Sách *</label>
                  <input
                    type="text"
                    name="ma_sach"
                    value={formData.ma_sach}
                    onChange={handleChange}
                    required
                  />
                </div>
              )} */}

              <div className={cx('form-group')}>
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  name="tieu_de"
                  value={formData.tieu_de}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label>Nhà xuất bản *</label>
                <select
                  name="ma_nxb"
                  value={formData.ma_nxb}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn NXB --</option>
                  {nxbList.map(nxb => (
                    <option key={nxb.ma_nxb} value={nxb.ma_nxb}>
                      {nxb.ten_nxb}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx('form-group')}>
                <label>Tác giả *</label>
                <select
                  name="ma_tac_gia"
                  value={formData.ma_tac_gia}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn Tác Giả --</option>
                  {tacgiaList?.map(tg => (
                    <option key={tg.ma_tac_gia} value={tg.ma_tac_gia}>
                      {tg.ten_tac_gia}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx('form-group')}>
                <label>Thể loại *</label>
                <select
                  name="ma_the_loai"
                  value={formData.ma_the_loai}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn Thể Loại --</option>
                  {theloaiList?.map(tl => (
                    <option key={tl.ma_the_loai} value={tl.ma_the_loai}>
                      {tl.ten_the_loai}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx('form-group')}>
                <label>Năm xuất bản</label>
                <input
                  type="date"
                  name="nam_xuat_ban"
                  value={formData.nam_xuat_ban}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label>Số trang</label>
                <input
                  type="number"
                  name="so_trang"
                  value={formData.so_trang}
                  onChange={handleNumberChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className={cx('form-column')}>
              <div className={cx('form-group')}>
                <label>Ngôn ngữ</label>
                <input
                  type="text"
                  name="ngon_ngu"
                  value={formData.ngon_ngu}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label>Giá cũ (đ)</label>
                <input
                  type="number"
                  name="giacu"
                  value={formData.giacu}
                  onChange={handleNumberChange}
                  min="0"
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label>Giá hiện tại (đ) *</label>
                <input
                  type="number"
                  name="giahientai"
                  value={formData.giahientai}
                  onChange={handleNumberChange}
                  min="0"
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label>Số lượng kho *</label>
                <input
                  type="number"
                  name="so_luong_kho"
                  value={formData.so_luong_kho}
                  onChange={handleNumberChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className={cx('form-group')}>
            <label>Mô tả</label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.mo_ta}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData(prevData => ({
                  ...prevData,
                  mo_ta: data
                }));
              }}
            />
          </div>


          <div className={cx('form-group')}>
            <label>Ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              re
            />

            <div className={cx('image-preview-container')}>
              {previewImages.map((img, index) => (
                <div key={index} className={cx('image-preview-wrapper')}>
                  <img
                    src={img.startsWith('blob:') ? img : img}
                    alt="Preview"
                    className={cx('image-preview')}
                  />
                  <button
                    type="button"
                    className={cx('remove-image-btn')}
                    onClick={() => removeImage(index, index < existingImages.length)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={cx('form-actions')}>
            <button type="button" onClick={onClose} className={cx('cancel-btn')}>
              Hủy
            </button>
            <button type="submit" className={cx('submit-btn')}>
              {initialData ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SachForm;