import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/navigation";
import PaymentUploadForm from "@/components/PaymentUploadForm";
import Logo from "@/components/Logo";
import PricingCard from "@/components/PricingCard";
import PaymentChannelsList from "@/components/PaymentChannelsList";
import type { Locale } from "@/i18n/routing";

export default async function PaiementPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("payment");

  const session = await auth();
  const userId = session!.user.id;

  const [user, channels] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, rejectionReason: true },
    }),
    prisma.paymentChannel.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!user) {
    redirect({ href: "/connexion", locale });
    return;
  }

  if (user.subscriptionStatus === "APPROVED") {
    redirect({ href: "/tableau-de-bord", locale });
    return;
  }

  const canUpload = user.subscriptionStatus === "AWAITING_PROOF" || user.subscriptionStatus === "REJECTED";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Logo className="animate-seal-pop mx-auto mb-6 h-14 w-14" />
      <h1 className="font-display animate-fade-in-up stagger-1 mb-2 text-center text-2xl font-semibold text-forest-950">
        {t("title")}
      </h1>
      <p className="animate-fade-in-up stagger-2 mb-8 text-center text-ink-soft">{t("instructionsIntro")}</p>

      <div className="animate-fade-in-up stagger-2 mb-6">
        <PricingCard />
      </div>

      {user.subscriptionStatus === "PENDING_REVIEW" && (
        <div className="card animate-fade-in-up mb-6 border-t-2 border-t-gold-500 p-6 text-center">
          <p className="font-medium text-forest-800">{t("statusPendingReview")}</p>
        </div>
      )}

      {user.subscriptionStatus === "REJECTED" && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-red-300 bg-red-50 p-5">
          <p className="mb-1 font-medium text-red-800">{t("statusRejected")}</p>
          {user.rejectionReason && (
            <p className="text-sm text-red-700">
              {t("rejectionReasonLabel")} {user.rejectionReason}
            </p>
          )}
        </div>
      )}

      <div className="card animate-fade-in-up stagger-3 mb-6 p-6">
        <h2 className="font-display mb-4 text-lg font-semibold text-forest-950">{t("channelsTitle")}</h2>
        <PaymentChannelsList channels={channels} noChannelsLabel={t("noChannels")} />
      </div>

      {canUpload && (
        <div className="card animate-fade-in-up stagger-4 p-6">
          <PaymentUploadForm />
        </div>
      )}
    </div>
  );
}
