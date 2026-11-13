import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LangProvider } from "@/lib/lang";
import { A11yMenu } from "@/components/A11yMenu";
import { SHOW_A11Y_MENU } from "@/lib/config";
import { SITE_URL } from "@/lib/config";
export const metadata: Metadata = {
  title: "Masia | הטיול הבא שלכם מתחיל כאן",
  description: "Masia Global Journey: סוכנות נסיעות המתמחה באסיה ובאירופה: תאילנד, יפן, המלדיביים, פריז, רומא, פראג ועוד, כולל טיולים כשרים וטיולי מורשת יהודית. טיסות, מלונות והסעות בתוכנית אחת ברורה.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Masia | Global Journey",
    description: "Certified travel agency for Asia & Europe: flights, hotels, transfers, tours and kosher trips in one clear plan.",
    url: SITE_URL,
    siteName: "Masia",
    type: "website",
    locale: "he_IL",
    images: [{ url: "/img/hero-phiphi-poster.jpg", width: 1920, height: 1080, alt: "Phi Phi Islands, Thailand" }],
  },
  twitter: { card: "summary_large_image", images: ["/img/hero-phiphi-poster.jpg"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#051127" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Saved language (cookie) is read on the server so the page renders in it directly on refresh.
  const saved = (await cookies()).get("tv")?.value;
  const lang = saved === "en" || saved === "ar" || saved === "he" ? saved : "he";
  return (
    <html lang={lang} dir={lang === "en" ? "ltr" : "rtl"}>
      <body>
        <LangProvider initial={lang} fromCookie={!!saved}>{children}{SHOW_A11Y_MENU && <A11yMenu />}</LangProvider>
      </body>
    </html>
  );
}
