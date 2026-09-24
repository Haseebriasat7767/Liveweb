import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { agent, contact } from '@/data';

export const metadata: Metadata = {
  title: 'Fair Housing Notice',
  description: 'Our commitment to equal housing opportunity and fair advertising.',
  alternates: { canonical: '/fair-housing' },
};

export default function FairHousingPage() {
  return (
    <LegalPage
      eyebrow="Compliance"
      title="Fair Housing Notice"
      updated="January 2026"
      intro={`${agent.brokerage} is pledged to the letter and spirit of United States policy for the achievement of equal housing opportunity and to the principles of fair advertising.`}
      sections={[
        {
          heading: 'Equal housing opportunity',
          body: [
            'We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, colour, religion, sex, handicap, familial status or national origin.',
            'Additional protections may apply under state and local law. Those protections are observed equally in the marketing of this residence.',
          ],
        },
        {
          heading: 'How this applies to inquiries',
          body: [
            'All inquiries received through this website are handled on the same terms regardless of who makes them. We do not use, and will not accept, criteria that would exclude or discourage any protected class.',
            'Private showing requests are evaluated on availability, property access requirements and the same proof-of-funds process applied to every prospective buyer.',
          ],
        },
        {
          heading: 'Accessibility',
          body: [
            'We will make reasonable accommodations for prospective buyers with disabilities, including alternative viewing arrangements where a physical walkthrough is not possible.',
            'This website is built to be usable with keyboard navigation and assistive technology, and honours reduced-motion preferences.',
          ],
        },
        {
          heading: 'Reporting a concern',
          body: [
            `If you believe you have experienced discrimination in connection with this property, please contact ${agent.brokerage} at ${contact.email.label} or ${contact.phone.label}. You may also file a complaint with the U.S. Department of Housing and Urban Development or your state or local fair housing agency.`,
          ],
        },
      ]}
    />
  );
}
