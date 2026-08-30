import { prisma } from "@/lib/prisma";

export async function getSubscriptionStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true },
  });
  return user?.subscriptionStatus as "AWAITING_PROOF" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | undefined;
}
