'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { galleryImages } from '@/data';
import { cn } from '@/lib/utils';
import { useLockBodyScroll } from '@/lib/hooks';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

type LightboxProps = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Fullscreen image viewer: keyboard arrows, swipe on touch, counter, and a
 * thumbnail strip. Deliberately quiet chrome so the photography carries it.
 */
export function Lightbox({ index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const reduced = useReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);

  const step = useCallback(
    (direction: number) => {
      if (index === null) return;
      const next = (index + direction + galleryImages.length) % galleryImages.length;
      onNavigate(next);
      track('gallery_navigate', { direction, frame: next + 1 });
    },
    [index, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'Tab' && closeRef.current) {
        // Keep focus inside the viewer.
        const focusables = document.querySelectorAll<HTMLElement>('[data-lightbox-focus]');
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, step]);

  const image = index !== null ? galleryImages[index] : null;

  return (
    <AnimatePresence>
      {open && image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image ${index! + 1} of ${galleryImages.length}: ${image.caption}`}
          className="fixed inset-0 z-[90] flex flex-col bg-ink/97 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.6, ease: EASE }}
          onTouchStart={(event) => {
            touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            if (!start) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
            touchStart.current = null;
          }}
        >
          {/* chrome */}
          <div className="flex shrink-0 items-center justify-between px-5 py-5 md:px-8">
            <p className="label text-paper/50">
              <span className="text-paper">{String(index! + 1).padStart(2, '0')}</span> /{' '}
              {String(galleryImages.length).padStart(2, '0')}
              <span className="mx-3 text-paper/25">—</span>
              {image.chapter}
            </p>
            <button
              ref={closeRef}
              type="button"
              data-lightbox-focus
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center border border-paper/20 text-paper/80 transition-colors duration-500 hover:border-paper/60 hover:text-paper"
              aria-label="Close gallery"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          {/* stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-2 md:px-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={image.id}
                className="relative h-full w-full"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
                transition={{ duration: reduced ? 0.15 : 0.7, ease: EASE }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 88vw"
                  quality={90}
                  priority
                  className="object-contain"
                />
              </motion.figure>
            </AnimatePresence>

            {/* arrows */}
            <button
              type="button"
              data-lightbox-focus
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-paper/60 transition-colors duration-500 hover:text-paper md:left-4"
              aria-label="Previous image"
            >
              <svg viewBox="0 0 22 10" className="h-3 w-6 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M0 5h20M16 1l4 4-4 4" />
              </svg>
            </button>
            <button
              type="button"
              data-lightbox-focus
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-paper/60 transition-colors duration-500 hover:text-paper md:right-4"
              aria-label="Next image"
            >
              <svg viewBox="0 0 22 10" className="h-3 w-6" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M0 5h20M16 1l4 4-4 4" />
              </svg>
            </button>
          </div>

          {/* caption + thumbnails */}
          <div className="shrink-0 px-5 pb-6 pt-4 md:px-8 md:pb-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-5">
              <div className="flex flex-col gap-2 border-t border-paper/12 pt-4 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="font-display text-lg text-paper/90">{image.caption}</p>
                <p className="label text-[9px] text-paper/35">Use ← → to browse · Esc to close</p>
              </div>

              <ul className="no-scrollbar -mx-1 hidden gap-2 overflow-x-auto px-1 md:flex" role="list">
                {galleryImages.map((item, itemIndex) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-lightbox-focus
                      onClick={() => {
                        onNavigate(itemIndex);
                        track('gallery_navigate', { direction: 'thumb', frame: itemIndex + 1 });
                      }}
                      className={cn(
                        'relative block h-14 w-20 overflow-hidden border transition-opacity duration-500',
                        itemIndex === index
                          ? 'border-brass opacity-100'
                          : 'border-transparent opacity-45 hover:opacity-80',
                      )}
                      aria-label={`View image ${itemIndex + 1}: ${item.caption}`}
                      aria-current={itemIndex === index}
                    >
                      <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
