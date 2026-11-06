import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmbodyStar — Robot Kits, Components & Curious Possibilities",
  description: "Find your next build. Explore EmbodyStar's demo collection of robot kits, clever components, and maker accessories. Browse products, save your favorites, and try the demo shopping bag.",
  alternates: { canonical: "https://embodystar.com/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
