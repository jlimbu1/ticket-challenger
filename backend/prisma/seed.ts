import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('ritual123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ticketchallenger.com',
      password: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create sample customer user for testing
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@ticketchallenger.com',
      password: customerPassword,
      name: 'Gerard Way',
      role: Role.CUSTOMER,
    },
  });

  console.log('Created customer user:', customerUser.email);

  // Create 20+ products with MCR-themed names and descriptions
  const products = [
    {
      name: 'Three Cheers for Sweet Revenge T-Shirt',
      description: 'Black t-shirt featuring the iconic Three Cheers album artwork. 100% cotton, pre-shrunk.',
      price: 29.99,
      category: 'Apparel',
      imageUrl: '/images/product-1.jpg',
      stock: 50,
    },
    {
      name: 'The Black Parade Hoodie',
      description: 'Heavyweight black hoodie with The Black Parade skeleton emblem embroidered on chest.',
      price: 59.99,
      category: 'Apparel',
      imageUrl: '/images/product-2.jpg',
      stock: 35,
    },
    {
      name: 'Danger Days Jacket',
      description: 'Vintage-style denim jacket with Danger Days killjoy patches. Limited edition.',
      price: 89.99,
      category: 'Apparel',
      imageUrl: '/images/product-3.jpg',
      stock: 20,
    },
    {
      name: 'Revenge Era Zip-Up',
      description: 'Black zip-up hoodie with crimson red lining and revenge-era print on back.',
      price: 64.99,
      category: 'Apparel',
      imageUrl: '/images/product-4.jpg',
      stock: 40,
    },
    {
      name: 'Helena Music Box Necklace',
      description: 'Antique silver locket that opens to reveal a tiny music box playing Helena.',
      price: 34.99,
      category: 'Accessories',
      imageUrl: '/images/product-5.jpg',
      stock: 25,
    },
    {
      name: 'Skull Ring - Sterling Silver',
      description: '925 sterling silver skull ring with ruby eyes. Adjustable band.',
      price: 44.99,
      category: 'Accessories',
      imageUrl: '/images/product-6.jpg',
      stock: 30,
    },
    {
      name: 'Black Parade Arm Band',
      description: 'Embroidered arm band with The Black Parade logo. One size fits most.',
      price: 14.99,
      category: 'Accessories',
      imageUrl: '/images/product-7.jpg',
      stock: 100,
    },
    {
      name: 'Rose Choker',
      description: 'Black velvet choker with a single crimson rose pendant. Adjustable.',
      price: 19.99,
      category: 'Accessories',
      imageUrl: '/images/product-8.jpg',
      stock: 45,
    },
    {
      name: 'Three Cheers Vinyl LP',
      description: 'Limited edition red vinyl pressing of Three Cheers for Sweet Revenge. Includes lyric booklet.',
      price: 39.99,
      category: 'Vinyl',
      imageUrl: '/images/product-9.jpg',
      stock: 15,
    },
    {
      name: 'The Black Parade Vinyl LP',
      description: '180g black vinyl with gatefold sleeve featuring the Patient artwork.',
      price: 44.99,
      category: 'Vinyl',
      imageUrl: '/images/product-10.jpg',
      stock: 20,
    },
    {
      name: 'Danger Days Vinyl LP',
      description: 'Electric blue vinyl pressing of Danger Days: The True Lives of the Fabulous Killjoys.',
      price: 42.99,
      category: 'Vinyl',
      imageUrl: '/images/product-11.jpg',
      stock: 18,
    },
    {
      name: 'I Brought You My Bullets Vinyl LP',
      description: 'Reissue on white vinyl. Original demo recordings remastered.',
      price: 36.99,
      category: 'Vinyl',
      imageUrl: '/images/product-12.jpg',
      stock: 12,
    },
    {
      name: 'Conventional Weapons Vinyl LP',
      description: 'Rare compilation of unreleased tracks on clear vinyl. Limited pressing.',
      price: 49.99,
      category: 'Vinyl',
      imageUrl: '/images/product-13.jpg',
      stock: 8,
    },
    {
      name: 'The Black Parade Poster',
      description: '24x36 inch poster featuring the original The Black Parade album art. Glossy finish.',
      price: 12.99,
      category: 'Posters',
      imageUrl: '/images/product-14.jpg',
      stock: 60,
    },
    {
      name: 'Three Cheers Poster',
      description: '24x36 inch poster of the Three Cheers for Sweet Revenge cover art. Matte finish.',
      price: 12.99,
      category: 'Posters',
      imageUrl: '/images/product-15.jpg',
      stock: 55,
    },
    {
      name: 'Danger Days Killjoy Poster',
      description: '24x36 inch poster featuring the four killjoys from Danger Days. Glow-in-the-dark ink.',
      price: 15.99,
      category: 'Posters',
      imageUrl: '/images/product-16.jpg',
      stock: 40,
    },
    {
      name: 'Revenge Tour Poster',
      description: 'Limited edition 18x24 inch poster from the 2005 Revenge tour. Vintage paper stock.',
      price: 24.99,
      category: 'Posters',
      imageUrl: '/images/product-17.jpg',
      stock: 25,
    },
    {
      name: 'MCR Logo Beanie',
      description: 'Black knit beanie with embroidered MCR logo in white. One size.',
      price: 22.99,
      category: 'Apparel',
      imageUrl: '/images/product-18.jpg',
      stock: 70,
    },
    {
      name: 'Helena Gloves',
      description: 'Lace fingerless gloves with ribbon ties. Inspired by the Helena music video.',
      price: 18.99,
      category: 'Accessories',
      imageUrl: '/images/product-19.jpg',
      stock: 35,
    },
    {
      name: 'Famous Last Words Tank Top',
      description: 'Black tank top with Famous Last Words lyric print on front. Racerback style.',
      price: 24.99,
      category: 'Apparel',
      imageUrl: '/images/product-20.jpg',
      stock: 45,
    },
    {
      name: 'Life on Mars? T-Shirt',
      description: 'White t-shirt with Life on Mars? graphic and vintage wash. Unisex fit.',
      price: 27.99,
      category: 'Apparel',
      imageUrl: '/images/product-21.jpg',
      stock: 30,
    },
    {
      name: 'MCR Patch Set',
      description: 'Set of 5 embroidered patches including logo, album art, and skull designs.',
      price: 9.99,
      category: 'Accessories',
      imageUrl: '/images/product-22.jpg',
      stock: 80,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Created ${products.length} products`);

  // Create a sample order for the customer
  const sampleProducts = await prisma.product.findMany({ take: 3 });
  const orderTotal = sampleProducts.reduce((sum, p) => sum + p.price, 0);

  const sampleOrder = await prisma.order.create({
    data: {
      userId: customerUser.id,
      status: OrderStatus.COMPLETED,
      total: orderTotal,
      items: {
        create: sampleProducts.map((product) => ({
          productId: product.id,
          quantity: 1,
          price: product.price,
        })),
      },
    },
  });

  console.log('Created sample order:', sampleOrder.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });