import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search…', onClear }) {
  return (
    <div className="searchbar-wrap">
      <Search size={16} className="searchbar-icon" />
      <input
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="searchbar-clear" onClick={() => { onChange(''); onClear?.(); }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
