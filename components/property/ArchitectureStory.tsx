'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { property } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { cn } from '@/lib/utils';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

type Chapter = (typeof property.story.chapters)[number];

function StoryChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Gentle counter-scroll inside the frame — the image drifts, the page does not.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-6%', '6%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.06, 1.02, 1.06]);
  const flipped = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
        flipped && 'lg:[&>*:first-child]:order-2',
      )}
    >
      <div className="relative">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-bone/40 sm:aspect-[16/10] lg:aspect-[4/3]">
          <motion.div className="absolute inset-[-8%]" style={{ y, scale }}>
            <Image
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={84}
              className="object-cover"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
          />
          <span className="absolute left-5 top-5 font-sans text-[10px] uppercase tracking-[0.3em] text-paper/80">
            {chapter.index}
          </span>
        </div>
      </div>

      <div className={cn('lg:px-6', flipped && 'lg:order-1')}>
        <Reveal variant="fade">
          <p className="label text-bronze">{chapter.title}</p>
        </Reveal>

        <h3 className="display-md mt-6 max-w-lg text-charcoal">
          <SplitLines text={chapter.statement} />
        </h3>

        <Reveal delay={0.15}>
          <p className="body-md mt-6 max-w-md text-graphite/65">{chapter.body}</p>
        </Reveal>

        <Reveal variant="clip" delay={0.2} className="mt-8 h-px w-full max-w-md bg-charcoal/15" />

        <Reveal variant="fade" delay={0.25}>
          <p className="label mt-6 text-[9px] text-graphite/40">
            {String(index + 1).padStart(2, '0')} / {property.story.chapters.length.toString().padStart(2, '0')} —{' '}
            {chapter.title}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/**
 * 04 — ARCHITECTURAL STORY
 * Three chapters, alternating, each with its own drift. Reads like an
 * architecture magazine spread rather than a feature grid.
 */
export function ArchitectureStory() {
  const ref = useOnceInView<HTMLElement>(() => track('section_view', { section: 'architecture' }));

  return (
    <section
      id="architecture"
      ref={ref}
      className="relative bg-paper py-24 text-charcoal md:py-32 lg:py-40"
      aria-labelledby="architecture-heading"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <Reveal variant="fade">
            <p className="label flex items-center gap-3 text-bronze">
              <span className="h-px w-8 bg-bronze/60" />
              {property.story.eyebrow}
            </p>
          </Reveal>
          <h2 id="architecture-heading" className="display-lg mt-8 text-charcoal">
            <SplitLines text={property.story.heading} />
          </h2>
        </div>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-32 lg:space-y-40">
          {property.story.chapters.map((chapter, index) => (
            <StoryChapter key={chapter.index} chapter={chapter} index={index} />
          ))}
        </div>
      </div>

      {/* Full-bleed closing statement */}
      <motion.div
        className="mt-24 md:mt-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <div className="shell">
          <div className="border-t border-charcoal/12 pt-10">
            <p className="max-w-4xl font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.35] text-charcoal/85">
              “The house was drawn around the view. Everything else — the plan, the materials, the
              sequence of rooms — followed from that single decision.”
            </p>
            <p className="label mt-6 text-[9px] text-graphite/40">
              Design statement — placeholder copy for demonstration
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
