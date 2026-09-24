'use client';

import { property } from '@/data';
import { CountUp } from '@/components/ui/CountUp';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';

/**
 * 03 — PROPERTY STATISTICS
 * Editorial numerals on ink, not dashboard cards. Values settle on the true
 * figure as they enter the viewport.
 */
export function Statistics() {
  const { stats } = property;

  return (
    <section
      id="statistics"
      className="relative overflow-hidden bg-ink py-24 text-paper md:py-32 lg:py-40"
      aria-labelledby="statistics-heading"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/60" />
                {stats.eyebrow}
              </p>
            </Reveal>
            <h2 id="statistics-heading" className="display-md mt-8 max-w-md text-paper">
              <SplitLines text={stats.heading} />
            </h2>
          </div>

          <RevealGroup className="grid grid-cols-2 gap-y-12 sm:gap-y-14 lg:grid-cols-3">
            {stats.values.map((stat) => (
              <RevealItem key={stat.label} className="pr-4">
                <p className="font-display text-[clamp(2.4rem,5.2vw,4rem)] leading-[0.95] tracking-[-0.03em] text-paper">
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="label mt-4 text-brass">{stat.label}</p>
                {stat.note && (
                  <p className="mt-2 text-[12px] leading-relaxed text-paper/45">{stat.note}</p>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* ------------------------------------------------- price statement */}
        <Reveal variant="mask" delay={0.1} className="mt-20 md:mt-28">
          <div className="flex flex-col gap-6 border-t border-paper/15 pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label text-paper/45">{stats.headlineLabel}</p>
              <p className="display-lg mt-4 text-paper">{stats.headlineValue}</p>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-paper/50 md:text-right">
              {stats.headlineNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
