'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  variant?: 'navbar' | 'hero';
  placeholder?: string;
}

export default function SearchBar({ variant = 'navbar', placeholder = 'Search products...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof products>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter products based on query
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const filtered = products.filter(product => {
      const searchTerm = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.sequence && product.sequence.toLowerCase().includes(searchTerm))
      );
    }).slice(0, 5); // Limit to 5 results for dropdown

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = (productSlug: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/products/${productSlug}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // Styles based on variant
  const containerClass = variant === 'navbar' 
    ? 'hidden lg:block relative'
    : 'w-full max-w-2xl mx-auto relative';

  const inputClass = variant === 'navbar'
    ? 'pl-10 pr-10 py-2.5 w-64 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    : 'pl-12 pr-12 py-4 w-full text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg';

  return (
    <div className={containerClass} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={inputClass}
        />
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {variant === 'hero' && (
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-medium text-gray-500">
                {results.length} product{results.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={handleSubmit}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View all results →
              </button>
            </div>
            
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleResultClick(product.slug)}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🧪</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate group-hover:text-blue-700">
                        {product.name}
                      </h4>
                      <span className="text-sm font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {product.dosage} • {product.purity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4">
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🔍</div>
            <p className="font-medium text-gray-700">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try searching for "Tirzepatide", "BPC-157", "Semaglutide", etc.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}