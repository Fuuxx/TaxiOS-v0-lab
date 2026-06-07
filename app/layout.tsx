import "../styles/taxios-ui-entry.css";
import "../styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TaxiOS v0 Lab",
  description: "Standalone TaxiOS Company Dashboard reconstruction lab for v0."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="taxios-premium antialiased">{children}</body>
    </html>
  );
}
