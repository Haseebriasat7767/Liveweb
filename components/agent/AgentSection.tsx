'use client';

import { agent, contact, demoMode, property } from '@/data';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Media } from '@/components/ui/Media';
import { CountUp } from '@/components/ui/CountUp';
import { Button } from '@/components/ui/Button';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

/**
 * 10 — AGENT / DEVELOPER CREDIBILITY
 * Everything here is configuration-driven. Figures and accreditations ship as
 * clearly-marked placeholders so nothing is ever published as fact by accident.
 */
export function AgentSection() {
  const ref = useOnceInView<HTMLElement>(() => track('section_view', { section: 'advisor' }));

  return (
    <section
      id="advisor"
      ref={ref}
      className="relative bg-paper py-24 text-charcoal md:py-32 lg:py-40"
      aria-labelledby="advisor-heading"
    >
      <div className="shell">
        <Reveal variant="fade">
          <p className="label flex items-center gap-3 text-bronze">
            <span className="h-px w-8 bg-bronze/60" />
            {agent.eyebrow}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-20">
          {/* ------------------------------------------------------- portrait */}
          <div>
            <Reveal variant="mask">
              {agent.photoSrc ? (
                <Media
                  src={agent.photoSrc}
                  alt={agent.photoAlt}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="aspect-[4/5] w-full bg-bone/40"
                  imageClassName="transition-transform duration-[2600ms] ease-luxury hover:scale-[1.03]"
                  quality={86}
                />
              ) : (
                /* Designed placeholder: a white-label client with no photograph
                   still gets a composed panel rather than a broken frame. */
                <div className="flex aspect-[4/5] w-full flex-col justify-between border border-charcoal/12 bg-bone/40 p-7 md:p-9">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="label text-bronze">{agent.brokerage}</span>
                    <span className="label text-[8px] text-graphite/35">
                      Ref {property.hero.meta[3]?.value}
                    </span>
                  </div>

                  <span className="font-display text-[clamp(4.5rem,11vw,8rem)] leading-[0.85] tracking-[-0.04em] text-charcoal/80">
                    {agent.initials}
                  </span>

                  <div>
                    <p className="font-display text-xl text-charcoal">{agent.name}</p>
                    <p className="label mt-2 text-[8.5px] text-graphite/45">{agent.title}</p>
                    <p className="mt-4 text-[11px] leading-relaxed text-graphite/45">
                      {demoMode
                        ? 'Portrait placeholder — add the advisor photograph at /public/images/agent.jpg and set agent.photoSrc in data/agent.ts.'
                        : 'Portrait available on request.'}
                    </p>
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal variant="fade" delay={0.1}>
              <dl className="mt-8 border-t border-charcoal/12 pt-6">
                <div className="flex items-baseline justify-between gap-6 py-2">
                  <dt className="label text-graphite/45">Languages</dt>
                  <dd className="text-[13px] text-graphite/75">{agent.languages.join(' · ')}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-2">
                  <dt className="label text-graphite/45">Office</dt>
                  <dd className="text-right text-[13px] text-graphite/75">{agent.brokerage}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------- detail */}
          <div>
            <h2 id="advisor-heading" className="display-lg text-charcoal">
              <SplitLines text={agent.name} />
            </h2>

            <Reveal delay={0.1}>
              <p className="mt-5 text-[13px] uppercase tracking-[0.24em] text-bronze">
                {agent.title} · {agent.brokerage}
              </p>
              <p className="body-lg mt-7 max-w-xl text-graphite/70">{agent.positioning}</p>
            </Reveal>

            <div className="mt-8 max-w-xl space-y-5">
              {agent.bio.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.12 + index * 0.06}>
                  <p className="body-md text-graphite/70">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* ------------------------------------------------------ figures */}
            <RevealGroup className="mt-12 grid grid-cols-2 gap-y-10 border-t border-charcoal/12 pt-10 sm:grid-cols-4">
              {agent.stats.map((stat) => (
                <RevealItem key={stat.label}>
                  <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-charcoal">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 pr-4 text-[11.5px] leading-relaxed text-graphite/50">{stat.label}</p>
                  {demoMode && stat.isPlaceholder && (
                    <p className="label mt-2 text-[7.5px] text-bronze/70">Placeholder figure</p>
                  )}
                </RevealItem>
              ))}
            </RevealGroup>

            {/* -------------------------------------------------- credentials */}
            <div className="mt-12 grid gap-10 border-t border-charcoal/12 pt-10 sm:grid-cols-2">
              <Reveal>
                <h3 className="label text-graphite/45">Credentials</h3>
                <ul className="mt-4 space-y-2.5">
                  {agent.credentials.map((credential) => (
                    <li
                      key={credential.label}
                      className="flex items-start gap-3 text-[13px] leading-relaxed text-graphite/70"
                    >
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-bronze/60" />
                      <span>
                        {credential.label}
                        {demoMode && credential.isPlaceholder && (
                          <span className="ml-2 align-middle text-[8px] uppercase tracking-[0.2em] text-bronze/70">
                            placeholder
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.08}>
                <h3 className="label text-graphite/45">Areas of expertise</h3>
                <ul className="mt-4 space-y-2.5">
                  {agent.expertise.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] leading-relaxed text-graphite/70">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-bronze/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {demoMode && (
              <p className="mt-8 max-w-xl border-l border-bronze/40 pl-4 text-[11px] leading-relaxed text-graphite/45">
                {agent.credentialsNote}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                href="#private-showing"
                intent="speak-with-advisor"
                variant="solid"
                size="md"
                arrow
                analyticsEvent="agent_contact_click"
                analyticsProps={{ source: 'advisor_section' }}
              >
                {agent.cta.label}
              </Button>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-graphite/60">
                {contact.phone.available && (
                  <a
                    href={contact.phone.href}
                    onClick={() => track('phone_click', { source: 'advisor_section' })}
                    className="transition-colors duration-500 hover:text-charcoal"
                  >
                    {contact.phone.label}
                  </a>
                )}
                {contact.email.available && (
                  <a
                    href={contact.email.href}
                    onClick={() => track('email_click', { source: 'advisor_section' })}
                    className="break-all transition-colors duration-500 hover:text-charcoal"
                  >
                    {contact.email.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
