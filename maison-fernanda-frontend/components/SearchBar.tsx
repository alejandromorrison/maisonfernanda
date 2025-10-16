import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { products } from '@/lib/api';
import Link from 'next/link';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await products.autocomplete(query);
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/collection?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label="Search"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-warm-taupe/20 p-4 z-50">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 border border-warm-taupe focus:outline-none focus:border-deep-taupe"
              autoFocus
            />
          </form>

          {loading && (
            <div className="mt-4 text-center">
              <div className="spinner mx-auto"></div>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <ul className="mt-4 space-y-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion._id}>
                  <Link
                    href={`/product/${suggestion.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="block p-2 hover:bg-warm-taupe/10 transition-colors"
                  >
                    <p className="font-medium text-sm">{suggestion.name}</p>
                    <p className="text-xs text-deep-taupe/60 capitalize">{suggestion.category}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && query.length >= 2 && suggestions.length === 0 && (
            <p className="mt-4 text-sm text-deep-taupe/60 text-center">
              No se encontraron productos
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

