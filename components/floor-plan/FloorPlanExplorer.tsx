'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { floorPlans, property, type PlanRoom } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Button } from '@/components/ui/Button';
import { PlanDrawing } from './PlanDrawing';
import { cn } from '@/lib/utils';
import { onPlanSelect } from '@/lib/planEvents';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 07 — FLOOR PLAN EXPERIENCE
 * Level selector, interactive SVG plan, and a room dossier that fills in as you
 * explore. Also receives selections fired from Signature Spaces.
 */
export function FloorPlanExplorer() {
  const reduced = useReducedMotion();
  const sectionRef = useOnceInView<HTMLElement>(() => track('floorplan_open', { source: 'section_view' }));

  const [levelId, setLevelId] = useState(floorPlans[0].id);
  const [roomId, setRoomId] = useState<string | null>(floorPlans[0].rooms[3]?.id ?? null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const level = useMemo(
    () => floorPlans.find((entry) => entry.id === levelId) ?? floorPlans[0],
    [levelId],
  );

  const room = useMemo(
    () => level.rooms.find((entry) => entry.id === roomId) ?? null,
    [level, roomId],
  );

  const selectRoom = useCallback((next: PlanRoom, source: string) => {
    setRoomId(next.id);
    track('floorplan_room_select', { room: next.name, level: source, area: next.area });
  }, []);

  /** Selections pushed from other sections (e.g. Signature Spaces). */
  useEffect(() => {
    return onPlanSelect(({ roomId: targetId, source }) => {
      const owner = floorPlans.find((entry) => entry.rooms.some((r) => r.id === targetId));
      if (!owner) return;
      setLevelId(owner.id);
      setRoomId(targetId);
      track('floorplan_open', { source, room: targetId });
    });
  }, []);

  return (
    <section
      id="floor-plan"
      ref={sectionRef}
      className="relative bg-paper py-24 text-charcoal md:py-32 lg:py-40"
      aria-labelledby="floor-plan-heading"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-end lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-bronze">
                <span className="h-px w-8 bg-bronze/60" />
                {property.floorPlans.eyebrow}
              </p>
            </Reveal>
            <h2 id="floor-plan-heading" className="display-lg mt-8 text-charcoal">
              <SplitLines text={property.floorPlans.heading} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <p className="body-lg max-w-md text-graphite/65 lg:pb-4">{property.floorPlans.intro}</p>
          </Reveal>
        </div>

        {/* ------------------------------------------------------------ levels */}
        <Reveal variant="fade" delay={0.1} className="mt-14">
          <div
            role="tablist"
            aria-label="Floor plan levels"
            className="no-scrollbar -mx-[var(--shell-x)] flex gap-3 overflow-x-auto px-[var(--shell-x)] sm:mx-0 sm:px-0"
          >
            {floorPlans.map((entry, index) => {
              const isActive = entry.id === levelId;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setLevelId(entry.id);
                    setRoomId(entry.rooms.find((r) => !r.minor)?.id ?? entry.rooms[0].id);
                    track('floorplan_open', { level: entry.name });
                  }}
                  className={cn(
                    'group shrink-0 border px-5 py-4 text-left transition-all duration-[600ms] ease-luxury',
                    isActive
                      ? 'border-charcoal bg-charcoal text-paper'
                      : 'border-charcoal/18 text-graphite/70 hover:border-charcoal/45',
                  )}
                >
                  <span className="label block text-[8.5px] opacity-60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-2 block font-display text-lg leading-none">{entry.name}</span>
                  <span className="mt-1.5 block text-[10.5px] tracking-[0.12em] opacity-60">
                    {entry.totalArea}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ------------------------------------------------------------- plan */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)] lg:gap-12">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={level.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE }}
              >
                <PlanDrawing
                  level={level}
                  selectedId={roomId}
                  hoveredId={hoverId}
                  onSelect={(next) => selectRoom(next, level.name)}
                  onHover={setHoverId}
                />
              </motion.div>
            </AnimatePresence>

            <p className="mt-6 max-w-2xl text-[11.5px] leading-relaxed text-graphite/45">
              {property.floorPlans.scaleNote}
            </p>
          </div>

          {/* -------------------------------------------------------- dossier */}
          <div ref={detailsRef} className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-charcoal/15 bg-paper p-6 md:p-7">
              <AnimatePresence mode="wait">
                {room ? (
                  <motion.div
                    key={`${level.id}-${room.id}`}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE }}
                  >
                    {room.imageSrc && (
                      <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden bg-bone/50">
                        <Image
                          src={room.imageSrc}
                          alt={room.imageAlt ?? room.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 30vw"
                          quality={82}
                          className="object-cover"
                          style={room.id === 'pool' ? { objectPosition: 'center 78%' } : undefined}
                        />
                      </div>
                    )}

                    <p className="label text-bronze">{level.name}</p>
                    <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-charcoal">
                      {room.name}
                    </h3>

                    <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-charcoal/12 pt-5">
                      <div>
                        <dt className="label text-graphite/45">Area</dt>
                        <dd className="mt-2 text-[13.5px] text-charcoal">{room.area}</dd>
                      </div>
                      <div>
                        <dt className="label text-graphite/45">Dimensions</dt>
                        <dd className="mt-2 text-[13.5px] text-charcoal">{room.dimensions}</dd>
                      </div>
                    </dl>

                    {room.detail && (
                      <p className="mt-5 text-[13px] leading-relaxed text-graphite/65">{room.detail}</p>
                    )}

                    <p className="mt-5 text-[10.5px] uppercase tracking-[0.2em] text-graphite/35">
                      Approximate · verify independently
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="empty"
                    className="text-[13px] leading-relaxed text-graphite/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Select a room on the plan to see its dimensions, features and photography.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Room list — the accessible, thumb-friendly way to explore the plan */}
            <div className="mt-6">
              <p className="label text-graphite/45">Rooms — {level.short}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {level.rooms
                  .filter((entry) => !entry.minor)
                  .map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => selectRoom(entry, level.name)}
                        aria-pressed={entry.id === roomId}
                        className={cn(
                          'border px-3.5 py-2 text-[11.5px] tracking-[0.04em] transition-all duration-[500ms] ease-luxury',
                          entry.id === roomId
                            ? 'border-charcoal bg-charcoal text-paper'
                            : 'border-charcoal/18 text-graphite/70 hover:border-charcoal/45 hover:text-charcoal',
                        )}
                      >
                        {entry.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-charcoal/12 pt-6">
              <p className="text-[13px] leading-relaxed text-graphite/65">
                Want the full set of drawings, the specification schedule and the disclosure package?
              </p>
              <Button
                variant="outline"
                size="sm"
                arrow
                className="mt-4"
                href="#private-showing"
                intent="property-details"
                analyticsEvent="showing_form_open"
                analyticsProps={{ source: 'floorplan_dossier' }}
              >
                Request Property Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
