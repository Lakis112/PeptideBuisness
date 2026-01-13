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
    // Use absolute URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://peptide-buisness.vercel.app' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
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
    // Use absolute URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://peptide-buisness.vercel.app' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/products`, {
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
  
  // DEBUG - Add these 4 lines
  console.log('Current product category:', product.category);
  console.log('All products count:', products.length);
  console.log('Sample products:', products.slice(0, 3).map(p => ({ id: p.id, category: p.category, name: p.name })));

  const relatedProducts = products
    .filter((p: any) => {
      const isMatch = p.category === product.category && p.id !== product.id;
      console.log(`Product ${p.id} (${p.category}) matches? ${isMatch}`);
      return isMatch;
    })
    .slice(0, 4);

console.log('Related products found:', relatedProducts.length); // Add this line
      
  return (
  <div className="min-h-screen bg-gray-50">
    <ProductDetail 
      product={product} 
      sku={product.slug || product.sku}  // ← Add sku prop
      imageUrl={product.imageUrl}
    />
    <RelatedProducts 
      products={relatedProducts} 
      category={product.category}
      sku={product.slug || product.sku}  // ← Add sku prop
    />
  </div>
);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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