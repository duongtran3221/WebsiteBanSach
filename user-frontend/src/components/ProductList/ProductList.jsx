import { React, useState } from 'react'
import styles from '../ProductList/ProductList.module.scss'
import classnames from 'classnames/bind'
import ProductItem from '../ProducItem/ProductItem';
import { Link } from 'react-router-dom';
const cx = classnames.bind(styles);

function ProductList({
    title = "Xu Hướng Mua Sắm",
    tabs = ['Xu Hướng Theo Ngày', 'Sách HOT - Giảm Sốc'],
    initialActiveTab = null,
    products = [],
    showTabs = true
}) {
    const [activeTab, setActiveTab] = useState(initialActiveTab || tabs[0]);

    return (
        <div className={cx('book-container')}>
            <div className={cx('header')}>
                <div className={cx('title-container')}>
                    <div className={cx('logo')}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
                        </svg>
                    </div>
                    <h2 className={cx('title')}>{title}</h2>
                </div>

                {showTabs && (
                    <div className={cx('tabs')}>
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                className={cx('tab', { active: activeTab === tab })}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div
                className={cx('product-grid')}
            >
                {products.map(product => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>

            <div className={cx('see-more-container')}>
                <button
                    className={cx('see-more-button')}
                >
                    <Link style={{color:"#ee4d2d"}} to="/category/giáo%20dục%20-%20học%20tập">Xem Thêm</Link>
                </button>
            </div>
        </div>
    );
}

export default ProductList;