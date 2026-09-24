'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useActiveSection, useLockBodyScroll, useScrolled } from '@/lib/hooks';
import { contact, agent, property, site } from '@/data';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';

const LINKS = [
  { id: 'residence', label: 'Overview', href: '#residence' },
  { id: 'spaces', label: 'Residence', href: '#spaces' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'floor-plan', label: 'Floor Plan', href: '#floor-plan' },
  { id: 'location', label: 'Location', href: '#location' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

const SECTION_IDS = ['hero', ...LINKS.map((l) => l.id), 'private-showing'];
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Minimal floating navigation.
 * Transparent over the hero, then a quiet blurred bar that holds contrast on
 * both the light and dark chapters of the page.
 */
export function FloatingNav() {
  const scrolled = useScrolled(80);
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = useCallback((href: string, label: string) => {
    setOpen(false);
    track('nav_cta_click', { label, href });
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,height,border-color] duration-[900ms] ease-luxury',
          scrolled
            ? 'h-[68px] border-b border-paper/10 bg-ink/80 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/65'
            : 'h-[86px] border-b border-transparent bg-gradient-to-b from-ink/45 to-transparent',
        )}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          {/* Brand lockup */}
          <Link
            href="#hero"
            onClick={() => go('#hero', 'brand')}
            className="group flex flex-col justify-center leading-none text-paper"
            aria-label={`${site.brand} — ${property.name}, back to top`}
          >
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.34em] transition-opacity duration-500 group-hover:opacity-70 sm:text-[11px]">
              {site.brand}
            </span>
            <span className="mt-1.5 hidden font-display text-[13px] italic tracking-wide text-paper/55 sm:block">
              {property.name}
            </span>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      onClick={() => go(link.href, link.label)}
                      className="group relative block py-2 font-sans text-[10.5px] font-normal uppercase tracking-[0.2em] text-paper/70 transition-colors duration-500 hover:text-paper"
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brass transition-transform duration-[700ms] ease-luxury',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <Button
              href="#private-showing"
              intent="private-showing"
              analyticsEvent="nav_cta_click"
              analyticsProps={{ label: 'Request Private Showing — nav' }}
              variant="inverse"
              size="sm"
              arrow
              className="hidden md:inline-flex"
            >
              Request Private Showing
            </Button>

            {contact.phone.available && (
              <a
                href={contact.phone.href}
                onClick={() => track('phone_click', { source: 'nav' })}
                className="hidden font-sans text-[10.5px] uppercase tracking-[0.2em] text-paper/70 transition-colors duration-500 hover:text-paper xl:block"
              >
                {contact.phone.label}
              </a>
            )}

            <button
              ref={triggerRef}
              type="button"
              onClick={() => {
                setOpen(true);
                track('nav_cta_click', { label: 'Menu — open' });
              }}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <span className="flex flex-col gap-[6px]">
                <span className="block h-px w-6 bg-paper" />
                <span className="block h-px w-6 bg-paper" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="shell flex h-[86px] shrink-0 items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-[0.34em] text-paper/70">
                Menu
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="flex h-10 w-10 items-center justify-center"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="shell flex-1 overflow-y-auto pb-8">
              <ul className="divide-y divide-paper/10 border-y border-paper/10">
                {LINKS.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.18 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => go(link.href, link.label)}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="font-display text-[1.75rem] leading-none">{link.label}</span>
                      <span className="label text-brass">{String(index + 1).padStart(2, '0')}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 space-y-6">
                <Button
                  href="#private-showing"
                  intent="private-showing"
                  analyticsEvent="nav_cta_click"
                  analyticsProps={{ label: 'Request Private Showing — mobile menu' }}
                  variant="inverse"
                  size="lg"
                  arrow
                  fullWidth
                  onClick={() => setOpen(false)}
                >
                  Request Private Showing
                </Button>

                <div className="grid grid-cols-2 gap-4 text-paper/70">
                  {contact.phone.available && (
                    <a href={contact.phone.href} className="label" onClick={() => setOpen(false)}>
                      Call<br />
                      <span className="mt-1 block normal-case tracking-normal text-[13px] text-paper">
                        {contact.phone.label}
                      </span>
                    </a>
                  )}
                  {contact.email.available && (
                    <a href={contact.email.href} className="label" onClick={() => setOpen(false)}>
                      Email<br />
                      <span className="mt-1 block break-all normal-case tracking-normal text-[13px] text-paper">
                        {contact.email.label}
                      </span>
                    </a>
                  )}
                </div>

                <p className="label text-[9px] leading-relaxed text-paper/35">
                  {property.name} · {agent.brokerage}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
