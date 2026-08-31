import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import RegistrationWizard from "@/components/RegistrationWizard";
import Logo from "@/components/Logo";
import type { Locale } from "@/i18n/routing";

// Exams and payment channels are admin-editable and this page has no
// request-time API (no auth() call) to otherwise force fresh rendering —
// without this, Next.js prerenders it once at build time and new payment
// channels added via the admin panel never show up until the next deploy.
export const dynamic = "force-dynamic";

export default async function InscriptionPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.register");

  const [exams, channels] = await Promise.all([
    prisma.quiz.findMany({
      select: {
        id: true,
        slug: true,
        ministereFr: true,
        ministereAr: true,
        corpsFr: true,
        corpsAr: true,
      },
      orderBy: [{ ministere: "asc" }, { corpsFr: "asc" }],
    }),
    prisma.paymentChannel.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Logo className="animate-seal-pop mx-auto mb-6 h-14 w-14" />
      <h1 className="font-display animate-fade-in-up stagger-1 mb-6 text-center text-2xl font-semibold text-forest-950">
        {t("title")}
      </h1>
      <div className="card animate-fade-in-up stagger-2 p-6 sm:p-7">
        <RegistrationWizard exams={exams} channels={channels} />
      </div>
    </div>
  );
}
