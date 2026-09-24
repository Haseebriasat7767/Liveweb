import { NextResponse } from 'next/server';
import { demoMode, leadSettings, property } from '@/data';
import { scoreLead, validateLead } from '@/lib/leads';
import { forwardLead, persistLead, rateLimit, readLeads } from '@/lib/leadStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const clientKey = (request: Request) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'local';

/**
 * POST /api/leads — receive a qualified lead.
 * Order of defences: rate limit → honeypot → validation → persist → forward.
 */
export async function POST(request: Request) {
  const started = Date.now();

  const limit = rateLimit(clientKey(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: 'Too many requests. Please try again shortly, or call the advisor directly.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfter) } },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot: answer politely, store nothing.
  if (typeof payload.honeypot === 'string' && payload.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true, reference: 'VM-OK', filtered: true });
  }

  const validation = validateLead(payload);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, errors: validation.errors, message: 'Please review the highlighted fields.' },
      { status: 422 },
    );
  }

  const elapsed = Number((payload.meta as { elapsedSeconds?: number } | undefined)?.elapsedSeconds ?? 0);
  const suspicious = elapsed > 0 && elapsed < leadSettings.spam.minCompletionSeconds;

  const lead = {
    ...validation.lead,
    id: `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    property: validation.lead.property || property.name,
    submittedAt: new Date().toISOString(),
    score: scoreLead(validation.lead),
    meta: { ...validation.lead.meta, elapsedSeconds: elapsed },
  };

  const persisted = await persistLead(lead);
  if (!suspicious) await forwardLead(lead);

  // Server-side trace — useful when a client is watching the dock during a demo.
  if (demoMode) {
    // eslint-disable-next-line no-console
    console.info(
      `▸ lead received · ${lead.intent} · score ${lead.score} · ${Date.now() - started}ms · stored=${persisted}`,
    );
  }

  return NextResponse.json(
    {
      ok: true,
      reference: lead.reference,
      lead: { ...lead, score: lead.score },
      stored: persisted,
    },
    { status: 201 },
  );
}

/**
 * GET /api/leads — advisor inbox.
 * Open in demo mode (so a prospective client can see captured leads); otherwise
 * requires the admin token configured in LEAD_ADMIN_TOKEN.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const adminToken = process.env.LEAD_ADMIN_TOKEN;

  const authorised = adminToken ? token === adminToken : demoMode;
  if (!authorised) {
    return NextResponse.json({ ok: false, message: 'Not authorised.' }, { status: 401 });
  }

  const limit = Math.min(Number(url.searchParams.get('limit') ?? 25) || 25, 100);
  const leads = await readLeads(limit);

  return NextResponse.json({ ok: true, count: leads.length, leads }, { headers: { 'cache-control': 'no-store' } });
}
