/**
 * AGENT / DEVELOPER CREDIBILITY
 * All figures are explicitly flagged as template placeholders so a client can
 * replace them with verified credentials — nothing here is presented as fact.
 */

export type Credential = {
  label: string;
  /** true = template copy that must be replaced before publishing. */
  isPlaceholder?: boolean;
};

export const agent = {
  eyebrow: 'Represented By',
  heading: 'Your advisor',
  name: 'James Carter',
  initials: 'JC',
  title: 'Luxury Property Advisor',
  brokerage: 'Carter Private Estates',
  /**
   * Advisor portrait. Set to a path under /public (e.g. '/images/agent.jpg')
   * and the section renders the photograph; leave null and it renders the
   * designed monogram panel instead — never a broken image.
   */
  photoSrc: null as string | null,
  photoAlt: 'Portrait of James Carter, luxury property advisor',
  languages: ['English', 'Spanish', 'Portuguese'],

  bio: [
    'James advises buyers and sellers on waterfront and architecturally significant homes, working almost entirely by referral and by private introduction.',
    'He represents a small number of residences at any one time, so that every listing receives the attention a property of this calibre requires.',
  ],

  /** Optional positioning line under the name. */
  positioning: 'Private representation for architectural and waterfront residences.',

  stats: [
    { value: 18, suffix: '+', label: 'Years representing waterfront property', isPlaceholder: true },
    { value: 240, suffix: '+', label: 'Residences transacted', isPlaceholder: true },
    { value: 96, suffix: '%', label: 'List-to-close ratio', isPlaceholder: true },
    { value: 12, suffix: ' min', label: 'Typical response time', isPlaceholder: true },
  ],

  credentials: [
    { label: 'Licensed Real Estate Broker — State of Florida', isPlaceholder: true },
    { label: 'Licence number — add client licence ID', isPlaceholder: true },
    { label: 'Certified Luxury Home Marketing Specialist — verify before publishing', isPlaceholder: true },
    { label: 'Member, National Association of Realtors®', isPlaceholder: true },
  ] as Credential[],

  /** Demo-mode transparency note. Hidden when demo mode is off. */
  credentialsNote:
    'Experience figures, licence numbers and accreditations above are template placeholders for demonstration only. Replace with verified advisor credentials in data/agent.ts before publishing.',

  expertise: [
    'Waterfront & architectural residences',
    'Confidential off-market sales',
    'International buyer representation',
    'New development positioning',
  ],

  cta: {
    label: 'Speak with the Advisor',
    /** Anchor that opens the inline call panel. */
    href: '#contact',
  },
} as const;
