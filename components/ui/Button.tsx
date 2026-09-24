'use client';

import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { requestShowing } from '@/lib/conversion';
import type { IntentId } from '@/data/leadSettings';
import { track } from '@/lib/analytics';

type Variant = 'solid' | 'inverse' | 'outline' | 'outline-dark' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Show the arrow that travels on hover. */
  arrow?: boolean;
  /** Open the lead panel with this intent pre-selected. */
  intent?: IntentId;
  analyticsEvent?: Parameters<typeof track>[0];
  analyticsProps?: Record<string, string | number | boolean>;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  'aria-label'?: string;
};

type Props = BaseProps & {
  /** Anchor target. `#private-showing` style anchors scroll; external links open normally. */
  href?: string;
};

const VARIANTS: Record<Variant, string> = {
  solid:
    'bg-ink text-paper border border-ink hover:bg-bronze hover:border-bronze hover:text-paper',
  inverse:
    'bg-paper text-ink border border-paper hover:bg-transparent hover:text-paper',
  outline:
    'bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-paper',
  'outline-dark':
    'bg-transparent text-paper border border-paper/30 hover:border-paper hover:bg-paper hover:text-ink',
  quiet:
    'bg-transparent text-current border-transparent hover:border-current/40',
};

const SIZES: Record<Size, string> = {
  sm: 'px-5 py-3 text-[10px] tracking-[0.24em]',
  md: 'px-7 py-4 text-[10.5px] tracking-[0.26em]',
  lg: 'px-9 py-[1.15rem] text-[11px] tracking-[0.28em]',
};

/**
 * The conversion button. Every primary action on the showroom routes through
 * one of these so the interaction language stays consistent.
 */
export function Button({
  children,
  variant = 'solid',
  size = 'md',
  className,
  arrow = false,
  intent,
  analyticsEvent,
  analyticsProps,
  fullWidth,
  type = 'button',
  disabled,
  onClick,
  href,
  ...rest
}: Props) {
  const classes = cn(
    'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden',
    'font-sans font-medium uppercase transition-[background-color,border-color,color,letter-spacing]',
    'duration-[600ms] ease-luxury will-change-[letter-spacing]',
    'disabled:cursor-not-allowed disabled:opacity-45',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    if (analyticsEvent) track(analyticsEvent, analyticsProps);
    if (intent) {
      // Let the anchor scroll happen, then hand the intent to the lead panel.
      requestShowing(intent, String(analyticsEvent ?? 'cta'));
    }
    onClick?.(event);
  };

  const content = (
    <>
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="relative z-10 inline-flex h-3 w-4 shrink-0 items-center overflow-hidden"
        >
          <svg
            viewBox="0 0 22 10"
            className="h-[9px] w-[22px] translate-x-0 transition-transform duration-[700ms] ease-luxury group-hover/btn:translate-x-[3px] group-focus-visible/btn:translate-x-[3px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <path d="M0 5h20M16 1l4 4-4 4" />
          </svg>
        </span>
      )}
    </>
  );

  if (href) {
    const external = /^(https?:|mailto:|tel:|sms:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          onClick={handleClick}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
          {...rest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={handleClick} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={handleClick} disabled={disabled} {...rest}>
      {content}
    </button>
  );
}
