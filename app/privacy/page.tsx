import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "מדיניות פרטיות | Masia" };

export default function Page() {
  return <LegalPage doc="privacy" />;
}
