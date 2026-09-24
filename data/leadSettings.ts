/**
 * LEAD SETTINGS — the qualification model behind the conversion sections.
 * Anything not required can be hidden per client by removing it from `questions`.
 */

export type IntentId =
  | 'private-showing'
  | 'property-details'
  | 'speak-with-advisor'
  | 'seller-consultation'
  | 'other';

export type TimelineId = 'immediate' | '30-days' | '3-months' | '6-months' | 'exploring';

export type PreferredContactId = 'phone' | 'email' | 'text';

export type VisitorIntentId =
  | 'ready-to-view'
  | 'actively-searching'
  | 'exploring-market'
  | 'considering-selling'
  | 'buyer-agent'
  | 'other';

export const leadSettings = {
  /* ------------------------------------------------------------- intent */
  intents: [
    {
      id: 'private-showing' as IntentId,
      label: 'Request Private Showing',
      /** Rendered as the form heading when selected. */
      headline: 'Request a private showing',
      body: 'Private viewings are arranged by appointment, usually within 48 hours. Proof of funds is requested before viewing.',
      submitLabel: 'Request Private Showing',
    },
    {
      id: 'property-details' as IntentId,
      label: 'Request Property Details',
      headline: 'Request the full property dossier',
      body: 'Includes floor plans, specification schedule, material samples list and disclosure package.',
      submitLabel: 'Request Property Details',
    },
    {
      id: 'speak-with-advisor' as IntentId,
      label: 'Speak With Advisor',
      headline: 'Speak with the listing advisor',
      body: 'A fifteen-minute call to answer questions on the residence, the market or the process.',
      submitLabel: 'Request a Call',
    },
    {
      id: 'seller-consultation' as IntentId,
      label: 'Seller Consultation',
      headline: 'Request a confidential valuation',
      body: 'For owners considering a private sale. Nothing is published, and nothing is shared without written instruction.',
      submitLabel: 'Request a Consultation',
    },
    {
      id: 'other' as IntentId,
      label: 'Something Else',
      headline: 'Tell us what you need',
      body: 'Press, professional or other confidential inquiries are welcome here.',
      submitLabel: 'Send Inquiry',
    },
  ],

  /* ------------------------------------------------------- qualification */
  visitorIntent: [
    { id: 'ready-to-view' as VisitorIntentId, label: 'I’m ready to view the property' },
    { id: 'actively-searching' as VisitorIntentId, label: 'I’m actively searching' },
    { id: 'exploring-market' as VisitorIntentId, label: 'I’m exploring the market' },
    { id: 'considering-selling' as VisitorIntentId, label: 'I’m considering selling' },
    { id: 'buyer-agent' as VisitorIntentId, label: 'I represent a buyer' },
    { id: 'other' as VisitorIntentId, label: 'Other' },
  ],

  timelines: [
    { id: 'immediate' as TimelineId, label: 'Ready now' },
    { id: '30-days' as TimelineId, label: 'Next 30 days' },
    { id: '3-months' as TimelineId, label: '1–3 months' },
    { id: '6-months' as TimelineId, label: '3–6 months' },
    { id: 'exploring' as TimelineId, label: 'Just exploring' },
  ],

  preferredContact: [
    { id: 'phone' as PreferredContactId, label: 'Phone' },
    { id: 'email' as PreferredContactId, label: 'Email' },
    { id: 'text' as PreferredContactId, label: 'Text' },
  ],

  /* ------------------------------------------------------------ fields */
  /** Optional fields can be switched off per client without breaking the form. */
  fields: {
    preferredDate: true,
    preferredTime: true,
    visitorIntent: true,
    timeline: true,
    preferredContact: true,
    message: true,
  },

  /* ------------------------------------------------------- requirements */
  requirements: {
    /** Required in every market. */
    required: ['firstName', 'lastName', 'email', 'phone'] as const,
    /** Consent tick — required where applicable. */
    consentRequired: true,
    consentCopy:
      'I agree to be contacted about this property by phone, email or text. I understand my details will not be sold or distributed.',
    /** Marketing opt-in, never pre-ticked, never blocking. */
    marketingCopy: 'Keep me informed about comparable private listings.',
    /** Shown next to the phone field. */
    ownershipNote:
      'By submitting you confirm you are the person named above, or are authorised to enquire on their behalf.',
  },

  /* ----------------------------------------------------------- delivery */
  delivery: {
    recipient: process.env.LEAD_EMAIL_RECIPIENT || 'advisor@example.com',
    webhook: process.env.LEAD_WEBHOOK_URL || '',
    crm: process.env.LEAD_CRM_PROVIDER || 'none',
    /** Leads are always persisted locally so nothing is lost in a demo. */
    persistLocally: true,
    storageFile: '.data/leads.ndjson',
  },

  /* ------------------------------------------------------------- safety */
  spam: {
    /** Hidden field. Bots fill it; humans never see it. */
    honeypotField: '_company',
    /** Minimum seconds a human plausibly needs to complete the form. */
    minCompletionSeconds: 3,
    /** Simple in-memory rate limit. */
    rateLimit: { windowMs: 60_000, max: 6 },
  },

  /* ------------------------------------------------------------ success */
  success: {
    heading: 'Your request has been received',
    body: 'A property advisor will contact you shortly to confirm arrangements. If your inquiry is time-sensitive, please call the direct line below.',
    referencePrefix: 'VM',
    nextSteps: [
      'You’ll receive a confirmation email with the property dossier.',
      'Advisor confirms the appointment window by phone or text.',
      'Address and access details are released once the appointment is set.',
    ],
  },
} as const;

export type LeadSettings = typeof leadSettings;
