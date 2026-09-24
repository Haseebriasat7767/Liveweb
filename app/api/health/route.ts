import { NextResponse } from 'next/server';
import { analytics, contact, demoMode, leadSettings, property, site } from '@/data';
import { canPersistToDisk } from '@/lib/leadStore';
import { resolveDeploymentHost, resolveSiteUrl } from '@/lib/siteUrl';

/**
 * GET /api/health — deployment sanity check.
 * Reports which integrations are wired without exposing any credentials.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    site: site.brand,
    property: property.name,
    demoMode,
    environment: process.env.NODE_ENV,
    integrations: {
      analyticsProvider: analytics.provider,
      leadRecipient: Boolean(leadSettings.delivery.recipient),
      webhook: Boolean(leadSettings.delivery.webhook),
      crm: leadSettings.delivery.crm,
      channels: {
        phone: contact.phone.available,
        sms: contact.sms.available,
        email: contact.email.available,
        whatsapp: contact.whatsapp.available,
        booking: contact.booking.available,
      },
      adminInbox: Boolean(process.env.LEAD_ADMIN_TOKEN) || demoMode,
    },
    deployment: {
      host: resolveDeploymentHost(),
      canonicalUrl: resolveSiteUrl(),
      vercelUrl: process.env.VERCEL_URL ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      /** False on serverless: configure LEAD_WEBHOOK_URL or leads cannot be kept. */
      persistentLeadStore: canPersistToDisk,
      warning: canPersistToDisk
        ? null
        : 'Serverless filesystem detected — set LEAD_WEBHOOK_URL so leads are not lost.',
    },
    time: new Date().toISOString(),
  });
}
