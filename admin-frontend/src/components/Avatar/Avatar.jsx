import React from 'react';
import styles from './Avatar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Avatar = ({ name, size = '40px', className }) => {
  const getInitials = () => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div 
      className={cx('avatar', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: randomColor,
        fontSize: `calc(${size} / 2.5)`
      }}
    >
      {getInitials()}
    </div>
  );
};

export default Avatar;