import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductDetail from '../../../components/ProductDetail';
import RelatedProducts from '../../../components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    notFound();
  }
  
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

// Generate static paths for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Add this function for SEO - SEPARATE FUNCTION!
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'Research peptide not found',
    };
  }
  
  return {
    title: `${product.name} | Research Peptide | PeptideScience`,
    description: `${product.description}. ${product.dosage}, ${product.purity} purity. Laboratory-grade research peptide for scientific study.`,
    keywords: [
      product.name,
      'research peptide',
      'laboratory-grade',
      product.category,
      'amino acid sequence',
      'HPLC-MS verified',
      'scientific research',
    ],
    openGraph: {
      title: `${product.name} | Research Peptide`,
      description: product.description,
      type: 'article',
      url: `https://peptidebuisness.vercel.app/products/${slug}`,
      images: [
        {
          url: `https://peptidebuisness.vercel.app/api/og?title=${encodeURIComponent(product.name)}&description=${encodeURIComponent(product.description)}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Research Peptide`,
      description: product.description,
      images: [`https://peptidebuisness.vercel.app/api/og?title=${encodeURIComponent(product.name)}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}