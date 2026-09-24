/**
 * LEAD DATA ARCHITECTURE
 *
 *   Lead
 *   ├── firstName        ├── intent              ├── property
 *   ├── lastName         ├── buyingTimeline      ├── source
 *   ├── email            ├── visitorIntent       ├── submittedAt
 *   ├── phone            ├── preferredContact    ├── reference
 *   ├── preferredDate    ├── message             └── consent (+ marketing, ownership)
 *   └── preferredTime
 *
 * Isomorphic: safe to import in the browser (validation) and on the server.
 */

import { leadSettings } from '@/data';
import { makeReference } from './utils';

export type Lead = {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  intent: string;
  buyingTimeline?: string;
  visitorIntent?: string;
  preferredContact?: string;
  message?: string;
  property: string;
  propertyReference?: string;
  source: string;
  landingPath?: string;
  referrer?: string;
  utm?: Record<string, string>;
  submittedAt: string;
  consent: boolean;
  marketingConsent: boolean;
  ownershipConfirmed: boolean;
  /** Server-side qualification score (0–100), computed on submit. */
  score?: number;
  /** Lightweight request context for the advisor. */
  meta?: {
    userAgent?: string;
    elapsedSeconds?: number;
  };
};

export type LeadInput = Partial<Omit<Lead, 'id' | 'submittedAt'>>;

export type FieldError = { field: string; message: string };

export type ValidationResult =
  | { ok: true; lead: Omit<Lead, 'id' | 'submittedAt'> }
  | { ok: false; errors: FieldError[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const str = (value: unknown, max = 120): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const digitsOnly = (value: string) => value.replace(/[^\d]/g, '');

const VALID_INTENTS = leadSettings.intents.map((i) => i.id as string);
const VALID_TIMELINES = leadSettings.timelines.map((t) => t.id as string);
const VALID_CONTACT = leadSettings.preferredContact.map((c) => c.id as string);
const VALID_VISITOR = leadSettings.visitorIntent.map((v) => v.id as string);

/**
 * Validate and normalise a submission.
 * Returns every error at once so the visitor never fixes one field at a time.
 */
export function validateLead(input: LeadInput): ValidationResult {
  const errors: FieldError[] = [];

  const firstName = str(input.firstName, 60);
  const lastName = str(input.lastName, 60);
  const email = str(input.email, 160).toLowerCase();
  const phone = str(input.phone, 40);
  const message = str(input.message, 1500);
  const preferredDate = str(input.preferredDate, 20);
  const preferredTime = str(input.preferredTime, 10);
  const intent = str(input.intent, 40) || 'private-showing';
  const buyingTimeline = str(input.buyingTimeline, 40);
  const visitorIntent = str(input.visitorIntent, 40);
  const preferredContact = str(input.preferredContact, 20);

  if (firstName.length < 1) errors.push({ field: 'firstName', message: 'Please enter your first name.' });
  if (lastName.length < 1) errors.push({ field: 'lastName', message: 'Please enter your last name.' });

  if (!email) errors.push({ field: 'email', message: 'Please enter your email address.' });
  else if (!EMAIL_RE.test(email)) errors.push({ field: 'email', message: 'That email address doesn’t look right.' });

  const phoneDigits = digitsOnly(phone);
  if (!phone) errors.push({ field: 'phone', message: 'Please enter a phone number so the advisor can reach you.' });
  else if (phoneDigits.length < 7 || phoneDigits.length > 15)
    errors.push({ field: 'phone', message: 'Please include the country and area code.' });

  if (!VALID_INTENTS.includes(intent)) errors.push({ field: 'intent', message: 'Please choose what you’d like to do.' });

  if (buyingTimeline && !VALID_TIMELINES.includes(buyingTimeline))
    errors.push({ field: 'buyingTimeline', message: 'Please choose a timeline from the list.' });

  if (visitorIntent && !VALID_VISITOR.includes(visitorIntent))
    errors.push({ field: 'visitorIntent', message: 'Please choose an option from the list.' });

  if (preferredContact && !VALID_CONTACT.includes(preferredContact))
    errors.push({ field: 'preferredContact', message: 'Please choose how you’d prefer to be contacted.' });

  if (preferredDate) {
    const parsed = new Date(`${preferredDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) errors.push({ field: 'preferredDate', message: 'Please choose a valid date.' });
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsed < today) errors.push({ field: 'preferredDate', message: 'Please choose today or a future date.' });
    }
  }

  if (leadSettings.requirements.consentRequired && input.consent !== true)
    errors.push({ field: 'consent', message: 'Please confirm we may contact you about this property.' });

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      reference: input.reference || makeReference(leadSettings.success.referencePrefix),
      firstName,
      lastName,
      email,
      phone,
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime || undefined,
      intent,
      buyingTimeline: buyingTimeline || undefined,
      visitorIntent: visitorIntent || undefined,
      preferredContact: preferredContact || undefined,
      message: message || undefined,
      property: str(input.property, 120) || '',
      propertyReference: str(input.propertyReference, 40) || undefined,
      source: str(input.source, 60) || 'website',
      landingPath: str(input.landingPath, 200) || undefined,
      referrer: str(input.referrer, 300) || undefined,
      utm: input.utm,
      consent: input.consent === true,
      marketingConsent: input.marketingConsent === true,
      ownershipConfirmed: input.ownershipConfirmed === true,
      meta: input.meta,
    },
  };
}

/**
 * Quiet qualification score for the advisor — never shown to the visitor,
 * never a barrier to submission.
 */
export function scoreLead(lead: LeadInput & { intent?: string }): number {
  let score = 20;
  const intent = lead.intent;
  if (intent === 'private-showing') score += 30;
  if (intent === 'property-details') score += 20;
  if (intent === 'speak-with-advisor') score += 15;
  if (intent === 'seller-consultation') score += 15;

  if (lead.visitorIntent === 'ready-to-view') score += 25;
  else if (lead.visitorIntent === 'actively-searching') score += 18;
  else if (lead.visitorIntent === 'buyer-agent') score += 14;
  else if (lead.visitorIntent === 'considering-selling') score += 10;

  if (lead.buyingTimeline === 'immediate') score += 15;
  else if (lead.buyingTimeline === '30-days') score += 10;
  else if (lead.buyingTimeline === '3-months') score += 6;

  if (lead.preferredDate) score += 10;
  if (lead.preferredTime) score += 4;
  if (lead.message && lead.message.length > 40) score += 6;
  if (lead.phone) score += 5;

  return Math.max(0, Math.min(100, score));
}

/** Human-readable qualification band for the advisor inbox. */
export function scoreBand(score = 0): 'Hot' | 'Warm' | 'Nurture' {
  if (score >= 75) return 'Hot';
  if (score >= 50) return 'Warm';
  return 'Nurture';
}

/** Compact one-line summary used in the demo dock and advisor email. */
export function summariseLead(lead: Lead): string {
  return [lead.intent, lead.visitorIntent, lead.buyingTimeline, lead.preferredDate]
    .filter(Boolean)
    .join(' · ');
}
