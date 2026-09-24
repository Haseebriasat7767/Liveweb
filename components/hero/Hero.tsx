'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { property, agent } from '@/data';
import { Button } from '@/components/ui/Button';
import { SplitLines } from '@/components/ui/SplitLines';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 01 — CINEMATIC HERO
 * Full-bleed, slow, and quiet: image or film, a four-stage text reveal, and a
 * scroll indicator. Everything else waits.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, reduced ? 1 : 0]);

  useEffect(() => {
    track('page_view', { path: '/', chapter: 'hero' });
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="The Private Listing"
      className="relative flex h-[100svh] min-h-[620px] max-h-[1180px] w-full flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      {/* ------------------------------------------------------------- media */}
      <motion.div
        className="absolute inset-0 -z-0"
        style={{ y: mediaY }}
        initial={reduced ? undefined : { opacity: 0, scale: 1.04 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        {property.hero.videoSrc ? (
          <video
            className="h-full w-full object-cover"
            src={property.hero.videoSrc}
            poster={property.hero.posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={property.hero.imageAlt}
          />
        ) : (
          <div className="h-full w-full animate-[slow-zoom_28s_ease-out_forwards]">
            <Image
              src={property.hero.imageSrc}
              alt={property.hero.imageAlt}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              quality={88}
              className="object-cover object-[center_58%]"
            />
          </div>
        )}
      </motion.div>

      {/* Readability gradients — never a flat black overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/85"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/55 to-transparent"
      />
      <div className="grain pointer-events-none absolute inset-0" />

      {/* ----------------------------------------------------------- content */}
      <motion.div
        className="shell relative z-10 pb-14 md:pb-16 lg:pb-20"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-4xl">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
          >
            <span className="h-px w-10 bg-brass/80 sm:w-16" />
            <span className="label text-paper/75">{property.hero.eyebrow}</span>
          </motion.div>

          <h1 className="display-xl mt-6 text-paper md:mt-8">
            <SplitLines text={property.hero.headline} immediate delay={0.75} stagger={0.11} />
          </h1>

          <motion.p
            className="body-lg mt-7 max-w-xl text-paper/70"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.35 }}
          >
            {property.tagline}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.6 }}
          >
            <Button
              href={property.hero.primaryCta.href}
              intent="private-showing"
              analyticsEvent="hero_cta_click"
              analyticsProps={{ label: 'Request Private Showing' }}
              variant="inverse"
              size="lg"
              arrow
              className="w-full sm:w-auto"
            >
              {property.hero.primaryCta.label}
            </Button>

            <a
              href={property.hero.secondaryCta.href}
              onClick={() => track('hero_secondary_click', { label: property.hero.secondaryCta.label })}
              className="group inline-flex items-center justify-center gap-3 px-1 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-paper/75 transition-colors duration-500 hover:text-paper sm:justify-start"
            >
              {property.hero.secondaryCta.label}
              <span
                aria-hidden="true"
                className="h-px w-8 bg-current transition-all duration-[700ms] ease-luxury group-hover:w-12"
              />
            </a>
          </motion.div>
        </div>

        {/* ------------------------------------------------------ meta strip */}
        <motion.dl
          className="mt-14 hidden grid-cols-2 gap-x-8 gap-y-6 border-t border-paper/15 pt-7 sm:grid sm:grid-cols-4 lg:max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.95 }}
        >
          {property.hero.meta.map((item) => (
            <div key={item.label}>
              <dt className="label text-[9px] text-paper/40">{item.label}</dt>
              <dd className="mt-2 text-[13px] tracking-wide text-paper/85">{item.value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* ---------------------------------------------------- scroll indicator */}
      <motion.div
        className="pointer-events-none absolute bottom-14 right-[var(--shell-x)] z-10 hidden flex-col items-center gap-4 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.2 }}
        aria-hidden="true"
      >
        <span className="label rotate-180 text-[9px] text-paper/45 [writing-mode:vertical-rl]">
          {property.hero.scrollHint}
        </span>
        <span className="relative block h-16 w-px overflow-hidden bg-paper/20">
          <span className="absolute inset-x-0 top-0 block h-6 animate-scroll-dot bg-brass" />
        </span>
      </motion.div>

      {/* ----------------------------------------------------- chapter marker */}
      <motion.div
        className="pointer-events-none absolute bottom-6 left-[var(--shell-x)] z-10 flex items-center gap-3 lg:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.3 }}
        aria-hidden="true"
      >
        <span className="label text-[9px] text-paper/35">01 — Arrival</span>
        <span className="hidden h-px w-16 bg-paper/15 sm:block" />
        <span className="label hidden text-[9px] text-paper/35 sm:block">{agent.brokerage}</span>
      </motion.div>
    </section>
  );
}
