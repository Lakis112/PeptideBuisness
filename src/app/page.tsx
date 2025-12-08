import { Beaker, Shield } from 'lucide-react';
import ProductCard from './components/ProductCard';
import { products } from '@/lib/products';  // ADD THIS
import { Check, Thermometer } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Beaker className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">
          Peptide<span className="text-blue-600">Science</span>
        </h1>
      </div>

      {/* Hero */}
            {/* Hero Section - IMPROVED */}
      <div className="max-w-6xl mx-auto mb-16">
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
      {/* Product Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}