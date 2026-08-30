import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] ?? routing.defaultLocale;
  const pathWithoutLocale = pathname.slice(localeMatch?.[0].length ?? 0) || "/";

  const isProtected =
    pathWithoutLocale.startsWith("/tableau-de-bord") ||
    pathWithoutLocale.startsWith("/paiement") ||
    (pathWithoutLocale.startsWith("/quiz/") && pathWithoutLocale !== "/quiz/");

  if (isProtected && !req.auth) {
    const url = new URL(`/${locale}/connexion`, req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
