import Image from 'next/image';
import { cn } from '@/lib/utils';

type SizePreset = 'full' | 'two-thirds' | 'half' | 'third' | 'card' | 'thumb';
type Sizes = SizePreset | (string & {});

const SIZES: Record<SizePreset, string> = {
  full: '100vw',
  'two-thirds': '(max-width: 768px) 100vw, 66vw',
  half: '(max-width: 768px) 100vw, 50vw',
  third: '(max-width: 768px) 100vw, 33vw',
  card: '(max-width: 640px) 88vw, (max-width: 1024px) 46vw, 30vw',
  thumb: '(max-width: 640px) 40vw, 20vw',
};

type MediaProps = {
  src: string;
  alt: string;
  /** Wrapper classes — defines the frame, aspect ratio and overflow. */
  className?: string;
  /** Image classes — use for transitions, scale on hover, filters. */
  imageClassName?: string;
  sizes?: Sizes;
  priority?: boolean;
  quality?: number;
  /** CSS object-position, e.g. "center 60%" — the crop control for art direction. */
  focal?: string;
  /** Optional caption rendered as an editorial label under the frame. */
  caption?: string;
  captionClassName?: string;
  /** Empty alt + aria-hidden for purely decorative crops. */
  decorative?: boolean;
};

/**
 * One image primitive for the entire showroom: fill-based, responsive, with
 * explicit crop control so replacing artwork never breaks the composition.
 */
export function Media({
  src,
  alt,
  className,
  imageClassName,
  sizes = 'half',
  priority = false,
  quality = 82,
  focal,
  caption,
  captionClassName,
  decorative = false,
}: MediaProps) {
  return (
    <figure className={cn('relative', className)}>
      <div className="relative h-full w-full overflow-hidden bg-bone/40">
        <Image
          src={src}
          alt={decorative ? '' : alt}
          aria-hidden={decorative || undefined}
          fill
          sizes={SIZES[sizes as SizePreset] ?? sizes}
          priority={priority}
          quality={quality}
          style={focal ? { objectPosition: focal } : undefined}
          className={cn('object-cover', imageClassName)}
        />
      </div>
      {caption && (
        <figcaption
          className={cn(
            'label mt-3 text-[9.5px] text-current/45',
            captionClassName,
          )}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
