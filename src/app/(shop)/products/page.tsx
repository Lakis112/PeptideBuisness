import ProductCard from '@components/ProductCard';
import { Filter, Grid } from 'lucide-react';

export const metadata = {
  title: 'Product Catalog | Pharmaceutical Grade Peptides',
  description: 'Browse our complete catalog of EU-GMP pharmaceutical grade peptides for research use.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

async function getProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
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
      inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0)
    }));
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category || 'all';
  const searchQuery = params?.search || '';
  
  const products = await getProducts();
  
  // Extract unique categories and count products in each
  const categories = Array.from(
    new Set(products.map((product: any) => product.category))
  )
    .filter(Boolean)
    .map(category => ({
      id: category,
      name: category,
      count: products.filter((p: any) => p.category === category).length
    }));

  // Filter products
  const filteredProducts = products.filter((product: any) => {
    const productName = product.name || '';
    const productDescription = product.description || '';
    const productCategory = product.category || '';
    
    const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
    const matchesSearch = !searchQuery || 
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Get featured products for the sidebar
  const featuredProducts = products.filter((p: any) => p.isFeatured || p.featured).slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pharmaceutical Peptide Catalog</h1>
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
            {/* Categories Filter */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Categories
              </h3>
              <div className="space-y-2">
                <a 
                  href="/products" 
                  className={`block px-4 py-2 rounded-lg transition ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Products
                  <span className="float-right text-gray-500">{products.length}</span>
                </a>
                {categories.map((category) => (
                  <a 
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className={`block px-4 py-2 rounded-lg transition ${selectedCategory === category.name ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {category.name}
                    <span className="float-right text-gray-500">{category.count}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold mb-4">Featured Products</h3>
                <div className="space-y-4">
                  {featuredProducts.map((product: any) => (
                   <a 
  key={product.id}
  href={`/products/${product.slug || product.sku}`}
  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition"
>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🧪</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </a>
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
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} of {products.length} products
                </p>
              </div>
              
              {/* Sorting */}
              <div className="mt-4 sm:mt-0">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                  <Grid className="h-4 w-4" />
                  Sort by: Featured
                </button>
              </div>
            </div>
            
            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredProducts.map((product: any) => (
    <ProductCard 
      key={product.id} 
      id={product.id}
      sku={product.slug || product.sku} 
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
      isFeatured={product.isFeatured || false}
      // Optional fields if your API returns them
      originalPrice={product.originalPrice}
      casNumber={product.casNumber || ''}
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
            {filteredProducts.length > 0 && (
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