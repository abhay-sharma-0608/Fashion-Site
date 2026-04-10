const BASE = import.meta.env.VITE_API_URL || 'https://drape-backend-gqe0.onrender.com/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // sends httpOnly refresh cookie
  });

  const data = await res.json();

  // Auto-refresh token on 401
  if (res.status === 401 && path !== '/auth/refresh-token' && path !== '/auth/login') {
    const refreshed = await fetch(`${BASE}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshed.ok) {
      const { accessToken } = await refreshed.json();
      localStorage.setItem('accessToken', accessToken);
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retry = await fetch(`${BASE}${path}`, { ...options, headers, credentials: 'include' });
      return retry.json();
    } else {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  }

  if (!data.success) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body)         => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body)         => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()             => request('/auth/logout',   { method: 'POST' }),
  getMe:    ()             => request('/auth/me'),
  updateProfile: (body)    => request('/auth/me',       { method: 'PATCH', body: JSON.stringify(body) }),
  changePassword: (body)   => request('/auth/change-password', { method: 'PATCH', body: JSON.stringify(body) }),
  getWishlist: ()          => request('/auth/wishlist'),
  toggleWishlist: (productId) => request('/auth/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
  addAddress: (body)       => request('/auth/addresses', { method: 'POST', body: JSON.stringify(body) }),
  updateAddress: (id, body)=> request(`/auth/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAddress: (id)      => request(`/auth/addresses/${id}`, { method: 'DELETE' }),
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getById:    (id)    => request(`/products/${id}`),
  getFeatured: ()     => request('/products/featured'),
  getRelated: (id)    => request(`/products/${id}/related`),
  addReview:  (id, body) => request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const ordersAPI = {
  place:    (body)  => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/orders/my${qs ? '?' + qs : ''}`);
  },
  getById:  (id)    => request(`/orders/${id}`),
  cancel:   (id, reason) => request(`/orders/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  trackByOrderId: (orderId) => request(`/orders/my`).then(data => ({
    ...data,
    orders: data.orders.filter(o => o.orderId === orderId),
  })),
};

// ─── PAYMENT ─────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createRazorpayOrder: (orderId) => request('/payment/create-order', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verifyPayment: (body)          => request('/payment/verify', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── COUPONS ─────────────────────────────────────────────────────────────────
export const couponsAPI = {
  validate: (code, subtotal) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
};
