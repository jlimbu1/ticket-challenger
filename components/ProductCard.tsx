import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

const SKULL_ROSE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 10 C30 10 15 25 15 45 C15 60 25 72 35 78 L35 90 L65 90 L65 78 C75 72 85 60 85 45 C85 25 70 10 50 10Z" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="35" cy="40" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="65" cy="40" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="35" cy="40" r="3" fill="currentColor"/>
  <circle cx="65" cy="40" r="3" fill="currentColor"/>
  <path d="M40 55 Q50 65 60 55" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M50 45 L50 50" stroke="currentColor" stroke-width="2"/>
  <path d="M85 45 C95 35 95 20 85 15 C75 10 70 20 75 30" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M15 45 C5 35 5 20 15 15 C25 10 30 20 25 30" fill="none" stroke="currentColor" stroke-width="1.5"/>
</svg>`;

export function ProductCard({ product }: ProductCardProps) {
  if (!product) {
    return null;
  }

  const { name, price, description, imageUrl, category } = product;

  if (!name || typeof price !== 'number' || price < 0) {
    return null;
  }

  return (
    <article className="group relative overflow-hidden rounded-lg bg-zinc-900 transition-transform duration-500 hover:scale-105">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: SKULL_ROSE_SVG }}
        />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(139, 0, 0, 0.1) 2px,
                rgba(139, 0, 0, 0.1) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(74, 0, 130, 0.1) 2px,
                rgba(74, 0, 130, 0.1) 4px
              )
            `,
          }}
        />
      </div>
      <div className="p-4">
        <span className="font-serif text-xs uppercase tracking-widest text-crimson">
          {category}
        </span>
        <h3 className="mt-1 font-gothic text-xl text-white transition-colors duration-300 group-hover:text-crimson">
          {name}
        </h3>
        <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-gray-400">
          {description}
        </p>
        <p className="mt-3 font-gothic text-lg text-purple-400">
          ${price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}