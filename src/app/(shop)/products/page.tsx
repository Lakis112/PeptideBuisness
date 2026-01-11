
import ProductCard from '@components/ProductCard';
import { Filter, Grid, ChevronRight,Star, FlaskConical } from 'lucide-react';
import SortSelect from '@components/SortSelect'; // Add this import

export const metadata = {
  title: 'Product Catalog | Pharmaceutical Grade Peptides',
  description: 'Browse our complete catalog of EU-GMP pharmaceutical grade peptides for research use.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    sort?: string;
  }>;
}

async function getProducts() {
  try {
    
    // Determine the base URL
    let baseUrl;
    
    if (process.env.NODE_ENV === 'production') {
      // In production (Vercel)
      baseUrl = 'https://peptide-buisness.vercel.app';
    } else {
      // In development (localhost)
      baseUrl = 'http://localhost:3000';
    }
     console.log('Fetching from:', `${baseUrl}/api/products`);

    //const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/products`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) return [];
    const data = await response.json();
    
    // Convert all prices from string to number
    return data.map((product: any) => ({
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
      originalPrice: product.originalPrice 
        ? (typeof product.originalPrice === 'string' 
          ? parseFloat(product.originalPrice) 
          : product.originalPrice)
        : undefined,
      // Ensure other fields have defaults
      dosage: product.dosage || 'Research',
      quantity: product.quantity || '1 vial',
      purity: product.purity || '99%',
      inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0),
      featured: product.featured || false // Use only the featured field
    }));
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category || 'all';
  const selectedSubcategory = params?.subcategory || '';
  const searchQuery = params?.search || '';
  const sortBy = params?.sort || 'featured';
  
  const products = await getProducts();

// DEBUG: Add this to see what's happening
console.log('=== DEBUG PRODUCTS ===');
console.log('Total products:', products.length);
console.log('First 3 products:');
products.slice(0, 3).forEach((p: any, i) => {
  console.log(`Product ${i + 1}:`, {
    name: p.name,
    featured: p.featured,
    hasFeaturedField: 'featured' in p,
    allFields: Object.keys(p)
  });
});

// Check how many are actually featured
const featuredProducts = products.filter(p => p.featured === true);
console.log('Featured products (true):', featuredProducts.length);
console.log('Featured product names:', featuredProducts.map(p => p.name));
console.log('=== END DEBUG ===');
  
  // Extract unique categories and count products in each
const categories = Array.from(
  new Set(products
    .map((product: any) => product.category)
    .filter(Boolean)  // Remove null/undefined
  )
)
  .sort()  // Alphabetical sort
  .map(category => ({
    id: category,
    name: category,
    count: products.filter((p: any) => p.category === category).length
  }));

  // Filter products
  // In /app/(shop)/products/page.tsx - Replace the filtering section (lines 72-85):
  // Get both parameters

// Filter products
// Filter products with hierarchical category support
const filteredProducts = products.filter((product: any) => {
  const productName = product.name || '';
  const productDescription = product.description || '';
  const productSubcategory = product.subcategory || '';  // e.g., "Injectables"
  const productMaincategory = product.maincategory || ''; // e.g., "AAS"
  
  // 1. Category filtering (hierarchical)
  let matchesCategory = true;
  
  if (selectedCategory !== 'all') {
    // First check if it matches the main category
    matchesCategory = productMaincategory?.toLowerCase() === selectedCategory.toLowerCase();
    
    // If subcategory is also specified, require both to match
    if (selectedSubcategory) {
      matchesCategory = matchesCategory && 
        productSubcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
    }
  }
  
  // 2. Search filtering
  const matchesSearch = !searchQuery || 
    productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    productDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    productSubcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    productMaincategory.toLowerCase().includes(searchQuery.toLowerCase());
  
  return matchesCategory && matchesSearch;
});
  
// Apply sorting
const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortBy) {
    case 'price-low':
      return (a.price || 0) - (b.price || 0);
    case 'price-high':
      return (b.price || 0) - (a.price || 0);
    case 'name-az':
      return (a.name || '').localeCompare(b.name || '');
    case 'name-za':
      return (b.name || '').localeCompare(a.name || '');
    case 'featured':
    default:
      // Use ONLY the featured field (not isFeatured)
      const aFeatured = Boolean(a.featured);
      const bFeatured = Boolean(b.featured);
      
      // Featured products first
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      
      // If same featured status, sort by name
      return (a.name || '').localeCompare(b.name || '');
  }
});
  
// Get featured products for the sidebar
//const featuredProducts = products.filter((p: any) => p.featured).slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pharmaceutical Product Catalog</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Browse our EU-GMP certified pharmaceutical peptides. Each batch undergoes rigorous 
            analytical validation including HPLC, LC-MS/MS, and amino acid analysis.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-1/4 space-y-6">
            
            {/* Professional Categories Filter */}
            {/* Professional Hierarchical Categories Filter */}
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
    <a 
      href="/products" 
      className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm' : 'hover:bg-gray-50 hover:border hover:border-gray-200'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${selectedCategory === 'all' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300 group-hover:bg-blue-300'}`}></div>
        <span className={`font-medium ${selectedCategory === 'all' ? 'text-blue-700' : 'text-gray-700'}`}>
          All Products
        </span>
      </div>
      <span className={`text-sm font-semibold ${selectedCategory === 'all' ? 'text-blue-600' : 'text-gray-500'}`}>
        {products.length}
      </span>
    </a>
    
    {/* Hierarchical Categories - You need to fetch this data properly */}
    {/* For now, I'll show a static example. You need to update your API */}
    
    {/* AAS Section */}
    <div className="pt-2">
      <div className="flex items-center justify-between mb-2 px-4">
        <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          AAS
        </span>
        <a 
          href="/products?category=AAS"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </a>
      </div>
      <div className="space-y-1">
        <a 
          href="/products?category=AAS&subcategory=Injectables"
          className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${selectedSubcategory === 'Injectables' && selectedCategory === 'AAS' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === 'Injectables' && selectedCategory === 'AAS' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${selectedSubcategory === 'Injectables' && selectedCategory === 'AAS' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
              Injectables
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {products.filter(p => p.subcategory === 'Injectables').length}
          </span>
        </a>
        <a 
          href="/products?category=AAS&subcategory=Orals"
          className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${selectedSubcategory === 'Orals' && selectedCategory === 'AAS' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === 'Orals' && selectedCategory === 'AAS' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${selectedSubcategory === 'Orals' && selectedCategory === 'AAS' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
              Orals
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {products.filter(p => p.subcategory === 'Orals').length}
          </span>
        </a>
      </div>
    </div>
    
    {/* Peptides Section */}
    <div className="pt-4">
      <div className="flex items-center justify-between mb-2 px-4">
        <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Peptides
        </span>
        <a 
          href="/products?category=Peptides"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </a>
      </div>
      <div className="space-y-1">
        <a 
          href="/products?category=Peptides&subcategory=Weightloss"
          className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${selectedSubcategory === 'Weightloss' && selectedCategory === 'Peptides' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === 'Weightloss' && selectedCategory === 'Peptides' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${selectedSubcategory === 'Weightloss' && selectedCategory === 'Peptides' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
              Weight Loss
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {products.filter(p => p.subcategory === 'Weightloss').length}
          </span>
        </a>
        <a 
          href="/products?category=Peptides&subcategory=Injury Healing"
          className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${selectedSubcategory === 'Injury Healing' && selectedCategory === 'Peptides' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === 'Injury Healing' && selectedCategory === 'Peptides' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${selectedSubcategory === 'Injury Healing' && selectedCategory === 'Peptides' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
              Injury Healing
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {products.filter(p => p.subcategory === 'Injury Healing').length}
          </span>
        </a>
        <a 
          href="/products?category=Peptides&subcategory=GH & GH Secretagogues"
          className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${selectedSubcategory === 'GH & GH Secretagogues' && selectedCategory === 'Peptides' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === 'GH & GH Secretagogues' && selectedCategory === 'Peptides' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${selectedSubcategory === 'GH & GH Secretagogues' && selectedCategory === 'Peptides' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
              GH & GH Secretagogues
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {products.filter(p => p.subcategory === 'GH & GH Secretagogues').length}
          </span>
        </a>
        <a 
          href="/products?category=Peptides&subcategory=Nootropics"
          className={`flex items-center justify-between group px-4 py-2.5 rounded-lg transition-all ml-4 ${selectedSubcategory === 'Nootropics' && selectedCategory === 'Peptides' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedSubcategory === 'Nootropics' && selectedCategory === 'Peptides' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${selectedSubcategory === 'Nootropics' && selectedCategory === 'Peptides' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
              Nootropics
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {products.filter(p => p.subcategory === 'Nootropics').length}
          </span>
        </a>
      </div>
    </div>
    
    {/* Add more sections as needed */}
  </div>
  
  {/* Active filters display */}
  {(selectedCategory !== 'all' || selectedSubcategory) && (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Active Filters</span>
        <a 
          href="/products" 
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedCategory !== 'all' && selectedCategory !== 'all' && (
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
            {selectedCategory}
            <a 
              href="/products" 
              className="ml-1 hover:text-blue-900"
            >
              ×
            </a>
          </div>
        )}
        {selectedSubcategory && (
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-xs font-medium px-3 py-1.5 rounded-full">
            {selectedSubcategory}
            <a 
              href={`/products?category=${encodeURIComponent(selectedCategory)}`} 
              className="ml-1 hover:text-cyan-900"
            >
              ×
            </a>
          </div>
        )}
      </div>
    </div>
  )}
</div>
            
            {/* Featured Products */}
          {/* Professional Featured Products - Clean Version */}
{featuredProducts.length > 0 && (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
          <Star className="h-4 w-4 text-white fill-white" />
        </div>
        <span>Featured Products</span>
      </h3>
      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
        Editor's Pick
      </span>
    </div>
    
    <div className="space-y-4">
      {featuredProducts.slice(0, 3).map((product: any) => (
        <a 
          key={product.id}
          href={`/products/${product.slug}`}
          className="group block overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <FlaskConical className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                {/* Featured ribbon */}
                <div className="absolute -top-1 -right-1 w-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 transform rotate-45 translate-x-4 -translate-y-1">
                    <div className="absolute top-1 left-1 text-white text-[8px] font-bold tracking-wider">
                      FEATURED
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-sm mb-1">
                  {product.name}
                </h4>
                
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {product.description?.substring(0, 60)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ${product.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {product.purity && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">
                            {typeof product.purity === 'string' ? product.purity : `${product.purity}%`} Purity
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>In Stock</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
    
    {/* View All Link */}
    <div className="mt-6 pt-6 border-t border-gray-200">
      <a 
        href="/products?sort=featured"
        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-blue-800 rounded-xl font-medium transition-all duration-300 group"
      >
        <span>Browse All Featured</span>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
)}
            
            {/* Quality Assurance */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold mb-3 text-blue-900">Quality Assurance</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5">✓</div>
                  <span>EU-GMP Manufacturing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5">✓</div>
                  <span>LC-MS/MS Validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5">✓</div>
                  <span>Full Documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5">✓</div>
                  <span>Third-Party Testing</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Main Content - Product Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl border">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedCategory === 'all' ? 'All Products' : selectedCategory} 
                  {searchQuery && ` matching "${searchQuery}"`}
                  {sortBy !== 'featured' && ` • Sorted by ${sortBy.replace('-', ' ')}`}
                </h2>
                <p className="text-gray-600">
                  {sortedProducts.length} of {products.length} products
                </p>
              </div>
              
                {/* Sorting */}
              <div className="mt-4 sm:mt-0">
                <SortSelect 
                  currentSort={sortBy}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
            
            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product: any) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    sku={product.slug} 
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    category={product.category}
                    dosage={product.dosage || 'Research'}
                    quantity={product.quantity || '1 vial'}
                    purity={product.purity || '99%'}
                    molecularWeight={product.molecularWeight || ''}
                    sequence={product.sequence || ''}
                    inStock={product.inStock !== undefined ? product.inStock : true}
                    isFeatured={product.featured || false}
                    original_price={product.original_price}
                    casNumber={product.casNumber || ''}
                    imageUrl={product.imageUrl} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <div className="text-5xl mb-6">🔬</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No products found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <a 
                  href="/products" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  View All Products
                </a>
              </div>
            )}
            
            {/* Pagination (simplified for now) */}
            {sortedProducts.length > 0 && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2">
                  <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                    Previous
                  </button>
                  <span className="px-4 py-2">Page 1 of 1</span>
                  <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}