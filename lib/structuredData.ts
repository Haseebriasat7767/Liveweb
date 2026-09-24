/**
 * SEO — structured data.
 * RealEstateListing wrapping a SingleFamilyResidence, plus the brokerage and
 * the advisor, described strictly from configuration.
 */

import { property, agent, contact, site, floorPlans } from '@/data';

export function buildListingSchema() {
  const url = site.url;
  const address = property.address;

  const floorSize = floorPlans
    .filter((level) => level.id !== 'site')
    .reduce((total, level) => {
      const match = level.totalArea.match(/[\d,]+/);
      return total + (match ? Number(match[0].replace(/,/g, '')) : 0);
    }, 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${property.listingTitle} — ${property.name}`,
    description: property.seo.description,
    url,
    datePosted: '2026-01-15',
    image: [`${url}${property.hero.imageSrc}`],
    inLanguage: 'en-US',
    about: {
      '@type': 'SingleFamilyResidence',
      name: property.name,
      description: property.introduction.statement,
      numberOfRooms: 12,
      numberOfBedrooms: 5,
      numberOfBathroomsTotal: 7,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: floorSize || 8450,
        unitCode: 'FTK',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.line1,
        addressLocality: 'Palm Coast',
        addressRegion: address.region,
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: address.latitude,
        longitude: address.longitude,
      },
      amenityFeature: property.amenities.groups.flatMap((group) =>
        group.items.slice(0, 3).map((item) => ({
          '@type': 'LocationFeatureSpecification',
          name: item,
          value: true,
        })),
      ),
    },
    offers: {
      '@type': 'Offer',
      price: 8900000,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: agent.name,
        jobTitle: agent.title,
        telephone: contact.phone.label,
        email: contact.email.label,
        worksFor: {
          '@type': 'RealEstateAgent',
          name: agent.brokerage,
        },
      },
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agent.brokerage,
    url: site.url,
    description: `${agent.brokerage} — ${agent.positioning}`,
    telephone: contact.phone.label,
    email: contact.email.label,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.office.address[0],
      addressLocality: 'Palm Beach',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: site.market,
    employee: {
      '@type': 'Person',
      name: agent.name,
      jobTitle: agent.title,
      knowsLanguage: [...agent.languages],
    },
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${property.listingTitle} — ${property.name}`,
    url: site.url,
    publisher: { '@type': 'Organization', name: agent.brokerage },
    inLanguage: 'en-US',
  };
}
