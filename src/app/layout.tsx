import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Microsoft AI FDE Program Portal",
  description:
    "Learning, labs, quizzes, and cohort tracking for the 16-week Microsoft AI FDE Program.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
