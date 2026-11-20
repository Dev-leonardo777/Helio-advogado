import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Hero } from "@/components/sections/hero";
import { PracticeAreas } from "@/components/sections/practice-areas";
import { About } from "@/components/sections/about";
import { Team } from "@/components/sections/team";
import { Differentials } from "@/components/sections/differentials";
import { Contact } from "@/components/sections/contact";
import { contactAreas } from "@/lib/contact-validation";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ area?: string | string[] }> }) {
  const { area } = await searchParams;
  const initialArea = typeof area === "string" && Object.hasOwn(contactAreas, area) ? area : "";
  return <><Header /><main id="conteudo"><Hero /><PracticeAreas /><About /><Team /><Differentials /><Contact key={initialArea} initialArea={initialArea} /></main><Footer /><WhatsAppLink /></>;
}
