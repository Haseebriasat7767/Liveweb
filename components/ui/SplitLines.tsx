'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type SplitLinesProps = {
  /** Text to reveal. Newlines (\n) force a line break. */
  text: string;
  className?: string;
  /** Per-word delay in seconds. */
  stagger?: number;
  delay?: number;
  /** Delay before the first word of each subsequent line. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** Start immediately (hero) rather than on scroll. */
  immediate?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masked, word-by-word headline reveal — the signature motion of the showroom.
 * Uses clip rather than blur or scale so the typography stays crisp.
 */
export function SplitLines({
  text,
  className,
  stagger = 0.075,
  delay = 0,
  as = 'div',
  immediate = false,
}: SplitLinesProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  const lines = text.split('\n');

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  let wordIndex = 0;

  return (
    <Tag
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once: true, margin: '-15% 0px -15% 0px' } })}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="block">
          {line.split(' ').map((word) => {
            const index = wordIndex++;
            return (
              <span
                key={`${word}-${index}`}
                className="inline-block overflow-hidden pb-[0.06em] align-bottom"
              >
                <motion.span
                  className={cn('inline-block', lineIndex === lines.length - 1 && 'pr-[0.24em]')}
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    show: { y: '0%', opacity: 1, transition: { duration: 1.05, ease: EASE } },
                  }}
                >
                  {word}
                </motion.span>
                <span className="inline-block">&nbsp;</span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
