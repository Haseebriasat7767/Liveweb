'use client';

import Image from 'next/image';
import { contact, property } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { LeadForm } from './LeadForm';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

/**
 * 11 — PRIVATE SHOWING CTA + 12 — LEAD QUALIFICATION
 * The dramatic turn: the page goes dark, the copy narrows to a single ask, and
 * the form carries the qualification quietly inside four required fields.
 */
export function LeadConversion() {
  const ref = useOnceInView<HTMLElement>(() => track('showing_form_open', { source: 'section_view' }), '-40% 0px -40% 0px');

  return (
    <section
      id="private-showing"
      ref={ref}
      className="relative overflow-hidden bg-ink py-24 text-paper md:py-32 lg:py-40"
      aria-labelledby="private-showing-heading"
    >
      {/* Depth: the residence, almost entirely in shadow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <Image src={property.hero.imageSrc} alt="" fill sizes="100vw" quality={60} className="object-cover object-[center_60%]" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/60" />
                {property.conversion.eyebrow}
              </p>
            </Reveal>

            <h2 id="private-showing-heading" className="display-lg mt-8 text-paper">
              <SplitLines text={property.conversion.heading} />
            </h2>

            <Reveal delay={0.12}>
              <p className="body-lg mt-7 max-w-lg text-paper/65">{property.conversion.body}</p>
            </Reveal>

            <Reveal variant="fade" delay={0.18}>
              <ul className="mt-10 max-w-lg border-t border-paper/12">
                {property.conversion.reassurance.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-b border-paper/12 py-4 text-[13px] leading-relaxed text-paper/60"
                  >
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-brass/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="fade" delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] text-paper/50">
                {contact.phone.available && (
                  <a
                    href={contact.phone.href}
                    onClick={() => track('phone_click', { source: 'conversion_panel' })}
                    className="group flex flex-col gap-1 transition-colors duration-500 hover:text-paper"
                  >
                    <span className="label text-[9px] text-paper/30">Call</span>
                    <span>{contact.phone.label}</span>
                  </a>
                )}
                {contact.email.available && (
                  <a
                    href={contact.email.href}
                    onClick={() => track('email_click', { source: 'conversion_panel' })}
                    className="group flex flex-col gap-1 transition-colors duration-500 hover:text-paper"
                  >
                    <span className="label text-[9px] text-paper/30">Email</span>
                    <span className="break-all">{contact.email.label}</span>
                  </a>
                )}
                {contact.whatsapp.available && (
                  <a
                    href={contact.whatsapp.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => track('whatsapp_click', { source: 'conversion_panel' })}
                    className="group flex flex-col gap-1 transition-colors duration-500 hover:text-paper"
                  >
                    <span className="label text-[9px] text-paper/30">International</span>
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal variant="up" delay={0.1} id="lead-form-anchor">
            <LeadForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
