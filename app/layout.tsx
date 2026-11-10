import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
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
      <GoogleAnalytics gaId="G-H6KZW2BTXF" />
    </html>
  );
}
