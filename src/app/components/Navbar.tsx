'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand - FIXED VERSION */}
          {/* Logo & Brand - FIXED VERSION */}
<div className="flex items-center mr-auto pr-8">
  <Link href="/" className="flex items-center gap-3 group">
    {/* Logo Container */}
    <div className="w-20 h-20 shrink-0">
      <img 
        src="/logo.jpg" 
        alt="MMN Pharmaceuticals" 
        className="h-full w-full object-contain p-1.5"
      />
    </div>
    
    {/* Brand Name */}
    <div className="hidden sm:block">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold leading-tight whitespace-nowrap">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9575CD] via-[#9575CD] to-[#4FC3F7]">
    MMN Pharmaceuticals
  </span>
</h1>
        <p className="text-xs text-gray-600 font-medium tracking-wide">
          Pharma Grade
        </p>
      </div>
    </div>
  </Link>
</div>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            >
              Home
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <Link 
                    href="/products" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    <div className="font-medium">All Products</div>
                    <div className="text-xs text-gray-500 mt-1">Complete pharmaceutical catalog</div>
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link 
                    href="/products/category/glp-1" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    GLP-1 Analogs
                  </Link>
                  <Link 
                    href="/products/category/peptides" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Therapeutic Peptides
                  </Link>
                  <Link 
                    href="/products/category/sarms" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Research Compounds
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/quality" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            >
              Quality Assurance
            </Link>
            
            <Link 
              href="/documentation" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            >
              Documentation
            </Link>
            
            <Link 
              href="/contact" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section: Search & Cart */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                />
              </div>
            </form>

            {/* Cart Button */}
            <Link 
              href="/cart"
              className="relative flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:from-cyan-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all group"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-[#FF6BCB] to-[#9575CD] text-white text-xs flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/products" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              <Link 
                href="/quality" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quality Assurance
              </Link>
              
              <Link 
                href="/documentation" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>
              
              <Link 
                href="/contact" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}