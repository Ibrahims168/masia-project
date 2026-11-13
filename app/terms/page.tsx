import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "תנאי שימוש | Masia" };

export default function Page() {
  return <LegalPage doc="terms" />;
}
