import Link from 'next/link';
import { agent, contact, legal, property, site } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';

const year = new Date().getFullYear();

function EqualHousingMark() {
  return (
    <svg viewBox="0 0 28 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M1.5 11 14 2l12.5 9" />
      <path d="M4.5 11v11h19V11" />
      <path d="M9 15h10M9 18.5h10" />
    </svg>
  );
}

/**
 * Minimal premium footer. Carries the compliance furniture a listing requires
 * without looking like a legal wall.
 */
export function Footer() {
  const channels = [contact.phone, contact.sms, contact.email, contact.whatsapp, contact.booking].filter(
    (channel) => channel.available,
  );

  return (
    <footer className="relative overflow-hidden bg-ink text-paper" id="footer">
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="shell relative pt-20 pb-14 md:pt-28">
        <Reveal variant="fade">
          <div className="flex flex-col gap-10 border-b border-paper/12 pb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-brass">{site.brand}</p>
              <h2 className="display-lg mt-6 max-w-2xl text-paper">
                <SplitLines text={property.name} />
              </h2>
              <p className="body-md mt-5 max-w-md text-paper/55">{property.tagline}</p>
            </div>

            <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3 lg:max-w-xl">
              <div>
                <dt className="label text-paper/40">Location</dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-paper/80">
                  {property.address.line1}
                  <br />
                  {property.address.line2}
                </dd>
              </div>
              <div>
                <dt className="label text-paper/40">Offered at</dt>
                <dd className="mt-2 font-display text-2xl text-paper">{property.price}</dd>
              </div>
              <div>
                <dt className="label text-paper/40">Status</dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-paper/80">{property.status}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="label text-paper/40">Advisor</h3>
            <p className="mt-4 font-display text-2xl">{agent.name}</p>
            <p className="mt-1 text-[13px] text-paper/60">{agent.title}</p>
            <p className="mt-1 text-[13px] text-paper/60">{agent.brokerage}</p>
          </div>

          <div>
            <h3 className="label text-paper/40">Contact</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-paper/70">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="transition-colors duration-500 hover:text-paper"
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
              {channels.length === 0 && <li className="text-paper/40">Contact details in config</li>}
            </ul>
          </div>

          <div>
            <h3 className="label text-paper/40">Office</h3>
            <address className="mt-4 space-y-1 text-[13px] not-italic leading-relaxed text-paper/70">
              <span className="block">{contact.office.name}</span>
              {contact.office.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-3 text-[11px] leading-relaxed text-paper/35">{contact.office.licenceLine}</p>
          </div>

          <div>
            <h3 className="label text-paper/40">Legal & Compliance</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-paper/70">
              <li>
                <Link href={legal.privacyHref} className="transition-colors duration-500 hover:text-paper">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={legal.termsHref} className="transition-colors duration-500 hover:text-paper">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href={legal.fairHousingHref} className="transition-colors duration-500 hover:text-paper">
                  Fair Housing Notice
                </Link>
              </li>
              <li>
                <Link href={legal.disclosuresHref} className="transition-colors duration-500 hover:text-paper">
                  Agency & Disclosures
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-paper/12 pt-10">
          <div className="flex items-start gap-4 text-paper/45">
            <EqualHousingMark />
            <p className="max-w-3xl text-[11px] leading-relaxed">
              We are pledged to the letter and spirit of United States policy for the achievement of
              equal housing opportunity. We encourage and support an affirmative advertising and
              marketing program in which there are no barriers to obtaining housing because of race,
              colour, religion, sex, handicap, familial status or national origin.
            </p>
          </div>

          <p className="max-w-4xl text-[11px] leading-relaxed text-paper/35">
            {property.disclaimer} Areas, dimensions and travel times shown are indicative and are not
            survey or valuation documents. MLS® and REALTOR® are registered marks of their respective
            owners.
          </p>

          <div className="flex flex-col gap-4 text-[11px] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {legal.copyrightStart === year ? year : `${legal.copyrightStart}–${year}`} {site.brand}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span>Reference {property.hero.meta[3]?.value}</span>
              <Link href="#hero" className="transition-colors duration-500 hover:text-paper">
                Back to top ↑
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Keeps the mobile sticky bar from covering footer content */}
      <div aria-hidden="true" className="h-16 bg-ink lg:hidden" />
    </footer>
  );
}
