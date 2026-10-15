import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPrincipal } from "@/server/auth/session";
import { getDatabase } from "@/server/db";
import { listServiceSites } from "@/server/sites/service";
import { resolveTenantContext, TenantAccessError, type TenantContext } from "@/server/tenant/context";
import { createPrismaMembershipRepository } from "@/server/tenant/prisma-membership-repository";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function OrganizationHomePage({
  params,
}: Readonly<{ params: Promise<{ locale: string; orgSlug: string }> }>) {
  const { locale, orgSlug } = await params;
  if (!isLocale(locale)) notFound();
  const text = getDictionary(locale);

  const principal = await getPrincipal();
  if (!principal) {
    redirect(`/${locale}/sign-in?next=${encodeURIComponent(`/${locale}/org/${orgSlug}`)}`);
  }

  const db = getDatabase();
  let context: TenantContext;
  try {
    context = await resolveTenantContext(principal, orgSlug, createPrismaMembershipRepository(db));
  } catch (error) {
    if (error instanceof TenantAccessError && error.code === "NOT_FOUND") notFound();
    if (error instanceof TenantAccessError && error.code === "FORBIDDEN") {
      return (
        <main className="mx-auto max-w-3xl px-5 py-10">
          <p role="alert">{text.org.noAccess}</p>
        </main>
      );
    }
    throw error;
  }

  const organization = await db.organization.findUniqueOrThrow({
    where: { id: context.organizationId },
    select: { name: true },
  });
  const sites = context.permissions.has("sites:read") ? await listServiceSites(context, db) : null;

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
      <header className="flex items-center justify-between gap-4 border-b border-emerald-950/10 pb-5">
        <h1 className="text-2xl font-semibold text-emerald-950">{organization.name}</h1>
        <SignOutButton label={text.auth.signOut} redirectTo={`/${locale}/sign-in`} />
      </header>
      <section className="py-8">
        <h2 className="mb-4 text-lg font-semibold text-emerald-950">{text.org.sites}</h2>
        {sites === null ? (
          <p>{text.org.noSitePermission}</p>
        ) : sites.length === 0 ? (
          <p>{text.org.noSites}</p>
        ) : (
          <ul className="grid gap-3">
            {sites.map((site) => (
              <li key={site.id} className="rounded-2xl border border-emerald-950/10 bg-white p-4">
                <span className="font-medium">{site.name}</span>
                {site.city && <span className="ms-2 text-slate-500">{site.city}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
