/**
 * ANALYTICS ARCHITECTURE
 * Provider-swappable event tracking. Never receives private lead information —
 * only non-identifying context (property reference, intent category, source).
 */

import { analytics as analyticsConfig, property, type AnalyticsProvider } from '@/data';

export type AnalyticsEvent =
  | 'page_view'
  | 'hero_cta_click'
  | 'hero_secondary_click'
  | 'nav_cta_click'
  | 'scroll_depth'
  | 'section_view'
  | 'gallery_open'
  | 'gallery_navigate'
  | 'floorplan_open'
  | 'floorplan_room_select'
  | 'room_space_select'
  | 'video_play'
  | 'video_pause'
  | 'video_progress'
  | 'agent_contact_click'
  | 'phone_click'
  | 'email_click'
  | 'whatsapp_click'
  | 'sms_click'
  | 'booking_click'
  | 'showing_form_open'
  | 'showing_form_submit'
  | 'lead_form_error'
  | 'demo_dock_open';

/** Props are intentionally limited to non-identifying values. */
export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export type TrackedEvent = {
  id: string;
  name: AnalyticsEvent;
  props: AnalyticsProps;
  at: number;
};

type Listener = (event: TrackedEvent) => void;

const listeners = new Set<Listener>();
const buffer: TrackedEvent[] = [];
const MAX_BUFFER = 60;

declare global {
  interface Window {
    dataLayer?: unknown[];
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
    analytics?: { track: (event: string, props?: AnalyticsProps) => void };
    __llmEvents?: TrackedEvent[];
  }
}

/** Subscribe to the local event bus (used by the demo dock). */
export function subscribeToEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function recentEvents(): TrackedEvent[] {
  return [...buffer];
}

function providerSend(name: string, props: AnalyticsProps) {
  const provider: AnalyticsProvider = analyticsConfig.provider;
  if (typeof window === 'undefined') return;

  switch (provider) {
    case 'gtm':
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...props });
      break;
    case 'plausible':
      window.plausible?.(name, { props });
      break;
    case 'segment':
      window.analytics?.track(name, props);
      break;
    case 'console':
      // Kept in the browser console only — handy during a client walkthrough.
      // eslint-disable-next-line no-console
      console.info(`%c▸ ${name}`, 'color:#A47C4F', props);
      break;
    case 'none':
    default:
      break;
  }
}

let counter = 0;

/**
 * Track a conversion or experience event.
 * Fire-and-forget: never blocks the UI, never throws.
 */
export function track(name: AnalyticsEvent, props: AnalyticsProps = {}): void {
  try {
    const event: TrackedEvent = {
      id: `${Date.now().toString(36)}-${(counter += 1)}`,
      name,
      props: {
        property: property.name,
        reference: property.hero.meta[3]?.value ?? null,
        ...props,
      },
      at: Date.now(),
    };

    buffer.unshift(event);
    if (buffer.length > MAX_BUFFER) buffer.pop();

    if (typeof window !== 'undefined') {
      window.__llmEvents = buffer;
    }

    listeners.forEach((listener) => listener(event));
    providerSend(name, event.props);
  } catch {
    /* analytics must never break the experience */
  }
}

/**
 * Sanitise anything heading to analytics: strip values that could identify a
 * person, keep only the shape of the submission.
 */
export function safeLeadContext(intent: string, fields: Record<string, unknown>) {
  return {
    intent,
    fieldCount: Object.keys(fields).filter((key) => Boolean(fields[key])).length,
    source: 'website',
  };
}
