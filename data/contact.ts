/**
 * CONTACT DESTINATIONS — every link is configuration-driven.
 * Anything left blank is hidden across the entire interface (no dead links).
 * Sensible demo values are supplied so the conversion paths can be exercised.
 */

const env = {
  phone: process.env.NEXT_PUBLIC_PHONE || '+1 (561) 555-0184',
  sms: process.env.NEXT_PUBLIC_SMS || '+1 (561) 555-0184',
  email: process.env.NEXT_PUBLIC_EMAIL || 'advisor@carterprivateestates.test',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '15515550184',
  booking: process.env.NEXT_PUBLIC_BOOKING_URL || '',
};

const digits = (value: string) => value.replace(/[^\d+]/g, '');

export const contact = {
  eyebrow: 'Contact',
  heading: 'Direct lines',
  note: 'Calls, texts and confidential inquiries reach the listing advisor directly. No call centre, no lead resale.',

  phone: {
    /** Displayed value. */
    label: env.phone,
    /** tel: href. */
    href: env.phone ? `tel:${digits(env.phone)}` : '',
    available: Boolean(env.phone),
    caption: 'Direct line — 8am to 8pm',
  },

  sms: {
    label: env.sms,
    href: env.sms ? `sms:${digits(env.sms)}` : '',
    available: Boolean(env.sms),
    caption: 'Text works best during showings',
  },

  email: {
    label: env.email,
    href: env.email ? `mailto:${env.email}?subject=Private%20showing%20request%20—%20Villa%20Marisol` : '',
    available: Boolean(env.email),
    caption: 'Confidential inquiries',
  },

  whatsapp: {
    label: 'WhatsApp',
    href: env.whatsapp ? `https://wa.me/${digits(env.whatsapp)}` : '',
    available: Boolean(env.whatsapp),
    caption: 'International buyers',
  },

  booking: {
    label: 'Book a call',
    href: env.booking,
    available: Boolean(env.booking),
    caption: 'Choose a time that suits you',
  },

  hours: [
    { day: 'Monday — Friday', value: '8:00 — 20:00' },
    { day: 'Saturday', value: '9:00 — 18:00' },
    { day: 'Sunday', value: 'By appointment' },
  ],

  /** Office of record shown in the footer. */
  office: {
    name: 'Carter Private Estates',
    address: ['1200 Ocean Boulevard, Suite 400', 'Palm Beach, Florida 33480'],
    licenceLine: 'Brokerage licence — add client licence number',
  },
} as const;

export type ContactChannel = 'phone' | 'sms' | 'email' | 'whatsapp' | 'booking';
