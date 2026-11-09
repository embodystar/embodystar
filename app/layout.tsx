import type { Metadata } from "next";
import "./globals.css";
import { landing } from "../lib/landing";

export const metadata: Metadata = {
  title: landing.title,
  description: landing.description,
  alternates: { canonical: "https://embodystar.com/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
