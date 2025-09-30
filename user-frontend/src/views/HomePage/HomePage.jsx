import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import IconMenu from "../../components/MenuIcon/IconMenu";
import ProductItem from "../../components/ProducItem/ProductItem";
import ProductList from "../../components/ProductList/ProductList";
import sachService from "../../services/homePage"

import styles from '../HomePage/HomePage.module.scss';
import classnames from 'classnames/bind';

import slide1 from '../../assets/images/slide1.webp';
import slide2 from '../../assets/images/slide2.webp';
import slide3 from '../../assets/images/slide3.webp';
import slide4 from '../../assets/images/slide4.webp';
import ads1 from '../../assets/images/ads1.webp';
import ads2 from '../../assets/images/ads2.webp';
import ads3 from '../../assets/images/ads3.webp';
import ads4 from '../../assets/images/ads4.webp';
import ml2 from '../../assets/images/ml2.webp';
import ml3 from '../../assets/images/ml3.webp';
import ml4 from '../../assets/images/ml4.webp';
import ml5 from '../../assets/images/ml5.webp';
import ml6 from '../../assets/images/ml6.webp';
import ml7 from '../../assets/images/ml7.webp';
import ml8 from '../../assets/images/ml8.webp';
import menuicon1 from '../../assets/images/menuicon1.webp';
import { ReactComponent as LeftIcon } from '../../assets/images/angle-small-left.svg';
import { ReactComponent as RightIcon } from '../../assets/images/angle-small-right.svg';
import Footer from "../../components/Footer/Footer";

const cx = classnames.bind(styles);

function HomePage() {
    const [randomProducts, setRandomProducts] = useState([]);
    const [newProducts, setnewProducts] = useState([]);
    const slides = [slide1, slide2, slide3, slide4];
    const [currentIndex, setCurrentIndex] = useState(0);
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 3000); 

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await sachService.getRandom10Sach();
                const newProduct = await sachService.get10SachNew();
                setRandomProducts(data);
                setnewProducts(newProduct);
            } catch (error) {
                console.error("Lỗi khi load sách:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <Header />
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <div className={cx("slide")}>
                        <button className={cx("prev-button")} onClick={handlePrev}>
                            <span className={cx("icon-left")}><LeftIcon /></span>
                        </button>

                        <img src={slides[currentIndex]} alt={`Slide ${currentIndex + 1}`} />

                        <button className={cx("next-button")} onClick={handleNext}>
                            <span className={cx("icon-right")}><RightIcon /></span>
                        </button>
                    </div>


                    <div className={cx('listads')}>
                        <div className={cx('ads-item')} >
                            <img src={ads1} alt="ads" />
                        </div>
                        <div className={cx('ads-item')} >
                            <img src={ads2} alt="ads" />
                        </div>
                        <div className={cx('ads-item')} >
                            <img src={ads3} alt="ads" />
                        </div>
                        <div className={cx('ads-item')} >
                            <img src={ads4} alt="ads" />
                        </div>
                    </div>

                    <div className={cx('list-menu-icon')}>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={menuicon1} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Minh Long</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml2} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Sản phẩm mới</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml3} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Sản phẩm được trợ giá</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml4} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Phiên chợ đồ cũ</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml5} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Manga</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml6} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Sbooks</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml7} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>MBooks</span> </div>
                        </div>
                        <div className={cx("icon-text")}>
                            <div className={cx('img-icon')}>
                                <a href="#">
                                    <img src={ml8} alt="imgicon" />
                                </a>
                            </div>
                            <div className={cx("text")}><span>Mã giảm giá</span> </div>
                        </div>
                    </div>

                    <ProductList
                        title="Sách Ngẫu Nhiên"
                        products={randomProducts}
                        tabs={["Sách ngẫu nhiên"]}
                        showTabs={true}
                    />
                    <ProductList
                        title="Sách Mới"
                        products={newProducts}
                        tabs={["Sách mới"]}
                        showTabs={true}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default HomePage;
