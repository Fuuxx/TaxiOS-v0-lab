import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxiOS v0 Registry",
  description: "TaxiOS custom registry for v0 components, blocks, tokens, and workspace UI patterns."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="taxios-premium">{children}</body>
    </html>
  );
}
