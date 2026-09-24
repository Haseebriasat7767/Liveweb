'use client';

import { agent, contact, property } from '@/data';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Button } from '@/components/ui/Button';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

const ICONS: Record<string, React.ReactNode> = {
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />,
  sms: <path d="M4 5h16v11H9l-5 4V5Z" />,
  email: <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />,
  whatsapp: (
    <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Zm4 11.6c-.2.6-1.2 1.1-1.7 1.1-1.4.1-3-.8-4.4-2.2-1.3-1.3-2.2-3-2.1-4.3 0-.6.5-1.5 1-1.7.3-.1.7 0 .9.4l.7 1.6c.1.3 0 .5-.2.7l-.5.5c-.1.2-.2.4 0 .7.3.6 1.6 1.9 2.2 2.1.3.1.5 0 .6-.1l.5-.5c.2-.2.4-.3.7-.2l1.6.7c.3.2.4.6.3.9Z" />
  ),
  booking: <path d="M4 6.5h16v13H4zM4 10h16M8 3.5v4M16 3.5v4" />,
};

/**
 * 13 — CONTACT / BOOKING
 * Every channel comes from configuration. Nothing configured, nothing shown —
 * so a white-label client never ships a dead link.
 */
export function ContactPanel() {
  const ref = useOnceInView<HTMLElement>(() => track('section_view', { section: 'contact' }));

  const channels = [
    { key: 'phone', data: contact.phone, event: 'phone_click' as const },
    { key: 'sms', data: contact.sms, event: 'sms_click' as const },
    { key: 'email', data: contact.email, event: 'email_click' as const },
    { key: 'whatsapp', data: contact.whatsapp, event: 'whatsapp_click' as const },
    { key: 'booking', data: contact.booking, event: 'booking_click' as const },
  ].filter((channel) => channel.data.available);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-paper py-24 text-charcoal md:py-32 lg:py-36"
      aria-labelledby="contact-heading"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-end lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-bronze">
                <span className="h-px w-8 bg-bronze/60" />
                {contact.eyebrow}
              </p>
            </Reveal>
            <h2 id="contact-heading" className="display-lg mt-8 text-charcoal">
              <SplitLines text={contact.heading} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <p className="body-lg max-w-md text-graphite/65 lg:pb-4">{contact.note}</p>
          </Reveal>
        </div>

        {/* ----------------------------------------------------------- channels */}
        <RevealGroup className="mt-16 grid border-t border-charcoal/12 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <RevealItem key={channel.key} className="border-b border-charcoal/12 sm:border-r">
              <a
                href={channel.data.href}
                target={channel.data.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.data.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                onClick={() => track(channel.event, { source: 'contact_panel' })}
                className="group flex h-full flex-col justify-between gap-8 p-6 transition-colors duration-[700ms] ease-luxury hover:bg-bone/50 lg:p-7"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-bronze"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  aria-hidden="true"
                >
                  {ICONS[channel.key]}
                </svg>
                <span>
                  <span className="label block text-graphite/40">{channel.key}</span>
                  <span className="mt-3 block break-words font-display text-[1.15rem] leading-snug text-charcoal">
                    {channel.data.label}
                  </span>
                  <span className="mt-2 block text-[11.5px] leading-relaxed text-graphite/50">
                    {channel.data.caption}
                  </span>
                </span>
              </a>
            </RevealItem>
          ))}

          {channels.length === 0 && (
            <RevealItem className="col-span-full border-b border-charcoal/12 p-6">
              <p className="text-[13px] text-graphite/60">
                Contact channels are configured in data/contact.ts — add a phone, email or booking link.
              </p>
            </RevealItem>
          )}
        </RevealGroup>

        {/* ------------------------------------------------------- hours + CTA */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:gap-20">
          <Reveal>
            <h3 className="label text-graphite/45">Office hours</h3>
            <dl className="mt-5 border-t border-charcoal/12">
              {contact.hours.map((entry) => (
                <div
                  key={entry.day}
                  className="flex items-baseline justify-between gap-6 border-b border-charcoal/12 py-3.5"
                >
                  <dt className="text-[13px] text-graphite/70">{entry.day}</dt>
                  <dd className="text-[13px] tabular-nums text-charcoal">{entry.value}</dd>
                </div>
              ))}
            </dl>

            <address className="mt-8 not-italic">
              <p className="label text-graphite/45">{contact.office.name}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-graphite/70">
                {contact.office.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </address>
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-10">
            <div className="border border-charcoal/15 bg-bone/30 p-7 md:p-9">
              <p className="label text-bronze">{property.conversion.eyebrow}</p>
              <p className="mt-5 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight text-charcoal">
                {property.conversion.heading}
              </p>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-graphite/65">
                {property.conversion.body}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#private-showing"
                  intent="private-showing"
                  variant="solid"
                  size="md"
                  arrow
                  className="w-full sm:w-auto"
                  analyticsEvent="showing_form_open"
                  analyticsProps={{ source: 'contact_panel' }}
                >
                  Request Private Showing
                </Button>

                {contact.booking.available ? (
                  <Button
                    href={contact.booking.href}
                    variant="outline"
                    size="md"
                    arrow
                    className="w-full sm:w-auto"
                    analyticsEvent="booking_click"
                    analyticsProps={{ source: 'contact_panel' }}
                  >
                    {contact.booking.label}
                  </Button>
                ) : (
                  <Button
                    href="#private-showing"
                    intent="speak-with-advisor"
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto"
                    analyticsEvent="agent_contact_click"
                    analyticsProps={{ source: 'contact_panel' }}
                  >
                    {agent.cta.label}
                  </Button>
                )}
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-graphite/45">
                {agent.name}, {agent.title} · {agent.brokerage}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
