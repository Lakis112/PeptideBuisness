import { Beaker, Shield, Check, Thermometer, ArrowRight } from 'lucide-react';
import ProductCard from './components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-8 pt-8">
        <Beaker className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">
          Peptide<span className="text-blue-600">Science</span>
        </h1>
      </div>

      {/* Hero Section - IMPROVED */}
      <div className="max-w-7xl mx-auto mb-16 px-8">
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

      {/* Featured Products - IMPROVED */}
      <div className="max-w-7xl mx-auto mb-20 px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium mb-4">
            🔬 Research Compounds
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Premium <span className="text-blue-600">Peptide Selection</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            High-purity amino acid chains for laboratory research. 
            Each peptide undergoes rigorous quality control and third-party verification.
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium">
            All Peptides
          </button>
          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium">
            Recovery Peptides
          </button>
          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium">
            Growth Factors
          </button>
          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium">
            Cognitive Enhancers
          </button>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              {...product}
            />
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
            <span>View All 12+ Research Peptides</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Why Researchers Choose <span className="text-blue-600">PeptideScience</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We maintain the highest standards for research compound quality and reliability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={index} className="bg-white p-8 rounded-2xl border hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Disclaimer */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-t border-b border-red-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-red-800 mb-4">
                ⚠️ Important Research Notice
              </h3>
              <div className="space-y-3 text-red-700">
                <p className="flex items-start gap-3">
                  <span className="font-bold">•</span>
                  <span>All products are sold as research chemicals for laboratory use only</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-bold">•</span>
                  <span>Not for human consumption, diagnostic, or therapeutic use</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-bold">•</span>
                  <span>Must be 18+ to purchase. By ordering, you confirm understanding of intended research use</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-bold">•</span>
                  <span>Consult with qualified professionals for research protocols</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-red-300">
              <h4 className="font-bold mb-3">📋 Research Compliance</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>IEC/IRB approval documentation available</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Material Safety Data Sheets (MSDS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
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