import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "הצהרת נגישות | Masia" };

export default function Page() {
  return <LegalPage doc="accessibility" />;
}
