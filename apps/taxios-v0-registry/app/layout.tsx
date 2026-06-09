import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THEME_NO_FLASH_SCRIPT } from "@taxios-v2/ui/components/taxios/theme/use-theme";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before hydration to avoid a light->dark flash. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }}
        />
      </head>
      <body className="taxios-premium">{children}</body>
    </html>
  );
}
