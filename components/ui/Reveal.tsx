'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RevealVariant = 'up' | 'fade' | 'mask' | 'clip' | 'left' | 'scale';

type RevealProps = {
  children?: ReactNode;
  className?: string;
  /** Motion character of the reveal. */
  variant?: RevealVariant;
  /** Seconds to wait before starting. */
  delay?: number;
  /** Seconds the reveal lasts — luxury timing is slow by default. */
  duration?: number;
  /** Travel distance for up/left variants (px). */
  distance?: number;
  /** Stagger children by index instead of revealing as one block. */
  as?: ElementType;
  once?: boolean;
  id?: string;
  'aria-hidden'?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

function buildVariants(variant: RevealVariant, distance: number, duration: number): Variants {
  switch (variant) {
    case 'fade':
      return { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration, ease: EASE } } };
    case 'mask':
      return {
        hidden: { clipPath: 'inset(0 0 100% 0)', y: distance * 0.25, opacity: 0 },
        show: {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          opacity: 1,
          transition: { duration: duration * 1.15, ease: EASE },
        },
      };
    case 'clip':
      return {
        hidden: { clipPath: 'inset(0 100% 0 0)' },
        show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: duration * 1.3, ease: EASE } },
      };
    case 'left':
      return {
        hidden: { opacity: 0, x: -distance },
        show: { opacity: 1, x: 0, transition: { duration, ease: EASE } },
      };
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 1.04 },
        show: { opacity: 1, scale: 1, transition: { duration: duration * 1.4, ease: EASE } },
      };
    case 'up':
    default:
      return {
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      };
  }
}

/**
 * Scroll-triggered reveal. Slow, single-direction, reduced-motion aware.
 */
export function Reveal({
  children,
  className,
  variant = 'up',
  delay = 0,
  duration = 0.9,
  distance = 26,
  as = 'div',
  once = true,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as 'div'] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={cn(className)}
      variants={buildVariants(variant, distance, duration)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggered group — pair with <RevealItem> children.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as 'div'] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  variant = 'up',
  distance = 22,
  duration = 0.8,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  distance?: number;
  duration?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as 'div'] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={buildVariants(variant, distance, duration)}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
