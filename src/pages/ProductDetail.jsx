import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ChevronLeft, Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { ALL_PRODUCTS, PRODUCTS, CATEGORIES } from '../data/products';
import { useCart, useToast } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import SizeGuideModal from '../components/SizeGuideModal';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const product = ALL_PRODUCTS.find(p => p.id === id);
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImg,     setActiveImg]     = useState(0);
  const [liked,         setLiked]         = useState(false);
  const [added,         setAdded]         = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) return (
    <div className="container pd-not-found">
      <p>Product not found.</p>
      <button className="tag" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );

  const cat = CATEGORIES.find(c => c.id === product.category);
  const related = PRODUCTS[product.category]?.filter(p => p.id !== product.id).slice(0, 4) || [];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    if (!selectedSize)  { addToast('Please select a size', 'error'); return; }
    if (!selectedColor) { addToast('Please select a color', 'error'); return; }
    addItem(product, selectedSize, selectedColor);
    addToast(`${product.name} added to cart!`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pd-page">
      {sizeGuideOpen && (
        <SizeGuideModal
          onClose={() => setSizeGuideOpen(false)}
          onSelectSize={(size) => setSelectedSize(size)}
          productSizes={product.sizes}
        />
      )}
      <div className="container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> /
          <Link to={`/category/${product.category}`}>{cat?.label}</Link> /
          <span>{product.name}</span>
        </div>

        <div className="pd-grid">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-image">
              <img src={product.images[activeImg] || product.image} alt={product.name} />
              {discount && <span className="pd-discount-badge">-{discount}%</span>}
              <button className={`pd-like-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(v => !v)}>
                <Heart size={18} fill={liked ? '#c0392b' : 'none'} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <button key={i} className={`pd-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-brand">{product.brand}</div>
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-rating-row">
              <div className="pd-stars">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= Math.round(product.rating) ? '#c07a3a' : 'none'} color="#c07a3a" />
                ))}
              </div>
              <span className="pd-rating-val">{product.rating}</span>
              <span className="pd-reviews">({product.reviews} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && <span className="pd-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
              {discount && <span className="badge badge-sale">{discount}% off</span>}
            </div>

            <p className="pd-description">{product.description}</p>
            <p className="pd-material"><strong>Material:</strong> {product.material}</p>

            {/* Color */}
            <div className="pd-option-group">
              <label className="pd-option-label">Color {selectedColor && <span className="selected-val">— {selectedColor}</span>}</label>
              <div className="pd-colors">
                {product.colors.map(c => (
                  <button key={c} className={`pd-color-chip ${selectedColor === c ? 'active' : ''}`} onClick={() => setSelectedColor(c)}>
                    {c}
                    {selectedColor === c && <Check size={12} className="color-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pd-option-group">
              <label className="pd-option-label">Size {selectedSize && <span className="selected-val">— {selectedSize}</span>}</label>
              <div className="pd-sizes">
                {product.sizes.map(s => (
                  <button key={s} className={`pd-size-chip ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
              <button className="size-guide-link" onClick={() => setSizeGuideOpen(true)}>Size guide →</button>
            </div>

            {/* CTA */}
            <div className="pd-cta">
              <button className={`pd-add-btn ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                {added ? <><Check size={18} /> Added to Cart!</> : <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
              <button className={`pd-wishlist-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(v => !v)}>
                <Heart size={18} fill={liked ? '#c0392b' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              {[
                { icon: <Truck size={15}/>,       text: 'Free shipping over ₹2,999' },
                { icon: <RotateCcw size={15}/>,   text: '30-day easy returns' },
                { icon: <Shield size={15}/>,      text: 'Secure payment' },
              ].map(t => (
                <div className="trust-item" key={t.text}>
                  {t.icon}<span>{t.text}</span>
                </div>
              ))}
            </div>

            {/* Stock */}
            <p className="pd-stock">
              {product.stock > 10 ? <><span className="stock-dot in" />In Stock ({product.stock} left)</> :
               product.stock > 0  ? <><span className="stock-dot low" />Only {product.stock} left!</> :
               <><span className="stock-dot out" />Out of Stock</>}
            </p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="pd-related-title">You May Also Like</h2>
            <div className="pd-related-grid">
              {related.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}