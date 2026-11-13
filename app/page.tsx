import { Top } from "@/components/Top";
import { WhyMasia } from "@/components/WhyMasia";
import { Destinations, Services, Faq, Contact, Footer } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";

import { BackToTop } from "@/components/BackToTop";
import { AnchorScroll } from "@/components/AnchorScroll";
import { VisaCheck } from "@/components/VisaCheck";
import { Jewish } from "@/components/Jewish";
import { Reviews } from "@/components/Reviews";
import { About } from "@/components/About";
import { InstaFeed } from "@/components/InstaFeed";
import { SITE_URL, SOCIAL } from "@/lib/config";

// Tells search engines this is a travel agency (name, logo, area, social profile).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Masia",
  alternateName: "Masia Global Journey",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/masia-logo.jpg`,
  image: `${SITE_URL}/img/hero-phiphi-poster.jpg`,
  description: "Certified travel agency for Asia and Europe: flights, hotels, transfers, tours, honeymoons and kosher / Jewish-heritage trips in one plan.",
  areaServed: ["Thailand", "Japan", "Maldives", "Indonesia", "Sri Lanka", "Vietnam", "Singapore", "France", "Italy", "Czechia", "Netherlands", "Switzerland", "Greece"],
  sameAs: Object.values(SOCIAL).filter(Boolean),
};

export default function Home() {
  return (
    <main>
      <Top />
      <Destinations />
      <Services />
      <WhyMasia />
      <Jewish />
      <About />
      <VisaCheck />
      <InstaFeed />
      <Faq />
      <Reviews />
      <Contact />
      <Footer />
      <Reveal />
      <BackToTop />
      <AnchorScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
