'use client';

import { property, demoMode } from '@/data';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Media } from '@/components/ui/Media';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

/**
 * 02 — PROPERTY INTRODUCTION
 * The exhale after the hero: label left, editorial statement right, then the
 * photographic and factual evidence underneath.
 */
export function Introduction() {
  const ref = useOnceInView<HTMLElement>(() => track('section_view', { section: 'residence' }));

  return (
    <section
      id="residence"
      ref={ref}
      className="relative bg-paper py-24 text-charcoal md:py-32 lg:py-40"
      aria-labelledby="residence-heading"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-bronze">
                <span className="h-px w-8 bg-bronze/60" />
                {property.introduction.eyebrow}
              </p>
            </Reveal>

            {demoMode && (
              <Reveal variant="fade" delay={0.1}>
                <p className="mt-8 max-w-[15rem] text-[10.5px] leading-relaxed text-graphite/40">
                  Architect and interiors credits are placeholders — supplied per client in
                  data/property.ts.
                </p>
              </Reveal>
            )}
          </div>

          <div>
            <h2 id="residence-heading" className="display-lg text-charcoal">
              <SplitLines text={property.introduction.statement} />
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
              {property.introduction.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.08}>
                  <p className="body-md text-graphite/70">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- image */}
        <Reveal variant="mask" className="mt-16 md:mt-24">
          <Media
            src={property.introduction.imageSrc}
            alt={property.introduction.imageAlt}
            sizes="full"
            className="aspect-[16/10] w-full md:aspect-[21/9]"
            imageClassName="transition-transform duration-[2400ms] ease-luxury hover:scale-[1.03]"
            caption={property.introduction.caption}
            quality={84}
          />
        </Reveal>

        {/* ----------------------------------------------------------- facts */}
        <RevealGroup className="mt-14 grid gap-y-10 border-t border-charcoal/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {property.introduction.facts.map((fact) => (
            <RevealItem key={fact.label} className="pr-6">
              <p className="label text-graphite/45">{fact.label}</p>
              <p className="mt-3 font-display text-[1.35rem] leading-snug text-charcoal">
                {fact.value}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
