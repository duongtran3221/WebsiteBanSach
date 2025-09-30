import { useNavigate } from 'react-router-dom';
import classnames from 'classnames/bind';
import styles from '../ProducItem/ProductItem.module.scss';

const cx = classnames.bind(styles);

function ProductItem({ product }) {
  const navigate = useNavigate();

  const {
    ma_sach,
    anh,
    tieu_de,
    giahientai,
    giacu,
    tag,
    soldCount,
    status,
    rating
  } = product;

  const firstImage = anh ? anh.split('|')[0] : '';

  const formatPrice = (giahientai) => {
    return giahientai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' đ';
  };

  const discount = giacu && giahientai ? Math.round(((giacu - giahientai) / giacu) * 100) : 0;

  const renderStatusBadge = () => {
    if (status === 'almostSoldOut') {
      return <div className={cx('status-badge', 'almost-sold-out')}>Sắp hết</div>;
    }
    if (soldCount) {
      return <div className={cx('status-badge', 'sold-count')}>Đã bán {soldCount}</div>;
    }
    return null;
  };

  const renderBadge = () => {
    switch (tag) {
      case 'Xu hướng':
        return <div className={cx('badge', 'trend')}>Xu hướng</div>;
      case 'Mới':
        return <div className={cx('badge', 'new')}>Mới</div>;
      case 'Bán chạy':
        return <div className={cx('badge', 'bestseller')}>Bán chạy</div>;
      default:
        return null;
    }
  };

  const renderRating = () => {
    if (!rating) return null;

    return (
      <div className={cx('rating')}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={cx('star', { active: i < rating })}>★</span>
        ))}
        <span className={cx('review-count')}>(0)</span>
      </div>
    );
  };

  const handleClick = () => {
    navigate(`/details/${ma_sach}`);
     window.scrollTo({ top: 0});
  };

  return (
    <div className={cx('product-item')} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={cx('image-container')}>
        <img
          src={`http://localhost:3000/images/${ma_sach}/${firstImage}`}
          alt={tieu_de}
          className={cx('product-image')}
        />
        {renderBadge()}
        {product.specialLabel && (
          <div className={cx('special-label')}>{product.specialLabel}</div>
        )}
      </div>

      <div className={cx('product-info')}>
        <h3 className={cx('product-title')}>{tieu_de}</h3>

        <div className={cx('price-container')}>
          <span className={cx('current-price')}>{Number(giahientai)?.toLocaleString("vi-VN")} đ</span>
          {discount > 0 && (
            <span className={cx('discount-badge')}>-{discount}%</span>
          )}
        </div>

        {giacu && (
          <div className={cx('original-price')}>{Number(giacu)?.toLocaleString("vi-VN")} đ</div>
        )}

        {renderRating()}

        <div className={cx('status-container')}>
          {renderStatusBadge()}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
