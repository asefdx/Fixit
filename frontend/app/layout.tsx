import type { Metadata } from "next";

import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "FixItNow | Your Trusted Home Service Platform",
  description: "Book trusted home service professionals with FixItNow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
