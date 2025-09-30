import React from "react";
import logo from '../../assets/images/logo.webp';
import logo2 from '../../assets/images/logobocongthuong.webp';
import tf1 from '../../assets/images/transfer1.webp';
import tf2 from '../../assets/images/transfer2.webp';
import tf3 from '../../assets/images/transfer3.webp';
import { FaYoutube ,FaFacebook,FaInstagram ,FaTumblr ,FaTwitter ,FaLocationArrow ,FaMailBulk ,FaPhone } from "react-icons/fa";
import styles from './Footer.module.scss'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles);
const Footer = () => {
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('content-left')}>
                        <div className={cx('f-logo')}>
                            <img src={logo} alt="" />
                        </div>
                        <div className={cx('f-addressfooter')}>
                            Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCMCông Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam
                        </div>
                        <div className={cx('f-addressfooter')}>
                            Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.
                        </div>
                        <div className={cx('f-logo')} >
                            <img src={logo2} alt="" style={{width:'120px',height:'30px'}}/>
                        </div>
                        <div className={cx('f-logo')} >
                            <FaFacebook size={30}></FaFacebook>
                            <FaInstagram size={30}></FaInstagram>
                            <FaYoutube size={30}></FaYoutube>
                            <FaTwitter size={30}></FaTwitter>
                            <FaTumblr size={30}></FaTumblr>
                        </div>
                    </div>
                    <div className={cx('content-right')}>
                        <div className={cx('top-right')}>
                            <div className={cx('top-right-item')}>
                                <div className={cx('top-right-title')}>
                                    <h3>Dịch vụ</h3>
                                </div>
                                <div className={cx('top-right-content')}>
                                    <ul>
                                        <li>Điều khoản sử dụng</li>
                                        <li>Chính sách bảo mật thông tin cá nhân</li>
                                        <li>Chính sách bảo mật thanh toán</li>
                                        <li>Giới thiệu DTBOOK</li>
                                        <li>Hệ thống trung tâm - nhà sách</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={cx('top-right-item')}>
                                <div className={cx('top-right-title')}>
                                    <h3>Hỗ trợ</h3>
                                </div>
                                <div className={cx('top-right-content')}>
                                    <ul>
                                        <li>Chính sách bồi - trả - hoàn tiền</li>
                                        <li>Chính sách bảo hành - bồi hoàn</li>
                                        <li>Chính sách vận chuyển</li>
                                        <li>Chính sách khách sỉ</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={cx('top-right-item')}>
                                <div className={cx('top-right-title')}>
                                    <h3>Tài khoản của tôi</h3>
                                </div>
                                <div className={cx('top-right-content')}>
                                    <ul>
                                        <li>Đăng nhập - Tạo mới tài khoản</li>
                                        <li>Thay đổi địa chỉ khách hành</li>
                                        <li>Địa chỉ tài khoản</li>
                                        <li>Lịch sử mua hàng</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={cx('bot-right')}>
                            <h3>Liên hệ</h3>
                            <div className= {cx('list-contact')}>
                                <div>
                                    <FaLocationArrow></FaLocationArrow> 60-62 Lê Lợi, Q.1, TP. HCM
                                </div>
                                <div>
                                    <FaMailBulk></FaMailBulk> cskh@fahasa.com.vn
                                </div>
                                <div>
                                    <FaPhone></FaPhone> 1900636467
                                </div>
                            </div>
                            <div className= {cx('list-img-transfer')}>
                                <div>
                                    <img src={tf1} alt="" />
                                </div>
                                <div>
                                    <img src={tf2} alt="" />
                                </div>
                                <div>
                                    <img src={tf3} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;