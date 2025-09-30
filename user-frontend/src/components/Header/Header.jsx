import React, { useState, useEffect } from "react";
import IconText from "../IconText/IconText";
import banner1 from '../../assets/images/bannerheader.webp';
import logo from '../../assets/images/logo.webp';
import menuicon from '../../assets/images/iconmenu.svg';
import { Link } from 'react-router-dom'
import { getAllTheLoai } from '../../services/category'
import { auth, register } from '../../services/auth';

import { useNavigate } from "react-router-dom";
import { ReactComponent as SearchIcon } from '../../assets/images/search.svg';
import { ReactComponent as BellIcon } from '../../assets/images/bell.svg';
import { ReactComponent as CartIcon } from '../../assets/images/shopping-cart.svg';
import { ReactComponent as UserIcon } from '../../assets/images/user.svg';
import styles from './header.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const Auth = ({ showDropdown, setShowDropdown, showModal, setShowModal }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openModal = (tab) => {
    setActiveTab(tab);
    setShowModal(true);
    setShowDropdown(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await auth(phone, password);

      if (response.success) {
        const maNguoiDung = response.data.ma_nguoi_dung;

        localStorage.setItem('ma_nguoi_dung', maNguoiDung);
        setIsLoggedIn(true);
        setShowModal(false);

        console.log('Mã người dùng:', response.data.ma_nguoi_dung);
        alert('Đăng nhập thành công!');
      } else {
        alert(response.message || 'Sai thông tin đăng nhập!');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert('Đăng nhập thất bại! Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    const maNguoiDung = localStorage.getItem('ma_nguoi_dung');
    if (maNguoiDung) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('ma_nguoi_dung');

    setShowDropdown(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
      setError('Số điện thoại không hợp lệ (phải đúng 10 chữ số)');
      return;
    }


    setLoading(true);
    try {
      const response = await register(firstName, lastName, email, phone, password, confirmPassword);
      if (response.success) {
        alert('Đăng ký thành công!');
        setShowModal(false);
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {showDropdown && (
        <div
          className={cx('auth-dropdown')}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {isLoggedIn ? (
            <div className={cx('user-dropdown')}>
              <div className={cx('user-header')}>
                <span className={cx('user-name')}>Thành viên DTBOOK</span>
              </div>
              <ul className={cx('user-menu')}>
                <li><Link to="/profile">Trang cá nhân</Link></li>
                <li><Link to="/order">Đơn hàng của tôi</Link></li>
                <li className={cx('logout')}>
                  <button onClick={handleLogout}>Thoát tài khoản</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className={cx('guest-dropdown')}>
              <button className={cx('dropdown-item', 'btn1')} onClick={() => openModal('login')}>Đăng nhập</button>
              <button className={cx('dropdown-item', 'btn2')} onClick={() => openModal('register')}>Đăng ký</button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className={cx('auth-modal-overlay')}>
          <div className={cx('auth-modal')}>
            <div className={cx('modal-header')}>
              <button
                className={cx('tab-button', { active: activeTab === 'login' })}
                onClick={() => setActiveTab('login')}
              >
                Đăng nhập
              </button>
              <button
                className={cx('tab-button', { active: activeTab === 'register' })}
                onClick={() => setActiveTab('register')}
              >
                Đăng ký
              </button>
              <button className={cx('close-button')} onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <div className={cx('modal-body')}>
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin}>
                  <div className={cx('form-group')}>
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className={cx('form-group')}>
                    <label>Mật khẩu</label>
                    <div className={cx('password-input')}>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="button" className={cx('show-password')}>Hiện</button>
                    </div>
                  </div>
                  <div className={cx('forgot-password')}>
                    <a href="/forgot-password">Quên mật khẩu?</a>
                  </div>
                  <div className={cx('form-actions')}>
                    <button type="submit" className={cx('submit-button')}>Đăng nhập</button>
                    <button type="button" className={cx('cancel-button')} onClick={() => setShowModal(false)}>Bỏ qua</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <div className={cx('form-row')}>
                    <div className={cx('form-group')}>
                      <label>Họ</label>
                      <input
                        type="text"
                        placeholder="Nhập họ"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>

                    <div className={cx('form-group')}>
                      <label>Tên</label>
                      <input
                        type="text"
                        placeholder="Nhập tên"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>


                  <div className={cx('form-group')}>
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={cx('form-group')}>
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className={cx('form-group')}>
                    <label>Mật khẩu</label>
                    <div className={cx('password-input')}>
                      <input
                        type={showPassword1 ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className={cx('show-password')}
                        onClick={() => setShowPassword1(prev => !prev)}
                      >
                        {showPassword1 ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </div>

                  <div className={cx('form-group')}>
                    <label>Nhập lại mật khẩu</label>
                    <div className={cx('password-input')}>
                      <input
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className={cx('show-password')}
                        onClick={() => setShowPassword2(prev => !prev)}
                      >
                        {showPassword2 ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </div>
                  {error && <p className="error">{error}</p>}
                  <div className={cx('form-actions')}>
                    <button type="submit" className={cx('submit-button')} disabled={loading}>
                      {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                    <button
                      type="button"
                      className={cx('cancel-button')}
                      onClick={() => setShowModal(false)}
                    >
                      Bỏ qua
                    </button>
                  </div>

                  <div className={cx('terms')}>
                    Bằng việc đăng ký, bạn đã đồng ý với Fahasa.com về<br />
                    <a href="/terms">Điều khoản dịch vụ</a> & <a href="/privacy">Chính sách bảo mật</a>
                  </div>
                </form>

              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Header = () => {
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorys, setcategorys] = useState([]);

  const fetchCate = async () => {
    try {
      const response = await getAllTheLoai();
      console.log(response);
      setcategorys(response);
    } catch (error) {
      console.error('Lỗi khi load thể loại:', error);
    }
  };

  useEffect(() => {
    fetchCate();
  }, []);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim().length > 1) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
    }
    else {
      alert("Bạn chưa nhập từ khóa nào!")
    }
  };
  return (
    <>
      <div className={cx('banner-header')}>
        <div className={cx('banner-img')}>
          <img src={banner1} alt="" />
        </div>
      </div>

      <div className={cx('menu-container')}>
        <div className={cx('wrapper')}>
          <div className={cx('logo')}>
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>

          <div className={cx('menu-search')}>
            <div className={cx('menu-icon')}>
              <img src={menuicon} alt="Danh mục sản phẩm" />
              <div className={cx('menu-hide')}>
                <div className={cx('menu-dropdown')}>
                  <div className={cx("menu-title")}><h2>Danh mục sản phẩm</h2></div>
                  <ul className={cx('menu-list')}>
                    {categorys?.map((cate) => (
                      <li key={cate.ma_the_loai}>
                        <Link to={`/category/${cate.ten_the_loai.toLowerCase()}`}>
                          {cate.ten_the_loai}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={cx('search-bar')}>
              <input className={cx('searchinput')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" />
              <button className={cx('btnsearch')} onClick={handleSearch}>
                <SearchIcon className={cx('icon-search')} />
              </button>
            </div>
          </div>

          <div className={cx("actions")}>
            <div className={cx("icon-text")}>
              <a href="#">
                <BellIcon className={cx("icon")} />
                <div className={cx("text")}>Thông báo</div>
              </a>
            </div>
            <div className={cx("icon-text")}>
              <Link to="/cart">
                <CartIcon className={cx("icon")} />
                <div className={cx("text")}>Giỏ hàng</div>
              </Link>
            </div>
            <div className={cx("account-wrapper")}>
              <div
                className={cx("icon-text")}
                onMouseEnter={() => setShowAuthDropdown(true)}
                onMouseLeave={() => setShowAuthDropdown(false)}
                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <UserIcon className={cx("icon")} />
                  <span className={cx("text")}>Tài khoản</span>
                </a>
              </div>
              <Auth
                showDropdown={showAuthDropdown}
                setShowDropdown={setShowAuthDropdown}
                showModal={showAuthModal}
                setShowModal={setShowAuthModal}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;