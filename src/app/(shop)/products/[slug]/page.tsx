import { notFound } from 'next/navigation';
import ProductDetail from '@components/ProductDetail';
import RelatedProducts from '@components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    
    // Ensure price is a NUMBER
    return {
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : (data.price || 0),
      originalPrice: data.originalPrice 
        ? (typeof data.originalPrice === 'string' 
          ? parseFloat(data.originalPrice) 
          : data.originalPrice)
        : undefined
    };
  } catch {
    return null;
  }
}

async function getProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) return [];
    const data = await response.json();
    
    // Ensure ALL prices are NUMBERS
    return data.map((product: any) => ({
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
      originalPrice: product.originalPrice 
        ? (typeof product.originalPrice === 'string' 
          ? parseFloat(product.originalPrice) 
          : product.originalPrice)
        : undefined
    }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const [product, products] = await Promise.all([
    getProduct(slug),
    getProducts()
  ]);
  
  if (!product) {
    notFound();
  }
  
  const relatedProducts = products
    .filter((p: any) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
  <div className="min-h-screen bg-gray-50">
    <ProductDetail 
      product={product} 
      sku={product.slug || product.sku}  // ← Add sku prop
    />
    <RelatedProducts 
      products={relatedProducts} 
      category={product.category}
      sku={product.slug || product.sku}  // ← Add sku prop
    />
  </div>
);
}

// FIXED: Generate static paths with proper error handling
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    
    return products
      .filter((product: any) => product.sku && typeof product.sku === 'string')
      .map((product: any) => ({
        slug: product.sku,
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'Research peptide not found',
    };
  }
  
  return {
    title: `${product.name} | Research Peptide | PeptideScience`,
    description: `${product.description}. Laboratory-grade research peptide for scientific study.`,
  };
}