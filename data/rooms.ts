/**
 * SIGNATURE SPACES — drives section 05 and cross-links into the floor plan.
 * `planRoomId` maps a space to an interactive room in data/floorPlans.ts.
 */

export type Room = {
  id: string;
  index: string;
  name: string;
  /** One-line editorial description. */
  description: string;
  /** Longer paragraph revealed on hover / expansion. */
  detail: string;
  /** Approximate dimensions. Marked indicative in the UI. */
  dimensions: string;
  area: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
  /** Small editorial label used as an image caption. */
  caption: string;
  planRoomId: string;
  objectPosition?: string;
};

export const rooms: Room[] = [
  {
    id: 'grand-living',
    index: '01',
    name: 'Grand Living Room',
    description: 'A double-height room that opens its full width to the water.',
    detail:
      'The largest volume in the house, deliberately kept free of structural interruption so that the ceiling, floor and view do all of the work. Sliding walls retract completely, making the terrace an extension of the room.',
    dimensions: '40′ × 30′',
    area: '1,200 sq ft',
    features: [
      'Double-height glazing, 14 ft ceiling',
      'Retracting glass wall to the terrace',
      'Pale oak chevron flooring',
      'Integrated lighting scenes, four moods',
      'Bronze-clad fireplace',
    ],
    imageSrc: '/images/room-living.jpg',
    imageAlt:
      'Grand living room with floor-to-ceiling glass, low linen seating and views over the water',
    caption: '01 / Living',
    planRoomId: 'grand-living',
  },
  {
    id: 'chefs-kitchen',
    index: '02',
    name: 'Chef’s Kitchen',
    description: 'A working kitchen with a scullery that hides everything that should be hidden.',
    detail:
      'Honest materials and a long island set the room up for both cooking and gathering. A separate scullery takes the noise, storage and cleaning of a serious kitchen out of sight of the water view.',
    dimensions: '32′ × 20′',
    area: '640 sq ft',
    features: [
      'Honed marble island, 11 ft single slab',
      'Full scullery and separate pantry',
      'Professional range, dual ovens',
      'Integrated refrigeration and wine column',
      'Breakfast terrace directly off the room',
    ],
    imageSrc: '/images/room-kitchen.jpg',
    imageAlt:
      'Chef’s kitchen with a long honed marble island, pale oak cabinetry and a window to the garden',
    caption: '02 / Kitchen',
    planRoomId: 'kitchen',
  },
  {
    id: 'primary-suite',
    index: '03',
    name: 'The Primary Suite',
    description: 'A private retreat oriented toward the morning light.',
    detail:
      'Occupying the water corner of the upper floor, the suite is reached through its own vestibule and separated from the guest wing by the stair and study.',
    dimensions: '41′ × 20′',
    area: '820 sq ft',
    features: [
      'Floor-to-ceiling glazing',
      'Private terrace',
      'Walk-in dressing room',
      'Spa bathroom in honed limestone',
      'Garden and water views from the bed',
    ],
    imageSrc: '/images/room-primary.jpg',
    imageAlt:
      'Primary suite with a low platform bed in ivory linen and glazing opening to a private terrace',
    caption: '03 / Primary',
    planRoomId: 'primary-suite',
  },
  {
    id: 'spa-bathroom',
    index: '04',
    name: 'Spa Bathroom',
    description: 'A stone room built around a single freestanding tub and a garden view.',
    detail:
      'Honed limestone, a wet room for two, and a soaking tub set against full-height glass. Daylight does the lighting; concealed strips do the rest.',
    dimensions: '20′ × 16′',
    area: '320 sq ft',
    features: [
      'Freestanding stone soaking tub',
      'Dual wet room with rain heads',
      'Honed limestone throughout',
      'Heated floors and towel cabinets',
      'Private garden outlook, entirely screened',
    ],
    imageSrc: '/images/room-bath.jpg',
    imageAlt:
      'Spa bathroom with a freestanding stone tub beside full-height glazing onto a garden',
    caption: '04 / Bath',
    planRoomId: 'spa-bath',
  },
  {
    id: 'arrival',
    index: '05',
    name: 'Arrival Gallery',
    description: 'The threshold: a tall, quiet room holding the stair and the first view of water.',
    detail:
      'A slot window tracks the sun across a plaster wall, changing the room hour by hour. The stair is detailed as a single object so the arrival sequence reads as one gesture.',
    dimensions: '35′ × 12′',
    area: '420 sq ft',
    features: [
      'Floating oak and steel stair',
      'Full-height slot window',
      'Hand-trowelled plaster walls',
      'Concealed coat and delivery storage',
      'Direct sightline through to the water',
    ],
    imageSrc: '/images/story-2.jpg',
    imageAlt:
      'Floating oak and steel staircase beside a slot window casting a blade of sunlight across plaster',
    caption: '05 / Arrival',
    planRoomId: 'gallery',
  },
  {
    id: 'terrace',
    index: '06',
    name: 'Outdoor Terrace',
    description: 'Covered living space that works at midday and at last light.',
    detail:
      'A slim steel pergola holds the shade line, and a low fireplace extends the season by several months. The terrace is sized to seat the same number as the dining room.',
    dimensions: '44′ × 22′',
    area: '960 sq ft',
    features: [
      'Covered outdoor living and dining',
      'Linear fire table',
      'Outdoor kitchen and wine fridge',
      'Infrared heating for shoulder seasons',
      'Uninterrupted horizon view',
    ],
    imageSrc: '/images/story-3.jpg',
    imageAlt:
      'Covered terrace at sunset with linen seating, a low fire table and a horizon view over water',
    caption: '06 / Terrace',
    planRoomId: 'covered-terrace',
    objectPosition: 'center 60%',
  },
  {
    id: 'pool',
    index: '07',
    name: 'The Pool Terrace',
    description: 'A black-tiled infinity edge that reads as one plane with the water beyond.',
    detail:
      'The pool was set dead level with the bay so that the two surfaces align from the principal rooms. A submerged shelf runs its full length for shallow lounging.',
    dimensions: '52′ × 18′',
    area: '936 sq ft',
    features: [
      '52 ft infinity edge, aligned to the horizon',
      'Submerged lounge shelf',
      'Dark tiled interior for mirror reflections',
      'Detached spa and cold plunge',
      'Underwater lighting scenes',
    ],
    imageSrc: '/images/hero.jpg',
    imageAlt:
      'Infinity pool reflecting the illuminated glass facade of the villa at dusk',
    caption: '07 / Water',
    planRoomId: 'pool',
    objectPosition: 'center 78%',
  },
];
