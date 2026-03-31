import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBR Bookshelf — 2026 Reading List",
  description: "My personal reading list and reviews for 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
