import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { safeNextPath } from "@/lib/safe-redirect";
import { AuthForm } from "./auth-form";

export default async function SignInPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string | string[] }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { next } = await searchParams;
  const text = getDictionary(locale);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
        <AuthForm text={text.auth} next={safeNextPath(typeof next === "string" ? next : null, locale)} />
      </div>
    </main>
  );
}
