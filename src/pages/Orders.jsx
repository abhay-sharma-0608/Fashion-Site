import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, MapPin, CreditCard, Calendar } from 'lucide-react';
import { MOCK_ORDERS } from '../data/products';
import { useCart } from '../context/AppContext';
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

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const orderTotal = order.items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div className="order-card">
      <div className="order-card-header" onClick={() => setExpanded(v => !v)}>
        <div className="order-card-meta">
          <div className="order-id-row">
            <Package size={16} className="order-pkg-icon" />
            <span className="order-id">{order.id}</span>
            <span className={`status status-${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
          <div className="order-meta-chips">
            <span className="meta-chip"><Calendar size={12}/>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="meta-chip"><CreditCard size={12}/>{order.payment}</span>
            <span className="meta-chip">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="order-card-right">
          <span className="order-total">₹{orderTotal.toLocaleString('en-IN')}</span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="order-card-body animate-fadeIn">
          <OrderTimeline status={order.status} />
          <div className="order-items-list">
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <Link to={`/product/${item.product.id}`} className="order-item-img">
                  <img src={item.product.image} alt={item.product.name} />
                </Link>
                <div className="order-item-info">
                  <p className="order-item-brand">{item.product.brand}</p>
                  <Link to={`/product/${item.product.id}`} className="order-item-name">{item.product.name}</Link>
                  <p className="order-item-meta">{item.color} · Size {item.size} · Qty {item.qty}</p>
                </div>
                <span className="order-item-price">₹{(item.product.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="order-address">
            <MapPin size={14} />
            <span>{order.address}</span>
          </div>
          {order.status === 'delivered' && order.deliveredOn && (
            <p className="order-delivered-on">Delivered on {new Date(order.deliveredOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { items } = useCart();
  const allOrders = [...MOCK_ORDERS];
  // Add live cart as a "placed" order if cart has items
  const [filter, setFilter] = useState('all');
  const statuses = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];
  const filtered = filter === 'all' ? allOrders : allOrders.filter(o => o.status === filter);

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-sub">{allOrders.length} orders placed</p>
          </div>
          <Link to="/track" className="track-order-link">Track an Order →</Link>
        </div>

        <div className="orders-filters">
          {statuses.map(s => (
            <button key={s} className={`tag ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="orders-empty">
            <Package size={48} strokeWidth={1} />
            <h3>No {filter} orders</h3>
            <Link to="/" className="tag">Continue Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
