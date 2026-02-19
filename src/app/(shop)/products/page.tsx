import ProductCard from '@components/ProductCard';
import { Filter, Grid, ChevronRight, Star, FlaskConical, ShoppingCart } from 'lucide-react';
import SortSelect from '@components/SortSelect';
import CategoriesSidebar from '@components/CategoriesSidebar'; // NEW COMPONENT
import Link from 'next/link';

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
    let baseUrl;
    
    if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://peptide-buisness.vercel.app';
    } else {
      baseUrl = 'http://localhost:3000';
    }
    
    console.log('Fetching from:', `${baseUrl}/api/products`);

    const apiUrl = `${baseUrl}/api/products`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) return [];
    const data = await response.json();
    
    return data.map((product: any) => ({
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
      originalPrice: product.originalPrice 
        ? (typeof product.originalPrice === 'string' 
          ? parseFloat(product.originalPrice) 
          : product.originalPrice)
        : undefined,
      dosage: product.dosage || 'Research',
      quantity: product.quantity || '1 vial',
      purity: product.purity || '99%',
      inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0),
      featured: product.featured || false
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

  // Filter products
  const filteredProducts = products.filter((product: any) => {
    const productName = product.name || '';
    const productDescription = product.description || '';
    const productSubcategory = product.subcategory || '';
    const productMaincategory = product.maincategory || '';
    
    // Category filtering (hierarchical)
    let matchesCategory = true;
    
    if (selectedCategory !== 'all') {
      matchesCategory = productMaincategory?.toLowerCase() === selectedCategory.toLowerCase();
      
      if (selectedSubcategory) {
        matchesCategory = matchesCategory && 
          productSubcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
      }
    }
    
    // Search filtering
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
        const aFeatured = Boolean(a.featured);
        const bFeatured = Boolean(b.featured);
        
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        
        return (a.name || '').localeCompare(b.name || '');
    }
  });
  
  // Get featured products for sidebar
  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pharmaceutical Product Catalog</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Browse our pharmaceutical products catalog. Each batch undergoes rigorous 
            analytical validation including HPLC, LC-MS/MS, and amino acid analysis.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Dynamic Categories */}
          <div className="lg:w-1/4 space-y-6">
            {/* Dynamic Categories Component */}
            <CategoriesSidebar 
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              products={products}
            />
            
            {/* Featured Products */}
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
                  {featuredProducts.map((product: any) => (
                    <Link 
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
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
                          </div>
                          
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
                                </div>
                              </div>
                              
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ChevronRight className="h-4 w-4 text-blue-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
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
                <Link 
                  href="/products" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
