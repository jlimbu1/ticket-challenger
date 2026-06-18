export const placeholderTexts = {
  'empty-cart': {
    title: 'The void awaits your offerings',
    subtitle: 'Your collection is but a whisper in the dark. Add some relics to begin your journey.',
  },
  'no-results': {
    title: 'No echoes found in the abyss',
    subtitle: 'The shadows conceal what you seek. Try a different incantation.',
  },
  'empty-stage': {
    title: 'The stage lies silent',
    subtitle: 'No performances scheduled in this realm. The curtain awaits its rising.',
  },
  'empty-order-history': {
    title: 'No rituals completed',
    subtitle: 'Your grimoire of past transactions is blank. Complete a ritual to inscribe your legacy.',
  },
} as const;

export type PlaceholderVariant = keyof typeof placeholderTexts;

export function getPlaceholderContent(variant: PlaceholderVariant): { title: string; subtitle: string } {
  const content = placeholderTexts[variant];
  if (!content) {
    return placeholderTexts['empty-cart'];
  }
  return content;
}