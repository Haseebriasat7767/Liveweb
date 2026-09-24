import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * POST /api/analytics — optional server-side event sink.
 * Only non-identifying payloads are accepted; anything resembling personal
 * data is dropped before it reaches a log.
 */
const BLOCKED_KEYS = ['email', 'phone', 'name', 'firstName', 'lastName', 'message', 'address'];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; props?: Record<string, unknown> };
    const name = typeof body.name === 'string' ? body.name.slice(0, 64) : 'unknown';

    const props = Object.entries(body.props ?? {})
      .filter(([key]) => !BLOCKED_KEYS.includes(key))
      .slice(0, 12)
      .reduce<Record<string, string | number | boolean>>((accumulator, [key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          accumulator[key] = typeof value === 'string' ? value.slice(0, 120) : value;
        }
        return accumulator;
      }, {});

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`▸ analytics · ${name}`, props);
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
