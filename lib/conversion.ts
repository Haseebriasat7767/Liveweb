/**
 * Conversion plumbing.
 * Any CTA anywhere on the page can open the lead capture panel with the right
 * intent pre-selected — one event, no prop drilling, no global state library.
 */

import type { IntentId } from '@/data/leadSettings';

export const SHOWING_EVENT = 'llm:showing';

export type ShowingRequest = {
  intent: IntentId;
  /** Where the request came from, for analytics. */
  source: string;
};

/** Open the conversion panel with a pre-selected intent. */
export function requestShowing(intent: IntentId = 'private-showing', source = 'cta'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ShowingRequest>(SHOWING_EVENT, { detail: { intent, source } }));
}

/** Subscribe (returns an unsubscribe function). */
export function onShowingRequest(handler: (request: ShowingRequest) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (event: Event) => handler((event as CustomEvent<ShowingRequest>).detail);
  window.addEventListener(SHOWING_EVENT, listener);
  return () => window.removeEventListener(SHOWING_EVENT, listener);
}

/**
 * Draft protection: submitted form data is never lost to a frontend validation
 * failure or an accidental refresh. Cleared only on a confirmed submission.
 */
const DRAFT_KEY = 'llm:lead-draft:v1';

export function saveDraft(values: Record<string, unknown>): void {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, at: Date.now() }));
  } catch {
    /* storage disabled — not fatal */
  }
}

export function loadDraft<T extends Record<string, unknown>>(): Partial<T> | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { values?: Partial<T>; at?: number };
    return parsed.values ?? null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}
