import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    productsAPI.getAll({ search: query, limit: 40 })
      .then(data => setResults(data.products || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <p className="search-label">Search results for</p>
          <h1 className="search-query">"{query}"</h1>
          <p className="search-count">
            {loading ? 'Searching…' : `${results.length} product${results.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {!loading && results.length === 0 && (
          <div className="search-empty">
            <Search size={48} strokeWidth={1}/>
            <h3>No results found</h3>
            <p>Try different keywords or browse our categories below.</p>
            <div className="search-cat-links">
              {['tshirts','shirts','jeans','trousers'].map(c => (
                <Link key={c} to={`/category/${c}`} className="tag">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-grid">
            {results.map((p, i) => <ProductCard key={p._id || p.productId} product={p} delay={i * 40}/>)}
          </div>
        )}
      </div>
    </div>
  );
}
