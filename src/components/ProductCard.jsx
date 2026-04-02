import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart, useToast } from '../context/AppContext';
import './ProductCard.css';

export default function ProductCard({ product, delay = 0 }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product, product.sizes[0], product.colors[0]);
    addToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdding(false), 600);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="product-card-image-wrap">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-card-img-fallback">
            <span>{product.name[0]}</span>
          </div>
        )}

        {/* Badges */}
        <div className="product-card-badges">
          {product.badge === 'bestseller' && <span className="badge badge-premium">Bestseller</span>}
          {product.badge === 'new'        && <span className="badge badge-new">New</span>}
          {product.badge === 'sale'       && <span className="badge badge-sale">Sale {discount && `-${discount}%`}</span>}
          {product.badge === 'hot'        && <span className="badge badge-hot">Hot</span>}
          {product.badge === 'premium'    && <span className="badge badge-premium">Premium</span>}
        </div>

        {/* Like button */}
        <button
          className={`product-card-like ${liked ? 'liked' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          aria-label="Wishlist"
        >
          <Heart size={15} fill={liked ? '#c0392b' : 'none'} />
        </button>

        {/* Quick add overlay */}
        <div className="product-card-overlay">
          <button
            className={`quick-add-btn ${adding ? 'adding' : ''}`}
            onClick={handleAddToCart}
          >
            <ShoppingBag size={15} />
            {adding ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-meta">
          <div className="product-card-rating">
            <Star size={11} fill="#c07a3a" color="#c07a3a" />
            <span>{product.rating}</span>
            <span className="review-count">({product.reviews})</span>
          </div>
          <div className="product-card-colors">
            {product.colors.slice(0, 4).map(c => (
              <span key={c} className="color-dot" title={c} />
            ))}
            {product.colors.length > 4 && <span className="color-more">+{product.colors.length - 4}</span>}
          </div>
        </div>
        <div className="product-card-price-row">
          <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="product-card-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <div className="product-card-sizes">
          {product.sizes.slice(0, 5).map(s => (
            <span key={s} className="size-chip">{s}</span>
          ))}
          {product.sizes.length > 5 && <span className="size-chip muted">+{product.sizes.length - 5}</span>}
        </div>
      </div>
    </Link>
  );
}
