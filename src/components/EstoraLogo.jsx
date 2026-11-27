import React from 'react';

const SIZE_PRESETS = {
  sm: {
    mark: '1.5rem', // 24px
    text: '0.9375rem', // 15px
    gap: '8px',
  },
  md: {
    mark: '1.875rem', // 30px
    text: '1.1875rem', // 19px
    gap: '10px',
  },
  lg: {
    mark: '2.75rem', // 44px
    text: '1.75rem', // 28px
    gap: '13px',
  },
};

/**
 * Architectural Estora brand identity component supporting lockup, monogram mark, and wordmark variants.
 * Adapts automatically between dark and light themes via CSS brand custom properties.
 *
 * @param {{ variant?: 'lockup' | 'mark' | 'wordmark', size?: 'sm' | 'md' | 'lg', className?: string }} props
 */
const EstoraLogo = ({ variant = 'lockup', size = 'md', className = '' }) => {
  const dimensions = SIZE_PRESETS[size] || SIZE_PRESETS.md;
  const showMark = variant === 'lockup' || variant === 'mark';
  const showWordmark = variant === 'lockup' || variant === 'wordmark';

  return (
    <span
      className={`estora-logo inline-flex items-center select-none ${className}`}
      style={{ gap: showMark && showWordmark ? dimensions.gap : undefined }}
    >
      {showMark && (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role={showWordmark ? undefined : 'img'}
          aria-label={showWordmark ? undefined : 'ESTORA'}
          aria-hidden={showWordmark ? 'true' : undefined}
          style={{
            width: dimensions.mark,
            height: dimensions.mark,
            flexShrink: 0,
            display: 'block',
          }}
        >
          {/* LAYER 1: Outer Architectural Ink Frame + Inner E Spine, Top Bar & Middle Bar (passes BEHIND gold arch pillar) */}
          <path
            d="M 24.55 4.4 H 3.4 V 31.6 H 16.5"
            stroke="var(--estora-ink)"
            strokeWidth="2.8"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
          <path
            d="M 16.5 10.2 H 9.2 V 25.8"
            stroke="var(--estora-ink)"
            strokeWidth="2.8"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
          <path
            d="M 9.2 18 H 24.5"
            stroke="var(--estora-ink)"
            strokeWidth="2.8"
            strokeLinecap="butt"
          />

          {/* LAYER 2: Brushed Champagne-Gold Architectural Archway (passes OVER the E's top & middle bars) */}
          <path
            d="M 16.5 31.6 V 12.45 A 8.05 8.05 0 0 1 32.6 12.45 V 31.6 Z"
            stroke="var(--estora-gold)"
            strokeWidth="2.8"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />

          {/* LAYER 3: Inner E Bottom Bar (passes OVER the gold arch's left pillar for true interlocking depth) */}
          <path
            d="M 7.8 25.8 H 24.5"
            stroke="var(--estora-ink)"
            strokeWidth="2.8"
            strokeLinecap="butt"
          />
        </svg>
      )}

      {showWordmark && (
        <span
          role="img"
          aria-label="ESTORA"
          style={{
            fontFamily: 'var(--estora-font-brand)',
            fontWeight: 800,
            fontSize: dimensions.text,
            lineHeight: 1,
            letterSpacing: '0.04em',
            color: 'var(--estora-ink)',
            textRendering: 'geometricPrecision',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            userSelect: 'none',
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          <span aria-hidden="true">ES</span>
          <span aria-hidden="true" style={{ marginRight: '-0.03em' }}>T</span>
          <span aria-hidden="true">O</span>
          <span aria-hidden="true" style={{ marginRight: '0.02em' }}>R</span>
          <svg
            viewBox="0 0 24 24"
            fill="var(--estora-ink)"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{
              height: '0.74em',
              width: 'auto',
              display: 'block',
              flexShrink: 0,
            }}
          >
            {/* Signature Architectural A: angled apex & subtle stepped/notched inner crossbar */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 9.6 1.35 L 14.0 0.25 L 23.8 24 H 18.55 L 16.24 17.5 H 12.1 V 18.8 H 7.30 L 5.45 24 H 0.2 Z M 12.0 5.6 L 8.94 14.2 H 15.06 Z"
            />
          </svg>
          <span
            aria-hidden="true"
            className="estora-logo-period"
            style={{
              width: '0.165em',
              height: '0.165em',
              backgroundColor: 'var(--estora-gold)',
              marginLeft: '0.14em',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
        </span>
      )}
    </span>
  );
};

export default EstoraLogo;
