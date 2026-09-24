import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { agent, property, site } from '@/data';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms that govern use of this property presentation website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      updated="January 2026"
      intro={`These terms govern your use of the ${property.name} presentation website operated by ${agent.brokerage}. By using the site you accept them.`}
      sections={[
        {
          heading: 'Purpose of this website',
          body: [
            'This website presents a single residence and provides a means of requesting a private showing, additional documentation, or a conversation with the listing advisor.',
            'It is a marketing presentation, not a contract, offer, or disclosure document.',
          ],
        },
        {
          heading: 'Accuracy of information',
          body: [
            'Areas, dimensions, floor plans, travel times and specifications are approximate and provided for orientation only. They are not survey documents and must be independently verified by a qualified professional before you rely on them.',
            'Photography, film and imagery may be staged, and may show finishes or furnishings that are not included in a sale.',
          ],
        },
        {
          heading: 'No offer and no advice',
          body: [
            'Nothing on this site constitutes an offer to sell real property, a solicitation of an offer to buy, or legal, tax, financial or investment advice.',
            `${agent.name} represents the interests of the seller. Any buyer is encouraged to obtain independent representation and advice.`,
          ],
        },
        {
          heading: 'Permitted use',
          body: [
            'You may view, share and print pages for personal, non-commercial purposes. Automated scraping, bulk extraction of content, and reproduction of photography or film without written permission are not permitted.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            `All site design, text, photography, plans and film are owned by or licensed to ${agent.brokerage} and are protected by copyright. Third-party marks, including MLS® and REALTOR®, belong to their respective owners.`,
            `${site.brand} is the software system used to operate this presentation.`,
          ],
        },
        {
          heading: 'Limitation of liability',
          body: [
            'To the extent permitted by law, the brokerage is not liable for indirect or consequential loss arising from use of this website or from reliance on information contained in it.',
          ],
        },
        {
          heading: 'Governing law',
          body: [
            'These terms are governed by the laws of the State of Florida, and the courts of that state have exclusive jurisdiction over any dispute arising from them.',
          ],
        },
      ]}
    />
  );
}
