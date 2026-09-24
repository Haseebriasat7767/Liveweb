/**
 * Server-side lead delivery.
 * Leads are appended to a local NDJSON file so nothing is ever lost in a demo,
 * and optionally forwarded to a webhook / CRM when configured.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { leadSettings } from '@/data';
import type { Lead } from './leads';

const STORAGE = path.join(process.cwd(), leadSettings.delivery.storageFile);

async function ensureStore() {
  await fs.mkdir(path.dirname(STORAGE), { recursive: true });
}

export async function persistLead(lead: Lead): Promise<boolean> {
  if (!leadSettings.delivery.persistLocally) return false;
  try {
    await ensureStore();
    await fs.appendFile(STORAGE, `${JSON.stringify(lead)}\n`, 'utf8');
    return true;
  } catch {
    return false;
  }
}

export async function readLeads(limit = 25): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(STORAGE, 'utf8');
    return raw
      .split('\n')
      .filter(Boolean)
      .slice(-limit)
      .reverse()
      .map((line) => JSON.parse(line) as Lead);
  } catch {
    return [];
  }
}

/** Optional outbound delivery. Silently no-ops when not configured. */
export async function forwardLead(lead: Lead): Promise<void> {
  const webhook = leadSettings.delivery.webhook;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        recipient: leadSettings.delivery.recipient,
        crm: leadSettings.delivery.crm,
        lead,
      }),
      // Never let a slow CRM hold up the visitor.
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    /* delivery is best-effort; the local copy is the record */
  }
}

/* -------------------------------------------------------------------------- */
/* In-memory rate limiting                                                     */
/* -------------------------------------------------------------------------- */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const { windowMs, max } = leadSettings.spam.rateLimit;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}
