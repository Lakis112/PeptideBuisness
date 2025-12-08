import { Beaker, Shield } from 'lucide-react';
import ProductCard from './components/ProductCard';
import { products } from '@/lib/products';  // ADD THIS

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
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-6">
          <Shield className="h-4 w-4" />
          <span className="font-medium">99% Purity Guaranteed</span>
        </div>
        
       <h2 className="text-5xl font-bold mb-6">
  		Premium Research-Grade
  		<span className="text-blue-600"> Peptides</span>
	</h2>
        
        <p className="text-gray-600 text-lg mb-8">
          Laboratory-tested amino acid chains for scientific research. 
          Each batch comes with third-party Certificate of Analysis.
        </p>
        
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Browse All Products
          </button>
          <button className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
            View Research
          </button>
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