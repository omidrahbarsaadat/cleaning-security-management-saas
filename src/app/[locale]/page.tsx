import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { getLanguageTag, isLocale } from "@/i18n/config";

export default async function LocalizedHomePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = getDictionary(locale);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/10 pb-5">
        <Link href={`/${locale}`} className="font-semibold tracking-tight text-emerald-950">
          {text.productName}
        </Link>
        <nav aria-label={text.languageLabel} className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">{text.languageLabel}:</span>
          {(["de", "fa", "en"] as const).map((language) => (
            <Link
              key={language}
              href={`/${language}`}
              lang={getLanguageTag(language)}
              aria-current={locale === language ? "page" : undefined}
              className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-white aria-[current=page]:bg-white aria-[current=page]:font-semibold"
            >
              {text.languages[language]}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid flex-1 content-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">{text.eyebrow}</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-emerald-950 sm:text-6xl">
            {text.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{text.description}</p>
          <div className="mt-8 inline-flex rounded-full border border-amber-700/20 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-950">
            <span className="me-2 text-amber-700">{text.foundationLabel}:</span>{text.foundationStatus}
          </div>
        </div>

        <div className="grid gap-4">
          <article className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-900" aria-hidden="true">✳</div>
            <h2 className="text-xl font-semibold text-emerald-950">{text.cleaningModule}</h2>
            <p className="mt-2 leading-7 text-slate-600">{text.cleaningDescription}</p>
          </article>
          <article className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-800" aria-hidden="true">⬡</div>
            <h2 className="text-xl font-semibold text-emerald-950">{text.securityModule}</h2>
            <p className="mt-2 leading-7 text-slate-600">{text.securityDescription}</p>
          </article>
        </div>
      </section>
      <footer className="border-t border-emerald-950/10 py-5 text-sm text-slate-500">{text.productName}</footer>
    </main>
  );
}
