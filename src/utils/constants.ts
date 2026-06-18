export const THEME_COLORS = {
  black: '#000000',
  crimson: '#8B0000',
  deepPurple: '#4A0082',
  neonCrimson: '#FF0044',
  neonPurple: '#B000FF',
  darkGray: '#1A1A1A',
  mediumGray: '#2A2A2A',
  lightGray: '#3A3A3A',
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  transparent: 'transparent',
} as const;

export const FONT_FAMILIES = {
  heading: "'Playfair Display', serif",
  body: "'Inter', sans-serif",
  gothic: "'Playfair Display', serif",
} as const;

export const POETIC_MESSAGES = {
  emptyCart: 'The shelf stands empty, waiting for your collection.',
  emptyProducts: 'Silence echoes in these hollow halls.',
  emptyOrders: 'No records spin in this forgotten corner.',
  emptySearch: 'The jukebox weeps for songs not yet chosen.',
  emptyWishlist: 'A blank page in the book of melodies.',
  loading: 'Spinning the record...',
  error: 'The record skips. Something went wrong.',
  checkout: 'Complete the Ritual',
  addToCart: 'Add to Collection',
  removeFromCart: 'Remove from Collection',
  proceedToCheckout: 'Proceed to Ritual',
  orderConfirmed: 'Your ritual is complete.',
  orderFailed: 'The ritual has failed. Try again.',
} as const;

export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  verySlow: '1000ms',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
} as const;