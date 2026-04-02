import { Routes, Route } from 'react-router-dom';
import { CartProvider, ToastProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import SearchPage from './pages/SearchPage';
import ScrollToTop from './components/ScrollToTop';
import { Scroll } from 'lucide-react';

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/category/:id"      element={<CategoryPage />} />
          <Route path="/product/:id"       element={<ProductDetail />} />
          <Route path="/cart"              element={<Cart />} />
          <Route path="/orders"            element={<Orders />} />
          <Route path="/track"             element={<TrackOrder />} />
          <Route path="/search"            element={<SearchPage />} />
        </Routes>
        <Footer />
      </ToastProvider>
    </CartProvider>
  );
}
