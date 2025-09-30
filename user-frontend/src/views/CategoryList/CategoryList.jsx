import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductItem from "../../components/ProducItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./CategoryList.module.scss"
import { getAllTheLoai, getByTheLoai } from '../../services/category'
import classnames from "classnames/bind";
import { useParams,Link } from "react-router-dom";
const cx = classnames.bind(styles)
function CategoryList() {
    const [products, setproducts] = useState([]);
    const [categorys, setcategorys] = useState([]);
    const { ten_the_loai } = useParams();

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalItems: 0,
    });

    const fetchCate = async () => {
        try {
            const response = await getAllTheLoai();
            setcategorys(response);
        } catch (error) {
            console.error('Lỗi khi load thể loại:', error);
        }
    };

    const fetchProducts = async (ten_the_loai, page = 1, pageSize = 12) => {
        try {
            const response = await getByTheLoai(ten_the_loai, page, pageSize);
            setproducts(response.data);
            setPagination(prev => ({
                ...prev,
                totalItems: response.totalRecords,
            }));
        } catch (error) {
            console.error('Lỗi khi load products:', error);
        }
    };

    useEffect(() => {
        fetchCate();
    }, []);

    useEffect(() => {
        if (ten_the_loai) {
            fetchProducts(ten_the_loai, pagination.page, pagination.pageSize);
        }
    }, [ten_the_loai, pagination.page]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <>
            <Header />
            <div className={cx('category-wrapper')}>
                <div className={cx('category-sidebar')}>
                    <h3>NHÓM SẢN PHẨM</h3>
                    <ul className={cx('category-list')}>
                        <li>Tất cả danh mục</li>
                        {categorys?.map((cate) => (
                            <li key={cate.ma_the_loai}>
                                <Link to={`/category/${cate.ten_the_loai.toLowerCase()}`} className="your-class">
                                    {cate.ten_the_loai}
                                </Link>
                            </li>
                        ))}
                        {/* <li className={cx('view-more')}>Xem Thêm <IoIosArrowDown fontSize={16}></IoIosArrowDown></li> */}
                    </ul>

                </div>

                <div className={cx('product-list')}>
                    {/* <div className={cx('sort-bar')}>
                        <span>Sắp xếp theo: </span>
                        <select>
                            <option>Bán Chạy Tuần</option>
                            <option>Bán Chạy Tháng</option>
                            <option>Bán Chạy Năm</option>
                        </select>
                    </div> */}

                    <div className={cx('product-grid')}>
                        {products?.map(product => (
                            <ProductItem key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </div>

            </div>
            <Footer />
        </>
    )
}

export default CategoryList;