'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { property, rooms, type Room } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { selectPlanRoom } from '@/lib/planEvents';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/* Desktop: an index on the left, one large frame on the right                 */
/* -------------------------------------------------------------------------- */
function DesktopSpaces() {
  const [activeId, setActiveId] = useState(rooms[0].id);
  const active = rooms.find((room) => room.id === activeId) ?? rooms[0];
  const reduced = useReducedMotion();

  return (
    <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
      <div>
        <ul className="border-t border-paper/12" role="list">
          {rooms.map((room) => {
            const isActive = room.id === activeId;
            return (
              <li key={room.id} className="border-b border-paper/12">
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(room.id)}
                  onFocus={() => setActiveId(room.id)}
                  onClick={() => {
                    setActiveId(room.id);
                    track('room_space_select', { room: room.name, area: room.area });
                    selectPlanRoom(room.planRoomId, 'spaces-desktop');
                  }}
                  aria-pressed={isActive}
                  className="group flex w-full items-baseline justify-between gap-6 py-5 text-left"
                >
                  <span className="flex items-baseline gap-5">
                    <span
                      className={cn(
                        'label text-[9px] transition-colors duration-500',
                        isActive ? 'text-brass' : 'text-paper/35',
                      )}
                    >
                      {room.index}
                    </span>
                    <span
                      className={cn(
                        'font-display text-[clamp(1.3rem,1.9vw,1.9rem)] leading-none transition-all duration-[700ms] ease-luxury',
                        isActive ? 'translate-x-1 text-paper' : 'text-paper/55 group-hover:text-paper/85',
                      )}
                    >
                      {room.name}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-[11px] tabular-nums tracking-[0.14em] transition-all duration-700',
                      isActive ? 'text-paper/70' : 'text-paper/30',
                    )}
                  >
                    {room.area}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 min-h-[13rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="label text-paper/45">{active.dimensions} · approx.</p>
              <p className="body-md mt-4 max-w-md text-paper/70">{active.detail}</p>
              <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {active.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[12.5px] leading-relaxed text-paper/55">
                    <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-brass/70" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                href="#floor-plan"
                variant="quiet"
                size="sm"
                arrow
                className="mt-7 px-0 text-paper/70 hover:text-paper"
                analyticsEvent="floorplan_open"
                analyticsProps={{ source: 'spaces-desktop', room: active.name }}
                onClick={() => selectPlanRoom(active.planRoomId, 'spaces-desktop')}
              >
                See {active.name} in the plan
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Frame */}
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-graphite">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: room.id === activeId ? 1 : 0,
                scale: room.id === activeId ? 1 : reduced ? 1 : 1.03,
              }}
              transition={{ duration: 1.1, ease: EASE }}
              aria-hidden={room.id !== activeId}
            >
              <Image
                src={room.imageSrc}
                alt={room.id === activeId ? room.imageAlt : ''}
                fill
                sizes="(max-width: 1280px) 55vw, 45vw"
                quality={84}
                style={room.objectPosition ? { objectPosition: room.objectPosition } : undefined}
                className="object-cover"
              />
            </motion.div>
          ))}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6">
            <div>
              <p className="label text-[9px] text-paper/55">{active.caption}</p>
              <p className="mt-2 font-display text-2xl leading-none text-paper">{active.name}</p>
            </div>
            <p className="hidden max-w-[16rem] text-right text-[12px] leading-relaxed text-paper/60 xl:block">
              {active.description}
            </p>
          </div>
        </div>

        {/* Frame counter */}
        <div className="mt-4 flex items-center justify-between">
          <p className="label text-[9px] text-paper/35">
            {String(rooms.findIndex((room) => room.id === activeId) + 1).padStart(2, '0')} /{' '}
            {String(rooms.length).padStart(2, '0')}
          </p>
          <p className="label text-[9px] text-paper/35">Hover or select a space</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile: swipeable cards with scroll-snap                                    */
/* -------------------------------------------------------------------------- */
function MobileSpaces() {
  const scroller = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const onScroll = () => {
      const card = node.firstElementChild as HTMLElement | null;
      if (!card) return;
      const width = card.offsetWidth + 16;
      setIndex(Math.min(Math.round(node.scrollLeft / width), rooms.length - 1));
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (next: number) => {
    const node = scroller.current;
    const card = node?.firstElementChild as HTMLElement | null;
    if (!node || !card) return;
    node.scrollTo({ left: next * (card.offsetWidth + 16), behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden">
      <ul
        ref={scroller}
        className="no-scrollbar -mx-[var(--shell-x)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--shell-x)] pb-2"
      >
        {rooms.map((room) => (
          <li
            key={room.id}
            className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[58vw]"
          >
            <article className="flex h-full flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-graphite">
                <Image
                  src={room.imageSrc}
                  alt={room.imageAlt}
                  fill
                  sizes="78vw"
                  quality={82}
                  style={room.objectPosition ? { objectPosition: room.objectPosition } : undefined}
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="label text-[9px] text-paper/55">{room.caption}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-paper">{room.name}</h3>
                </div>
              </div>

              <div className="mt-5 flex-1">
                <p className="label text-brass">{room.dimensions} · approx.</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-paper/70">{room.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {room.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[12.5px] leading-relaxed text-paper/50">
                      <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-brass/70" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    track('floorplan_open', { source: 'spaces-mobile', room: room.name });
                    selectPlanRoom(room.planRoomId, 'spaces-mobile');
                    document.getElementById('floor-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-5 inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.24em] text-paper/60"
                >
                  See in plan
                  <span aria-hidden="true" className="h-px w-6 bg-current" />
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTo(Math.max(index - 1, 0))}
            className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors duration-500 hover:border-paper/50"
            aria-label="Previous space"
          >
            <svg viewBox="0 0 22 10" className="h-2.5 w-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M0 5h20M16 1l4 4-4 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollTo(Math.min(index + 1, rooms.length - 1))}
            className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors duration-500 hover:border-paper/50"
            aria-label="Next space"
          >
            <svg viewBox="0 0 22 10" className="h-2.5 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M0 5h20M16 1l4 4-4 4" />
            </svg>
          </button>
        </div>
        <p className="label text-[9px] text-paper/40">
          {String(index + 1).padStart(2, '0')} / {String(rooms.length).padStart(2, '0')} — swipe to explore
        </p>
      </div>
    </div>
  );
}

/**
 * 05 — SIGNATURE SPACES
 * Desktop gets a hover index; mobile gets a swipe deck. Same content, two
 * genuinely different interactions.
 */
export function SignatureSpaces() {
  return (
    <section
      id="spaces"
      className="relative overflow-hidden bg-ink py-24 text-paper md:py-32 lg:py-40"
      aria-labelledby="spaces-heading"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-end lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/60" />
                {property.spaces.eyebrow}
              </p>
            </Reveal>
            <h2 id="spaces-heading" className="display-lg mt-8 text-paper">
              <SplitLines text={property.spaces.heading} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="body-lg max-w-md text-paper/60 lg:pb-3">{property.spaces.intro}</p>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-20">
          <DesktopSpaces />
          <MobileSpaces />
        </div>
      </div>
    </section>
  );
}

export type { Room };
