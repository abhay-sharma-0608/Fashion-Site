import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES, HERO_SLIDES } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import './Home.css';

// ─── Hero Slider ──────────────────────────────────────────────────────────────
function HeroSlider() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const slide = HERO_SLIDES[active];

  return (
    <section className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url(${slide.image})` }} />
      <div className="hero-overlay" />
      <div className="hero-content container">
        <div className="hero-text">
          <p className="hero-eyebrow animate-fadeUp" style={{ animationDelay: '0ms' }}>
            Summer 2025 Collection
          </p>
          <h1 className="hero-title animate-fadeUp" style={{ animationDelay: '80ms' }}>
            {slide.title}<br /><span className="hero-title-accent">{slide.subtitle}</span>
          </h1>
          <p className="hero-desc animate-fadeUp" style={{ animationDelay: '160ms' }}>
            {slide.description}
          </p>
          <div className="hero-actions animate-fadeUp" style={{ animationDelay: '220ms' }}>
            <button
              className="hero-btn-primary"
              onClick={() => navigate(`/category/${slide.category}`)}
            >
              {slide.cta} <ArrowRight size={16} />
            </button>
            <button className="hero-btn-ghost" onClick={() => navigate('/')}>
              All Collections
            </button>
          </div>
        </div>

        <div className="hero-slider-controls">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      <button className="hero-arrow hero-arrow-left"  onClick={() => setActive((active - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}><ChevronLeft  size={20} /></button>
      <button className="hero-arrow hero-arrow-right" onClick={() => setActive((active + 1) % HERO_SLIDES.length)}><ChevronRight size={20} /></button>
    </section>
  );
}

// ─── Category Banner Row ──────────────────────────────────────────────────────
function CategoryBanners() {
  return (
    <section className="cat-banners container">
      {CATEGORIES.map((cat, i) => (
        <Link key={cat.id} to={`/category/${cat.id}`} className="cat-banner-card" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="cat-banner-bg" style={{ backgroundImage: `url(${cat.banner})` }} />
          <div className="cat-banner-overlay" />
          <div className="cat-banner-content">
            <span className="cat-banner-icon">{cat.icon}</span>
            <h3>{cat.label}</h3>
            <span className="cat-banner-count">{PRODUCTS[cat.id].length} styles</span>
          </div>
          <span className="cat-banner-arrow"><ArrowRight size={16} /></span>
        </Link>
      ))}
    </section>
  );
}

// ─── Product Section with Search ──────────────────────────────────────────────
function ProductSection({ categoryId }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const allProducts = PRODUCTS[categoryId];
  const cat = CATEGORIES.find(c => c.id === categoryId);

  const FILTERS = ['all', 'new', 'sale', 'premium', 'bestseller'];

  const visible = allProducts.filter(p => {
    const matchesSearch = query === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.colors.some(c => c.toLowerCase().includes(query.toLowerCase()));
    const matchesFilter = filter === 'all' || p.badge === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-head">
          <div className="section-head-left">
            <span className="section-icon">{cat.icon}</span>
            <div>
              <h2 className="section-title">{cat.label}</h2>
              <p className="section-sub">{cat.description}</p>
            </div>
          </div>
          <Link to={`/category/${categoryId}`} className="section-see-all">
            View all {cat.label} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="section-toolbar">
          <div className="section-search">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={`Search ${cat.label.toLowerCase()}…`}
            />
          </div>
          <div className="section-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`tag ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="no-results">
            <p>No {cat.label.toLowerCase()} found matching "{query}"</p>
            <button className="tag" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {visible.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div className="promo-banner container">
      <div className="promo-inner">
        <div className="promo-text">
          <h3>Free Shipping on orders above ₹2,999</h3>
          <p>30-day easy returns · COD available · Try before you buy</p>
        </div>
        <div className="promo-chips">
          {['Free Shipping', 'Easy Returns', 'COD Available', 'Secure Payment'].map(t => (
            <span key={t} className="promo-chip">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="home-page">
      <HeroSlider />
      <CategoryBanners />
      <PromoBanner />
      {['tshirts', 'shirts', 'jeans', 'trousers'].map(cat => (
        <ProductSection key={cat} categoryId={cat} />
      ))}
    </div>
  );
}
