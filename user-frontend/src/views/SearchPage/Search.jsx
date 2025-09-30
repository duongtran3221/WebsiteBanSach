import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductItem from "../../components/ProducItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination";
import sachService from "../../services/homePage";

import styles from "./Search.module.scss"
import classnames from "classnames/bind";
const cx = classnames.bind(styles)
function SearchPage() {
    const [products,setproducts] = useState([]);
    const {searchTerm} = useParams();
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
        totalItems: 1
    });
    const fetchData = async () => {
        try {
          const result = await sachService.searchSach(
            pagination.page,
            pagination.pageSize,
            searchTerm
          );
          setproducts(result.data);
          setPagination(prev => ({
            ...prev,
            totalItems: result.totalRecords
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [pagination.page, pagination.pageSize, searchTerm]);
    
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };
    return (
        <>
            <Header />
            <div className={cx('search-wrapper')}>
                <div className={cx('search-title')}> <h2>Kết quả tìm kiếm: <span>Đã tìm thấy {pagination.totalItems} kết quả</span></h2> </div>
                <div className={cx('product-list')}>
                    {products.length < 1 ? (
                        <div className={cx('not-found')}>Không tìm thấy kết quả nào</div>
                    ) : (
                        <><div className={cx('product-grid')}>
                            {products?.map(product => (
                                <ProductItem key={product.id} product={product} />
                            ))}
                        </div>

                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </>


                    )}
                </div>


            </div>

            <Footer />
        </>
    )
}

export default SearchPage;