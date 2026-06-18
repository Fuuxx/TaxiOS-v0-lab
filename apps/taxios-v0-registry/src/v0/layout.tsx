import type { ReactNode } from "react";
import "@taxios-v2/ui/styles/globals.css";

export const metadata = {
  title: "TaxiOS Lab",
  description: "TaxiOS v0 registry lab preview"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="taxios-premium">{children}</body>
    </html>
  );
}
