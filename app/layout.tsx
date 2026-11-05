import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmbodyStar — The Embodied AI Hub",
  description: "Discover the models, datasets, simulators, research, and tools bringing embodied AI to life. Explore and build your personal resource collection with EmbodyStar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
