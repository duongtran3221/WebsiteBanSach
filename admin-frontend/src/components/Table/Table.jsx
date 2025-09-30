import React from 'react';
import styles from './Table.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Table = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className={cx('data-table')}>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col.field]}</td>
              ))}
              <td>
                <button 
                  className={cx('edit-btn')} 
                  onClick={() => onEdit(row)}
                >
                  Sửa
                </button>
                <button 
                  className={cx('delete-btn')} 
                  onClick={() => onDelete(row)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;