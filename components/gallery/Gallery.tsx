'use client';

import Image from 'next/image';
import { useState } from 'react';
import { property, galleryImages } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { Button } from '@/components/ui/Button';
import { Lightbox } from './Lightbox';
import { cn } from '@/lib/utils';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

/** Frame rows: asymmetric widths, aligned heights — a magazine, not a grid. */
const ROWS: Array<{
  height: string;
  items: Array<{ id: string; span: string; aside?: 'quote' | 'index' }>;
}> = [
  { height: 'h-[clamp(240px,50vw,720px)]', items: [{ id: 'g01', span: 'col-span-12' }] },
  {
    height: 'h-[clamp(260px,34vw,520px)]',
    items: [
      { id: 'g02', span: 'col-span-12 md:col-span-7' },
      { id: 'g03', span: 'col-span-12 md:col-span-5' },
    ],
  },
  {
    height: 'h-[clamp(260px,36vw,560px)]',
    items: [
      { id: 'g05', span: 'col-span-12 md:col-span-7' },
      { id: 'g04', span: 'col-span-12 md:col-span-5' },
    ],
  },
  {
    height: 'h-[clamp(240px,32vw,480px)]',
    items: [
      { id: 'g06', span: 'col-span-12 md:col-span-6' },
      { id: 'g07', span: 'col-span-12 md:col-span-6' },
    ],
  },
  {
    height: 'h-[clamp(220px,30vw,440px)]',
    items: [
      { id: 'g08', span: 'col-span-12 md:col-span-8' },
      { id: 'g09', span: 'col-span-12 md:col-span-4' },
    ],
  },
];

/**
 * 06 — INTERACTIVE GALLERY
 * An editorial photo essay built from three frame sizes and one fullscreen
 * viewer. Opens at the frame you touched, remembers nothing else.
 */
export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useOnceInView<HTMLElement>(() => track('section_view', { section: 'gallery' }));

  const indexOf = (id: string) => galleryImages.findIndex((image) => image.id === id);

  const open = (id: string) => {
    const index = indexOf(id);
    if (index < 0) return;
    setOpenIndex(index);
    track('gallery_open', { frame: index + 1, caption: galleryImages[index].caption });
  };

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative bg-paper py-24 text-charcoal md:py-32 lg:py-40"
      aria-labelledby="gallery-heading"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-end lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-bronze">
                <span className="h-px w-8 bg-bronze/60" />
                {property.gallery.eyebrow}
              </p>
            </Reveal>
            <h2 id="gallery-heading" className="display-lg mt-8 text-charcoal">
              <SplitLines text={`A photo essay in ${galleryImages.length} frames`} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <p className="body-lg max-w-md text-graphite/65 lg:pb-4">{property.gallery.intro}</p>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------------------- frames */}
      <div className="shell mt-16 space-y-4 md:mt-20 md:space-y-6">
        {ROWS.map((row, rowIndex) => (
          <Reveal key={rowIndex} variant="mask" delay={0.04 * rowIndex}>
            <div className={cn('grid grid-cols-12 gap-4 md:gap-6', row.height)}>
              {row.items.map((item) => {
                const image = galleryImages.find((entry) => entry.id === item.id);
                if (!image) return null;
                const position = indexOf(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => open(item.id)}
                    className={cn(
                      'group relative overflow-hidden bg-bone/50 text-left',
                      item.span,
                    )}
                    aria-label={`Open image ${position + 1}: ${image.caption}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={
                        item.span.includes('12')
                          ? '100vw'
                          : item.span.includes('8')
                            ? '(max-width: 768px) 100vw, 66vw'
                            : '(max-width: 768px) 100vw, 40vw'
                      }
                      quality={82}
                      style={image.focal ? { objectPosition: image.focal } : undefined}
                      className="object-cover transition-transform duration-[2600ms] ease-luxury group-hover:scale-[1.045]"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-[900ms] ease-luxury group-hover:opacity-100 group-focus-visible:opacity-100"
                    />

                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
                      <span className="translate-y-2 opacity-0 transition-all duration-[900ms] ease-luxury group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        <span className="label block text-[9px] text-paper/60">{image.chapter}</span>
                        <span className="mt-1 block font-display text-base text-paper md:text-lg">
                          {image.caption}
                        </span>
                      </span>
                      <span className="label shrink-0 text-[9px] text-paper/50">
                        {String(position + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="shell mt-12 flex flex-col items-start gap-6 border-t border-charcoal/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-[9px] text-graphite/45">
          {String(galleryImages.length).padStart(2, '0')} frames · click any image to open the viewer
        </p>
        <Button
          variant="outline"
          size="sm"
          arrow
          href="#private-showing"
          intent="property-details"
          analyticsEvent="showing_form_open"
          analyticsProps={{ source: 'gallery_footer' }}
        >
          Request the full dossier
        </Button>
      </div>

      <Lightbox index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </section>
  );
}
