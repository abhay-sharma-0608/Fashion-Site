import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, fetch current user if token exists
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    authAPI.getMe()
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('accessToken'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const data = await authAPI.register({ name, email, password, phone });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ─── CART CONTEXT ─────────────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, size, color, qty = 1) => {
    setItems(prev => {
      const key = `${product.productId || product.id}-${size}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, product, size, color, qty }];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal   = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping   = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;
  const total      = subtotal + shipping;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// ─── TOAST CONTEXT ────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

function ToastContainer({ toasts }) {
  return (
    <div id="toast-root">
      {toasts.map(t => (
        <div key={t.id} style={{
          background: '#fff',
          border: '1px solid #e8e2d9',
          borderLeft: `4px solid ${t.type === 'success' ? '#3d7c52' : t.type === 'error' ? '#c0392b' : '#c07a3a'}`,
          borderRadius: '10px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: '260px',
          maxWidth: '360px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          animation: 'toastIn 0.35s ease both',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          fontWeight: 500,
          pointerEvents: 'all',
        }}>
          <span style={{ fontSize: '16px' }}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
