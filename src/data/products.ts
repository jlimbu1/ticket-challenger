export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stockCount: number;
  category: 'vinyl' | 'apparel' | 'poster' | 'accessory';
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'The Black Parade Vinyl',
    price: 34.99,
    imageUrl: 'https://picsum.photos/seed/black-parade/400/400',
    description: 'A requiem for the living. This midnight wax pressing carries the anthems of rebellion, loss, and resurrection. Each groove etched with the ghosts of a thousand shows.',
    stockCount: 12,
    category: 'vinyl',
  },
  {
    id: 'prod-002',
    name: 'Three Cheers T-Shirt',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/three-cheers/400/400',
    description: 'Wear your devotion on your sleeve. This blood-red tee bears the sigil of the brokenhearted, faded like a memory you cannot forget.',
    stockCount: 25,
    category: 'apparel',
  },
  {
    id: 'prod-003',
    name: 'Danger Days Poster',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/danger-days/400/400',
    description: 'A vibrant declaration of defiance. This poster captures the neon-drenched wasteland where hope flickers brightest before the fall.',
    stockCount: 8,
    category: 'poster',
  },
  {
    id: 'prod-004',
    name: 'Revenge Era Hoodie',
    price: 54.99,
    imageUrl: 'https://picsum.photos/seed/revenge-hoodie/400/400',
    description: 'Wrapped in the warmth of vengeance. This hoodie carries the scent of gasoline and regret. A second skin for the broken and the brave.',
    stockCount: 15,
    category: 'apparel',
  },
  {
    id: 'prod-005',
    name: 'Bullets EP Vinyl',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/bullets-ep/400/400',
    description: 'The beginning of the end. This rare pressing captures the raw, unpolished fury of a band born from the ashes of hope. Each track a bullet through the heart of silence.',
    stockCount: 6,
    category: 'vinyl',
  },
  {
    id: 'prod-006',
    name: 'Phantom Fear Poster',
    price: 22.99,
    imageUrl: 'https://picsum.photos/seed/phantom-fear/400/400',
    description: 'A spectral image of the band shrouded in shadow and crimson light. This poster haunts the walls of the faithful, a reminder that even in death, the music lives.',
    stockCount: 10,
    category: 'poster',
  },
  {
    id: 'prod-007',
    name: 'Skull Ring Accessory',
    price: 14.99,
    imageUrl: 'https://picsum.photos/seed/skull-ring/400/400',
    description: 'A silver skull ring with ruby eyes. Wear the mark of the undying. A small token of rebellion against the mundane, forged in the fires of a thousand shows.',
    stockCount: 40,
    category: 'accessory',
  },
  {
    id: 'prod-008',
    name: 'Rose Patch Set',
    price: 9.99,
    imageUrl: 'https://picsum.photos/seed/rose-patch/400/400',
    description: 'A set of embroidered patches featuring crimson roses and gothic script. Sew them onto your jacket, your bag, your soul. Each stitch a promise to never fade away.',
    stockCount: 50,
    category: 'accessory',
  },
  {
    id: 'prod-009',
    name: 'The Black Parade Hoodie',
    price: 59.99,
    imageUrl: 'https://picsum.photos/seed/black-parade-hoodie/400/400',
    description: 'Step into the parade. This heavy-weight hoodie features the iconic fallen soldier on the back, a marching reminder that we are all part of something greater. Wear it with reverence.',
    stockCount: 20,
    category: 'apparel',
  },
  {
    id: 'prod-010',
    name: 'Three Cheers Vinyl',
    price: 32.99,
    imageUrl: 'https://picsum.photos/seed/three-cheers-vinyl/400/400',
    description: 'The sweet sound of revenge. This vinyl pressing captures the raw energy of a band on the edge of glory and destruction. Each side a chapter in a story of love and loss.',
    stockCount: 9,
    category: 'vinyl',
  },
];