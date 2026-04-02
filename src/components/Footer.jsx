import { useState } from 'react';
import { Link } from 'react-router-dom';
import SizeGuideModal from './SizeGuideModal';
import './Footer.css';

export default function Footer() {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <footer className="footer">
      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-logo">DRAPE</div>
            <p className="footer-tagline">Modern clothing for the discerning wardrobe. Crafted with intention, worn with confidence.</p>
            <div className="footer-socials">
              {['Instagram', 'Twitter', 'Pinterest'].map(s => (
                <a key={s} href="#" className="footer-social">{s[0]}</a>
              ))}
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Shop</h4>
            <Link to="/category/tshirts">T-Shirts</Link>
            <Link to="/category/shirts">Shirts</Link>
            <Link to="/category/jeans">Jeans</Link>
            <Link to="/category/trousers">Trousers</Link>
          </div>

          <div className="footer-links-group">
            <h4>Help</h4>
            <Link to="/orders">My Orders</Link>
            <Link to="/track">Track Order</Link>
            <a href="#" onClick={e => { e.preventDefault(); setShowSizeGuide(true); }}>Size Guide</a>
            <Link to="/orders">Returns & Refunds</Link>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Sustainability</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>

          <div className="footer-newsletter">
            <h4>Stay in the loop</h4>
            <p>Get early access to new drops and exclusive offers.</p>
            <div className="footer-newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Abhay Sharma. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}