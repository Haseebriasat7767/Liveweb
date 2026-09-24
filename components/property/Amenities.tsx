'use client';

import { property } from '@/data';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';

/**
 * AMENITIES — a quiet editorial band between the gallery and the film.
 * No icons, no cards: just considered lists on generous whitespace.
 */
export function Amenities() {
  return (
    <section
      id="amenities"
      className="relative bg-bone/40 py-24 text-charcoal md:py-28 lg:py-32"
      aria-labelledby="amenities-heading"
    >
      <div className="shell">
        <div className="grid gap-10 border-t border-charcoal/12 pt-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label text-bronze">{property.amenities.eyebrow}</p>
            </Reveal>
            <h2 id="amenities-heading" className="display-md mt-6 max-w-xs text-charcoal">
              <SplitLines text={property.amenities.heading} />
            </h2>
          </div>

          <RevealGroup className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {property.amenities.groups.map((group) => (
              <RevealItem key={group.title}>
                <h3 className="label border-b border-charcoal/12 pb-4 text-graphite/50">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-graphite/70">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-bronze/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
