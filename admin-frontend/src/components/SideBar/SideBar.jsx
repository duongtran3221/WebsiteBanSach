import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
import { FiBookOpen ,FiBox ,FiUsers ,FiHome, FiGrid ,FiStar   } from 'react-icons/fi';
const cx = classNames.bind(styles);

const Sidebar = () => {
  return (
    <div className={cx('sidebar')}>

      <nav className={cx('nav')}>
        <ul>
          <li>
            Trang Chủ<br/>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => cx({ active: isActive })}
              end
            >
              <FiHome size={20}/>
              <span>  Tổng quan</span>
            </NavLink>
          </li>
          <li>Quản Lý<br/>
            <NavLink 
              to="/admin/the-loai" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiGrid size={20}/>
              <span>  Thể loại</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/tac-gia" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiUsers size={20}/>
              <span>  Tác giả</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/nha-xuat-ban" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiUsers size={20}/>
              <span>  Nhà xuất bản</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/sach" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiBookOpen size={20}/>
              <span>  Sách</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/nguoidung" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiUsers size={20}/>
              <span>  Người dùng</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/donhang" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiBox/>
              <span>  Đơn hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/danhgia" 
              className={({ isActive }) => cx({ active: isActive })}
            >
              <FiStar />
              <span>  Đánh giá</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;