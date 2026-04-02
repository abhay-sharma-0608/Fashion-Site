import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.colors.some(c => c.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <p className="search-label">Search results for</p>
          <h1 className="search-query">"{query}"</h1>
          <p className="search-count">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
        </div>

        {results.length === 0 ? (
          <div className="search-empty">
            <Search size={48} strokeWidth={1} />
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
        ) : (
          <div className="search-grid">
            {results.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 40} />)}
          </div>
        )}
      </div>
    </div>
  );
}
