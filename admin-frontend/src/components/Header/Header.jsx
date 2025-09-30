import React, { useState } from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import {useNavigate} from 'react-router-dom'
import { FiLogOut, FiUser, FiBell, FiSettings, FiChevronDown } from 'react-icons/fi';
import avatar from '../../assets/avatar.jpg'
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = {
    name: 'Admin',
    avatar: avatar,
    role: 'Quản trị viên'
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    setShowUserMenu(false);
    toast.success("Đăng xuất thành công")
    localStorage.removeItem('ma_nguoi_dung');
    navigate('/');
  };
  return (
    <header className={cx('header')}>
      <div className={cx('user-actions')}>
        <button className={cx('action-btn')}>
          <FiBell size={20} />
          <span className={cx('badge')}>3</span>
        </button>

        <button className={cx('action-btn')}>
          <FiSettings size={20} />
        </button>

        <div
          className={cx('user-profile')}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <img src={user.avatar} alt={user.name} className={cx('avatar')} />
          <div className={cx('user-info')}>
            <span className={cx('user-name')}>{user.name}</span>
            <span className={cx('user-role')}>{user.role}</span>
          </div>
          <FiChevronDown className={cx('dropdown-icon', { rotated: showUserMenu })} />

          {showUserMenu && (
            <div className={cx('user-menu')}>
              <button className={cx('menu-item')}>
                <FiUser className={cx('menu-icon')} />
                <span>Hồ sơ</span>
              </button>
              <button className={cx('menu-item')}>
                <FiSettings className={cx('menu-icon')} />
                <span>Cài đặt</span>
              </button>
              <button className={cx('menu-item')} onClick={handleLogout}>
                <FiLogOut className={cx('menu-icon')} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;