import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import RegisterForm from "@/components/RegisterForm";
import Logo from "@/components/Logo";
import type { Locale } from "@/i18n/routing";

export default async function InscriptionPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.register");

  const exams = await prisma.quiz.findMany({
    select: {
      id: true,
      slug: true,
      ministereFr: true,
      ministereAr: true,
      corpsFr: true,
      corpsAr: true,
    },
    orderBy: [{ ministere: "asc" }, { corpsFr: "asc" }],
  });

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Logo className="animate-seal-pop mx-auto mb-6 h-14 w-14" />
      <h1 className="font-display animate-fade-in-up stagger-1 mb-6 text-center text-2xl font-semibold text-forest-950">
        {t("title")}
      </h1>
      <div className="card animate-fade-in-up stagger-2 p-6 sm:p-7">
        <RegisterForm exams={exams} />
      </div>
    </div>
  );
}
