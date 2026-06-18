import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Classic Leather Backpack',
    slug: 'classic-leather-backpack',
    description: 'Handcrafted full-grain leather backpack with brass hardware. Features a padded laptop sleeve, two interior zip pockets, and adjustable canvas straps. Perfect for daily commutes or weekend adventures.',
    price: 189.99,
    imageUrl: 'https://picsum.photos/seed/backpack/600/600',
    category: 'Bags',
  },
  {
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and memory foam ear cushions. Supports Bluetooth 5.2 with multipoint connection for seamless device switching.',
    price: 149.99,
    imageUrl: 'https://picsum.photos/seed/headphones/600/600',
    category: 'Electronics',
  },
  {
    name: 'Minimalist Ceramic Mug Set',
    slug: 'minimalist-ceramic-mug-set',
    description: 'Set of four hand-thrown ceramic mugs in matte earth tones. Each mug holds 12 ounces and features a comfortable ergonomic handle. Dishwasher and microwave safe.',
    price: 39.99,
    imageUrl: 'https://picsum.photos/seed/mugs/600/600',
    category: 'Home',
  },
  {
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    description: 'Ultra-soft 100% organic cotton crew neck t-shirt with a relaxed fit. Pre-shrunk fabric with reinforced stitching at shoulders and hem. Available in five neutral colors.',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/tshirt/600/600',
    category: 'Clothing',
  },
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Double-wall vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Made from 18/8 stainless steel with a leak-proof bamboo cap. BPA-free and dishwasher safe.',
    price: 34.99,
    imageUrl: 'https://picsum.photos/seed/bottle/600/600',
    category: 'Home',
  },
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Mesh back ergonomic office chair with adjustable lumbar support, 4D armrests, and a tilt-lock mechanism. Breathable fabric seat with memory foam cushioning for all-day comfort.',
    price: 399.99,
    imageUrl: 'https://picsum.photos/seed/chair/600/600',
    category: 'Furniture',
  },
  {
    name: 'Scented Soy Candle Collection',
    slug: 'scented-soy-candle-collection',
    description: 'Set of three hand-poured soy wax candles in amber glass jars. Scents include vanilla bean, lavender fields, and cedar smoke. Each candle burns for 45+ hours with a clean, even flame.',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/candles/600/600',
    category: 'Home',
  },
  {
    name: 'Leather Journal Notebook',
    slug: 'leather-journal-notebook',
    description: 'Hand-bound leather journal with 240 pages of acid-free, cream-colored paper. Features a lay-flat binding, ribbon bookmark, and elastic closure. Perfect for journaling, sketching, or note-taking.',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/journal/600/600',
    category: 'Stationery',
  },
];

async function main() {
  console.log('Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.shippingAddress.deleteMany();
  await prisma.paymentInfo.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();

  console.log('Seeding products...');
  for (const product of products) {
    try {
      await prisma.product.create({
        data: product,
      });
      console.log('  Created product:', product.name);
    } catch (error) {
      console.error('Failed to seed product:', product.name, error);
      throw error;
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });