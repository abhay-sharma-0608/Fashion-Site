import { useState } from 'react';
import { Search, MapPin, Truck, CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AppContext';
import './TrackOrder.css';

const STATUS_CONFIG = {
  placed:     { icon: <Clock size={20}/>,       color: 'var(--text-muted)',  label: 'Order Placed', bg: 'var(--bg-secondary)' },
  processing: { icon: <Package size={20}/>,     color: 'var(--warning)',     label: 'Processing',   bg: 'var(--warning-bg)' },
  shipped:    { icon: <Truck size={20}/>,        color: 'var(--info)',        label: 'Shipped',      bg: 'var(--info-bg)' },
  delivered:  { icon: <CheckCircle size={20}/>, color: 'var(--success)',     label: 'Delivered',    bg: 'var(--success-bg)' },
  cancelled:  { icon: <XCircle size={20}/>,     color: 'var(--error)',       label: 'Cancelled',    bg: 'var(--error-bg)' },
};

const TIMELINE = [
  { key: 'placed',     label: 'Order Placed',  desc: 'We received your order.' },
  { key: 'processing', label: 'Processing',    desc: 'Your order is being packed.' },
  { key: 'shipped',    label: 'Shipped',       desc: 'On the way to your address.' },
  { key: 'delivered',  label: 'Delivered',     desc: 'Package delivered successfully.' },
];
const STEP_MAP = { placed: 0, processing: 1, shipped: 2, delivered: 3 };

export default function TrackOrder() {
  const [query,    setQuery]    = useState('');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    if (!q) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      if (isAuthenticated) {
        // Search in user's own orders
        const data = await ordersAPI.getMyOrders({ limit: 100 });
        const found = data.orders.find(o => o.orderId.toUpperCase() === q);
        if (found) { setResult(found); }
        else { setNotFound(true); }
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const cfg  = result ? STATUS_CONFIG[result.status] : null;
  const step = result ? (STEP_MAP[result.status] ?? -1) : -1;

  return (
    <div className="track-page">
      <div className="container">
        <div className="track-header">
          <h1 className="track-title">Track Your Order</h1>
          <p className="track-sub">Enter your Order ID to get real-time updates on your shipment.</p>
        </div>

        <form className="track-form" onSubmit={handleSearch}>
          <div className="track-input-wrap">
            <Search size={18} className="track-search-icon"/>
            <input
              className="track-input"
              placeholder="e.g. DRP-20240410-0001"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="track-btn" disabled={loading}>
            {loading ? 'Searching…' : 'Track Order'}
          </button>
        </form>

        {!isAuthenticated && (
          <p className="track-login-hint">
            Please <a href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>login</a> to track your orders.
          </p>
        )}

        {notFound && (
          <div className="track-not-found animate-fadeIn">
            <XCircle size={40}/>
            <h3>Order Not Found</h3>
            <p>We couldn't find order <strong>"{query}"</strong>. Please check the ID and try again.</p>
          </div>
        )}

        {result && (
          <div className="track-result animate-fadeIn">
            {/* Status Card */}
            <div className="track-status-card" style={{ background: cfg.bg }}>
              <div className="track-status-icon" style={{ color: cfg.color }}>{cfg.icon}</div>
              <div>
                <p className="track-status-label" style={{ color: cfg.color }}>{cfg.label}</p>
                <p className="track-order-id">{result.orderId}</p>
              </div>
              <span className={`status status-${result.status}`}>{cfg.label}</span>
            </div>

            {/* Timeline */}
            {result.status !== 'cancelled' && (
              <div className="track-timeline">
                {TIMELINE.map((t, i) => {
                  const isDone    = i <= step;
                  const isCurrent = i === step;
                  return (
                    <div key={t.key} className={`track-tl-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="tl-icon-wrap">
                        <div className="tl-icon"/>
                        {i < TIMELINE.length - 1 && <div className="tl-connector"/>}
                      </div>
                      <div className="tl-content">
                        <p className="tl-label">{t.label}</p>
                        <p className="tl-desc">{isCurrent ? t.desc : isDone ? '✓ Completed' : 'Pending'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Details */}
            <div className="track-details-grid">
              <div className="track-detail-card">
                <h4>Order Items</h4>
                {result.items.map((item, i) => (
                  <div key={i} className="track-item">
                    <img src={item.image} alt={item.name}/>
                    <div>
                      <p className="track-item-name">{item.name}</p>
                      <p className="track-item-meta">{item.color} · Size {item.size} · Qty {item.qty}</p>
                    </div>
                    <span className="track-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="track-items-total">
                  <span>Total</span>
                  <span>₹{result.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="track-detail-card">
                <h4>Delivery Address</h4>
                {result.shipping && (
                  <div className="track-address">
                    <MapPin size={14}/>
                    <p>{result.shipping.name}, {result.shipping.line1}, {result.shipping.city}, {result.shipping.state} – {result.shipping.pincode}</p>
                  </div>
                )}
                <h4 style={{ marginTop: '1rem' }}>Payment</h4>
                <p className="track-payment">{result.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                {result.trackingNumber && <>
                  <h4 style={{ marginTop: '1rem' }}>Tracking Number</h4>
                  <p className="track-payment" style={{ fontWeight: 700 }}>{result.trackingNumber}</p>
                </>}
                <h4 style={{ marginTop: '1rem' }}>Order Date</h4>
                <p className="track-date">{new Date(result.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
                {result.deliveredAt && <>
                  <h4 style={{ marginTop: '1rem' }}>Delivered On</h4>
                  <p className="track-date" style={{ color: 'var(--success)' }}>
                    {new Date(result.deliveredAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
