/**
 * SIGNATURE SPACES — drives section 05 and cross-links into the floor plan.
 * `planRoomId` maps a space to an interactive room in data/floorPlans.ts.
 * Every space has its own photography; nothing here is reused from another section.
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
  /** Crop control for the frame. */
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
    id: 'dining',
    index: '03',
    name: 'Dining Room',
    description: 'Seats twelve with the glass wall open and the water two metres away.',
    detail:
      'Positioned so the table sits against the opening rather than in the middle of the room. A single sculptural pendant marks the centre; everything else is kept quiet so the horizon stays the subject.',
    dimensions: '24′ × 20′',
    area: '480 sq ft',
    features: [
      'Seats twelve at a single oak table',
      'Full-width opening to the terrace',
      'Bronze and glass pendant, dimmable',
      'Adjacent wine column and service scullery',
      'Evening aspect to the water',
    ],
    imageSrc: '/images/room-dining.jpg',
    imageAlt:
      'Dining room at dusk with a long oak table, bronze pendant and glass wall open to the terrace',
    caption: '03 / Dining',
    planRoomId: 'dining',
  },
  {
    id: 'primary-suite',
    index: '04',
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
    caption: '04 / Primary',
    planRoomId: 'primary-suite',
  },
  {
    id: 'spa-bathroom',
    index: '05',
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
    caption: '05 / Bath',
    planRoomId: 'spa-bath',
  },
  {
    id: 'study',
    index: '06',
    name: 'Study',
    description: 'A quiet room for work, positioned off the main circulation.',
    detail:
      'Screened from the arrival sequence and double-aspect to the garden, the study is the room most often used first thing in the morning. Joinery is custom; the desk faces the light.',
    dimensions: '16′ × 20′',
    area: '320 sq ft',
    features: [
      'Double aspect to the garden',
      'Full-height oak and steel joinery',
      'Dedicated data and power wall',
      'Adjacent powder room and library',
      'Acoustic separation from the living volume',
    ],
    imageSrc: '/images/room-office.jpg',
    imageAlt:
      'Study with a pale oak desk, black steel shelving and glazing onto a garden in afternoon light',
    caption: '06 / Study',
    planRoomId: 'study',
  },
  {
    id: 'entertainment',
    index: '07',
    name: 'Entertainment Room',
    description: 'A lower-level room for film, wine and long evenings.',
    detail:
      'Backlit panelling and a stone bar set the room up for both a small group and a full screening. The wine display is climate-controlled and visible from the lounge.',
    dimensions: '44′ × 20′',
    area: '880 sq ft',
    features: [
      'Media lounge with acoustic treatment',
      'Dark stone bar with wine column',
      'Climate-controlled display, 800 bottles',
      'Independent climate and air handling',
      'Direct access to the wellness suite',
    ],
    imageSrc: '/images/room-entertainment.jpg',
    imageAlt:
      'Entertainment room with a charcoal media lounge, backlit panelling and a stone bar with wine display',
    caption: '07 / Entertainment',
    planRoomId: 'entertainment',
  },
  {
    id: 'wellness',
    index: '08',
    name: 'Gym & Wellness',
    description: 'Training space with a planted lightwell and no view of the neighbours.',
    detail:
      'Zoned oak and rubber flooring, glazing to a planted lightwell, and a sauna and hammam set immediately alongside so the whole suite works as one sequence.',
    dimensions: '26′ × 20′',
    area: '520 sq ft',
    features: [
      'Glazing to a planted lightwell',
      'Zoned oak and rubber flooring',
      'Adjacent sauna, hammam and cold plunge',
      'Treatment room next door',
      'Recovery garden with outdoor shower',
    ],
    imageSrc: '/images/room-gym.jpg',
    imageAlt:
      'Private gym with oak and rubber flooring, minimal equipment and glazing onto a planted lightwell',
    caption: '08 / Wellness',
    planRoomId: 'gym',
  },
  {
    id: 'terrace',
    index: '09',
    name: 'Outdoor Terrace',
    description: 'Covered living and dining that works at midday and at last light.',
    detail:
      'A slim steel pergola holds the shade line, and a linear fire bowl extends the season by several months. The terrace is sized to seat the same number as the dining room.',
    dimensions: '44′ × 22′',
    area: '960 sq ft',
    features: [
      'Covered outdoor living and dining',
      'Linear fire bowl',
      'Outdoor kitchen and wine fridge',
      'Infrared heating for shoulder seasons',
      'Uninterrupted horizon view',
    ],
    imageSrc: '/images/room-terrace.jpg',
    imageAlt:
      'Covered outdoor dining terrace at last light with a long table, pergola and horizon over water',
    caption: '09 / Terrace',
    planRoomId: 'covered-terrace',
  },
  {
    id: 'pool',
    index: '10',
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
    imageSrc: '/images/room-pool.jpg',
    imageAlt:
      'Low view along the infinity pool edge at dusk, still water reflecting the illuminated glass facade',
    caption: '10 / Water',
    planRoomId: 'pool',
  },
];
