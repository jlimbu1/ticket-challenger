import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Classic Leather Backpack',
    description: 'Handcrafted full-grain leather backpack with brass hardware. Features a padded laptop sleeve, two interior zip pockets, and adjustable canvas straps. Perfect for daily commutes or weekend adventures.',
    price: 189.99,
    imageUrl: 'https://picsum.photos/seed/backpack/600/600',
    category: 'Bags',
  },
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and memory foam ear cushions. Supports Bluetooth 5.2 with multipoint connection for seamless device switching.',
    price: 149.99,
    imageUrl: 'https://picsum.photos/seed/headphones/600/600',
    category: 'Electronics',
  },
  {
    name: 'Minimalist Ceramic Mug Set',
    description: 'Set of four hand-thrown ceramic mugs in matte earth tones. Each mug holds 12 ounces and features a comfortable ergonomic handle. Dishwasher and microwave safe.',
    price: 39.99,
    imageUrl: 'https://picsum.photos/seed/mugs/600/600',
    category: 'Home',
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton crew neck t-shirt with a relaxed fit. Pre-shrunk fabric with reinforced stitching at shoulders and hem. Available in five neutral colors.',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/tshirt/600/600',
    category: 'Clothing',
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. 32-ounce capacity with leak-proof bamboo lid and carrying loop. BPA-free and dishwasher safe.',
    price: 34.99,
    imageUrl: 'https://picsum.photos/seed/bottle/600/600',
    category: 'Accessories',
  },
  {
    name: 'Handwoven Wool Throw Blanket',
    description: 'Luxuriously soft throw blanket woven from premium New Zealand wool. Features a classic herringbone pattern with fringed edges. Measures 50 x 70 inches.',
    price: 89.99,
    imageUrl: 'https://picsum.photos/seed/blanket/600/600',
    category: 'Home',
  },
  {
    name: 'Slim Leather Wallet',
    description: 'Minimalist bifold wallet crafted from vegetable-tanned Italian leather. Holds up to 8 cards plus cash, with a quick-access card slot. Develops a rich patina over time.',
    price: 59.99,
    imageUrl: 'https://picsum.photos/seed/wallet/600/600',
    category: 'Accessories',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact waterproof speaker with 360-degree sound and 20-hour battery life. IP67 rated for dust and water resistance. Built-in microphone for hands-free calls.',
    price: 79.99,
    imageUrl: 'https://picsum.photos/seed/speaker/600/600',
    category: 'Electronics',
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of three organic bamboo cutting boards in graduated sizes. Naturally antimicrobial and knife-friendly with juice grooves and easy-grip handles. Includes a stand for vertical storage.',
    price: 44.99,
    imageUrl: 'https://picsum.photos/seed/cuttingboard/600/600',
    category: 'Home',
  },
  {
    name: 'Merino Wool Beanie',
    description: 'Rib-knit beanie made from fine 19.5 micron merino wool. Lightweight, breathable, and itch-free with a fold-up brim. One size fits most adults.',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/beanie/600/600',
    category: 'Clothing',
  },
];

async function main() {
  console.log('Seeding database...');

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });