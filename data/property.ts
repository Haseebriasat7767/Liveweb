/**
 * PROPERTY CONFIGURATION — the heart of the white-label system.
 * Change this file (and the ones beside it) and the entire showroom re-brands.
 * No component hard-codes property content.
 */

export type StatValue = {
  /** Numeric part used for the count-up animation. */
  value: number;
  /** Decimal places to render (0.0 for "1.2"). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Small uppercase label under the number. */
  label: string;
  /** Optional editorial qualifier under the label. */
  note?: string;
  /** Flags template copy that a client must replace before publishing. */
  isPlaceholder?: boolean;
};

export const property = {
  /* ---------------------------------------------------------------- identity */
  name: 'VILLA MARISOL',
  listingTitle: 'THE PRIVATE LISTING',
  /** Short editorial descriptor used in metadata and the footer. */
  descriptor: 'A waterfront architectural residence',
  tagline: 'A residence designed around space, light, privacy and the view.',
  price: '$8,900,000',
  priceNote: 'Offered at',
  status: 'Offered privately • Not on the open market',
  address: {
    line1: '41 Seacliff Point',
    line2: 'Palm Coast, Florida',
    region: 'Florida',
    country: 'United States',
    /** Approximate geo for structured data / map centring. */
    latitude: 26.7097,
    longitude: -80.0364,
  },

  /* -------------------------------------------------------------- disclosure */
  disclaimer:
    'Villa Marisol is a fictional demonstration property created to showcase this website system. It is not a real listing, is not for sale, and no part of this page is an offer to sell or solicitation of an offer to buy real property.',

  /* -------------------------------------------------------------------- hero */
  hero: {
    eyebrow: 'Private Residence',
    headline: 'The Private Listing',
    /** Optional: drop an .mp4 in /public/videos and set it here for a hero film. */
    videoSrc: '/videos/hero.mp4' as string | null,
    posterSrc: '/images/hero.jpg',
    imageSrc: '/images/hero.jpg',
    imageAlt:
      'A contemporary waterfront villa at dusk, its glass facade glowing above a still infinity pool',
    primaryCta: { label: 'Request Private Showing', href: '#private-showing' },
    secondaryCta: { label: 'Explore the Residence', href: '#residence' },
    scrollHint: 'Scroll to explore',
    /** Small print along the bottom edge of the hero. */
    meta: [
      { label: 'Location', value: 'Palm Coast, Florida' },
      { label: 'Offered at', value: '$8,900,000' },
      { label: 'Interior', value: '8,450 sq ft' },
      { label: 'Reference', value: 'VM-2401' },
    ],
  },

  /* -------------------------------------------------------- introduction 02 */
  introduction: {
    eyebrow: 'The Residence',
    statement:
      'A private architectural residence shaped by light, landscape and uninterrupted views.',
    body: [
      'Designed as a seamless relationship between architecture and its surroundings, the residence combines generous entertaining spaces with private retreats and carefully framed views.',
      'Every principal room faces the water. Every service space recedes. The result is a house that feels calm at any hour and any scale of gathering.',
    ],
    imageSrc: '/images/aerial.jpg',
    imageAlt:
      'Aerial view of the waterfront estate at golden hour, with the pool aligned to the bay, private dock and palm grove',
    caption: '01 / The Estate',
    facts: [
      { label: 'Architect', value: 'Studio placeholder — replace in config' },
      { label: 'Interiors', value: 'Studio placeholder — replace in config' },
      { label: 'Completed', value: '2026' },
      { label: 'Orientation', value: 'East · Waterfront' },
    ],
    factsArePlaceholders: true,
  },

  /* ---------------------------------------------------------- statistics 03 */
  stats: {
    eyebrow: 'At a Glance',
    heading: 'The facts, without embellishment.',
    values: [
      { value: 8450, label: 'Sq Ft', note: 'Interior, conditioned' },
      { value: 5, label: 'Bedrooms', note: 'All with water aspect' },
      { value: 7, label: 'Bathrooms', note: 'Five full, two powder' },
      { value: 1.2, decimals: 1, label: 'Acres', note: 'Landscaped grounds' },
      { value: 122, label: 'Ft of Water Frontage', note: 'Private dock rights' },
      { value: 2026, label: 'Completed', note: 'Never previously listed' },
    ] as StatValue[],
    headlineValue: '$8.9M',
    headlineLabel: 'Offered At',
    headlineNote: 'Private treaty. Proof of funds requested before viewing.',
  },

  /* --------------------------------------------------- architectural story 04 */
  story: {
    eyebrow: 'Architecture',
    heading: 'Architecture without compromise',
    chapters: [
      {
        index: '01',
        title: 'Light',
        statement: 'Every room is positioned around light.',
        body: 'Principal spaces run the full depth of the plan so that morning light and evening light are both part of the daily experience of the house.',
        imageSrc: '/images/story-1.jpg',
        imageAlt:
          'A double-height living room with floor-to-ceiling glazing framing sea and sky',
      },
      {
        index: '02',
        title: 'Framing',
        statement: 'Every opening frames the landscape.',
        body: 'Openings were set to specific views rather than to the wall they sit in — water, horizon, garden — so the landscape reads as a considered part of the interior.',
        imageSrc: '/images/story-2.jpg',
        imageAlt:
          'A floating oak and steel staircase beside a slot window casting a blade of sunlight across plaster',
      },
      {
        index: '03',
        title: 'Transition',
        statement: 'Every transition is intentional.',
        body: 'Inside to outside, public to private, day to evening: thresholds were designed as rooms in their own right, with material changes marking each shift.',
        imageSrc: '/images/story-3.jpg',
        imageAlt:
          'A covered terrace at sunset with linen seating and an uninterrupted horizon over water',
      },
    ],
  },

  /* ------------------------------------------------------- signature spaces */
  spaces: {
    eyebrow: 'Signature Spaces',
    heading: 'Rooms that behave differently from one another.',
    intro:
      'Ten spaces define the daily experience of the residence. Select a space to see dimensions, features and its position in the plan.',
  },

  /* --------------------------------------------------------------- gallery */
  gallery: {
    eyebrow: 'Gallery',
    heading: 'A photo essay in fourteen frames',
    intro:
      'Photographed across a full day, from first light on the water to the last hour of terrace light.',
  },

  /* ------------------------------------------------------------ floor plans */
  floorPlans: {
    eyebrow: 'Floor Plan',
    heading: 'Explore the plan',
    intro:
      'Select a level, then select a room to see its dimensions, features and related photography.',
    scaleNote:
      'Indicative marketing plan — not to scale and not for construction. Dimensions are approximate and subject to independent verification.',
  },

  /* ------------------------------------------------------------------ film */
  film: {
    eyebrow: 'Property Film',
    heading: 'See the residence in motion',
    intro:
      'A three-minute film following the house across a single day, from first light on the water to the last hour of terrace light.',
    /** Real video drops straight in; otherwise the film player runs the still sequence. */
    videoSrc: '/videos/property-film.mp4' as string | null,
    posterSrc: '/images/hero.jpg',
    ctaLabel: 'Watch Property Film',
    durationLabel: '03:12',
  },

  /* -------------------------------------------------------------- amenities */
  amenities: {
    eyebrow: 'Amenities',
    heading: 'Considered, not counted.',
    groups: [
      {
        title: 'Water & Recreation',
        items: [
          'Infinity pool with submerged lounge shelf',
          'Private dock and 122 ft of frontage',
          'Detached spa and cold plunge',
          'Water sports storage room',
        ],
      },
      {
        title: 'Wellness',
        items: [
          'Home gym with glazing to the garden',
          'Sauna and hammam',
          'Treatment room',
          'Landscaped recovery garden',
        ],
      },
      {
        title: 'Service & Technology',
        items: [
          'Chef’s kitchen with full scullery',
          'Staff suite and service entry',
          'Whole-home automation, lighting and shading',
          'Monitored security and gated arrival court',
        ],
      },
      {
        title: 'Automotive',
        items: [
          'Four-car gallery garage with EV charging',
          'Motor court with turning circle',
          'Secure storage for watercraft',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ conversion */
  conversion: {
    eyebrow: 'Private Showing',
    heading: 'Request a private showing',
    body: 'For private viewings, property details or confidential inquiries, connect directly with the listing advisor. All inquiries are handled on a confidential basis.',
    reassurance: [
      'Confidential handling — no third-party distribution',
      'Response within one business day',
      'Virtual walkthrough available for remote buyers',
    ],
    submitLabel: 'Request Private Showing',
    footnote:
      'By submitting you agree to be contacted about this residence. You may request deletion of your details at any time.',
  },

  /** Search / structured-data keywords. Kept factual, never keyword-stuffed. */
  seo: {
    title: 'The Private Listing | Villa Marisol — Waterfront Residence, Palm Coast',
    description:
      'A private waterfront residence of 8,450 sq ft on 1.2 acres with 122 ft of frontage. Request a private showing. A demonstration property by Luxury Lead Machine.',
    keywords: [
      'luxury waterfront residence',
      'private listing',
      'luxury real estate',
      'Palm Coast luxury home',
      'architectural residence',
    ],
  },
} as const;

export type Property = typeof property;
