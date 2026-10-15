import { headers } from "next/headers";
import { getAuth } from "@/server/auth/auth";

export type Principal = { userId: string };

// Resolves the authenticated user from the session cookie on the server.
// Authorization for an organization is a separate step (resolveTenantContext).
export async function getPrincipal(): Promise<Principal | null> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session ? { userId: session.user.id } : null;
}
