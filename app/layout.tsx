import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmbodyStar | Robot Kits & Components",
  description: "Browse robot kits, compare component specifications, and save products at EmbodyStar. A demo shop with a persistent shopping bag and demo checkout.",
  alternates: { canonical: "https://embodystar.com/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
