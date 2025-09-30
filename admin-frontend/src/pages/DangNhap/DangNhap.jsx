import React, { useState, useEffect } from 'react';
import styles from '../DangNhap/DangNhap.module.scss';
import classnames from 'classnames/bind';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/auth';

const cx = classnames.bind(styles);

const DangNhap = () => {
    const [sdt, setsdt] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await auth(sdt, password);

            if (response.success) {
                localStorage.setItem('ma_nguoi_dung', response.data.ma_nguoi_dung);
                alert('Đăng nhập thành công!');
                navigate('/admin');
            } else {
                setError(response.message || 'Sai thông tin đăng nhập!');
            }
        } catch (err) {
            console.error('Lỗi khi đăng nhập:', err);
            setError('Đăng nhập thất bại! Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const maNguoiDung = localStorage.getItem('ma_nguoi_dung');
        if (maNguoiDung) {
            navigate('/admin');
        }
    }, [navigate]);

    return (
        <div className={cx('container')}>
            <form className={cx('form-login')} onSubmit={handleSubmit}>
                <div className={cx('logo')}>
                    <h1>Đăng Nhập</h1>
                </div>

                {error && <div className={cx('error-message')}>{error}</div>}

                <div className={cx('form-group')}>
                    <label>Số điện thoại</label>
                    <div className={cx('input-wrapper')}>
                        <FaUser className={cx('icon')} />
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={sdt}
                            onChange={(e) => setsdt(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={cx('form-group')}>
                    <label>Mật khẩu</label>
                    <div className={cx('input-wrapper')}>
                        <FaLock className={cx('icon')} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={cx('toggle-password')}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={cx('form-options')}>
                    <label className={cx('remember-me')}>
                        <input type="checkbox" /> Ghi nhớ đăng nhập
                    </label>
                    <Link to="#" className={cx('forgot-password')}>
                        Quên mật khẩu?
                    </Link>
                </div>

                <button
                    type="submit"
                    className={cx('login-button')}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
            </form>
        </div>
    );
};

export default DangNhap;
