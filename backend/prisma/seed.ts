import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Create 12 MCR-themed products
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
      description: 'Heavyweight black hoodie with The Black Parade album cover print. Fleece-lined for warmth.',
      price: 59.99,
      category: 'Apparel',
      imageUrl: '/images/product-2.jpg',
      stock: 30,
    },
    {
      name: 'Welcome to the Black Parade Vinyl',
      description: 'Limited edition 180g vinyl pressing of The Black Parade. Includes lyric booklet and poster.',
      price: 34.99,
      category: 'Music',
      imageUrl: '/images/product-3.jpg',
      stock: 100,
    },
    {
      name: 'I Brought You My Bullets... Vinyl',
      description: 'Reissue of the debut album on translucent red vinyl. Gatefold sleeve with original artwork.',
      price: 29.99,
      category: 'Music',
      imageUrl: '/images/product-4.jpg',
      stock: 75,
    },
    {
      name: 'Revenge Era Poster',
      description: '24x36 inch glossy poster featuring the Three Cheers for Sweet Revenge album art. Perfect for framing.',
      price: 14.99,
      category: 'Posters',
      imageUrl: '/images/product-5.jpg',
      stock: 200,
    },
    {
      name: 'Danger Days Patch Set',
      description: 'Set of 4 embroidered patches featuring the Killjoy symbols. Iron-on backing for easy application.',
      price: 9.99,
      category: 'Accessories',
      imageUrl: '/images/product-6.jpg',
      stock: 150,
    },
    {
      name: 'The Black Parade Baseball Tee',
      description: 'Black and white raglan baseball tee with The Black Parade logo on front. Soft cotton blend.',
      price: 34.99,
      category: 'Apparel',
      imageUrl: '/images/product-7.jpg',
      stock: 45,
    },
    {
      name: 'Three Cheers Vinyl',
      description: 'Standard black vinyl pressing of Three Cheers for Sweet Revenge. Remastered audio.',
      price: 27.99,
      category: 'Music',
      imageUrl: '/images/product-8.jpg',
      stock: 80,
    },
    {
      name: 'MCR Logo Beanie',
      description: 'Black knit beanie with embroidered MCR logo. One size fits most. Perfect for cold weather.',
      price: 19.99,
      category: 'Accessories',
      imageUrl: '/images/product-9.jpg',
      stock: 60,
    },
    {
      name: 'Danger Days Vinyl',
      description: 'Colored vinyl pressing of Danger Days: The True Lives of the Fabulous Killjoys. Includes digital download.',
      price: 32.99,
      category: 'Music',
      imageUrl: '/images/product-10.jpg',
      stock: 90,
    },
    {
      name: 'Conventional Weapons T-Shirt',
      description: 'Limited edition t-shirt featuring artwork from the Conventional Weapons series. Ultra-soft fabric.',
      price: 24.99,
      category: 'Apparel',
      imageUrl: '/images/product-11.jpg',
      stock: 35,
    },
    {
      name: 'Life on the Murder Scene DVD',
      description: 'Documentary DVD featuring behind-the-scenes footage and live performances. Region-free.',
      price: 19.99,
      category: 'Music',
      imageUrl: '/images/product-12.jpg',
      stock: 40,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });