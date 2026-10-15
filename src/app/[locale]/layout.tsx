import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDirection, getLanguageTag, isLocale } from "@/i18n/config";
import "../globals.css";

export const metadata: Metadata = {
  title: "Cleaning & Security Management",
  description: "Operations platform for cleaning and security service companies.",
};

export function generateStaticParams() {
  return ["de", "fa", "en"].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={getLanguageTag(locale)} dir={getDirection(locale)}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
