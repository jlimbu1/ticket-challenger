import { Product } from '@/lib/types';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { GothicEmptyState } from '@/components/GothicEmptyState';

export default function HomePage() {
  if (!products || products.length === 0) {
    return (
      <main className="min-h-screen bg-black p-8">
        <GothicEmptyState
          title="The Shelves Are Empty"
          description="The records have all been claimed by the void. Check back when the darkness brings new arrivals."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-4 sm:p-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="font-gothic text-5xl tracking-widest text-crimson md:text-6xl">
            THE COLLECTION
          </h1>
          <p className="mt-4 font-serif text-lg italic text-gray-400">
            Browse our curated selection of rare and dark vinyl
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}