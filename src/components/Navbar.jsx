import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Package, MapPin, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import './Navbar.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Left */}
          <div className="nav-left">
            <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="brand-logo">DRAPE</Link>
          </div>

          {/* Center links */}
          <div className="nav-center">
            <div className="nav-dropdown-wrap"
              onClick={() => setShopOpen(!shopOpen)}
              >
              <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Shop <ChevronDown size={14} className={`chevron ${shopOpen ? 'open' : ''}`} />
              </button>
              {shopOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-grid">
                    {CATEGORIES.map(cat => (
                      <Link key={cat.id} to={`/category/${cat.id}`} className="dropdown-item">
                        <span className="dropdown-icon">{cat.icon}</span>
                        <div>
                          <div className="dropdown-label">{cat.label}</div>
                          <div className="dropdown-sub">{cat.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <Link to="/" className="dropdown-footer-link">View All Collections →</Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
              Orders
            </Link>
            <Link to="/track" className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}>
              Track Order
            </Link>
          </div>

          {/* Right */}
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <Search size={19} />
            </button>
            <Link to="/orders" className="nav-icon-btn" aria-label="Orders">
              <Package size={19} />
            </Link>
            <Link to="/track" className="nav-icon-btn" aria-label="Track">
              <MapPin size={19} />
            </Link>
            <Link to="/cart" className="nav-icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={19} />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="nav-search-bar">
            <form onSubmit={handleSearch} className="nav-search-form">
              <Search size={17} className="nav-search-icon" />
              <input
                autoFocus
                type="text"
                placeholder="Search for tees, jeans, shirts…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="nav-search-input"
              />
              <button type="submit" className="nav-search-submit">Search</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            <p className="mobile-section-label">Collections</p>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="mobile-link">
                <span>{cat.icon}</span> {cat.label}
              </Link>
            ))}
            <div className="mobile-divider" />
            <p className="mobile-section-label">Account</p>
            <Link to="/orders" className="mobile-link"><Package size={16} /> My Orders</Link>
            <Link to="/track" className="mobile-link"><MapPin size={16} /> Track Order</Link>
            <Link to="/cart" className="mobile-link"><ShoppingBag size={16} /> Cart {totalItems > 0 && `(${totalItems})`}</Link>
          </div>
        </div>
      )}

      {/* Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
