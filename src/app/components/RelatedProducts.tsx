import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: any[];
  category: string;
  sku?: string; // ← Add this
}

export default function RelatedProducts({ products, category }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Related <span className="text-blue-600">{category}</span> Peptides
        </h2>
        <p className="text-gray-600">
          Other research compounds in the same category
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            sku={product.slug || product.sku} // ← CRITICAL: Add this
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
            // Add optional fields if needed:
            originalPrice={product.originalPrice}
            casNumber={product.casNumber || ''}
          />
        ))}
      </div>
    </div>
  );
}