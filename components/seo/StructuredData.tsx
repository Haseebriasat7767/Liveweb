import { buildListingSchema, buildOrganizationSchema, buildWebsiteSchema } from '@/lib/structuredData';

/**
 * Structured data for the listing, the brokerage and the site.
 * Rendered as JSON-LD so search engines can read the property properly.
 */
export function StructuredData() {
  const schemas = [buildListingSchema(), buildOrganizationSchema(), buildWebsiteSchema()];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // The payload is built from local configuration only — no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
