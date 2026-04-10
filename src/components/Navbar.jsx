import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Package, MapPin, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useCart, useAuth } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import './Navbar.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [shopOpen,    setShopOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false); setShopOpen(false); setSearchOpen(false); setAccountOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false); setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Left */}
          <div className="nav-left">
            <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <Link to="/" className="brand-logo">DRAPE</Link>
          </div>

          {/* Center */}
          <div className="nav-center">
            <div className="nav-dropdown-wrap" onClick={() => setShopOpen(!shopOpen)}>
              <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Shop <ChevronDown size={14} className={`chevron ${shopOpen ? 'open' : ''}`}/>
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
            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
            <Link to="/track"  className={`nav-link ${location.pathname === '/track'  ? 'active' : ''}`}>Track Order</Link>
          </div>

          {/* Right */}
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <Search size={19}/>
            </button>
            <Link to="/track" className="nav-icon-btn" aria-label="Track"><MapPin size={19}/></Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="nav-dropdown-wrap" onClick={() => setAccountOpen(!accountOpen)}>
                <button className="nav-icon-btn" aria-label="Account">
                  <User size={19}/>
                </button>
                {accountOpen && (
                  <div className="nav-dropdown nav-account-dropdown">
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    <Link to="/orders" className="dropdown-item" style={{ padding: '10px 16px' }}>
                      <Package size={15}/> <span>My Orders</span>
                    </Link>
                    <button className="dropdown-item" style={{ padding: '10px 16px', width: '100%', textAlign: 'left', color: 'var(--error)' }} onClick={handleLogout}>
                      <LogOut size={15}/> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn" aria-label="Login"><User size={19}/></Link>
            )}

            <Link to="/cart" className="nav-icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={19}/>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="nav-search-bar">
            <form onSubmit={handleSearch} className="nav-search-form">
              <Search size={17} className="nav-search-icon"/>
              <input autoFocus type="text" placeholder="Search for tees, jeans, shirts…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="nav-search-input"/>
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
            <div className="mobile-divider"/>
            <p className="mobile-section-label">Account</p>
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="mobile-link"><Package size={16}/> My Orders</Link>
                <button className="mobile-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', color: 'var(--error)' }}>
                  <LogOut size={16}/> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-link"><User size={16}/> Login / Register</Link>
            )}
            <Link to="/track" className="mobile-link"><MapPin size={16}/> Track Order</Link>
            <Link to="/cart"  className="mobile-link"><ShoppingBag size={16}/> Cart {totalItems > 0 && `(${totalItems})`}</Link>
          </div>
        </div>
      )}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}/>}
    </>
  );
}
