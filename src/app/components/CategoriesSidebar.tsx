'use client';

import { useEffect, useState } from 'react';
import { Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface CategoriesSidebarProps {
  selectedCategory: string;
  selectedSubcategory: string;
  products: any[];
}

export default function CategoriesSidebar({ 
  selectedCategory, 
  selectedSubcategory,
  products 
}: CategoriesSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Organize categories into hierarchy
  const mainCategories = categories.filter(cat => cat.parent_id === null);
  const subCategories = categories.filter(cat => cat.parent_id !== null);

  // Group subcategories by parent
  const subcategoriesByParent = mainCategories.map(main => ({
    ...main,
    subcategories: subCategories.filter(sub => sub.parent_id === main.id)
  }));

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <span>Categories</span>
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Browse by type
        </span>
      </div>

      <div className="space-y-1">
        {/* All Products */}
        <Link 
          href="/products" 
          className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${
            selectedCategory === 'all' 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm' 
              : 'hover:bg-gray-50 hover:border hover:border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                : 'bg-gray-300 group-hover:bg-blue-300'
            }`}></div>
            <span className={`font-medium ${
              selectedCategory === 'all' ? 'text-blue-700' : 'text-gray-700'
            }`}>
              All Products
            </span>
          </div>
          <span className={`text-sm font-semibold ${
            selectedCategory === 'all' ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {products.length}
          </span>
        </Link>

        {/* Dynamic Categories */}
        {subcategoriesByParent.map((mainCat) => (
          <div key={mainCat.id} className="pt-2">
            {/* Main Category Header */}
            <div className="flex items-center justify-between mb-2 px-4">
              <Link
                href={`/products?category=${encodeURIComponent(mainCat.name)}`}
                className={`text-sm font-semibold uppercase tracking-wider ${
                  selectedCategory === mainCat.name && !selectedSubcategory
                    ? 'text-blue-600'
                    : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                {mainCat.name}
              </Link>
              <span className="text-xs text-gray-500 font-medium">
                {products.filter(p => p.maincategory === mainCat.name).length}
              </span>
            </div>

            {/* Subcategories */}
            {mainCat.subcategories.length > 0 && (
              <div className="space-y-1 mb-4">
                {mainCat.subcategories.map((sub) => (
                  <Link 
                    key={sub.id}
                    href={`/products?category=${encodeURIComponent(mainCat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                    className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${
                      selectedSubcategory === sub.name && selectedCategory === mainCat.name
                        ? 'bg-blue-50 border border-blue-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        selectedSubcategory === sub.name && selectedCategory === mainCat.name
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 group-hover:bg-blue-400'
                      }`}></div>
                      <span className={`text-sm ${
                        selectedSubcategory === sub.name && selectedCategory === mainCat.name
                          ? 'text-blue-700 font-medium' 
                          : 'text-gray-600 group-hover:text-gray-900'
                      }`}>
                        {sub.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {products.filter(p => p.subcategory === sub.name).length}
                      </span>
                      <ChevronRight className={`h-3 w-3 opacity-0 -translate-x-2 transition-all ${
                        selectedSubcategory === sub.name && selectedCategory === mainCat.name
                          ? 'opacity-100 translate-x-0 text-blue-600'
                          : 'group-hover:opacity-100 group-hover:translate-x-0 text-gray-400'
                      }`} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedSubcategory) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Active Filters</span>
            <Link 
              href="/products" 
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {selectedCategory}
                <Link 
                  href="/products" 
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </Link>
              </div>
            )}
            {selectedSubcategory && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {selectedSubcategory}
                <Link 
                  href={`/products?category=${encodeURIComponent(selectedCategory)}`} 
                  className="ml-1 hover:text-cyan-900"
                >
                  ×
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
