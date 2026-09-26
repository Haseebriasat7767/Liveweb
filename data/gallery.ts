/**
 * INTERACTIVE GALLERY — asymmetric editorial layout + fullscreen viewer.
 * Fourteen frames, each with its own subject and crop: no image in this essay is
 * a repeat of another section's frame at the same size.
 *
 * `span`   controls the composition weight used by the page-level row map.
 * `focal`  controls the crop for that frame.
 */

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** Editorial chapter label shown in the viewer. */
  chapter: string;
  /** Grid weight: hero = full width, wide = full-width band, tall = portrait, std = regular. */
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
    src: '/images/aerial.jpg',
    alt: 'Aerial view of the estate, pool, dock and palm grove on the waterfront at golden hour',
    caption: 'The estate from above — 1.2 acres and 122 ft of frontage',
    chapter: 'Context',
    span: 'wide',
    focal: 'center 45%',
  },
  {
    id: 'g03',
    src: '/images/room-living.jpg',
    alt: 'Grand living room opening to the water through full-height glass',
    caption: 'Grand living room',
    chapter: 'Interior',
    span: 'std',
  },
  {
    id: 'g04',
    src: '/images/room-dining.jpg',
    alt: 'Dining room at dusk with a long oak table and glass wall open to the terrace',
    caption: 'Dining at dusk',
    chapter: 'Interior',
    span: 'std',
  },
  {
    id: 'g05',
    src: '/images/room-kitchen.jpg',
    alt: 'Chef’s kitchen with marble island and pale oak cabinetry',
    caption: 'Chef’s kitchen',
    chapter: 'Interior',
    span: 'wide',
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
    src: '/images/room-terrace.jpg',
    alt: 'Covered outdoor dining terrace at last light with a steel pergola and fire bowl',
    caption: 'Terrace at last light',
    chapter: 'Outdoor',
    span: 'std',
    focal: 'center 60%',
  },
  {
    id: 'g08',
    src: '/images/room-pool.jpg',
    alt: 'Low view along the infinity pool edge reflecting the illuminated facade at dusk',
    caption: 'The infinity edge, aligned to the horizon',
    chapter: 'Water',
    span: 'wide',
    focal: 'center 70%',
  },
  {
    id: 'g09',
    src: '/images/room-bath.jpg',
    alt: 'Spa bathroom with freestanding stone tub and garden outlook',
    caption: 'Spa bathroom',
    chapter: 'Private wing',
    span: 'std',
  },
  {
    id: 'g10',
    src: '/images/room-entertainment.jpg',
    alt: 'Entertainment room with charcoal media lounge, backlit panelling and stone bar',
    caption: 'Entertainment room',
    chapter: 'Lower level',
    span: 'std',
  },
  {
    id: 'g11',
    src: '/images/story-2.jpg',
    alt: 'Floating oak and steel staircase beside a slot window casting light across plaster',
    caption: 'Arrival gallery',
    chapter: 'Arrival',
    span: 'wide',
  },
  {
    id: 'g12',
    src: '/images/room-guest.jpg',
    alt: 'Guest bedroom with ivory linen, oak panelling and garden glazing',
    caption: 'Guest bedroom',
    chapter: 'Guest wing',
    span: 'std',
  },
  {
    id: 'g13',
    src: '/images/intro.jpg',
    alt: 'Travertine stone meeting black steel-framed glass above a reflecting water channel',
    caption: 'Material study — stone, steel, water',
    chapter: 'Details',
    span: 'std',
  },
  {
    id: 'g14',
    src: '/images/room-garage.jpg',
    alt: 'Four-bay gallery garage in honed concrete and travertine with a single car under light',
    caption: 'Gallery garage',
    chapter: 'Service',
    span: 'std',
  },
];
