import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { agent, contact } from '@/data';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How inquiry data submitted through this property website is collected, used and stored.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="January 2026"
      intro={`This policy explains what happens to the information you submit when you request a private showing, ask for property details, or contact ${agent.brokerage} through this website.`}
      sections={[
        {
          heading: 'What we collect',
          body: [
            'When you submit an inquiry we collect the details you provide: your name, email address, phone number, and any optional information such as preferred viewing date, buying timeline, preferred contact method and your message.',
            'We also record limited technical context with each submission — the page you submitted from, the time of submission, and a reference number — so the inquiry can be traced and answered.',
          ],
        },
        {
          heading: 'How we use it',
          body: [
            'Your information is used solely to respond to your inquiry, arrange showings, and provide the property information you requested. Where you explicitly opt in, we may also send details of comparable private listings.',
            'We do not sell, rent or distribute inquiry data to third parties. Access is limited to the listing advisor and the brokerage team responsible for this property.',
          ],
        },
        {
          heading: 'Storage and retention',
          body: [
            'Inquiries are stored in the brokerage’s lead system and, where configured, forwarded to the brokerage’s customer relationship management provider for follow-up.',
            'Records are retained for as long as necessary to service the inquiry and to meet record-keeping obligations, after which they are deleted.',
          ],
        },
        {
          heading: 'Your choices',
          body: [
            `You may request a copy of the information we hold about you, ask for it to be corrected, or ask for it to be deleted. Requests can be made to ${contact.email.label} or by telephone on ${contact.phone.label}.`,
            'You may withdraw consent to marketing communications at any time; withdrawing marketing consent does not affect your ability to receive a response to an active inquiry.',
          ],
        },
        {
          heading: 'Cookies and measurement',
          body: [
            'This site uses privacy-respecting measurement to understand which sections of the property presentation are viewed, so the presentation can be improved. Analytics events never contain your name, email address, phone number or message content.',
            'Where an analytics provider is enabled, its own cookie and retention policies apply; the provider is configured by the brokerage before the site is published.',
          ],
        },
        {
          heading: 'Disclosures and agency',
          body: [
            'Nothing on this website constitutes an offer to sell or a solicitation of an offer to buy real property. Property details, areas and dimensions are indicative and should be independently verified before any decision is made.',
          ],
        },
      ]}
    />
  );
}
