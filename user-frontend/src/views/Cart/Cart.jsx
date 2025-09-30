import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaGift, FaCheck } from "react-icons/fa"
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom'
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartDetails,
} from "../../services/cart";
import styles from "./Cart.module.scss"
import classnames from "classnames/bind";
const cx = classnames.bind(styles)
const CART_LOCAL_KEY = "cart_local";

function setCartLocal(cart) {
    console.log("Lưu giỏ hàng:", cart);
    localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(cart));
}

function getCartLocal() {
    const cartStr = localStorage.getItem(CART_LOCAL_KEY);
    console.log("Lấy giỏ hàng từ localStorage:", cartStr);
    try {
        return cartStr ? JSON.parse(cartStr) : [];
    } catch (e) {
        console.error("Lỗi parse JSON giỏ hàng:", e);
        return [];
    }
}



function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [maNguoiDung, setMaNguoiDung] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("ma_nguoi_dung");
        setMaNguoiDung(userId);

        if (userId) {
            getCartDetails(userId)
                .then((res) => {
                    setCartItems(res.data.data);
                })
                .catch((err) => {
                    console.error("Lấy giỏ hàng lỗi:", err);
                    setCartItems([]);
                });
        } else {
            setCartItems(getCartLocal());
        }
    }, []);

    useEffect(() => {
        if (!maNguoiDung && cartItems.length > 0) {
            setCartLocal(cartItems);
        }
    }, [cartItems, maNguoiDung]);


    const handleIncQuantity = (index) => {
        const newCart = [...cartItems];
        newCart[index].so_luong = (parseInt(newCart[index].so_luong) || 1) + 1;

        if (maNguoiDung) {
            updateQuantity(
                newCart[index].ma_gio_hang,
                newCart[index].ma_sach,
                newCart[index].so_luong
            )
                .then(() => setCartItems(newCart))
                .catch(console.error);
        } else {
            setCartItems(newCart);
            const cartLocal = JSON.parse(localStorage.getItem('cart_local')) || [];
            const updatedCartLocal = cartLocal.map(item =>
                item.ma_sach === newCart[index].ma_sach
                    ? { ...item, so_luong: newCart[index].so_luong }
                    : item
            );
            localStorage.setItem('cart_local', JSON.stringify(updatedCartLocal));
        }
    };

    const handleDecQuantity = (index) => {
        const newCart = [...cartItems];
        newCart[index].so_luong = Math.max(1, (parseInt(newCart[index].so_luong) || 1) - 1);

        if (maNguoiDung) {
            updateQuantity(
                newCart[index].ma_gio_hang,
                newCart[index].ma_sach,
                newCart[index].so_luong
            )
                .then(() => setCartItems(newCart))
                .catch(console.error);
        } else {
            setCartItems(newCart);
            const cartLocal = JSON.parse(localStorage.getItem('cart_local')) || [];
            const updatedCartLocal = cartLocal.map(item =>
                item.ma_sach === newCart[index].ma_sach
                    ? { ...item, so_luong: newCart[index].so_luong }
                    : item
            );
            localStorage.setItem('cart_local', JSON.stringify(updatedCartLocal));
        }
    };


    const handleRemoveItem = (ma_gio_hang, ma_sach) => {
        if (maNguoiDung) {
            removeFromCart(ma_gio_hang, ma_sach)
                .then(() => {
                    const newCart = cartItems.filter(item =>
                        !(item.ma_gio_hang === ma_gio_hang && item.ma_sach === ma_sach)
                    );
                    setCartItems(newCart);
                })
                .catch(console.error);
        } else {
            const cartLocal = JSON.parse(localStorage.getItem('cart_local')) || [];
            const newCartLocal = cartLocal.filter(item => item.ma_sach !== ma_sach);
            localStorage.setItem('cart_local', JSON.stringify(newCartLocal));
            setCartItems(newCartLocal);
        }
    };

    const tongTien = cartItems?.reduce((total, item) => {
        const donGia = parseInt(item.giahientai) || 0;
        const soLuong = parseInt(item.so_luong) || 1;
        return total + donGia * soLuong;
    }, 0);

    return (
        <>
            <Header />
            <div className={cx('wrapper-cart')}>
                <div className={cx('cart-title')}>
                    <h1>GIỎ HÀNG</h1>
                    <span> ({cartItems?.length} sản phẩm)</span>
                </div>
                <div className={cx('cart-content')}>
                    <div className={cx('cart-content-left')}>
                        {/* <div className={cx('content-left-checkall')}>
                            <div className={cx('check-all')} style={{ width: '5%' }}>
                                <input type="checkbox" name="" id="" width={15} height={15} style={{ margin: '7px' }} />
                            </div>
                            <div style={{ width: "65%" }}>
                                <span>(Chọn tất cả <span>{cartItems?.length}</span> sản phẩm)</span>
                            </div>
                            <div style={{ width: '10%' }}><span>Số lượng</span></div>
                            <div style={{ width: '20%' }}><span>Thành tiền</span></div>
                        </div> */}
                        <div className={cx('content-left-listiem')}>
                            {cartItems.length > 0 ? (
                                cartItems.map((item, index) => {
                                    const firstImage = item.anh ? item.anh.split('|')[0] : '';

                                    return (
                                        <div key={`${item.ma_gio_hang}-${item.ma_sach}`} className={cx('cart-item')}>

                                            <div style={{ width: "65%", display: 'flex' }}>
                                                <div className={cx('cart-item-img')}>
                                                    <img
                                                        src={`http://localhost:3000/images/${item.ma_sach}/${firstImage}`}
                                                        alt={item.tieu_de || "Ảnh sản phẩm"}
                                                    />
                                                </div>
                                                <div className={cx('cart-item-nameprice')}>
                                                    <div className={cx('cart-item-name')}>
                                                        <span>{item?.tieu_de || "Tên sản phẩm"}</span>
                                                    </div>
                                                    <div className={cx('cart-item-price')}>
                                                        <span className={cx('current-price')}>{Number(item.giahientai)?.toLocaleString('vi-VN') || "0 đ"}</span>
                                                        {item?.giacu && (
                                                            <span className={cx('old-price')}>{Number(item.giacu).toLocaleString('vi-VN')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ width: '10%', display: "flex", alignItems: "center" }}>
                                                <div className={cx('wrap-btn')}>
                                                    <button className={cx('dec-btn')} onClick={() => handleDecQuantity(index)}>-</button>
                                                    <input
                                                        className={cx('quantity-input')}
                                                        type="text"
                                                        readOnly
                                                        value={item.so_luong || 1}
                                                    />
                                                    <button className={cx('inc-btn')} onClick={() => handleIncQuantity(index)}>+</button>
                                                </div>
                                            </div>

                                            <div style={{ width: '15%', display: "flex", alignItems: 'center', marginLeft: "10px" }}>
                                                <span style={{ color: "#c9212a", fontWeight: "600", fontSize: "18px" }}>
                                                    {(item.so_luong * item.giahientai).toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>

                                            <div
                                                className={cx('trash-icon')}
                                                onClick={() => handleRemoveItem(item.ma_gio_hang, item.ma_sach)}
                                                style={{ width: "5%", display: "flex", alignItems: "center", cursor: "pointer" }}
                                            >
                                                <FaRegTrashAlt />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p style={{ textAlign: "center" }}>Giỏ hàng trống</p>
                            )}


                        </div>
                    </div>
                    <div className={cx('cart-content-right')}>
                        <div className={cx('promotion')}>
                            <div className={cx('promotion-title')}>
                                <span className={cx('title-left')} style={{ color: "#2f80ed" }}><FaGift size={16}></FaGift> KHUYẾN MÃI</span>
                                <span className={cx('title-right')}>
                                    <span style={{
                                        color: '#2f80ed',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        Xem thêm <MdKeyboardArrowRight size={24} />
                                    </span>
                                </span>
                            </div>
                            <div className={cx('promotion-content')}>
                                <br />
                                <h4>Mã giảm giá 40k - Toàn sàn</h4><br />
                                <p style={{ marginBottom: "5px" }}><FaCheck style={{ color: "#2f80ed" }}></FaCheck> Đơn hàng từ 499K - Miễn phí ship</p>
                                <p style={{ marginBottom: "5px" }}><FaCheck style={{ color: "#2f80ed" }}></FaCheck> Chính sách ưu đãi áp dụng từ 28/4 - 31/5 năm 2025</p>
                                <div className={cx('promotion-check')}>
                                    <input type="text" placeholder="Nhập mã giảm giá của bạn" />
                                    <button>Nhập mã</button>
                                </div>
                            </div>

                        </div>
                        <div className={cx('gift')}>
                            <span className={cx('title-left')}><FaGift color="#2f80ed"></FaGift> <span style={{ fontWeight: "600" }}>NHẬN QUÀ</span> (0 / 1) </span>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }} className={cx('title-right')}>Chọn quà <MdKeyboardArrowRight size={26} /></span>
                        </div>
                        <div className={cx('payment')}>
                            <div className={cx('payment-title')}>
                                <span className={cx('title-left')}>Thành tiền</span>
                                <span className={cx('title-right')}>{tongTien.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className={cx('payment-content')}>
                                <div style={{ position: "relative", width: "100%", height: "60px", marginTop: "10px" }}>
                                    <span
                                        style={{ fontWeight: "600", fontSize: "20px" }}
                                        className={cx('title-left')}
                                    >
                                        TỔNG SỐ TIỀN (GỒM VAT)
                                    </span>
                                    <span
                                        style={{ color: "#c92127", fontSize: "22px", fontWeight: "600" }}
                                        className={cx('title-right')}
                                    >
                                        {tongTien.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <Link to="/payment" style={{ color: "white" }}><button>Thanh toán</button></Link>
                                <span style={{ fontSize: "13px", color: "red" }}>
                                    (Giảm giá trên web chỉ áp dụng cho bán lẻ)
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Cart;