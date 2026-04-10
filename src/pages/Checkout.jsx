import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, useAuth, useToast } from '../context/AppContext';
import { ordersAPI, paymentAPI, couponsAPI } from '../services/api';
import { Tag, Truck, CreditCard, Wallet, MapPin, ChevronRight, Check } from 'lucide-react';
import './Checkout.css';

const STEPS = ['Address', 'Payment', 'Review'];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep]               = useState(0);
  const [payMethod, setPayMethod]     = useState('razorpay');
  const [couponCode, setCouponCode]   = useState('');
  const [couponData, setCouponData]   = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing]         = useState(false);

  const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    line1:   defaultAddr?.line1    || '',
    line2:   defaultAddr?.line2    || '',
    city:    defaultAddr?.city     || '',
    state:   defaultAddr?.state    || '',
    pincode: defaultAddr?.pincode  || '',
  });

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="checkout-empty-btn">Continue Shopping</Link>
      </div>
    );
  }

  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const discount       = couponData?.discount || 0;
  const total          = subtotal + shippingCharge - discount;

  const setAddr = (k) => (e) => setAddress(prev => ({ ...prev, [k]: e.target.value }));

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const data = await couponsAPI.validate(couponCode.trim(), subtotal);
      setCouponData(data);
      addToast(`Coupon applied! You save ₹${data.discount}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode('');
  };

  const loadRazorpayScript = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePlaceOrder = async () => {
    // Validate address
    const required = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];
    for (const f of required) {
      if (!address[f]?.trim()) { addToast(`Please fill in ${f}`, 'error'); setStep(0); return; }
    }

    setPlacing(true);
    try {
      const orderPayload = {
        items: items.map(i => ({
          productId: i.product.productId || i.product.id,
          size:  i.size,
          color: i.color,
          qty:   i.qty,
        })),
        shipping: address,
        paymentMethod: payMethod,
        couponCode: couponData ? couponCode : undefined,
      };

      const orderRes = await ordersAPI.place(orderPayload);
      const order    = orderRes.order;

      if (payMethod === 'cod') {
        addToast('Order placed! Pay on delivery.', 'success');
        clearCart();
        navigate('/orders');
        return;
      }

      // Razorpay flow
      const loaded = await loadRazorpayScript();
      if (!loaded) { addToast('Payment gateway failed to load. Try again.', 'error'); setPlacing(false); return; }

      const rzpOrderRes = await paymentAPI.createRazorpayOrder(order._id);

      const options = {
        key:          rzpOrderRes.key,
        amount:       rzpOrderRes.amount,
        currency:     rzpOrderRes.currency,
        name:         'DRAPE',
        description:  `Order ${order.orderId}`,
        order_id:     rzpOrderRes.razorpayOrderId,
        prefill: {
          name:    address.name,
          contact: address.phone,
          email:   user?.email || '',
        },
        theme: { color: '#c07a3a' },
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId:           order._id,
            });
            addToast('Payment successful! Order placed. 🎉', 'success');
            clearCart();
            navigate('/orders');
          } catch {
            addToast('Payment verification failed. Contact support.', 'error');
          }
        },
        modal: {
          ondismiss: () => {
            addToast('Payment cancelled.', 'info');
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      addToast(err.message, 'error');
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <h1 className="checkout-title">Checkout</h1>

          {/* Step indicator */}
          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`checkout-step ${i <= step ? 'done' : ''} ${i === step ? 'current' : ''}`}>
                <div className="step-dot">{i < step ? <Check size={12} /> : i + 1}</div>
                <span>{s}</span>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          {/* STEP 0 — Address */}
          {step === 0 && (
            <div className="checkout-section animate-fadeIn">
              <h2 className="section-heading"><MapPin size={18} /> Delivery Address</h2>
              <div className="address-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={address.name} onChange={setAddr('name')} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input value={address.phone} onChange={setAddr('phone')} placeholder="9876543210" />
                </div>
                <div className="form-group full">
                  <label>Address Line 1 *</label>
                  <input value={address.line1} onChange={setAddr('line1')} placeholder="House No, Street, Area" />
                </div>
                <div className="form-group full">
                  <label>Address Line 2</label>
                  <input value={address.line2} onChange={setAddr('line2')} placeholder="Landmark (optional)" />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input value={address.city} onChange={setAddr('city')} placeholder="Mumbai" />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input value={address.state} onChange={setAddr('state')} placeholder="Maharashtra" />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input value={address.pincode} onChange={setAddr('pincode')} placeholder="400001" maxLength={6} />
                </div>
              </div>
              <button className="checkout-next-btn" onClick={() => setStep(1)}>
                Continue to Payment <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1 — Payment */}
          {step === 1 && (
            <div className="checkout-section animate-fadeIn">
              <h2 className="section-heading"><CreditCard size={18} /> Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-option ${payMethod === 'razorpay' ? 'selected' : ''}`}>
                  <input type="radio" value="razorpay" checked={payMethod === 'razorpay'} onChange={() => setPayMethod('razorpay')} />
                  <CreditCard size={20} />
                  <div>
                    <p className="pay-title">Pay Online</p>
                    <p className="pay-sub">UPI, Cards, Net Banking via Razorpay</p>
                  </div>
                </label>
                <label className={`payment-option ${payMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" value="cod" checked={payMethod === 'cod'} onChange={() => setPayMethod('cod')} />
                  <Wallet size={20} />
                  <div>
                    <p className="pay-title">Cash on Delivery</p>
                    <p className="pay-sub">Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              {/* Coupon */}
              <div className="coupon-section">
                <h3 className="coupon-heading"><Tag size={15} /> Apply Coupon</h3>
                {couponData ? (
                  <div className="coupon-applied">
                    <Check size={16} />
                    <span><strong>{couponCode.toUpperCase()}</strong> — You save ₹{couponData.discount}</span>
                    <button onClick={handleRemoveCoupon} className="coupon-remove">Remove</button>
                  </div>
                ) : (
                  <div className="coupon-input-row">
                    <input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button onClick={handleApplyCoupon} disabled={couponLoading}>
                      {couponLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <div className="checkout-step-btns">
                <button className="checkout-back-btn" onClick={() => setStep(0)}>← Back</button>
                <button className="checkout-next-btn" onClick={() => setStep(2)}>
                  Review Order <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div className="checkout-section animate-fadeIn">
              <h2 className="section-heading">Review & Place Order</h2>

              <div className="review-block">
                <h4>Delivering to</h4>
                <p>{address.name} · {address.phone}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                <p>{address.city}, {address.state} – {address.pincode}</p>
              </div>

              <div className="review-block">
                <h4>Payment</h4>
                <p>{payMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}</p>
                {couponData && <p className="review-coupon">Coupon: {couponCode.toUpperCase()} (−₹{discount})</p>}
              </div>

              <div className="review-items">
                {items.map(item => (
                  <div key={item.key} className="review-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <p className="review-item-name">{item.product.name}</p>
                      <p className="review-item-meta">{item.color} · {item.size} · Qty {item.qty}</p>
                    </div>
                    <span>₹{(item.product.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-step-btns">
                <button className="checkout-back-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="place-order-btn" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Processing…' : payMethod === 'cod' ? '✓ Place Order (COD)' : '🔒 Pay ₹' + total.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-right">
          <div className="checkout-summary">
            <h3 className="summary-heading">Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.key} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.product.image} alt={item.product.name} />
                    <span className="summary-item-qty">{item.qty}</span>
                  </div>
                  <div className="summary-item-info">
                    <p>{item.product.name}</p>
                    <p className="summary-item-meta">{item.color} · {item.size}</p>
                  </div>
                  <span>₹{(item.product.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? 'free' : ''}>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row"><span>Coupon Discount</span><span>−₹{discount}</span></div>
              )}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-trust">
              <Truck size={14} /> <span>Free shipping on orders above ₹999</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
