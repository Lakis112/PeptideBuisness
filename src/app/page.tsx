'use client';
import Link from 'next/link';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  dosage?: string;
  purity?: string;
  stock?: number;
  inStock?: boolean;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['all']);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          
          // Extract unique categories
          const uniqueCategories = ['all', ...new Set(data.map((p: Product) => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category AND search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===== PROFESSIONAL HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* FULL BACKGROUND MOLECULAR PATTERN - 50% OPACITY */}
        <div className="absolute inset-0 z-0 opacity-50">
          {/* Large repeating molecular pattern */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="text-blue-200">
              <defs>
                <pattern id="molecular-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  {/* Central atom */}
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                  
                  {/* Surrounding atoms */}
                  <circle cx="20" cy="30" r="3" fill="currentColor" />
                  <circle cx="80" cy="30" r="3" fill="currentColor" />
                  <circle cx="20" cy="70" r="3" fill="currentColor" />
                  <circle cx="80" cy="70" r="3" fill="currentColor" />
                  <circle cx="30" cy="20" r="3" fill="currentColor" />
                  <circle cx="70" cy="20" r="3" fill="currentColor" />
                  <circle cx="30" cy="80" r="3" fill="currentColor" />
                  <circle cx="70" cy="80" r="3" fill="currentColor" />
                  
                  {/* Bonds */}
                  <line x1="50" y1="50" x2="20" y2="30" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="80" y2="30" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="20" y2="70" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="30" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="70" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="30" y2="80" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="70" y2="80" stroke="currentColor" strokeWidth="1" />
                  
                  {/* Additional small molecules */}
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                  <circle cx="90" cy="10" r="2" fill="currentColor" />
                  <circle cx="10" cy="90" r="2" fill="currentColor" />
                  <circle cx="90" cy="90" r="2" fill="currentColor" />
                  
                  {/* Peptide chain segments */}
                  <circle cx="5" cy="50" r="2" fill="currentColor" />
                  <circle cx="95" cy="50" r="2" fill="currentColor" />
                  <circle cx="50" cy="5" r="2" fill="currentColor" />
                  <circle cx="50" cy="95" r="2" fill="currentColor" />
                  
                  <line x1="5" y1="50" x2="20" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="95" y1="50" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="50" y1="5" x2="30" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="50" y1="95" x2="30" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#molecular-pattern)" />
            </svg>
          </div>
          
          {/* Additional floating molecular clusters */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-300">
              {/* Circular peptide structure */}
              <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
              {Array.from({length: 8}).map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const x = 100 + 40 * Math.cos(angle);
                const y = 100 + 40 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="5" fill="currentColor" />;
              })}
            </svg>
          </div>
          
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48">
            <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-300">
              {/* Helical peptide structure */}
              {Array.from({length: 6}).map((_, i) => {
                const x = 25 + i * 20;
                const y = 75 + 15 * Math.sin(i * 1.5);
                return <circle key={i} cx={x} cy={y} r="4" fill="currentColor" />;
              })}
              {Array.from({length: 5}).map((_, i) => {
                const x1 = 25 + i * 20;
                const y1 = 75 + 15 * Math.sin(i * 1.5);
                const x2 = 25 + (i + 1) * 20;
                const y2 = 75 + 15 * Math.sin((i + 1) * 1.5);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
              })}
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center mb-12">
              {/* Pharmaceutical Grade Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-2 rounded-full mb-8 backdrop-blur-sm bg-white/10 border border-white/20">
                <span className="text-sm font-semibold">PHARMACEUTICAL GRADE</span>
                <span className="text-xs opacity-90">GMP-Compliant</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-900">
                  Ultra-Pure
                </span>
                <span className="block text-gray-900">Pharmaceutical Peptides</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed backdrop-blur-sm bg-white/30 p-4 rounded-xl">
                Pharmaceutical-grade peptides manufactured under EU-GMP standards in Poland. 
                Each batch undergoes <span className="font-semibold text-blue-800">triple-quadrupole LC-MS/MS validation</span> with full regulatory documentation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-800 to-indigo-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-900 hover:to-indigo-950 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  Browse Pharmaceutical Catalog
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
                
                <Link 
                  href="/research" 
                  className="inline-flex items-center justify-center gap-3 bg-white/90 text-blue-800 border-2 border-blue-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  View Analytical Documentation
                </Link>
              </div>

              {/* TRUST BADGES */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <div className="flex items-center gap-2 bg-white/90 px-4 py-3 rounded-xl shadow-lg border border-blue-200 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">HPLC Verified ≥99%</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 px-4 py-3 rounded-xl shadow-lg border border-blue-200 backdrop-blur-sm">
                  <div className="text-blue-700 font-bold">🇵🇱</div>
                  <span className="text-sm font-medium text-gray-900">Poland-Based GMP Facility</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 px-4 py-3 rounded-xl shadow-lg border border-blue-200 backdrop-blur-sm">
                  <div className="text-purple-700">📦</div>
                  <span className="text-sm font-medium text-gray-900">EU & Global Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 px-4 py-3 rounded-xl shadow-lg border border-blue-200 backdrop-blur-sm">
                  <div className="text-red-700">📄</div>
                  <span className="text-sm font-medium text-gray-900">Full Regulatory Documentation</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col items-center gap-4 text-gray-700">
                <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl backdrop-blur-sm">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 font-medium text-gray-900">4.9/5 from 412 clinical research teams</span>
                </div>
                <p className="text-sm bg-white/70 p-2 rounded-lg backdrop-blur-sm">Trusted by EU Pharmaceutical Companies, University Hospitals, and Clinical Research Organizations</p>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
              <div className="bg-white/90 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm hover:border-blue-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🏭</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">EU-GMP Manufacturing</h3>
                <p className="text-gray-700">Produced in Poland under EU Good Manufacturing Practice regulations for pharmaceutical ingredients.</p>
              </div>
              
              <div className="bg-white/90 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm hover:border-blue-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Complete Analytical Suite</h3>
                <p className="text-gray-700">HPLC, LC-MS/MS, NMR, amino acid analysis, and chiral purity verification for each batch.</p>
              </div>
              
              <div className="bg-white/90 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm hover:border-blue-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Regulatory Compliance</h3>
                <p className="text-gray-700">Full documentation for EMA/FDA submissions including CMC, stability, and impurity profiling.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== END HERO SECTION ===== */}

      {/* Products Section */}
            {/* Featured Products Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Pharmaceutical Peptides</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our selection of EU-GMP certified peptides for research applications
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading pharmaceutical products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 8).map((product) => (
                  <ProductCard 
                    key={product.id}
                    {...{
                      ...product,
                      // Ensure all required props are passed
                      dosage: product.dosage || 'Research',
                      quantity: '1 vial',
                      purity: product.purity || '99%',
                      molecularWeight: '',
                      sequence: '',
                      inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0),
                      isFeatured: false
                    }}
                  />
                ))}
              </div>

              {/* View All Button - Shows only if we have products */}
              <div className="text-center mt-12">
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl"
                >
                  View All Pharmaceutical Products
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Link 
                href="/products" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

            {/* Stats Section */}
      {/* ===== PROFESSIONAL STATS SECTION ===== */}
<section className="py-16 bg-gradient-to-b from-blue-50 to-white">
  <div className="container mx-auto px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Pharmaceutical <span className="text-blue-800">Excellence</span> Metrics
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Quantifiable quality standards that define our commitment to research-grade peptide production
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        
        {/* Purity Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🧪</span>
            </div>
            
            {/* Stat Number */}
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">99.5</span>
              <span className="text-2xl font-bold text-blue-700 ml-1">%</span>
            </div>
            
            {/* Label */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Purity</h3>
            <p className="text-sm text-gray-600">
              HPLC-validated purity across all batches with full chromatographic documentation
            </p>
          </div>
        </div>

        {/* Research Institutions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🏛️</span>
            </div>
            
            {/* Stat Number */}
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">500</span>
              <span className="text-2xl font-bold text-green-700 ml-1">+</span>
            </div>
            
            {/* Label */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Research Institutions</h3>
            <p className="text-sm text-gray-600">
              Trusted by pharmaceutical companies, universities, and clinical research organizations worldwide
            </p>
          </div>
        </div>

        {/* Shipping Time */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🚚</span>
            </div>
            
            {/* Stat Number */}
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">48</span>
              <span className="text-2xl font-bold text-purple-700 ml-1">h</span>
            </div>
            
            {/* Label */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Shipping</h3>
            <p className="text-sm text-gray-600">
              Temperature-controlled express delivery with real-time tracking and monitoring
            </p>
          </div>
        </div>

        {/* Expert Support */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👨‍🔬</span>
            </div>
            
            {/* Stat Number */}
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">24/7</div>
            
            {/* Label */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Support</h3>
            <p className="text-sm text-gray-600">
              Pharmaceutical scientists and regulatory specialists available for technical consultation
            </p>
          </div>
        </div>
      </div>

      {/* Quality Assurance Note */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-6 py-3 rounded-xl">
          <span className="text-blue-700">🛡️</span>
          <span className="font-medium text-gray-800">
            All metrics are continuously monitored under our ISO 9001-certified Quality Assurance Process
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Quality Assurance Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quality Assurance Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Raw Material Testing</h3>
              <p className="text-gray-600">Every raw material undergoes identity confirmation via NMR and chiral HPLC before synthesis.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">In-Process Controls</h3>
              <p className="text-gray-600">Real-time monitoring during synthesis with intermediate purity checks at each step.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Final Release Testing</h3>
              <p className="text-gray-600">Triple-quadrupole LC-MS/MS, amino acid analysis, and sterility testing for final release.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Research?</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
            Access pharmaceutical-grade peptides with complete analytical documentation for your research needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Request Technical Documentation
            </Link>
            <Link 
              href="/products" 
              className="bg-white text-blue-700 border-2 border-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Product Catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Main export with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}