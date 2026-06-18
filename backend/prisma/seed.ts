import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data in correct order to respect foreign key constraints
  await prisma.shippingAddress.deleteMany();
  await prisma.orderItem.deleteMany();
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
      name: 'I Brought You My Bullets, You Brought Me Your Love Vinyl',
      description: 'Reissue of the debut album on translucent red vinyl. Gatefold sleeve with original artwork.',
      price: 29.99,
      category: 'Music',
      imageUrl: '/images/product-4.jpg',
      stock: 75,
    },
    {
      name: 'Danger Days Poster',
      description: 'Large format poster featuring the Danger Days: True Lives of the Fabulous Killjoys album art. Glossy finish.',
      price: 14.99,
      category: 'Posters',
      imageUrl: '/images/product-5.jpg',
      stock: 200,
    },
    {
      name: 'Revenge Era Patch Set',
      description: 'Set of 4 embroidered patches featuring imagery from Three Cheers for Sweet Revenge. Iron-on backing.',
      price: 12.99,
      category: 'Accessories',
      imageUrl: '/images/product-6.jpg',
      stock: 150,
    },
    {
      name: 'Black Parade Military Jacket',
      description: 'Inspired by the iconic marching band uniforms from The Black Parade era. Features gold trim and epaulettes.',
      price: 89.99,
      category: 'Apparel',
      imageUrl: '/images/product-7.jpg',
      stock: 20,
    },
    {
      name: 'Life on the Murder Scene DVD',
      description: 'Documentary DVD featuring behind-the-scenes footage from the Three Cheers era. Includes live performances.',
      price: 19.99,
      category: 'Music',
      imageUrl: '/images/product-8.jpg',
      stock: 60,
    },
    {
      name: 'MCR Logo Beanie',
      description: 'Black knit beanie with embroidered My Chemical Romance logo. One size fits most.',
      price: 24.99,
      category: 'Accessories',
      imageUrl: '/images/product-9.jpg',
      stock: 80,
    },
    {
      name: 'Conventional Weapons T-Shirt',
      description: 'Limited run t-shirt featuring artwork from the Conventional Weapons singles series. Soft cotton blend.',
      price: 27.99,
      category: 'Apparel',
      imageUrl: '/images/product-10.jpg',
      stock: 45,
    },
    {
      name: 'The Black Parade Is Dead! Live CD',
      description: 'Live album recorded in Mexico City during The Black Parade world tour. Includes bonus tracks.',
      price: 15.99,
      category: 'Music',
      imageUrl: '/images/product-11.jpg',
      stock: 90,
    },
    {
      name: 'MCR Skull Enamel Pin',
      description: 'Hard enamel pin featuring the classic MCR skull logo. Gold-plated with rubber clutch backing.',
      price: 9.99,
      category: 'Accessories',
      imageUrl: '/images/product-12.jpg',
      stock: 300,
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log('Seed data created successfully: 12 products added.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });