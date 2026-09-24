/**
 * Cross-section links into the floor plan.
 * Selecting a space in "Signature Spaces" highlights the same room in the plan.
 */

export const PLAN_SELECT_EVENT = 'llm:plan-select';

export type PlanSelection = { roomId: string; source: string };

export function selectPlanRoom(roomId: string, source = 'unknown'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<PlanSelection>(PLAN_SELECT_EVENT, { detail: { roomId, source } }));
}

export function onPlanSelect(handler: (selection: PlanSelection) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (event: Event) => handler((event as CustomEvent<PlanSelection>).detail);
  window.addEventListener(PLAN_SELECT_EVENT, listener);
  return () => window.removeEventListener(PLAN_SELECT_EVENT, listener);
}
