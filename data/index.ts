/**
 * CENTRALISED PROPERTY CONFIGURATION
 *
 *   propertyConfig
 *   ├── site          brand, demo mode, analytics, legal
 *   ├── property      identity, hero, story, stats, film, amenities, conversion, seo
 *   ├── rooms         signature spaces
 *   ├── gallery       photo essay frames
 *   ├── floorPlans    interactive levels and rooms
 *   ├── location      lifestyle and travel times
 *   ├── agent         advisor credibility
 *   ├── contact       phone / sms / email / whatsapp / booking
 *   └── leadSettings  intents, qualification, validation, delivery, spam control
 *
 * Replace these files (or feed them from a CMS later) and the entire showroom
 * re-brands without a single component change.
 */

import { site, demoMode, analytics, legal } from './site';
import { property } from './property';
import { rooms } from './rooms';
import { galleryImages } from './gallery';
import { floorPlans } from './floorPlans';
import { location } from './location';
import { agent } from './agent';
import { contact } from './contact';
import { leadSettings } from './leadSettings';

export const propertyConfig = {
  site,
  demoMode,
  analytics,
  legal,
  property,
  rooms,
  galleryImages,
  floorPlans,
  location,
  agent,
  contact,
  leadSettings,
} as const;

export type PropertyConfig = typeof propertyConfig;

/* Types — so components can import everything from one place. */
export type { AnalyticsProvider } from './site';
export type { StatValue } from './property';
export type { Room } from './rooms';
export type { GalleryImage } from './gallery';
export type { PlanRoom, PlanLevel } from './floorPlans';
export type { Destination } from './location';
export type { Credential } from './agent';
export type { ContactChannel } from './contact';
export type {
  LeadSettings,
  IntentId,
  TimelineId,
  PreferredContactId,
  VisitorIntentId,
} from './leadSettings';

export {
  site,
  demoMode,
  analytics,
  legal,
  property,
  rooms,
  galleryImages,
  floorPlans,
  location,
  agent,
  contact,
  leadSettings,
};

export { propertyConfig as config };
