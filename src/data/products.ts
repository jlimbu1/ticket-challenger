export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const products: Product[] = [
  {
    id: 'black-parade-vinyl',
    name: 'The Black Parade Vinyl',
    price: 34.99,
    imageUrl: 'https://picsum.photos/seed/blackparade/400/400',
    description: 'Limited edition vinyl pressing of the iconic 2006 album. Features the complete tracklist including "Welcome to the Black Parade" and "Famous Last Words." Housed in a deluxe gatefold sleeve with original artwork.',
    category: 'Vinyl Records',
    inStock: true,
  },
  {
    id: 'three-cheers-cassette',
    name: 'Three Cheers for Sweet Revenge Cassette',
    price: 14.99,
    imageUrl: 'https://picsum.photos/seed/threecheers/400/400',
    description: 'Vintage-style cassette tape of the breakthrough 2004 album. Includes "Helena," "I\'m Not Okay (I Promise)," and "The Ghost of You." Comes with replica J-card and lyric insert.',
    category: 'Cassettes',
    inStock: true,
  },
  {
    id: 'helenas-rosary',
    name: "Helena's Rosary Necklace",
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/helenasrosary/400/400',
    description: 'Handcrafted rosary-style necklace inspired by the "Helena" music video. Features black beads, a silver crucifix pendant, and vintage-style chain. Adjustable length from 18 to 24 inches.',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: 'danger-days-cd',
    name: 'Danger Days: True Lives of the Fabulous Killjoys CD',
    price: 12.99,
    imageUrl: 'https://picsum.photos/seed/dangerdays/400/400',
    description: 'Compact disc edition of the 2010 album. Includes "Na Na Na (Na Na Na Na Na Na Na Na Na)," "SING," and "Planetary (GO!)." Features the original comic book-style booklet.',
    category: 'CDs',
    inStock: true,
  },
  {
    id: 'revenge-t-shirt',
    name: 'Three Cheers Revenge T-Shirt',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/revengets/400/400',
    description: 'Black cotton t-shirt featuring the iconic album artwork from "Three Cheers for Sweet Revenge." Vintage-style print with distressed finish. Available in sizes S through 3XL.',
    category: 'Apparel',
    inStock: true,
  },
  {
    id: 'bullets-vinyl',
    name: 'I Brought You My Bullets, You Brought Me Your Love Vinyl',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/bullets/400/400',
    description: 'First pressing vinyl of the debut 2002 album. Features early classics like "Vampires Will Never Hurt You" and "Our Lady of Sorrows." Includes rare demo tracks on B-side.',
    category: 'Vinyl Records',
    inStock: false,
  },
  {
    id: 'parade-poster',
    name: 'The Black Parade Marching Poster',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/paradeposter/400/400',
    description: 'Large format poster (24x36 inches) featuring the iconic marching band artwork from The Black Parade era. Printed on heavy matte paper with archival inks.',
    category: 'Posters',
    inStock: true,
  },
  {
    id: 'skull-ring',
    name: 'Skull & Roses Signet Ring',
    price: 34.99,
    imageUrl: 'https://picsum.photos/seed/skullring/400/400',
    description: 'Sterling silver signet ring featuring an engraved skull entwined with roses. Inspired by the band\'s signature imagery. Adjustable band fits sizes 6-12.',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: 'revenge-hoodie',
    name: 'Sweet Revenge Zip Hoodie',
    price: 54.99,
    imageUrl: 'https://picsum.photos/seed/revengehoodie/400/400',
    description: 'Black zip-up hoodie with embroidered "Sweet Revenge" script on back. Features red rose embroidery on left chest. Heavyweight cotton-poly blend for warmth.',
    category: 'Apparel',
    inStock: true,
  },
  {
    id: 'conventional-weapons-box',
    name: 'Conventional Weapons Box Set',
    price: 49.99,
    imageUrl: 'https://picsum.photos/seed/conventional/400/400',
    description: 'Complete box set of the Conventional Weapons singles series. Includes all 10 tracks on colored vinyl, plus a 48-page booklet with never-before-seen photos and liner notes.',
    category: 'Vinyl Records',
    inStock: true,
  },
  {
    id: 'ghost-patch',
    name: 'The Ghost of You Embroidered Patch',
    price: 8.99,
    imageUrl: 'https://picsum.photos/seed/ghostpatch/400/400',
    description: 'Embroidered iron-on patch featuring the ship artwork from "The Ghost of You" single. Measures 3x4 inches. Perfect for jackets, bags, or denim vests.',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: 'life-on-mars-pin',
    name: 'Life on Mars? Enamel Pin Set',
    price: 14.99,
    imageUrl: 'https://picsum.photos/seed/marspin/400/400',
    description: 'Set of 3 hard enamel pins featuring celestial motifs from the Danger Days era. Includes a planet, a star, and a skull with astronaut helmet. Black nickel plating with glitter accents.',
    category: 'Accessories',
    inStock: true,
  },
];