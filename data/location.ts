/**
 * LOCATION / LIFESTYLE — editorial, not a map embed.
 * Travel times are indicative driving times for the demonstration property.
 */

export type Destination = {
  id: string;
  label: string;
  minutes: number;
  /** Grouping for the editorial columns. */
  group: 'Air & Travel' | 'Water' | 'City' | 'Leisure' | 'Everyday';
  note: string;
  /** Normalised position on the schematic map (0–100). */
  x: number;
  y: number;
};

export const location = {
  eyebrow: 'Location',
  heading: 'At the center of everything',
  statement:
    'Set on a private stretch of waterfront, the residence sits between the water and the city — close enough for a dinner reservation, far enough for silence.',
  body: 'The approach is residential and low-density. Traffic, aircraft noise and neighbouring overlook were all assessed before the site was chosen; the prevailing breeze comes off the water.',

  /** Destinations with travel times. */
  destinations: [
    {
      id: 'airport',
      label: 'Private Airport',
      minutes: 15,
      group: 'Air & Travel',
      note: 'Executive terminal, customs on request',
      x: 26,
      y: 24,
    },
    {
      id: 'international',
      label: 'International Airport',
      minutes: 38,
      group: 'Air & Travel',
      note: 'Direct carriers to New York and Europe',
      x: 14,
      y: 12,
    },
    {
      id: 'marina',
      label: 'Marina',
      minutes: 8,
      group: 'Water',
      note: '120 slips, 100 ft berths, yard services',
      x: 34,
      y: 74,
    },
    {
      id: 'dock',
      label: 'Property Dock',
      minutes: 0,
      group: 'Water',
      note: 'Direct deep-water access, 122 ft frontage',
      x: 52,
      y: 56,
    },
    {
      id: 'beach',
      label: 'Beach Club',
      minutes: 20,
      group: 'Water',
      note: 'Private membership, sailing program',
      x: 70,
      y: 82,
    },
    {
      id: 'downtown',
      label: 'Downtown',
      minutes: 12,
      group: 'City',
      note: 'Financial district and private offices',
      x: 62,
      y: 26,
    },
    {
      id: 'dining',
      label: 'Restaurants',
      minutes: 6,
      group: 'City',
      note: 'Two award-winning rooms within four miles',
      x: 44,
      y: 34,
    },
    {
      id: 'golf',
      label: 'Golf',
      minutes: 9,
      group: 'Leisure',
      note: 'Two championship courses, one private',
      x: 20,
      y: 46,
    },
    {
      id: 'shopping',
      label: 'Shopping',
      minutes: 14,
      group: 'Leisure',
      note: 'Design district and luxury retail',
      x: 78,
      y: 44,
    },
    {
      id: 'schools',
      label: 'Schools',
      minutes: 11,
      group: 'Everyday',
      note: 'Two independent schools within fifteen minutes',
      x: 66,
      y: 66,
    },
    {
      id: 'hospital',
      label: 'Hospital',
      minutes: 13,
      group: 'Everyday',
      note: 'Regional medical centre with trauma unit',
      x: 24,
      y: 66,
    },
    {
      id: 'culture',
      label: 'Museum & Arts',
      minutes: 16,
      group: 'Leisure',
      note: 'Winter concert season and permanent collection',
      x: 88,
      y: 62,
    },
  ] as Destination[],

  /** Editorial pull-quote over the map panel. */
  quote: {
    text: 'Twelve minutes from the city, and the only thing you hear is the water.',
    attribution: 'Listing advisor',
  },

  mapNote:
    'Schematic illustration — indicative travel times by car from the demonstration property, not to scale and not a survey document.',

  /** Compact figures shown under the statement. */
  quickFacts: [
    { label: 'Water frontage', value: '122 ft' },
    { label: 'Nearest airport', value: '15 min' },
    { label: 'Downtown', value: '12 min' },
    { label: 'Neighbourhood', value: 'Low density' },
  ],
} as const;
