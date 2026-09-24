'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { location, property } from '@/data';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

const GROUP_ORDER = ['Air & Travel', 'Water', 'City', 'Leisure', 'Everyday'] as const;

/**
 * 08 — LIFESTYLE / LOCATION
 * A drawn schematic rather than an embedded map: travel rings, plotted
 * destinations, and editorial columns. Honest about being illustrative.
 */
export function LocationSection() {
  const ref = useOnceInView<HTMLElement>(() => track('section_view', { section: 'location' }));
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>('marina');

  const active = useMemo(
    () => location.destinations.find((destination) => destination.id === activeId) ?? null,
    [activeId],
  );

  const byGroup = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        items: location.destinations.filter((destination) => destination.group === group),
      })).filter((entry) => entry.items.length > 0),
    [],
  );

  return (
    <section
      id="location"
      ref={ref}
      className="relative overflow-hidden bg-ink py-24 text-paper md:py-32 lg:py-40"
      aria-labelledby="location-heading"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-end lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/60" />
                {location.eyebrow}
              </p>
            </Reveal>
            <h2 id="location-heading" className="display-lg mt-8 text-paper">
              <SplitLines text={location.heading} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <p className="body-lg max-w-md text-paper/60 lg:pb-4">{location.statement}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-16">
          {/* ------------------------------------------------------ schematic */}
          <div>
            <div className="relative border border-paper/12 bg-charcoal/40 p-4 sm:p-6">
              <svg
                viewBox="0 0 100 100"
                className="h-auto w-full"
                role="img"
                aria-label={`Schematic map: ${location.destinations.length} destinations around ${property.name}`}
              >
                <defs>
                  <radialGradient id="loc-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C7A578" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#C7A578" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Water horizon */}
                <path d="M0 62 Q 26 56 52 60 T 100 56 L100 100 L0 100 Z" fill="#20242A" opacity="0.85" />
                <path d="M0 62 Q 26 56 52 60 T 100 56" fill="none" stroke="#C7A578" strokeOpacity="0.25" strokeWidth="0.3" />

                {/* Travel rings — 5 / 10 / 20 minutes */}
                {[34, 26, 18].map((radius, index) => (
                  <circle
                    key={radius}
                    cx="52"
                    cy="56"
                    r={radius}
                    fill="none"
                    stroke="#F4F1EC"
                    strokeOpacity={0.14}
                    strokeWidth="0.25"
                    strokeDasharray={index === 0 ? '0' : '1 2'}
                  />
                ))}
                <circle cx="52" cy="56" r="34" fill="url(#loc-glow)" />

                {/* Destination plots */}
                {location.destinations.map((destination) => {
                  const isActive = destination.id === activeId;
                  const isOrigin = destination.minutes === 0;
                  return (
                    <g
                      key={destination.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${destination.label}, ${destination.minutes} minutes`}
                      onClick={() => {
                        setActiveId(destination.id);
                        track('section_view', { section: 'location', destination: destination.label });
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setActiveId(destination.id);
                        }
                      }}
                      onMouseEnter={() => setActiveId(destination.id)}
                      onFocus={() => setActiveId(destination.id)}
                      className="cursor-pointer outline-none"
                    >
                      <line
                        x1="52"
                        y1="56"
                        x2={destination.x}
                        y2={destination.y}
                        stroke={isActive ? '#C7A578' : '#F4F1EC'}
                        strokeOpacity={isActive ? 0.7 : 0.12}
                        strokeWidth={isActive ? 0.35 : 0.2}
                        className="transition-all duration-700 ease-luxury"
                      />
                      <circle
                        cx={destination.x}
                        cy={destination.y}
                        r={isActive ? 1.5 : 1}
                        fill={isOrigin ? '#C7A578' : isActive ? '#F4F1EC' : '#8A857E'}
                        className="transition-all duration-700 ease-luxury"
                      />
                      {isActive && (
                        <text
                          x={destination.x}
                          y={destination.y - 3.2}
                          textAnchor="middle"
                          style={{
                            fontFamily: 'var(--font-sans), sans-serif',
                            fontSize: 2.6,
                            letterSpacing: '0.1em',
                            fill: '#F4F1EC',
                          }}
                        >
                          {destination.minutes === 0 ? 'PROPERTY' : `${destination.minutes} MIN`}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Property marker */}
                <motion.circle
                  cx="52"
                  cy="56"
                  r="1.6"
                  fill="#C7A578"
                  animate={reduced ? undefined : { r: [1.6, 2.4, 1.6], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>

              <div className="mt-4 flex flex-col gap-3 border-t border-paper/12 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="label text-[9px] text-paper/40">
                  {active ? `${active.label} · ${active.minutes === 0 ? 'On site' : `${active.minutes} minutes`}` : 'Select a destination'}
                </p>
                <p className="text-[11px] leading-relaxed text-paper/35">{active?.note}</p>
              </div>
            </div>

            <p className="mt-4 text-[10.5px] leading-relaxed text-paper/30">{location.mapNote}</p>
          </div>

          {/* -------------------------------------------------------- columns */}
          <div>
            {byGroup.map((entry) => (
              <RevealGroup key={entry.group} className="mb-8 last:mb-0">
                <RevealItem variant="fade">
                  <p className="label border-b border-paper/12 pb-3 text-paper/40">{entry.group}</p>
                </RevealItem>
                <ul>
                  {entry.items.map((destination) => (
                    <RevealItem key={destination.id} variant="up" distance={14}>
                      <li>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveId(destination.id)}
                          onFocus={() => setActiveId(destination.id)}
                          onClick={() => setActiveId(destination.id)}
                          aria-pressed={destination.id === activeId}
                          className={cn(
                            'flex w-full items-baseline justify-between gap-6 border-b border-paper/8 py-3.5 text-left transition-colors duration-500',
                            destination.id === activeId ? 'text-paper' : 'text-paper/60 hover:text-paper/85',
                          )}
                        >
                          <span className="text-[14px]">{destination.label}</span>
                          <span className="shrink-0 font-display text-[15px] tabular-nums text-brass/90">
                            {destination.minutes === 0 ? 'On site' : `${String(destination.minutes).padStart(2, '0')} min`}
                          </span>
                        </button>
                      </li>
                    </RevealItem>
                  ))}
                </ul>
              </RevealGroup>
            ))}

            <Reveal variant="fade" delay={0.1} className="mt-10 border-t border-paper/12 pt-8">
              <p className="font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-snug text-paper/85">
                “{location.quote.text}”
              </p>
              <p className="label mt-4 text-[9px] text-paper/35">{location.quote.attribution}</p>

              <dl className="mt-8 grid grid-cols-2 gap-6">
                {location.quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="label text-[9px] text-paper/35">{fact.label}</dt>
                    <dd className="mt-2 text-[14px] text-paper/85">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <Button
                href="#private-showing"
                intent="speak-with-advisor"
                variant="outline-dark"
                size="sm"
                arrow
                className="mt-8"
                analyticsEvent="agent_contact_click"
                analyticsProps={{ source: 'location' }}
              >
                Ask about the neighbourhood
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
