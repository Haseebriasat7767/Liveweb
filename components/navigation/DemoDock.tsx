'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { subscribeToEvents, track, type TrackedEvent } from '@/lib/analytics';
import { scoreBand, summariseLead, type Lead } from '@/lib/leads';
import { agent, analytics, leadSettings, property, site } from '@/data';

type Tab = 'leads' | 'events' | 'system';

const EASE = [0.16, 1, 0.3, 1] as const;

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Page view',
  hero_cta_click: 'Hero CTA',
  gallery_open: 'Gallery opened',
  floorplan_open: 'Floor plan opened',
  video_play: 'Film played',
  phone_click: 'Phone tap',
  showing_form_open: 'Form opened',
  showing_form_submit: 'Lead submitted',
  lead_form_error: 'Validation error',
};

/**
 * CLIENT-CLOSING DEMO MODE
 * A quiet dock that proves the machine works: captured leads, the live
 * conversion event stream, and the configuration map for white-labelling.
 * Disabled by setting NEXT_PUBLIC_DEMO_MODE=false.
 */
export function DemoDock() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => subscribeToEvents((event) => setEvents((prev) => [event, ...prev].slice(0, 40))), []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads?limit=12', { cache: 'no-store' });
      const payload = (await response.json()) as { leads?: Lead[] };
      setLeads(payload.leads ?? []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === 'leads') void loadLeads();
  }, [open, tab, loadLeads]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track('demo_dock_open', { source: 'chip' });
        }}
        className={cn(
          'fixed bottom-[76px] left-4 z-40 flex items-center gap-2 border border-paper/20 bg-ink/85 px-3.5 py-2 text-paper backdrop-blur-xl transition-all duration-700 ease-luxury hover:border-brass/70 lg:bottom-7 lg:left-7',
          open && 'pointer-events-none opacity-0',
        )}
        aria-label="Open demonstration panel"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
        <span className="label text-[9px]">Demo</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm lg:bg-ink/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Demonstration panel"
              className="fixed bottom-0 left-0 top-0 z-[80] flex w-full max-w-[27rem] flex-col border-r border-paper/12 bg-ink text-paper"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              <header className="flex items-center justify-between border-b border-paper/12 px-6 py-5">
                <div>
                  <p className="label text-brass">Demonstration</p>
                  <p className="mt-1 font-display text-xl">{site.brand}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center border border-paper/15 transition-colors duration-500 hover:border-paper/50"
                  aria-label="Close demonstration panel"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M5 5l14 14M19 5L5 19" />
                  </svg>
                </button>
              </header>

              <nav className="grid grid-cols-3 border-b border-paper/12" aria-label="Demo sections">
                {(['leads', 'events', 'system'] as Tab[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={cn(
                      'label py-3.5 text-[9px] transition-colors duration-500',
                      tab === item ? 'bg-paper/8 text-brass' : 'text-paper/50 hover:text-paper',
                    )}
                    aria-pressed={tab === item}
                  >
                    {item === 'leads' ? 'Leads' : item === 'events' ? 'Events' : 'System'}
                  </button>
                ))}
              </nav>

              <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6">
                {tab === 'leads' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="label text-paper/45">Captured leads</p>
                      <button
                        type="button"
                        onClick={() => void loadLeads()}
                        className="label text-[9px] text-brass transition-opacity duration-500 hover:opacity-70"
                      >
                        Refresh
                      </button>
                    </div>

                    {loading && <p className="mt-6 text-[13px] text-paper/50">Reading inbox…</p>}

                    {!loading && leads?.length === 0 && (
                      <p className="mt-6 text-[13px] leading-relaxed text-paper/50">
                        No leads yet. Submit the private showing form to see it arrive here — with the
                        qualification score and intent attached.
                      </p>
                    )}

                    <ul className="mt-5 space-y-4">
                      {leads?.map((lead) => {
                        const band = scoreBand(lead.score ?? 0);
                        return (
                          <li key={lead.id} className="border border-paper/12 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[14px]">
                                  {lead.firstName} {lead.lastName}
                                </p>
                                <p className="mt-1 text-[11px] text-paper/50">{lead.email}</p>
                                <p className="text-[11px] text-paper/50">{lead.phone}</p>
                              </div>
                              <span
                                className={cn(
                                  'label shrink-0 border px-2 py-1 text-[8px]',
                                  band === 'Hot'
                                    ? 'border-brass/60 text-brass'
                                    : band === 'Warm'
                                      ? 'border-paper/25 text-paper/70'
                                      : 'border-paper/15 text-paper/40',
                                )}
                              >
                                {band} {lead.score}
                              </span>
                            </div>
                            <p className="mt-3 text-[11px] leading-relaxed text-paper/55">
                              {summariseLead(lead)}
                            </p>
                            {lead.message && (
                              <p className="mt-2 line-clamp-3 text-[11px] italic leading-relaxed text-paper/45">
                                “{lead.message}”
                              </p>
                            )}
                            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-paper/30">
                              {lead.reference} · {new Date(lead.submittedAt).toLocaleString()}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {tab === 'events' && (
                  <div>
                    <p className="label text-paper/45">Conversion events — live</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-paper/40">
                      Provider: {analytics.provider}. No personal data is ever sent to analytics.
                    </p>
                    <ul className="mt-5 space-y-2">
                      {events.length === 0 && (
                        <li className="text-[13px] text-paper/45">
                          Interact with the page — scroll, open the gallery, request a showing — to see
                          events.
                        </li>
                      )}
                      {events.map((event) => (
                        <li
                          key={event.id}
                          className="flex items-baseline justify-between gap-3 border-b border-paper/8 pb-2"
                        >
                          <span className="text-[12px] text-paper/80">
                            {EVENT_LABELS[event.name] ?? event.name}
                          </span>
                          <span className="shrink-0 text-[10px] tabular-nums text-paper/35">
                            {new Date(event.at).toLocaleTimeString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === 'system' && (
                  <div className="space-y-6 text-[12px] leading-relaxed text-paper/60">
                    <div>
                      <p className="label text-paper/45">Property</p>
                      <p className="mt-2 text-paper/80">
                        {property.name} · {property.price}
                      </p>
                      <p className="mt-1">
                        {property.address.line1}, {property.address.line2}
                      </p>
                    </div>

                    <div>
                      <p className="label text-paper/45">Advisor</p>
                      <p className="mt-2 text-paper/80">
                        {agent.name} — {agent.brokerage}
                      </p>
                      <p className="mt-1">Recipient: {leadSettings.delivery.recipient}</p>
                      <p className="mt-1">CRM: {leadSettings.delivery.crm}</p>
                    </div>

                    <div>
                      <p className="label text-paper/45">White-label map</p>
                      <ul className="mt-2 space-y-1.5">
                        <li>data/property.ts — identity, hero, story, stats, SEO</li>
                        <li>data/rooms.ts — signature spaces</li>
                        <li>data/gallery.ts — photo essay</li>
                        <li>data/floorPlans.ts — interactive plans</li>
                        <li>data/location.ts — lifestyle and travel times</li>
                        <li>data/agent.ts — credibility content</li>
                        <li>data/contact.ts — phone, email, WhatsApp, booking</li>
                        <li>data/leadSettings.ts — intents, validation, delivery</li>
                        <li>public/images — artwork (same filenames swap in place)</li>
                      </ul>
                    </div>

                    <div className="border border-paper/12 p-4">
                      <p className="label text-paper/45">Client-ready checklist</p>
                      <ul className="mt-2 space-y-1.5 text-paper/60">
                        <li>✓ Cinematic hero with film support</li>
                        <li>✓ Interactive gallery with fullscreen viewer</li>
                        <li>✓ Interactive floor plans with room data</li>
                        <li>✓ Lead capture with qualification + scoring</li>
                        <li>✓ Provider-swappable analytics</li>
                        <li>✓ Structured data, sitemap, robots, OG metadata</li>
                        <li>✓ Reduced-motion and keyboard support</li>
                        <li>○ Set NEXT_PUBLIC_DEMO_MODE=false before going live</li>
                      </ul>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-paper/30">
                      Demo mode is on · fictional property content
                    </p>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
