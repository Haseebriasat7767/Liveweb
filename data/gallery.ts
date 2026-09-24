/**
 * INTERACTIVE GALLERY — asymmetric editorial layout + fullscreen viewer.
 * `span` controls the asymmetric composition; `focal` sets the crop.
 */

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** Editorial chapter label shown in the viewer. */
  chapter: string;
  /** Grid weight: hero = large, wide = full width band, tall = portrait, std = regular. */
  span: 'hero' | 'wide' | 'tall' | 'std';
  focal?: string;
};

export const galleryImages: GalleryImage[] = [
  {
    id: 'g01',
    src: '/images/hero.jpg',
    alt: 'The villa at dusk from across the infinity pool, glass facade illuminated',
    caption: 'The house from across the pool, blue hour',
    chapter: 'Exterior',
    span: 'hero',
    focal: 'center 55%',
  },
  {
    id: 'g02',
    src: '/images/room-living.jpg',
    alt: 'Grand living room opening to the water through full-height glass',
    caption: 'Grand living room',
    chapter: 'Interior',
    span: 'std',
  },
  {
    id: 'g03',
    src: '/images/story-2.jpg',
    alt: 'Floating staircase and slot window casting light across plaster',
    caption: 'Arrival gallery',
    chapter: 'Arrival',
    span: 'tall',
  },
  {
    id: 'g04',
    src: '/images/room-kitchen.jpg',
    alt: 'Chef’s kitchen with marble island and pale oak cabinetry',
    caption: 'Chef’s kitchen',
    chapter: 'Interior',
    span: 'std',
  },
  {
    id: 'g05',
    src: '/images/story-3.jpg',
    alt: 'Covered terrace at sunset with fire table and horizon view',
    caption: 'Terrace at last light',
    chapter: 'Outdoor',
    span: 'wide',
    focal: 'center 60%',
  },
  {
    id: 'g06',
    src: '/images/room-primary.jpg',
    alt: 'Primary suite with platform bed and glazing to a private terrace',
    caption: 'Primary suite',
    chapter: 'Private wing',
    span: 'std',
  },
  {
    id: 'g07',
    src: '/images/room-bath.jpg',
    alt: 'Spa bathroom with freestanding stone tub and garden outlook',
    caption: 'Spa bathroom',
    chapter: 'Private wing',
    span: 'tall',
  },
  {
    id: 'g08',
    src: '/images/story-1.jpg',
    alt: 'Double-height living volume with morning light pooling on pale oak floors',
    caption: 'Morning in the living volume',
    chapter: 'Interior',
    span: 'wide',
  },
  {
    id: 'g09',
    src: '/images/intro.jpg',
    alt: 'Travertine, black steel and a reflecting water channel at the entrance sequence',
    caption: 'Material study — stone, steel, water',
    chapter: 'Details',
    span: 'std',
  },
];
