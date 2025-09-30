import React from "react";
import styles from '../MenuIcon/IconMenu.module.scss'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles);

function IconMenu({ src, text, linkto }) {
    return (
        <div className={cx("icon-text")}>
                <div className={cx('img-icon')}>
                    <a href={linkto}>
                        <img src={src} alt="imgicon" />
                    </a>
                </div>
                <div className={cx("text")}><span>{text}</span> </div>
        </div>
    )
}

export default IconMenu;