import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { SplitLines } from './SplitLines';

type SectionHeadingProps = {
  /** Small uppercase label, e.g. "The Residence". */
  eyebrow?: string;
  /** Chapter number, e.g. "02". */
  index?: string;
  heading?: string;
  intro?: ReactNode;
  className?: string;
  headingClassName?: string;
  /** Colour context — controls hairlines and quiet text. */
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  /** Heading level for document outline. */
  as?: 'h2' | 'h3';
  /** Optional right-hand column (sticky facts, actions). */
  aside?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  index,
  heading,
  intro,
  className,
  headingClassName,
  tone = 'light',
  align = 'left',
  as = 'h2',
  aside,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div className={cn('relative', className)}>
      {(eyebrow || index) && (
        <Reveal variant="fade" duration={1}>
          <div
            className={cn(
              'flex items-baseline gap-4 pb-6',
              align === 'center' && 'justify-center',
            )}
          >
            {index && (
              <span className={cn('label', tone === 'dark' ? 'text-brass' : 'text-bronze')}>
                {index}
              </span>
            )}
            {eyebrow && (
              <span className={cn('label', tone === 'dark' ? 'text-paper/55' : 'text-graphite/55')}>
                {eyebrow}
              </span>
            )}
          </div>
        </Reveal>
      )}

      <div
        className={cn(
          'grid gap-x-12 gap-y-8',
          Boolean(aside) && 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end',
        )}
      >
        <div className={cn(align === 'center' && 'text-center')}>
          {heading && (
            <Heading
              className={cn(
                'display-lg',
                tone === 'dark' ? 'text-paper' : 'text-charcoal',
                headingClassName,
              )}
            >
              <SplitLines text={heading} />
            </Heading>
          )}
          {intro && (
            <Reveal delay={0.12} variant="up">
              <div
                className={cn(
                  'body-lg mt-7 max-w-2xl',
                  tone === 'dark' ? 'text-paper/65' : 'text-graphite/70',
                  align === 'center' && 'mx-auto',
                )}
              >
                {intro}
              </div>
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal delay={0.18} variant="up" className={cn(align === 'center' && 'text-center')}>
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}
