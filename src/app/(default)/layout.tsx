import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Cleaning & Security Management",
  description: "Operations platform for cleaning and security service companies.",
};

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
