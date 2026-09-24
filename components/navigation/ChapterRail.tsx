'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useActiveSection, useScrolled } from '@/lib/hooks';

const CHAPTERS = [
  { id: 'hero', index: '01', label: 'Arrival' },
  { id: 'residence', index: '02', label: 'The Residence' },
  { id: 'statistics', index: '03', label: 'At a Glance' },
  { id: 'architecture', index: '04', label: 'Architecture' },
  { id: 'spaces', index: '05', label: 'Signature Spaces' },
  { id: 'gallery', index: '06', label: 'Gallery' },
  { id: 'floor-plan', index: '07', label: 'Floor Plan' },
  { id: 'location', index: '08', label: 'Location' },
  { id: 'film', index: '09', label: 'Property Film' },
  { id: 'advisor', index: '10', label: 'Represented By' },
  { id: 'private-showing', index: '11', label: 'Private Showing' },
  { id: 'contact', index: '12', label: 'Contact' },
];

const IDS = CHAPTERS.map((chapter) => chapter.id);

/**
 * A quiet chapter index on the right edge of large screens — turns the page
 * into a navigation-able film instead of a scroll of disconnected sections.
 */
export function ChapterRail() {
  const active = useActiveSection(IDS, 0.4);
  const scrolled = useScrolled(600);

  return (
    <nav
      aria-label="Chapters"
      className={cn(
        'fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-[900ms] ease-luxury xl:block',
        scrolled ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ul className="flex flex-col items-end gap-1.5">
        {CHAPTERS.map((chapter) => {
          const isActive = active === chapter.id;
          return (
            <li key={chapter.id}>
              <Link
                href={`#${chapter.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center justify-end gap-3 py-1"
              >
                <span
                  className={cn(
                    'font-sans text-[9px] uppercase tracking-[0.28em] transition-all duration-700 ease-luxury',
                    isActive
                      ? 'text-brass opacity-100'
                      : 'translate-x-1 text-paper/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                  )}
                >
                  {chapter.label}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'block h-px transition-all duration-[700ms] ease-luxury',
                      isActive ? 'w-6 bg-brass' : 'w-3 bg-paper/40 group-hover:w-5 group-hover:bg-paper/70',
                    )}
                  />
                  <span
                    className={cn(
                      'font-sans text-[9px] tabular-nums tracking-[0.2em] transition-colors duration-500',
                      isActive ? 'text-brass' : 'text-paper/40 group-hover:text-paper/80',
                    )}
                  >
                    {chapter.index}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
