import React, { useState, useEffect } from "react";
import { FaCartPlus, FaTruck, FaRecycle, FaStore } from "react-icons/fa";
import { useParams } from 'react-router-dom'
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./DetailsProduct.module.scss"
import classnames from "classnames/bind";
import { addToCart } from '../../services/cart'
import ads1 from '../../assets/images/ads1.webp'

import detailsService from '../../services/details'

const cx = classnames.bind(styles)
function DetailsProduct() {

    const { ma_sach } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isReadMore,setIsReadMore] = useState(false);
    const ma_nguoi_dung = localStorage.getItem('ma_nguoi_dung');
    const [reviews, setReviews] = useState([]);
    const [thongke, setThongke] = useState({
        tong: 0,
        sao_5: 0,
        sao_4: 0,
        sao_3: 0,
        sao_2: 0,
        sao_1: 0
    });
    const tongDanhGia = parseInt(thongke.tong || 0);
    const totalScore =
        5 * parseInt(thongke.sao_5 || 0) +
        4 * parseInt(thongke.sao_4 || 0) +
        3 * parseInt(thongke.sao_3 || 0) +
        2 * parseInt(thongke.sao_2 || 0) +
        1 * parseInt(thongke.sao_1 || 0);

    const trungBinhSao = tongDanhGia ? (totalScore / tongDanhGia).toFixed(1) : 0;


    useEffect(() => {
        if (!ma_sach) return;

        const fetchProduct = async () => {
            try {
                const data = await detailsService.getById(ma_sach);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
                setProduct(null);
            }
        };
        const fetchReviews = async () => {
            try {
                const data = await detailsService.getBySach(ma_sach);
                setReviews(data.danh_sach);
                setThongke(data.thong_ke)
            } catch (error) {
                console.error("Lỗi khi tải đánh giá:", error);
            }
        };
        fetchProduct();
        fetchReviews();
    }, [ma_sach]);
    const [selectedImage, setSelectedImage] = useState("");
    const imageList = product?.anh ? product.anh.split("|") : [];

    useEffect(() => {
        if (imageList.length > 0) {
            setSelectedImage(imageList[0]);
        }
    }, [product]);


    const [selectedStars, setSelectedStars] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverStar, setHoverStar] = useState(0);

    const ReadMore = () => {
        setIsReadMore(!isReadMore);
    }
    const handleStarClick = (star) => {
        setSelectedStars(star);
    };

    const handleStarHover = (star) => {
        setHoverStar(star);
    };

    const handleStarLeave = () => {
        setHoverStar(0);
    };

    // Gửi đánh giá
    const handleSubmitReview = async () => {
        if (!ma_nguoi_dung) {
            alert("Bạn cần đăng nhập để đánh giá.");
            return;
        }

        if (!selectedStars) {
            alert("Vui lòng chọn số sao.");
            return;
        }

        if (!reviewText.trim()) {
            alert("Vui lòng nhập nội dung đánh giá.");
            return;
        }

        const reviewData = {
            ma_danh_gia: '',
            ma_sach,
            ma_nguoi_dung,
            diem_danh_gia: selectedStars,
            binh_luan: reviewText.trim()
        };

        try {
            const result = await detailsService.addDanhgia(reviewData);
            alert(result.message || "Đánh giá đã được gửi!");

            setSelectedStars(0);
            setReviewText('');
            window.location.reload()
        } catch (error) {
            alert("Có lỗi xảy ra khi gửi đánh giá.");
            console.error(error);
        }
    };
    const handleIncrease = () => setQuantity(q => q + 1);
    const handleDecrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));
    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value);
        setQuantity(isNaN(val) || val < 1 ? 1 : val);
    };

    const handleAddToCart = async () => {
        if (!product) return;

        const ma_nguoi_dung = localStorage.getItem('ma_nguoi_dung');
        const isLoggedIn = ma_nguoi_dung && ma_nguoi_dung !== "null" && ma_nguoi_dung !== "undefined";

        if (isLoggedIn) {
            console.log('User ID:', ma_nguoi_dung);

            try {
                const res = await addToCart(ma_nguoi_dung, product.ma_sach, quantity);
                if (res.data.success) {
                    alert('Thêm vào giỏ hàng thành công (server)');
                } else {
                    alert('Lỗi thêm vào giỏ hàng');
                }
            } catch (error) {
                console.error(error);
                alert('Lỗi khi gọi API thêm giỏ hàng');
            }
        } else {
            const cartLocal = JSON.parse(localStorage.getItem('cart_local')) || [];

            const index = cartLocal.findIndex(item => item.ma_sach === product.ma_sach);

            if (index >= 0) {
                cartLocal[index].so_luong += quantity;
            } else {
                cartLocal.push({
                    ma_sach: product.ma_sach,
                    tieu_de: product.tieu_de,
                    anh: product.anh,
                    so_luong: quantity,
                    giacu: product.giacu,
                    giahientai: product.giahientai
                });
            }

            localStorage.setItem('cart_local', JSON.stringify(cartLocal));
            alert('Thêm vào giỏ hàng thành công (localStorage)');
        }
    };
    return (
        <>
            <Header />
            <div className={cx('detailsproduct-wrapper')}>
                <div className={cx("top-content")}>
                    <div className={cx('product-left')}>
                        <div className={cx('full-img')}>
                            <img src={`http://localhost:3000/images/${product?.ma_sach}/${selectedImage}`} alt="Ảnh to" />
                        </div>

                        <div className={cx('thumbnail')}>
                            {imageList.map((img, index) => (
                                <div
                                    key={index}
                                    className={cx('thumb-item', {
                                        active: selectedImage === img,
                                    })}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img
                                        src={`http://localhost:3000/images/${product.ma_sach}/${img}`}
                                        alt={`Ảnh ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>


                        <div className={cx('action-buttons')}>
                            <button onClick={handleAddToCart} className={cx('add-to-cart-btn')}><FaCartPlus size={16} /> Thêm vào giỏ hàng</button>
                            <div className={cx('quantity-action')}>
                                <button
                                    className={cx('quantity-btn', 'decrease')}
                                    onClick={handleDecrease}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    className={cx('quantity-input')}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <button
                                    className={cx('quantity-btn', 'increase')}
                                    onClick={handleIncrease}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className={cx("list-promotions")}>
                            <h3 style={{ marginTop: "10px" }}>Chính sách ưu đãi của DTBOOK</h3>
                            <p style={{ lineHeight: "40px", fontSize: "14px" }}><span style={{ fontWeight: "500" }}><FaTruck color="#c92127" /> Thời gian giao hàng: </span>Giao nhanh và uy tín</p>
                            <p style={{ lineHeight: "40px", fontSize: "14px" }}><span style={{ fontWeight: "500" }}><FaRecycle color="#c92127" /> Chính sách đổi trả: </span>Đổi trả miễn phí toàn quốc</p>
                            <p style={{ lineHeight: "40px", fontSize: "14px" }}><span style={{ fontWeight: "500" }}><FaStore color="#c92127" /> Chính sách khách sỉ: </span>Ưu đãi khi mua số lượng lớn</p>
                        </div>
                    </div>

                    <div className={cx('product-right')}>
                        <div className={cx('product-main')}>
                            <div className={cx('product-info')}>
                                <div className={cx("product-name")}>
                                    <h2>{product?.tieu_de}</h2>
                                </div>
                                <div className={cx('supplier-info')}>
                                    <p>Tác giả: {product?.ten_tac_gia}</p>
                                    <p>Nhà xuất bản: {product?.ten_nxb}</p>
                                    <div className={cx('rating-sold')}>
                                        <span>{"★★★★★".split("").map((star, index) => (
                                            <span key={index}>
                                                {index < Math.round(trungBinhSao) ? "★" : "☆"}
                                            </span>
                                        ))} ({thongke.tong} đánh giá)</span>
                                        <span>| Đã bán 10k+</span>
                                    </div>
                                </div>

                                <div className={cx('price-section')}>
                                    <p className={cx('current-price')}>{Number(product?.giahientai).toLocaleString("vi-VN")} đ</p>
                                    <p className={cx('stock-info')}>Số lượng tồn: {product?.so_luong_kho}</p>
                                </div>

                            </div>


                        </div>
                        <div className={cx('product-details')}>
                            <h2>Thông tin chi tiết</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Loại sách</td>
                                        <td>{product?.ten_the_loai}</td>
                                    </tr>
                                    <tr>
                                        <td>Tác giả</td>
                                        <td>{product?.ten_tac_gia}</td>
                                    </tr>
                                    <tr>
                                        <td>NXB</td>
                                        <td>{product?.ten_nxb}</td>
                                    </tr>
                                    <tr>
                                        <td>Năm XB</td>
                                        <td>
                                            {product?.nam_xuat_ban
                                                ? new Date(product.nam_xuat_ban).toLocaleDateString('vi-VN')
                                                : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ngôn Ngữ</td>
                                        <td>{product?.ngon_ngu}</td>
                                    </tr>
                                    <tr>
                                        <td>Số trang</td>
                                        <td>{product?.so_trang}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={cx('product-description')}>
                            <h2>Mô tả sản phẩm</h2>
                            <div
                                className={cx('description-content',{'read-more':isReadMore})}
                                dangerouslySetInnerHTML={{ __html: product?.mo_ta }}
                            />
                            <button onClick={ReadMore} className={cx('read-more-btn') }  >{isReadMore ? 'Thu gọn' : 'Xem thêm'}</button>
                        </div>



                    </div>

                </div>
                <div className={cx('product-reviews')}>
                    <h2>Đánh giá sản phẩm</h2>
                    <div className={cx('rating-summary')}>
                        <div className={cx('rating-stars')}>
                            <span>
                                {"★★★★★".split("").map((star, index) => (
                                    <span key={index}>
                                        {index < Math.round(trungBinhSao) ? "★" : "☆"}
                                    </span>
                                ))}
                            </span>
                            <span>{trungBinhSao}/5</span>
                        </div>

                        <div className={cx('rating-distribution')}>
                            {[5, 4, 3, 2, 1].map((sao) => {
                                const soDanhGia = parseInt(thongke[`sao_${sao}`] || 0);
                                const tong = parseInt(thongke.tong || 0);
                                const phanTram = tong > 0 ? Math.round((soDanhGia / tong) * 100) : 0;

                                return (
                                    <div className={cx('rating-bar')} key={sao}>
                                        <span>{sao} sao</span>
                                        <div className={cx('bar')}>
                                            <div
                                                className={cx('fill')}
                                                style={{ width: `${phanTram}%` }}
                                            ></div>
                                        </div>
                                        <span>{phanTram}%</span>
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    {ma_nguoi_dung ? (
                        <div className={cx('review-area')}>
                            <h3 className={cx('review-title')}>Viết đánh giá của bạn</h3>

                            <div className={cx('rating-input')}>
                                <span>Đánh giá của bạn:</span>
                                <div className={cx('star-rating')}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={cx('star')}
                                            onClick={() => handleStarClick(star)}
                                        >
                                            {selectedStars >= star ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={cx('review-form')}>
                                <textarea
                                    className={cx('review-text')}
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={5}
                                />

                                <div className={cx('form-actions')}>
                                    <button
                                        className={cx('submit-btn')}
                                        disabled={!selectedStars || !reviewText.trim()}
                                        onClick={handleSubmitReview}
                                    >
                                        Gửi đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={cx('review-notice')}>
                            <p>
                                Chỉ có thành viên mới có thể viết nhận xét. Vui lòng{' '}
                                <span><a href="/login">Đăng nhập</a></span> hoặc{' '}
                                <span><a href="/register">Đăng ký</a></span>.
                            </p>
                        </div>
                    )}

                    <div className={cx('review-sort')}>
                        <span className={cx('active')}>Đánh giá của khách hàng</span>
                    </div>

                    <div className={cx('review-list')}>
                        {reviews.length === 0 ? (
                            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                        ) : (
                            reviews.map((review, index) => (
                                <div key={index} className={cx('review-item')}>
                                    <div className={cx('review-header')}>
                                        <span className={cx('reviewer')}>
                                            {review.ho_ten}
                                        </span>
                                        <span className={cx('review-date')}>
                                            {new Date(review.ngay_danh_gia).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className={cx('review-rating')}>
                                        {'★'.repeat(review.diem_danh_gia) + '☆'.repeat(5 - review.diem_danh_gia)}
                                    </div>
                                    <div className={cx('review-content')}>
                                        <p>{review.binh_luan}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default DetailsProduct;