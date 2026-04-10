import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, ToastProvider, AuthProvider, useAuth } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import ScrollToTop from './components/ScrollToTop';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/category/:id"   element={<CategoryPage />} />
            <Route path="/product/:id"    element={<ProductDetail />} />
            <Route path="/cart"           element={<Cart />} />
            <Route path="/search"         element={<SearchPage />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/track"          element={<TrackOrder />} />
            {/* Protected routes */}
            <Route path="/checkout"       element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"         element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
