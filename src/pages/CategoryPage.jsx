import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import './CategoryPage.css';

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];
const BADGE_FILTERS = ['all', 'new', 'sale', 'premium', 'bestseller'];

export default function CategoryPage() {
  const { id } = useParams();
  const cat = CATEGORIES.find(c => c.id === id);

  const [products, setProducts]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [query,   setQuery]         = useState('');
  const [badge,   setBadge]         = useState('all');
  const [sort,    setSort]          = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice]     = useState(10000);

  useEffect(() => {
    setLoading(true);
    const params = {
      category: id,
      limit: 60,
      sort,
      ...(badge !== 'all'  && { badge }),
      ...(query.trim()     && { search: query }),
      ...(maxPrice < 10000 && { maxPrice }),
    };
    productsAPI.getAll(params)
      .then(data => { setProducts(data.products || []); setTotal(data.pagination?.total || 0); })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [id, badge, sort, maxPrice]);

  // Client-side search filter (instant)
  const filtered = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  const clearAll = () => { setQuery(''); setBadge('all'); setSort('popular'); setMaxPrice(10000); };
  const hasFilters = query || badge !== 'all' || sort !== 'popular' || maxPrice < 10000;

  if (!cat) return <div className="container" style={{ paddingTop: 120 }}><p>Category not found.</p></div>;

  return (
    <div className="cat-page">
      <div className="cat-hero" style={{ backgroundImage: `url(${cat.banner})` }}>
        <div className="cat-hero-overlay"/>
        <div className="container cat-hero-content">
          <p className="cat-hero-eyebrow"><Link to="/">Home</Link> / {cat.label}</p>
          <h1 className="cat-hero-title">{cat.icon} {cat.label}</h1>
          <p className="cat-hero-sub">{total} styles · {cat.description}</p>
        </div>
      </div>

      <div className="container cat-body">
        <div className="cat-toolbar">
          <div className="cat-toolbar-left">
            <div className="cat-search">
              <SearchBar value={query} onChange={setQuery} placeholder={`Search ${cat.label.toLowerCase()}…`}/>
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
              <button className="tag" onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={12}/> Clear
              </button>
            )}
            <button className={`cat-filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(v => !v)}>
              <SlidersHorizontal size={15}/> Filters
            </button>
            <div className="cat-sort">
              <ArrowUpDown size={14} className="sort-icon"/>
              <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="cat-filters-panel animate-fadeIn">
            <div className="filter-group">
              <h4>Max Price</h4>
              <div className="price-range-row">
                <span>₹0</span>
                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={0} max={10000} step={100}
                value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="price-slider"
              />
            </div>
          </div>
        )}

        <p className="cat-results-count">
          {loading ? 'Loading…' : <>Showing <strong>{filtered.length}</strong> products</>}
        </p>

        {!loading && filtered.length === 0 ? (
          <div className="no-results">
            <p>No {cat.label.toLowerCase()} match your filters.</p>
            <button className="tag" onClick={clearAll}>Clear all filters</button>
          </div>
        ) : (
          <div className="cat-product-grid">
            {filtered.map((p, i) => <ProductCard key={p._id || p.productId} product={p} delay={i * 40}/>)}
          </div>
        )}
      </div>
    </div>
  );
}
