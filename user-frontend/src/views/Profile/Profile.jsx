import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classnames from 'classnames/bind';
import styles from './Profile.module.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaShoppingBag, FaComment, FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const cx = classnames.bind(styles);

const ProfilePage = () => {
    const ma_nguoi_dung = localStorage.getItem('ma_nguoi_dung');
    const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({
        ma_nguoi_dung: ma_nguoi_dung,
        ho: '',
        ten: '',
        email: '',
        so_dien_thoai: '',
        dia_chi: '',
        thanh_pho: '',
        tinh: '',
        quoc_gia: 'Việt Nam',
        chuc_quyen: 'Customer',
        ngay_dang_ky: '2023-01-15T00:00:00.000Z',
    });

    useEffect(() => {
        if (ma_nguoi_dung) {
            axios.get(`http://localhost:3000/nguoidung/getById/${ma_nguoi_dung}`)
                .then((res) => {
                    setUser(res.data.data);
                })
                .catch((err) => {
                    console.error("Lỗi lấy thông tin người dùng:", err);
                    setUser(null);
                });
        }

    }, [])
    const handleInputChange = (field, value) => {
        setUser(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const menuItems = [
        { title: 'Hồ sơ cá nhân', icon: <FaUser />, to: "/profile" },
        { title: 'Đơn hàng của tôi', icon: <FaShoppingBag />, to: "/order" }
    ];
    const handleUpdate = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.put(`http://localhost:3000/nguoidung/update/${ma_nguoi_dung}`, user);
            if (response.data.success) {
                setUser(response.data.data);
                alert('Cập nhật thành công!');
                window.location.reload();
            } else {
                setMessage(response.data.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Header></Header>
            <div className={cx('profile-wrapper')}>
                <div className={cx('profile-layout')}>
                    <aside className={cx('profile-sidebar')}>

                        <nav className={cx('profile-menu')}>
                            <h3 className={cx('menu-title')}>Thông tin tài khoản</h3>
                            <ul>
                                {menuItems.map((item, index) => (
                                    <li key={index} className={cx('menu-item')}>
                                        <Link to={item.to} className={cx('menu-link')}>
                                            {item.icon}
                                            <span style={{ marginLeft: "5px" }}>{item.title}</span>

                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    <main className={cx('profile-main')}>
                        <div className={cx('profile-container')}>
                            <div className={cx('profile-header')}>
                                <div className={cx('avatar')}>
                                    {user.ho?.charAt(0)}{user.ten?.charAt(0)}
                                </div>
                                <div className={cx('user-info')}>
                                    <h1 className={cx('user-name')}>{user.ho} {user.ten}</h1>
                                    <p className={cx('user-email')}>
                                        <IoIosMail className={cx('email-icon')} size={21.6} />
                                        {user.email}
                                    </p>                                    <div className={cx('user-meta')}>
                                        {user.so_dien_thoai && (
                                            <span className={cx('meta-item')} style={{ paddingLeft: "0px" }}>
                                                <FaPhoneAlt />{user.so_dien_thoai}
                                            </span>
                                        )}
                                        <span className={cx('meta-item')}>
                                            <i className={cx('fas', 'fa-user-tag')}></i> {user.chuc_quyen}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={cx('profile-content')}>
                                <div className={cx('profile-content')}>
                                    <section className={cx('info-section')}>
                                        <h2 className={cx('section-title')}>
                                            <i className={cx('fas', 'fa-info-circle')}></i> Thông tin cá nhân
                                        </h2>
                                        <div className={cx('info-grid')}>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="ho">Họ</label>
                                                <input
                                                    type="text"
                                                    id="ho"
                                                    className={cx('info-input')}
                                                    value={user.ho}
                                                    onChange={(e) => handleInputChange('ho', e.target.value)}
                                                />
                                            </div>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="ten">Tên</label>
                                                <input
                                                    type="text"
                                                    id="ten"
                                                    className={cx('info-input')}
                                                    value={user.ten}
                                                    onChange={(e) => handleInputChange('ten', e.target.value)}
                                                />
                                            </div>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className={cx('info-input')}
                                                    value={user.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}

                                                />
                                            </div>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="so_dien_thoai">Số điện thoại</label>
                                                <input
                                                    type="tel"
                                                    id="so_dien_thoai"
                                                    className={cx('info-input')}
                                                    value={user.so_dien_thoai || ''}
                                                    disabled={true}
                                                    onChange={(e) => handleInputChange('so_dien_thoai', e.target.value)}
                                                    placeholder="Nhập số điện thoại"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section className={cx('info-section')}>
                                        <h2 className={cx('section-title')}>
                                            <i className={cx('fas', 'fa-map-marker-alt')}></i> Địa chỉ
                                        </h2>
                                        <div className={cx('info-grid')}>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="dia_chi">Địa chỉ</label>
                                                <input
                                                    type="text"
                                                    id="dia_chi"
                                                    className={cx('info-input')}
                                                    value={user.dia_chi || ''}
                                                    onChange={(e) => handleInputChange('dia_chi', e.target.value)}
                                                    placeholder="Nhập địa chỉ"
                                                />
                                            </div>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="thanh_pho">Thành phố</label>
                                                <input
                                                    type="text"
                                                    id="thanh_pho"
                                                    className={cx('info-input')}
                                                    value={user.thanh_pho || ''}
                                                    onChange={(e) => handleInputChange('thanh_pho', e.target.value)}
                                                    placeholder="Nhập thành phố"
                                                />
                                            </div>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="tinh">Tỉnh</label>
                                                <input
                                                    type="text"
                                                    id="tinh"
                                                    className={cx('info-input')}
                                                    value={user.tinh || ''}
                                                    onChange={(e) => handleInputChange('tinh', e.target.value)}
                                                    placeholder="Nhập tỉnh"
                                                />
                                            </div>
                                            <div className={cx('info-item')}>
                                                <label htmlFor="quoc_gia">Quốc gia</label>
                                                <select
                                                    id="quoc_gia"
                                                    className={cx('info-input')}
                                                    value={user.quoc_gia || 'Việt Nam'}
                                                    onChange={(e) => handleInputChange('quoc_gia', e.target.value)}
                                                >
                                                    <option value="Việt Nam">Việt Nam</option>
                                                    <option value="Khác">Khác</option>
                                                </select>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className={cx('action-buttons')}>
                                    <button disabled={loading} onClick={handleUpdate} className={cx('btn', 'btn-primary') }>
                                        <i className={cx('fas', 'fa-edit')}></i> {loading ? 'Đang lưu...' : 'Chỉnh sửa'}
                                    </button>
                                </div>
                                {message && <p className="status-message">{message}</p>}

                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Footer></Footer>
        </>

    );
};

export default ProfilePage;