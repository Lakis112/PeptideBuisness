'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, ChevronDown, ChevronRight, Droplets, FlaskConical, Package, Shield } from 'lucide-react';
import { useCart } from '@/lib/cart';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface MainCategory extends Category {
  subcategories: Category[];
  icon: React.ReactNode;
}

// Icon mapping for each category
const categoryIcons: Record<string, React.ReactNode> = {
  'AAS': <Droplets className="h-4 w-4" />,
  'Peptides': <FlaskConical className="h-4 w-4" />,
  'Non Peptide Products': <Package className="h-4 w-4" />,
  'Ancillaries': <Shield className="h-4 w-4" />
};

export default function Navbar() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch categories with hierarchy
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data: Category[] = await res.json();
        
        // Organize categories into hierarchy
        const mainCategories = data.filter(cat => cat.parent_id === null);
        const subCategories = data.filter(cat => cat.parent_id !== null);
        
        // Define desired order: Peptides, AAS, Non Peptide Products, Ancillaries
        const desiredOrder = ['Peptides', 'AAS', 'Non Peptide Products', 'Ancillaries'];
        
        // Sort main categories according to desired order
        const sortedMainCategories = mainCategories.sort((a, b) => {
          const indexA = desiredOrder.indexOf(a.name);
          const indexB = desiredOrder.indexOf(b.name);
          // If not in desired order, put at the end
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
        
        const organized = sortedMainCategories.map(mainCat => ({
          ...mainCat,
          subcategories: subCategories.filter(sub => sub.parent_id === mainCat.id),
          icon: categoryIcons[mainCat.name] || <Package className="h-4 w-4" />
        }));
        
        setCategories(organized);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Improved hover handlers with delay
  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow mouse movement
    closeTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 150); // 150ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center mr-auto pr-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-20 h-20 shrink-0">
                <img 
                  src="/logo.png" 
                  alt="MMN Pharmaceuticals" 
                  className="h-full w-full object-contain p-1.5"
                />
              </div>
              
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
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Home
            </Link>
            
            {/* Products Dropdown with clickable button */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/products"
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              {isProductsOpen && !isLoading && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[1000px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-8 z-50">
                  {/* Top gradient bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-t-2xl"></div>
                  
                  <div className="grid grid-cols-4 gap-8 px-10">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            {category.icon}
                          </div>
                          <Link 
                            href={`/products?category=${encodeURIComponent(category.name)}`}
                            className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors group/item"
                            onClick={() => setIsProductsOpen(false)}
                          >
                            <span className="relative">
                              {category.name}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover/item:w-full transition-all duration-300"></span>
                            </span>
                          </Link>
                        </div>
                        
                        <div className="space-y-2">
                          {category.subcategories.length > 0 ? (
                            <>
                              {category.subcategories.map((sub) => (
                                <Link 
                                  key={sub.id}
                                  href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white rounded-lg px-3 py-2.5 transition-all group/sub"
                                  onClick={() => setIsProductsOpen(false)}
                                >
                                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover/sub:bg-blue-500 group-hover/sub:scale-125 transition-all"></div>
                                  <span className="flex-1">{sub.name}</span>
                                  <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
                                </Link>
                              ))}
                              <Link 
                                href={`/products?category=${encodeURIComponent(category.name)}`}
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mt-4 pt-3 border-t border-gray-100"
                                onClick={() => setIsProductsOpen(false)}
                              >
                                <span>View all {category.name}</span>
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </>
                          ) : (
                            <Link 
                              href={`/products?category=${encodeURIComponent(category.name)}`}
                              className="block text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2.5 transition-colors italic"
                              onClick={() => setIsProductsOpen(false)}
                            >
                              Explore {category.name}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom CTA Section */}
                  <div className="mt-10 pt-8 border-t border-gray-100 px-10">
                    <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Complete Product Catalog</h3>
                          <p className="text-sm text-gray-600 mt-1">Browse our full range of pharmaceutical-grade products</p>
                        </div>
                        <Link 
                          href="/products" 
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                          onClick={() => setIsProductsOpen(false)}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          View All Products
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href="/quality" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Quality
            </Link>
            
            <Link 
              href="/research" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Research
            </Link>
            
            <Link 
              href="/contact" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section: Search, User, Cart */}
          <div className="flex items-center gap-6 ml-8">
            <SearchBar variant="navbar" placeholder="Search peptides..." />
            
            <div className="hidden lg:block">
              <UserMenu />
            </div>
            
            <Link 
              href="/cart"
              className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all group"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              )}
            </Link>

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
            <div className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Products Dropdown */}
              <div className="px-4">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="flex items-center justify-between w-full py-3 text-base font-medium text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProductsOpen && !isLoading && (
                  <div className="mt-2 ml-4 space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <Link 
                          href={`/products?category=${encodeURIComponent(category.name)}`}
                          className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          onClick={() => {
                            setIsProductsOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          <div className="p-1.5 bg-blue-50 rounded">
                            {category.icon}
                          </div>
                          {category.name}
                        </Link>
                        
                        {category.subcategories.length > 0 && (
                          <div className="ml-8 space-y-1">
                            {category.subcategories.map((sub) => (
                              <Link 
                                key={sub.id}
                                href={`/products?subcategory=${encodeURIComponent(sub.name)}`}
                                className="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                onClick={() => {
                                  setIsProductsOpen(false);
                                  setIsMenuOpen(false);
                                }}
                              >
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* View All Products in Mobile */}
                    <div className="pt-4 border-t border-gray-100">
                      <Link 
                        href="/products" 
                        className="inline-flex items-center text-blue-600 font-medium"
                        onClick={() => {
                          setIsProductsOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View All Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link 
                href="/quality" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quality
              </Link>
              
              <Link 
                href="/research" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Research
              </Link>
              
              <Link 
                href="/contact" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="px-4 pt-4 border-t border-gray-100">
                <div className="lg:hidden">
                  <UserMenu />
                </div>
              </div>
              
              <div className="px-4 pt-4">
                <SearchBar variant="navbar" placeholder="Search products..." />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
