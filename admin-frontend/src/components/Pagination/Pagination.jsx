import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss'; 

const cx = classNames.bind(styles);

const Pagination = ({ pagination, onPageChange }) => {
  const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
  
  const handlePrevious = () => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  };
  
  const handleNext = () => {
    if (pagination.page < totalPages) {
      onPageChange(pagination.page + 1);
    }
  };
  
  return (
    <div className={cx('pagination')}>
      <button
        className={cx('pagination-button')}
        disabled={pagination.page === 1}
        onClick={handlePrevious}
        aria-label="Trang trước"
      >
        <FiChevronLeft />
      </button>
      
      <span className={cx('pagination-info')}>
        Trang {pagination.page} / {totalPages}
      </span>
      
      <button
        className={cx('pagination-button')}
        disabled={pagination.page >= totalPages}
        onClick={handleNext}
        aria-label="Trang sau"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;