import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart, useToast } from '../context/AppContext';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, shipping, total, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    addToast('Order placed successfully! 🎉', 'success');
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Bag</h1>
          <span className="cart-count-label">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={56} strokeWidth={1} />
            <h2>Your bag is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/" className="cart-empty-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-body">
            <div className="cart-items">
              {items.map(item => {
                const p = item.product;
                const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
                return (
                  <div key={item.key} className="cart-item">
                    <Link to={`/product/${p.id}`} className="cart-item-img">
                      <img src={p.image} alt={p.name} />
                    </Link>
                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <div>
                          <p className="cart-item-brand">{p.brand}</p>
                          <Link to={`/product/${p.id}`} className="cart-item-name">{p.name}</Link>
                          <div className="cart-item-meta">
                            <span className="cart-meta-chip">{item.color}</span>
                            <span className="cart-meta-chip">Size: {item.size}</span>
                          </div>
                        </div>
                        <button className="cart-remove" onClick={() => { removeItem(item.key); addToast('Item removed', 'info'); }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="cart-item-bottom">
                        <div className="cart-qty-ctrl">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} disabled={item.qty <= 1}><Minus size={13} /></button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)}><Plus size={13} /></button>
                        </div>
                        <div className="cart-item-price-col">
                          <span className="cart-item-price">₹{(p.price * item.qty).toLocaleString('en-IN')}</span>
                          {discount && <span className="cart-item-discount">{discount}% off</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-coupon">
                <Tag size={15} />
                <input placeholder="Enter coupon code" />
                <button>Apply</button>
              </div>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free-ship' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="ship-hint">Add ₹{(2999 - subtotal).toLocaleString('en-IN')} more for free shipping</p>
                )}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/" className="continue-shopping">← Continue Shopping</Link>
              <div className="summary-assurance">
                <p>🔒 Secure checkout · 30-day returns</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
