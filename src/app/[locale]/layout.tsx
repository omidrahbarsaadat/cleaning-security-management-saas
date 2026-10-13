import { notFound } from "next/navigation";
import { getDirection, isLocale } from "@/i18n/config";

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
    <div lang={locale} dir={getDirection(locale)} className="min-h-screen">
      {children}
    </div>
  );
}
