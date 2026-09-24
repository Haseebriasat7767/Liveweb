'use client';

import { cn } from '@/lib/utils';
import { useScrolled } from '@/lib/hooks';
import { contact, property } from '@/data';
import { requestShowing } from '@/lib/conversion';
import { track } from '@/lib/analytics';

/**
 * FLOATING CONVERSION SYSTEM
 * Desktop: a single quiet "Private Showing" badge, bottom right.
 * Mobile: a three-cell sticky bar — Call · Inquire · Showing.
 * Both appear only after the hero, so the first impression stays cinematic.
 */
export function StickyConversion() {
  const visible = useScrolled(720);

  const callHref = contact.phone.available ? contact.phone.href : contact.email.href;

  return (
    <>
      {/* ------------------------------------------------ desktop badge */}
      <div
        className={cn(
          'fixed bottom-7 right-7 z-40 hidden transition-all duration-[900ms] ease-luxury lg:block',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <button
          type="button"
          onClick={() => {
            track('showing_form_open', { source: 'floating_badge' });
            requestShowing('private-showing', 'floating_badge');
            document.getElementById('private-showing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="group flex items-center gap-4 border border-paper/15 bg-ink/85 px-6 py-4 text-paper shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-colors duration-700 ease-luxury hover:border-brass/60 hover:bg-ink"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass" />
          </span>
          <span className="label text-[9.5px]">Private Showing</span>
          <span aria-hidden="true" className="h-3 w-px bg-paper/20" />
          <span className="label text-[9.5px] text-paper/55 transition-colors duration-500 group-hover:text-paper">
            {property.hero.meta[3]?.value}
          </span>
        </button>
      </div>

      {/* ------------------------------------------------- mobile bar */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-paper/10 bg-ink/92 backdrop-blur-xl transition-transform duration-[900ms] ease-luxury lg:hidden',
          visible ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-3 divide-x divide-paper/10">
          <a
            href={callHref || '#contact'}
            onClick={() => {
              if (contact.phone.available) track('phone_click', { source: 'sticky_bar' });
            }}
            className="flex flex-col items-center justify-center gap-1 py-3.5 text-paper/85 transition-colors duration-500 active:bg-paper/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
            </svg>
            <span className="label text-[9px]">Call</span>
          </a>

          <button
            type="button"
            onClick={() => {
              track('showing_form_open', { source: 'sticky_bar_inquire' });
              requestShowing('property-details', 'sticky_bar');
              document.getElementById('private-showing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex flex-col items-center justify-center gap-1 py-3.5 text-paper/85 transition-colors duration-500 active:bg-paper/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />
            </svg>
            <span className="label text-[9px]">Inquire</span>
          </button>

          <button
            type="button"
            onClick={() => {
              track('showing_form_open', { source: 'sticky_bar' });
              requestShowing('private-showing', 'sticky_bar');
              document.getElementById('private-showing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex flex-col items-center justify-center gap-1 bg-paper py-3.5 text-ink transition-colors duration-500 active:bg-brass active:text-paper"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4 10.5 12 4l8 6.5V20H4z" />
              <path d="M10 20v-5h4v5" />
            </svg>
            <span className="label text-[9px]">Showing</span>
          </button>
        </div>
      </div>
    </>
  );
}
