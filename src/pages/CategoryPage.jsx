import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import './CategoryPage.css';

const SORT_OPTIONS = [
  { value: 'popular',   label: 'Most Popular' },
  { value: 'newest',    label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
];
const BADGE_FILTERS = ['all','new','sale','premium','bestseller'];

export default function CategoryPage() {
  const { id } = useParams();
  const cat = CATEGORIES.find(c => c.id === id);
  const allProducts = PRODUCTS[id] || [];

  const [query,   setQuery]   = useState('');
  const [badge,   setBadge]   = useState('all');
  const [sort,    setSort]    = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange]   = useState([0, 10000]);

  const filtered = useMemo(() => {
    let list = allProducts.filter(p => {
      const q = query.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.colors.some(c => c.toLowerCase().includes(q));
      const matchBadge  = badge === 'all' || p.badge === badge;
      const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchBadge && matchPrice;
    });
    if (sort === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
    if (sort === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating);
    if (sort === 'newest')     list = [...list].reverse();
    return list;
  }, [allProducts, query, badge, sort, priceRange]);

  if (!cat) return <div className="container" style={{paddingTop:'120px'}}><p>Category not found.</p></div>;

  const clearAll = () => { setQuery(''); setBadge('all'); setSort('popular'); setPriceRange([0,10000]); };
  const hasFilters = query || badge !== 'all' || sort !== 'popular' || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="cat-page">
      {/* Hero */}
      <div className="cat-hero" style={{ backgroundImage: `url(${cat.banner})` }}>
        <div className="cat-hero-overlay" />
        <div className="container cat-hero-content">
          <p className="cat-hero-eyebrow">
            <Link to="/">Home</Link> / {cat.label}
          </p>
          <h1 className="cat-hero-title">{cat.icon} {cat.label}</h1>
          <p className="cat-hero-sub">{allProducts.length} styles · {cat.description}</p>
        </div>
      </div>

      <div className="container cat-body">
        {/* Toolbar */}
        <div className="cat-toolbar">
          <div className="cat-toolbar-left">
            <div className="cat-search">
              <SearchBar value={query} onChange={setQuery} placeholder={`Search ${cat.label.toLowerCase()}…`} />
            </div>
            <div className="cat-badge-filters">
              {BADGE_FILTERS.map(f => (
                <button key={f} className={`tag ${badge === f ? 'active' : ''}`} onClick={() => setBadge(f)}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="cat-toolbar-right">
            {hasFilters && (
              <button className="tag" onClick={clearAll} style={{ display:'flex',alignItems:'center',gap:4 }}>
                <X size={12} /> Clear
              </button>
            )}
            <button className={`cat-filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(v => !v)}>
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div className="cat-sort">
              <ArrowUpDown size={14} className="sort-icon" />
              <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="cat-filters-panel animate-fadeIn">
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range-row">
                <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={0} max={10000} step={100}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                className="price-slider"
              />
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="cat-results-count">Showing <strong>{filtered.length}</strong> of {allProducts.length} products</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="no-results">
            <p>No {cat.label.toLowerCase()} match your filters.</p>
            <button className="tag" onClick={clearAll}>Clear all filters</button>
          </div>
        ) : (
          <div className="cat-product-grid">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 40} />)}
          </div>
        )}
      </div>
    </div>
  );
}
