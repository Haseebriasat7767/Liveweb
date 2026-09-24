import Link from 'next/link';
import { property, site } from '@/data';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink text-paper">
      <div className="shell py-32">
        <p className="label text-brass">{site.brand}</p>
        <h1 className="display-lg mt-8 max-w-2xl text-paper">This page isn’t part of the residence.</h1>
        <p className="body-lg mt-7 max-w-lg text-paper/60">
          The link may be outdated. The presentation of {property.name} — gallery, plans and private
          showing requests — is all on the main page.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-4 font-sans text-[11px] uppercase tracking-[0.28em] text-paper/80 transition-colors duration-500 hover:text-paper"
        >
          Return to the residence
          <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-700 group-hover:w-12" />
        </Link>
      </div>
    </section>
  );
}
