'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { contact, leadSettings, property } from '@/data';
import type { IntentId } from '@/data/leadSettings';
import { validateLead, type FieldError, type Lead } from '@/lib/leads';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { clearDraft, loadDraft, onShowingRequest, saveDraft } from '@/lib/conversion';
import { track } from '@/lib/analytics';

type Draft = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  buyingTimeline?: string;
  visitorIntent?: string;
  preferredContact?: string;
  message?: string;
};

const EMPTY: Draft = {};
const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared markup for a labelled field, including its error slot. */
function Field({
  id,
  label,
  children,
  error,
  optional,
  hint,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: FieldError;
  optional?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="label flex items-baseline justify-between text-paper/45">
        <span>
          {label}
          {!optional && <span className="ml-1 text-brass">*</span>}
        </span>
        {optional && <span className="text-[8px] tracking-[0.2em] text-paper/25">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-[10.5px] text-paper/30">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[11px] text-[#E3A692]">
          {error.message}
        </p>
      )}
    </div>
  );
}

function ChipRow({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: ReadonlyArray<{ id: string; label: string }>;
  value?: string;
  onChange: (next: string) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="label text-paper/45">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            data-active={value === option.id}
            aria-pressed={value === option.id}
            name={name}
            className="chip chip-dark text-paper/70 data-[active=true]:text-ink"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * SECTIONS 11–12 — LEAD CAPTURE + QUIET QUALIFICATION
 * Four required fields. Everything else is optional and framed as helpful
 * rather than interrogative. Values are never lost: drafts persist locally
 * until a submission is confirmed.
 */
export function LeadForm() {
  const [intent, setIntent] = useState<IntentId>('private-showing');
  const [values, setValues] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ reference: string; lead: Lead } | null>(null);
  const [draftNotice, setDraftNotice] = useState(false);

  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const activeIntent = useMemo(
    () => leadSettings.intents.find((entry) => entry.id === intent) ?? leadSettings.intents[0],
    [intent],
  );

  /* ------------------------------------------------------------ draft load */
  useEffect(() => {
    const draft = loadDraft<Draft>();
    if (draft && Object.keys(draft).length > 0) {
      setValues(draft);
      setDraftNotice(true);
    }
  }, []);

  /* ------------------------------------------------------ intent handoff */
  useEffect(
    () =>
      onShowingRequest(({ intent: nextIntent }) => {
        setIntent(nextIntent);
        setErrors([]);
      }),
    [],
  );

  /* ----------------------------------------------------------- draft save */
  useEffect(() => {
    if (success) return;
    const id = window.setTimeout(() => {
      if (Object.keys(values).length > 0) saveDraft(values);
    }, 600);
    return () => window.clearTimeout(id);
  }, [values, success]);

  const set = useCallback(<K extends keyof Draft>(key: K, value: Draft[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => previous.filter((error) => error.field !== key));
    setNetworkError(null);
  }, []);

  const errorFor = (field: string) => errors.find((error) => error.field === field);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNetworkError(null);

    const consentInput = event.currentTarget.querySelector<HTMLInputElement>('#consent');
    const marketingInput = event.currentTarget.querySelector<HTMLInputElement>('#marketing');
    const ownershipInput = event.currentTarget.querySelector<HTMLInputElement>('#ownership');

    const payload = {
      ...values,
      intent,
      consent: consentInput?.checked ?? false,
      marketingConsent: marketingInput?.checked ?? false,
      ownershipConfirmed: ownershipInput?.checked ?? false,
      property: property.name,
      propertyReference: property.hero.meta[3]?.value,
      source: 'website',
      landingPath: typeof window !== 'undefined' ? window.location.pathname : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      meta: { elapsedSeconds: Math.round((Date.now() - mountedAt.current) / 1000) },
    };

    const validation = validateLead(payload);
    if (!validation.ok) {
      setErrors(validation.errors);
      track('lead_form_error', {
        fields: validation.errors.map((error) => error.field).join(','),
        count: validation.errors.length,
      });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...validation.lead,
          honeypot: honeypotRef.current?.value ?? '',
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        lead?: Lead;
        reference?: string;
        errors?: FieldError[];
        message?: string;
      };

      if (!response.ok || !result.ok) {
        if (result.errors?.length) {
          setErrors(result.errors);
          track('lead_form_error', { stage: 'server', fields: result.errors.map((e) => e.field).join(',') });
        } else {
          setNetworkError(result.message ?? 'Something went wrong. Please call the advisor directly.');
        }
        setSubmitting(false);
        return;
      }

      const lead = result.lead as Lead;
      setSuccess({ reference: result.reference ?? lead.reference, lead });
      clearDraft();
      track('showing_form_submit', {
        intent,
        score: lead.score ?? null,
        timeline: lead.buyingTimeline ?? null,
        visitorIntent: lead.visitorIntent ?? null,
      });
      setSubmitting(false);
    } catch {
      setSubmitting(false);
      setNetworkError(
        'We could not reach the server. Your details are saved in this browser — please try again, or call the advisor directly.',
      );
      track('lead_form_error', { stage: 'network' });
    }
  };

  /* ------------------------------------------------------------ success UI */
  return (
    <div className="relative bg-charcoal/60 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            role="status"
            aria-live="polite"
          >
            <p className="label text-brass">Reference {success.reference}</p>
            <h3 className="display-md mt-6 text-paper">{leadSettings.success.heading}</h3>
            <p className="body-md mt-5 max-w-lg text-paper/65">{leadSettings.success.body}</p>

            <ul className="mt-8 space-y-3 border-t border-paper/12 pt-6">
              {leadSettings.success.nextSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-4 text-[13px] leading-relaxed text-paper/60">
                  <span className="label mt-1 shrink-0 text-brass/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid gap-4 border-t border-paper/12 pt-6 sm:grid-cols-2">
              <div>
                <dt className="label text-paper/35">Advisor</dt>
                <dd className="mt-2 text-[13px] text-paper/80">
                  {property.name} — {property.hero.meta[0]?.value}
                </dd>
              </div>
              <div>
                <dt className="label text-paper/35">Submitted</dt>
                <dd className="mt-2 text-[13px] text-paper/80">
                  {new Date(success.lead.submittedAt ?? Date.now()).toLocaleString()}
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {contact.phone.available && (
                <Button
                  href={contact.phone.href}
                  variant="inverse"
                  size="md"
                  arrow
                  analyticsEvent="phone_click"
                  analyticsProps={{ source: 'success_state' }}
                >
                  Call the advisor
                </Button>
              )}
              {contact.email.available && (
                <Button
                  href={contact.email.href}
                  variant="outline-dark"
                  size="md"
                  analyticsEvent="email_click"
                  analyticsProps={{ source: 'success_state' }}
                >
                  Email the office
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-describedby={networkError ? 'form-network-error' : undefined}
          >
            {/* Intent — the first and most important question */}
            <fieldset>
              <legend className="label text-paper/45">What would you like to do?</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {leadSettings.intents.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setIntent(entry.id);
                      setErrors([]);
                    }}
                    aria-pressed={intent === entry.id}
                    data-active={intent === entry.id}
                    className="chip chip-dark text-paper/70 data-[active=true]:text-ink"
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 border-t border-paper/12 pt-8">
              <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-paper">
                {activeIntent.headline}
              </h3>
              <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-paper/55">{activeIntent.body}</p>
            </div>

            {/* Error summary */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-8 overflow-hidden border border-[#8A4736]/60 bg-[#3A1E17]/40 px-4 py-3"
                >
                  <p className="text-[12px] leading-relaxed text-[#E3A692]">
                    {errors.length === 1
                      ? 'One field needs attention before we can send your request.'
                      : `${errors.length} fields need attention before we can send your request.`}{' '}
                    Your details are saved.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {networkError && (
              <div
                id="form-network-error"
                role="alert"
                className="mt-8 border border-[#8A4736]/60 bg-[#3A1E17]/40 px-4 py-3 text-[12px] leading-relaxed text-[#E3A692]"
              >
                {networkError}
              </div>
            )}

            {/* Contact details */}
            <div className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field id="firstName" label="First name" error={errorFor('firstName')}>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="field text-paper"
                  placeholder="Alexandra"
                  value={values.firstName ?? ''}
                  aria-invalid={Boolean(errorFor('firstName'))}
                  aria-describedby={errorFor('firstName') ? 'firstName-error' : undefined}
                  onChange={(event) => set('firstName', event.target.value)}
                />
              </Field>

              <Field id="lastName" label="Last name" error={errorFor('lastName')}>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="field text-paper"
                  placeholder="Reyne"
                  value={values.lastName ?? ''}
                  aria-invalid={Boolean(errorFor('lastName'))}
                  aria-describedby={errorFor('lastName') ? 'lastName-error' : undefined}
                  onChange={(event) => set('lastName', event.target.value)}
                />
              </Field>

              <Field id="email" label="Email" error={errorFor('email')}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  className="field text-paper"
                  placeholder="you@example.com"
                  value={values.email ?? ''}
                  aria-invalid={Boolean(errorFor('email'))}
                  aria-describedby={errorFor('email') ? 'email-error' : undefined}
                  onChange={(event) => set('email', event.target.value)}
                />
              </Field>

              <Field
                id="phone"
                label="Phone"
                error={errorFor('phone')}
                hint="Include your country and area code."
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  className="field text-paper"
                  placeholder="+1 561 555 0100"
                  value={values.phone ?? ''}
                  aria-invalid={Boolean(errorFor('phone'))}
                  aria-describedby={errorFor('phone') ? 'phone-error' : undefined}
                  onChange={(event) => set('phone', event.target.value)}
                />
              </Field>
            </div>

            {/* Qualification */}
            <div className="mt-10 space-y-8 border-t border-paper/12 pt-8">
              {leadSettings.fields.visitorIntent && (
                <ChipRow
                  name="visitorIntent"
                  legend="What brings you here?"
                  options={leadSettings.visitorIntent}
                  value={values.visitorIntent}
                  onChange={(next) => set('visitorIntent', next)}
                />
              )}

              {leadSettings.fields.timeline && (
                <ChipRow
                  name="buyingTimeline"
                  legend="Buying timeline"
                  options={leadSettings.timelines}
                  value={values.buyingTimeline}
                  onChange={(next) => set('buyingTimeline', next)}
                />
              )}

              {leadSettings.fields.preferredContact && (
                <ChipRow
                  name="preferredContact"
                  legend="Preferred contact"
                  options={leadSettings.preferredContact}
                  value={values.preferredContact}
                  onChange={(next) => set('preferredContact', next)}
                />
              )}

              {(leadSettings.fields.preferredDate || leadSettings.fields.preferredTime) && (
                <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                  {leadSettings.fields.preferredDate && (
                    <Field
                      id="preferredDate"
                      label="Preferred date"
                      optional
                      error={errorFor('preferredDate')}
                    >
                      <input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        className="field text-paper"
                        value={values.preferredDate ?? ''}
                        aria-invalid={Boolean(errorFor('preferredDate'))}
                        aria-describedby={errorFor('preferredDate') ? 'preferredDate-error' : undefined}
                        onChange={(event) => set('preferredDate', event.target.value)}
                      />
                    </Field>
                  )}

                  {leadSettings.fields.preferredTime && (
                    <Field id="preferredTime" label="Preferred time" optional>
                      <input
                        id="preferredTime"
                        name="preferredTime"
                        type="time"
                        className="field text-paper"
                        value={values.preferredTime ?? ''}
                        onChange={(event) => set('preferredTime', event.target.value)}
                      />
                    </Field>
                  )}
                </div>
              )}

              {leadSettings.fields.message && (
                <Field id="message" label="Anything we should know" optional>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    maxLength={1500}
                    className="field resize-none text-paper"
                    placeholder="Timing, financing status, or a specific question about the residence."
                    value={values.message ?? ''}
                    onChange={(event) => set('message', event.target.value)}
                  />
                </Field>
              )}
            </div>

            {/* Consent */}
            <div className="mt-10 space-y-4 border-t border-paper/12 pt-8">
              <label
                htmlFor="consent"
                className="flex cursor-pointer items-start gap-4 text-[12px] leading-relaxed text-paper/60"
              >
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-paper/30 bg-transparent transition-colors duration-300 checked:border-brass checked:bg-brass"
                  aria-invalid={Boolean(errorFor('consent'))}
                  aria-describedby={errorFor('consent') ? 'consent-error' : undefined}
                />
                <span>
                  {leadSettings.requirements.consentCopy}
                  <span className="ml-1 text-brass">*</span>
                </span>
              </label>
              {errorFor('consent') && (
                <p id="consent-error" role="alert" className="text-[11px] text-[#E3A692]">
                  {errorFor('consent')?.message}
                </p>
              )}

              <label
                htmlFor="marketing"
                className="flex cursor-pointer items-start gap-4 text-[12px] leading-relaxed text-paper/45"
              >
                <input
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-paper/25 bg-transparent transition-colors duration-300 checked:border-brass checked:bg-brass"
                />
                <span>{leadSettings.requirements.marketingCopy}</span>
              </label>

              <label
                htmlFor="ownership"
                className="flex cursor-pointer items-start gap-4 text-[12px] leading-relaxed text-paper/45"
              >
                <input
                  id="ownership"
                  name="ownership"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-paper/25 bg-transparent transition-colors duration-300 checked:border-brass checked:bg-brass"
                />
                <span>
                  I am the person named above, or I am authorised to enquire on their behalf.
                </span>
              </label>
            </div>

            {/* Honeypot — invisible to people, irresistible to bots */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={leadSettings.spam.honeypotField}>Company</label>
              <input
                ref={honeypotRef}
                id={leadSettings.spam.honeypotField}
                name={leadSettings.spam.honeypotField}
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                variant="inverse"
                size="lg"
                arrow
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Sending…' : activeIntent.submitLabel}
              </Button>

              <p className="max-w-xs text-[10.5px] leading-relaxed text-paper/35">
                {property.conversion.footnote}
              </p>
            </div>

            {draftNotice && (
              <p className="mt-5 text-[10.5px] text-paper/30">
                Your details were restored from this device — nothing is sent until you submit.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
