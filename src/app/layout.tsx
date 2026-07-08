import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FDE Tracker — Wipro × Microsoft FDE Academy",
  description:
    "Cohort tracking & monitoring for the 16-week Microsoft AI Forward Deployed Engineer Academy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
