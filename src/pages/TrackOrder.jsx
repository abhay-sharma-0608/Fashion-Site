import { useState } from 'react';
import { Search, Package, MapPin, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { MOCK_ORDERS } from '../data/products';
import './TrackOrder.css';

const STATUS_CONFIG = {
  placed:     { icon: <Clock size={20}/>,        color: 'var(--text-muted)',   label: 'Order Placed',  bg: 'var(--bg-secondary)' },
  processing: { icon: <Package size={20}/>,      color: 'var(--warning)',      label: 'Processing',    bg: 'var(--warning-bg)' },
  shipped:    { icon: <Truck size={20}/>,         color: 'var(--info)',         label: 'Shipped',       bg: 'var(--info-bg)' },
  delivered:  { icon: <CheckCircle size={20}/>,  color: 'var(--success)',      label: 'Delivered',     bg: 'var(--success-bg)' },
  cancelled:  { icon: <XCircle size={20}/>,      color: 'var(--error)',        label: 'Cancelled',     bg: 'var(--error-bg)' },
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
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    const order = MOCK_ORDERS.find(o => o.id.toUpperCase() === q);
    if (order) { setResult(order); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  };

  const cfg    = result ? STATUS_CONFIG[result.status] : null;
  const step   = result ? (STEP_MAP[result.status] ?? -1) : -1;
  const total  = result ? result.items.reduce((s,i) => s + i.product.price * i.qty, 0) : 0;

  return (
    <div className="track-page">
      <div className="container">
        <div className="track-header">
          <h1 className="track-title">Track Your Order</h1>
          <p className="track-sub">Enter your Order ID to get real-time updates on your shipment.</p>
        </div>

        <form className="track-form" onSubmit={handleSearch}>
          <div className="track-input-wrap">
            <Search size={18} className="track-search-icon" />
            <input
              className="track-input"
              placeholder="e.g. ORD-2025-0421"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="track-btn">Track Order</button>
        </form>

        <div className="track-sample-ids">
          <span>Try: </span>
          {MOCK_ORDERS.map(o => (
            <button key={o.id} className="sample-id" onClick={() => { setQuery(o.id); }}>
              {o.id}
            </button>
          ))}
        </div>

        {notFound && (
          <div className="track-not-found animate-fadeIn">
            <XCircle size={40} />
            <h3>Order Not Found</h3>
            <p>We couldn't find an order with ID "{query}". Please check and try again.</p>
          </div>
        )}

        {result && (
          <div className="track-result animate-fadeIn">
            {/* Status Card */}
            <div className="track-status-card" style={{ background: cfg.bg }}>
              <div className="track-status-icon" style={{ color: cfg.color }}>{cfg.icon}</div>
              <div>
                <p className="track-status-label" style={{ color: cfg.color }}>{cfg.label}</p>
                <p className="track-order-id">{result.id}</p>
              </div>
              <span className={`status status-${result.status}`}>{cfg.label}</span>
            </div>

            {/* Timeline - only for non-cancelled */}
            {result.status !== 'cancelled' && (
              <div className="track-timeline">
                {TIMELINE.map((t, i) => {
                  const isDone    = i <= step;
                  const isCurrent = i === step;
                  return (
                    <div key={t.key} className={`track-tl-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="tl-icon-wrap">
                        <div className="tl-icon" />
                        {i < TIMELINE.length - 1 && <div className="tl-connector" />}
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

            {/* Order Details */}
            <div className="track-details-grid">
              <div className="track-detail-card">
                <h4>Order Items</h4>
                {result.items.map((item, i) => (
                  <div key={i} className="track-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <p className="track-item-name">{item.product.name}</p>
                      <p className="track-item-meta">{item.color} · Size {item.size} · Qty {item.qty}</p>
                    </div>
                    <span className="track-item-price">₹{(item.product.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="track-items-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="track-detail-card">
                <h4>Delivery Address</h4>
                <div className="track-address"><MapPin size={14}/><p>{result.address}</p></div>
                <h4 style={{marginTop:'1rem'}}>Payment</h4>
                <p className="track-payment">{result.payment}</p>
                <h4 style={{marginTop:'1rem'}}>Order Date</h4>
                <p className="track-date">{new Date(result.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                {result.deliveredOn && <>
                  <h4 style={{marginTop:'1rem'}}>Delivered On</h4>
                  <p className="track-date" style={{color:'var(--success)'}}>
                    {new Date(result.deliveredOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
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
