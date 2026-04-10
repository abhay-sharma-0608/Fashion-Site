import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, MapPin, CreditCard, Calendar, X } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useToast } from '../context/AppContext';
import './Orders.css';

const STATUS_STEPS = {
  placed:     ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
  processing: ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
  shipped:    ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
  delivered:  ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
  cancelled:  ['Order Placed', 'Cancelled'],
};
const STEP_INDEX = { placed: 0, processing: 1, shipped: 2, delivered: 3, cancelled: 1 };

function OrderTimeline({ status }) {
  const steps = STATUS_STEPS[status] || STATUS_STEPS.placed;
  const current = STEP_INDEX[status] ?? 0;
  return (
    <div className="order-timeline">
      {steps.map((step, i) => (
        <div key={step} className={`timeline-step ${i <= current ? 'done' : ''} ${i === current ? 'current' : ''} ${status === 'cancelled' && i === 1 ? 'cancelled' : ''}`}>
          <div className="timeline-dot" />
          {i < steps.length - 1 && <div className="timeline-line" />}
          <span className="timeline-label">{step}</span>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { addToast } = useToast();

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      await ordersAPI.cancel(order._id, 'Cancelled by user');
      addToast('Order cancelled.', 'success');
      onCancel(order._id);
    } catch (err) {
      addToast(err.message, 'error');
    } finally { setCancelling(false); }
  };

  const canCancel = ['placed', 'processing'].includes(order.status);

  return (
    <div className="order-card">
      <div className="order-card-header" onClick={() => setExpanded(v => !v)}>
        <div className="order-card-meta">
          <div className="order-id-row">
            <Package size={16} className="order-pkg-icon" />
            <span className="order-id">{order.orderId}</span>
            <span className={`status status-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
          <div className="order-meta-chips">
            <span className="meta-chip"><Calendar size={12}/>{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
            <span className="meta-chip"><CreditCard size={12}/>{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</span>
            <span className="meta-chip">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="order-card-right">
          <span className="order-total">₹{order.total.toLocaleString('en-IN')}</span>
          {canCancel && (
            <button className="order-cancel-btn" onClick={handleCancel} disabled={cancelling}>
              <X size={14}/> {cancelling ? '…' : 'Cancel'}
            </button>
          )}
          {expanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </div>
      </div>
      {expanded && (
        <div className="order-card-body animate-fadeIn">
          <OrderTimeline status={order.status} />
          <div className="order-items-list">
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.image} alt={item.name} className="order-item-img-small" />
                <div className="order-item-info">
                  <p className="order-item-brand">{item.brand}</p>
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-meta">{item.color} · Size {item.size} · Qty {item.qty}</p>
                </div>
                <span className="order-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          {order.shipping && (
            <div className="order-address">
              <MapPin size={14}/>
              <span>{order.shipping.name}, {order.shipping.line1}, {order.shipping.city} – {order.shipping.pincode}</span>
            </div>
          )}
          {order.trackingNumber && <p className="order-tracking">Tracking: <strong>{order.trackingNumber}</strong></p>}
          {order.status === 'delivered' && order.deliveredAt && (
            <p className="order-delivered-on">Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    ordersAPI.getMyOrders({ limit: 50 })
      .then(data => setOrders(data.orders))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) => setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));

  const statuses = ['all','placed','processing','shipped','delivered','cancelled'];
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <Link to="/track" className="track-order-link">Track an Order →</Link>
        </div>

        {loading && <div className="orders-loading"><span>Loading orders…</span></div>}
        {error   && <div className="orders-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="orders-filters">
              {statuses.map(s => (
                <button key={s} className={`tag ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                  {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="orders-empty">
                <Package size={48} strokeWidth={1}/>
                <h3>{orders.length === 0 ? 'No orders yet' : `No ${filter} orders`}</h3>
                <Link to="/" className="tag">Start Shopping</Link>
              </div>
            ) : (
              <div className="orders-list">
                {filtered.map(order => <OrderCard key={order._id} order={order} onCancel={handleCancel}/>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
