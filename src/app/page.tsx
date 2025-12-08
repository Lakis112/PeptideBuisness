'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Beaker, Shield, Check, Thermometer, ArrowRight, X } from 'lucide-react';
import ProductCard from './components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter products based on category AND search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const showSearchResults = searchQuery && searchQuery.length > 0;

  const clearSearch = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-8 pt-8">
        <Beaker className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">
          Peptide<span className="text-blue-600">Science</span>
        </h1>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12 px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full mb-8">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">99% HPLC-MS Verified Purity</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Laboratory-Grade
              <span className="text-blue-600 block">Research Peptides</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
              Premium amino acid sequences for scientific study. 
              Third-party tested, batch-specific COAs, cold-chain shipped 
              to ensure maximum stability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
                Browse All Peptides →
              </button>
              <button className="px-10 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition">
                View Research Papers
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold">Third-Party Tested</div>
                  <div className="text-sm text-gray-600">HPLC-MS Analysis</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold">Cold Shipping</div>
                  <div className="text-sm text-gray-600">Temperature Controlled</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Product Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex flex-col items-center justify-center p-8">
                <div className="text-8xl mb-6">🧪</div>
                <h3 className="text-3xl font-bold text-white mb-2">BPC-157</h3>
                <p className="text-blue-100 mb-4">Body Protection Compound</p>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white">
                    99% Purity
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white">
                    5mg Vial
                  </span>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto mb-8 px-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            All Peptides
          </button>
          <button 
            onClick={() => setSelectedCategory('Weight Loss')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Weight Loss' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Weight Loss
          </button>
          <button 
            onClick={() => setSelectedCategory('Recovery')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Recovery' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Recovery
          </button>
          <button 
            onClick={() => setSelectedCategory('Growth Hormone')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Growth Hormone' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Growth Hormone
          </button>
          <button 
            onClick={() => setSelectedCategory('Cognitive')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Cognitive' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Cognitive
          </button>
          <button 
            onClick={() => setSelectedCategory('Skin/Anti-Aging')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Skin/Anti-Aging' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Skin & Anti-Aging
          </button>
          <button 
            onClick={() => setSelectedCategory('Sexual Health')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Sexual Health' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Sexual Health
          </button>
        </div>
        
        {/* Search & Filter info */}
        <div className="text-center mt-4 space-y-2">
          {showSearchResults && (
            <div className="flex items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                <span>Search results for: "{searchQuery}"</span>
                <button 
                  onClick={clearSearch}
                  className="hover:bg-blue-100 p-1 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} research peptides
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto mb-20 px-8">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium mb-4">
            🔬 Research Compounds
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Premium <span className="text-blue-600">Peptide Selection</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            High-purity amino acid chains for laboratory research. 
            Each peptide undergoes rigorous quality control and third-party verification.
          </p>
        </div>
        
        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🧪</div>
            <h3 className="text-xl font-bold mb-2">No peptides found</h3>
            <p className="text-gray-600 mb-6">
              {showSearchResults 
                ? `No results for "${searchQuery}". Try a different search term.`
                : `No peptides in ${selectedCategory} category. Try selecting "All Peptides".`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Show All Peptides
              </button>
              {showSearchResults && (
                <button 
                  onClick={clearSearch}
                  className="px-6 py-2 border border-gray-300 rounded-lg"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                {...product}
              />
            ))}
          </div>
        )}
        
        {/* View All Button */}
        {selectedCategory !== 'all' && !showSearchResults && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Show all {products.length} peptides</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Why Researchers Choose <span className="text-blue-600">PeptideScience</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We maintain the highest standards for research compound quality and reliability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🧪',
                title: 'Analytical Certificates',
                description: 'Batch-specific HPLC-MS certificates with full chromatograms'
              },
              {
                icon: '❄️',
                title: 'Cold Chain Integrity',
                description: 'Temperature-controlled shipping with ice packs & monitoring'
              },
              {
                icon: '📚',
                title: 'Research Support',
                description: 'Protocols, dosage calculators, and scientific literature'
              },
              {
                icon: '🔒',
                title: 'Secure Transactions',
                description: 'Encrypted payments and confidential ordering'
              },
              {
                icon: '⚡',
                title: 'Fast Processing',
                description: 'Orders shipped within 24 hours, priority lab processing'
              },
              {
                icon: '📞',
                title: 'Expert Support',
                description: 'Access to scientific team for research questions'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Disclaimer */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-t border-b border-red-200">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                ⚠️ Important Research Notice
              </h3>
              <div className="space-y-2 text-red-700 text-sm">
                <p className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>All products are sold as research chemicals for laboratory use only</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Not for human consumption, diagnostic, or therapeutic use</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Must be 18+ to purchase. By ordering, you confirm understanding of intended research use</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Consult with qualified professionals for research protocols</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-red-300">
              <h4 className="font-bold mb-3 text-sm">📋 Research Compliance</h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>IEC/IRB approval documentation available</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Material Safety Data Sheets (MSDS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Export compliance documentation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}