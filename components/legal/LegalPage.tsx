import Link from 'next/link';
import { demoMode } from '@/data';

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: Array<{ heading: string; body: string[] }>;
};

/**
 * Shared shell for the compliance pages. Configured, editable, and explicitly
 * flagged as a template in demo mode — a client's counsel signs off the copy.
 */
export function LegalPage({ eyebrow, title, updated, intro, sections }: LegalPageProps) {
  return (
    <article className="bg-paper pb-24 pt-32 text-charcoal md:pb-32 md:pt-40">
      <div className="shell">
        <div className="max-w-3xl">
          <Link href="/" className="label text-bronze transition-opacity duration-500 hover:opacity-70">
            ← Back to the residence
          </Link>

          <p className="label mt-10 text-graphite/45">{eyebrow}</p>
          <h1 className="display-lg mt-6 text-charcoal">{title}</h1>
          <p className="label mt-6 text-[9px] text-graphite/40">Last updated {updated}</p>

          <p className="body-lg mt-10 text-graphite/70">{intro}</p>

          {demoMode && (
            <p className="mt-8 border-l border-bronze/50 pl-4 text-[11.5px] leading-relaxed text-graphite/50">
              Template notice: this page is supplied as a starting point for a demonstration website.
              It is not legal advice. The brokerage’s own counsel should review and replace this copy
              before publication.
            </p>
          )}

          <div className="mt-14 space-y-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] leading-tight text-charcoal">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[14px] leading-[1.85] text-graphite/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
