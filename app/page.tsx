import type { Metadata } from 'next';
import { Hero } from '@/components/hero/Hero';
import { Introduction } from '@/components/property/Introduction';
import { Statistics } from '@/components/property/Statistics';
import { ArchitectureStory } from '@/components/property/ArchitectureStory';
import { SignatureSpaces } from '@/components/property/SignatureSpaces';
import { Amenities } from '@/components/property/Amenities';
import { Gallery } from '@/components/gallery/Gallery';
import { FloorPlanExplorer } from '@/components/floor-plan/FloorPlanExplorer';
import { LocationSection } from '@/components/location/LocationSection';
import { PropertyFilm } from '@/components/film/PropertyFilm';
import { AgentSection } from '@/components/agent/AgentSection';
import { LeadConversion } from '@/components/lead-form/LeadConversion';
import { ContactPanel } from '@/components/lead-form/ContactPanel';

/**
 * Title, description, canonical, Open Graph and Twitter metadata are declared
 * once in app/layout.tsx. Nothing is redeclared here, so the OG image and
 * Twitter card cannot be dropped by a nested override.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * LUXURY LEAD MACHINE — single-property digital showroom.
 *
 * Attention → Desire → Discovery → Trust → Action, in that order:
 *   01 Hero ........... attention
 *   02 Introduction ... desire
 *   03 Statistics ..... substance
 *   04 Architecture ... story
 *   05 Spaces ......... discovery
 *   06 Gallery ........ immersion
 *   —- Amenities ...... substance
 *   07 Floor plan ..... understanding
 *   08 Location ....... context
 *   09 Film ........... immersion
 *   10 Advisor ........ trust
 *   11 Showing ........ action
 *   12 Contact ........ action (direct)
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Statistics />
      <ArchitectureStory />
      <SignatureSpaces />
      <Gallery />
      <Amenities />
      <FloorPlanExplorer />
      <LocationSection />
      <PropertyFilm />
      <AgentSection />
      <LeadConversion />
      <ContactPanel />
    </>
  );
}
