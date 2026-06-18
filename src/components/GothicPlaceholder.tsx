import React from 'react';

interface GothicPlaceholderProps {
  variant?: 'empty-cart' | 'no-results' | 'empty-stage' | 'empty-order-history';
  className?: string;
  title?: string;
  subtitle?: string;
}

const placeholderContent: Record<string, { title: string; subtitle: string }> = {
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
};

const GothicPlaceholder: React.FC<GothicPlaceholderProps> = ({
  variant = 'empty-cart',
  className = '',
  title,
  subtitle,
}) => {
  const content = placeholderContent[variant] || placeholderContent['empty-cart'];
  const displayTitle = title || content.title;
  const displaySubtitle = subtitle || content.subtitle;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="mb-6 relative">
        <div
          className="w-24 h-24 mx-auto rounded-full border-2 border-crimson/30 flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(139,0,0,0.1) 0%, transparent 70%)',
          }}
        >
          <svg
            className="w-12 h-12 text-crimson/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-heading text-crimson mb-3 tracking-wide">
        {displayTitle}
      </h3>
      <p className="text-text-muted max-w-md text-sm leading-relaxed">
        {displaySubtitle}
      </p>
    </div>
  );
};

export default GothicPlaceholder;