import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductDetail from '../../components/ProductDetail';
import RelatedProducts from '../../components/RelatedProducts';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  // Find product by slug
  const product = products.find(p => p.slug === params.slug);
  
  // If product not found, show 404
  if (!product) {
    notFound();
  }
  
  // Find related products (same category)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} category={product.category} />
    </div>
  );
}

// Generate static paths for all products (for SEO)
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}