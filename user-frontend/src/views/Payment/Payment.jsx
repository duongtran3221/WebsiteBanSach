import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from 'react-select';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductItem from "../../components/ProducItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination";
import sachService from "../../services/homePage";
import {
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartDetails,
} from "../../services/cart";
import { addOrder } from "../../services/payment"
import styles from "./Payment.module.scss"
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
function PaymentPage() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [ghichu, setGhichu] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [address, setAddress] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('cod');


    const [cartItems, setCartItems] = useState([]);
    const thanhTien = cartItems.reduce((sum, item) => sum + (item.so_luong * item.giahientai), 0);
    const phiVanChuyen = 32000;
    const tongTien = thanhTien + phiVanChuyen;
    const [maNguoiDung, setMaNguoiDung] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const handleCheckout = async () => {
        if (!maNguoiDung) {
            alert("Vui lòng đăng nhập để thanh toán!");
            return;
        }

        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        const overstock = cartItems.find(item => item.so_luong > item.so_luong_kho);
        if (overstock) {
            alert(
                `Sản phẩm "${overstock.tieu_de}" chỉ còn ${overstock.so_luong_kho} bản, bạn đã chọn ${overstock.so_luong}!`
            );
            return;
        }

        if (!phone.trim()) {
            alert('Vui lòng nhập số điện thoại để giao hàng');
            return;
        }
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone.trim())) {
            alert('Số điện thoại phải đúng 10 chữ số');
            return;
        }
        if (!address.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }
        if (!selectedProvince) {
            alert('Vui lòng chọn tỉnh/thành phố');
            return;
        }
        if (!selectedDistrict) {
            alert('Vui lòng chọn quận/huyện');
            return;
        }
        if (!selectedWard) {
            alert('Vui lòng chọn phường/xã');
            return;
        }

        if (!selectedMethod) {
            alert('Vui lòng chọn hình thức thanh toán');
            return;
        }

        const orderDetails = cartItems.map(item => ({
            ma_sach: item.ma_sach,
            so_luong: item.so_luong,
            don_gia: item.giahientai,
            giam_gia: item.giam_gia || 0,
        }));

        const thanhTien = orderDetails.reduce(
            (sum, item) => sum + item.so_luong * (item.don_gia - item.giam_gia),
            0
        );

        const phiVanChuyen = 32000;
        const orderData = {
            ma_don_hang: `DH${Date.now()}`,
            ma_nguoi_dung: maNguoiDung,
            so_dien_thoai: phone,
            dia_chi_giao: address,
            thanh_pho_giao: selectedProvince?.label || '',
            quan_huyen_giao: selectedDistrict?.label || '',
            phuong_xa_giao: selectedWard?.label || '',
            quoc_gia_giao: "Việt Nam",
            phi_giao_hang: phiVanChuyen,
            tong_tien: thanhTien + phiVanChuyen,
            trang_thai_don: "cho_xu_ly",
            hinh_thuc_thanh_toan: selectedMethod,
            trang_thai_thanh_toan: "cho_thanh_toan",
            ghi_chu: ghichu,
            chi_tiet: orderDetails,
        };

        try {
            const res = await addOrder(orderData);
            if (res.data.success) {
                alert("Đặt hàng thành công!");
                localStorage.removeItem("cart");
                setCartItems([]);
            } else {
                alert("Đặt hàng thất bại: " + res.data.message);
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("Có lỗi xảy ra khi đặt hàng.");
        }
    };


    useEffect(() => {
        if (userInfo && userInfo.so_dien_thoai) {
            setPhone(userInfo.so_dien_thoai);
        }
    }, [userInfo]);

    useEffect(() => {
        const userId = localStorage.getItem("ma_nguoi_dung");
        setMaNguoiDung(userId);

        if (userId) {
            getCartDetails(userId)
                .then((res) => {
                    setCartItems(res.data.data);
                })
                .catch((err) => {
                    console.error("Lỗi lấy giỏ hàng:", err);
                    setCartItems([]);
                });

            axios.get(`http://localhost:3000/nguoidung/getById/${userId}`)
                .then((res) => {
                    setUserInfo(res.data.data);
                })
                .catch((err) => {
                    console.error("Lỗi lấy thông tin người dùng:", err);
                    setUserInfo(null);
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

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/p/');
                if (!res.ok) throw new Error('Không thể kết nối API tỉnh/thành');
                const data = await res.json();
                setProvinces(data.map(p => ({ value: p.code, label: p.name })));
            } catch (error) {
                console.error("Lỗi khi fetch thành phố:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`);
                    if (!res.ok) throw new Error('Không thể kết nối API quận/huyện');
                    const data = await res.json();
                    const districtOptions = data.districts.map(d => ({
                        value: d.code,
                        label: d.name,
                    }));
                    setDistricts(districtOptions);
                    setSelectedDistrict(null);
                    setSelectedWard(null);
                    setWards([]);
                } catch (error) {
                    console.error("Lỗi khi fetch quận/huyện:", error);
                }
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                try {
                    const res = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`);
                    if (!res.ok) throw new Error('Không thể kết nối API phường/xã');
                    const data = await res.json();
                    const wardOptions = data.wards.map(w => ({
                        value: w.code,
                        label: w.name,
                    }));
                    setWards(wardOptions);
                    setSelectedWard(null);
                } catch (error) {
                    console.error("Lỗi khi fetch phường/xã:", error);
                }
            }
        };
        fetchWards();
    }, [selectedDistrict]);


    return (

        <>
            <Header />
            <div className={cx('payment-wrapper')}>
                <div className={cx('payment-info')}>
                    <div className={cx('delivery-address')}>
                        <h2 className={cx('section-title')}>ĐỊA CHỈ GIAO HÀNG</h2>

                        <div className={cx('form-group',)}>
                            <label>Họ và tên người nhận</label>
                            <input
                                type="text"
                                placeholder={userInfo?.ho + " " + userInfo?.ten}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {/* {!name && <span className={cx('error-message')}>Thông tin này không thể để trống</span>} */}
                        </div>

                        <div className={cx('form-group')}>
                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            {!phone && <span className={cx('error-message')}>Thông tin này không thể để trống</span>}

                        </div>

                        <div className={cx('form-group')}>
                            <label>Tỉnh/Thành Phố</label>
                            <Select
                                options={provinces}
                                value={selectedProvince}
                                onChange={setSelectedProvince}
                                placeholder="Chọn hoặc tìm tỉnh/thành phố..."
                                isSearchable
                                noOptionsMessage={() => "Không tìm thấy"}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Quận/Huyện</label>
                            <Select
                                options={districts}
                                value={selectedDistrict}
                                onChange={setSelectedDistrict}
                                placeholder={selectedProvince ? "Chọn hoặc tìm quận/huyện..." : "Vui lòng chọn tỉnh trước"}
                                isSearchable
                                isDisabled={!selectedProvince}
                                noOptionsMessage={() => "Không tìm thấy"}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Phường/Xã</label>
                            <Select
                                options={wards}
                                value={selectedWard}
                                onChange={setSelectedWard}
                                placeholder={selectedDistrict ? "Chọn hoặc tìm phường/xã..." : "Vui lòng chọn quận trước"}
                                isSearchable
                                isDisabled={!selectedDistrict}
                                noOptionsMessage={() => "Không tìm thấy"}
                            />
                        </div>

                        <div className={cx('form-group', { 'has-error': !address })}>
                            <label>Địa chỉ nhận hàng</label>
                            <input
                                type="text"
                                placeholder="Nhập địa chỉ nhận hàng"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {!address && <span className={cx('error-message')}>Thông tin này không thể để trống</span>}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Ghi chú</label>
                            <input
                                type="text"
                                placeholder="Nhập ghi chú"
                                value={ghichu}
                                onChange={(e) => setGhichu(e.target.value)}
                            />
                            {/* {!ghichu && <span className={cx('error-message')}>Thông tin này không thể để trống</span>} */}
                        </div>
                    </div>
                </div>
                <div className={cx("payment-bankmode")}>
                    <div className={cx("payment-methods")}>
                        <h2 className={cx("section-title")}>PHƯƠNG THỨC THANH TOÁN</h2>

                        <div className={cx("method-list")}>

                            <div className={cx("method-item")}>
                                <div className={cx("method-header")}>
                                    <input
                                        type="radio"
                                        id="momo"
                                        name="paymentMethod"
                                        value="momo"
                                        checked={selectedMethod === 'momo'}
                                        onChange={() => setSelectedMethod('momo')}
                                    />
                                    <label htmlFor="momo">Ví Momo</label>
                                    <span className={cx("detail-toggle")}>Chi tiết</span>

                                </div>
                                {selectedMethod === 'momo' && (
                                    <div className={cx("method-detail")}>
                                        <p>Số tài khoản: <strong>098765432123</strong></p>
                                        <p>Tên tài khoản: <strong>Trần Thái Dương</strong></p>
                                        <p>Nội dung chuyển khoản: <strong>DTBOOK Vtxk</strong></p>
                                    </div>
                                )}
                            </div>

                            <div className={cx("method-item")}>
                                <div className={cx("method-header")}>
                                    <input
                                        type="radio"
                                        id="banktransfer"
                                        name="paymentMethod"
                                        value="banktransfer"
                                        checked={selectedMethod === 'banktransfer'}
                                        onChange={() => setSelectedMethod('banktransfer')}
                                    />
                                    <label htmlFor="banktransfer">Banktransfer / Internet Banking</label>
                                    <span className={cx("detail-toggle")}>Chi tiết</span>

                                </div>
                                {selectedMethod === 'banktransfer' && (
                                    <div className={cx("method-detail")}>
                                        <p>Số tài khoản: <strong>098765432123</strong></p>
                                        <p>Tên tài khoản: <strong>Trần Thái Dương</strong></p>
                                        <p>Nội dung chuyển khoản: <strong>DTBOOK Vtxk</strong></p>
                                    </div>
                                )}
                            </div>

                            <div className={cx("method-item")}>
                                <div className={cx("method-header")}>
                                    <input
                                        type="radio"
                                        id="cod"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={selectedMethod === 'cod'}
                                        onChange={() => setSelectedMethod('cod')}
                                    />
                                    <label htmlFor="cod">Thanh toán bằng tiền mặt khi nhận hàng</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('payment-listitem')}>
                    <h2 className={cx("section-title")}>KIỂM TRA LẠI ĐƠN HÀNG</h2>

                    {cartItems.length > 0 ? (
                        cartItems?.map((item, index) => {
                            const firstImage = item.anh ? item.anh.split('|')[0] : ''
                            return (
                                <div key={`${item?.ma_gio_hang}-${item?.ma_sach}`} className={cx('cart-item')}>

                                    <div style={{ width: "65%", display: 'flex' }}>
                                        <div className={cx('cart-item-img')}>
                                            <img src={`http://localhost:3000/images/${item?.ma_sach}/${firstImage}`} alt={item?.tieu_de || "Ảnh sản phẩm"} />
                                        </div>
                                        <div className={cx('cart-item-nameprice')}>
                                            <div className={cx('cart-item-name')}>
                                                <span>{item?.tieu_de || "Tên sản phẩm"}</span>
                                            </div>
                                            <div className={cx('cart-item-price')}>
                                                <span className={cx('current-price')}>
                                                    {item?.giahientai ? Number(item.giahientai).toLocaleString('vi-VN') + ' đ' : "0 đ"}
                                                </span>
                                                <span className={cx('old-price')}>
                                                    {item?.giacu ? Number(item.giacu).toLocaleString('vi-VN') + ' đ' : ""}
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                    <div style={{ width: '10%', display: "flex", alignItems: "center" }}>
                                        <div className={cx('wrap-btn')}>
                                            <span>{item?.so_luong}</span>
                                        </div>
                                    </div>

                                    <div style={{ width: '15%', display: "flex", alignItems: 'center', marginLeft: "10px" }}>
                                        <span style={{ color: "#c9212a", fontWeight: "600", fontSize: "18px" }}>
                                            {((item?.so_luong ?? 0) * (item?.giahientai ?? 0)).toLocaleString('vi-VN')} đ
                                        </span>

                                    </div>

                                </div>
                            );
                        }
                        )) : (
                        <p style={{ textAlign: "center" }}>Giỏ hàng trống</p>
                    )}
                </div>
                <div className={cx("payment-actions")}>
                    <div className={cx("payment-summary")}>
                        <div className={cx("summary-row")}>
                            <span>Thành tiền</span>
                            <span>{thanhTien?.toLocaleString('vi-VN')} đ</span>
                        </div>

                        <div className={cx("summary-row")}>
                            <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
                            <span>{phiVanChuyen?.toLocaleString('vi-VN')} đ</span>
                        </div>

                        <div className={cx("summary-row", "total-row")}>
                            <strong>Tổng số Tiền (gồm VAT)</strong>
                            <strong>{tongTien?.toLocaleString('vi-VN')} đ</strong>
                        </div>


                        <div className={cx("terms-agreement")}>
                            <p>
                                Bằng việc tiến hành Mua hàng, Bạn đã đồng ý với
                                <br />
                                <strong>Điều khoản & Điều kiện của Fahasa.com</strong>
                            </p>
                        </div>

                        <button className={cx("checkout-btn")} onClick={handleCheckout}>
                            ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default PaymentPage;