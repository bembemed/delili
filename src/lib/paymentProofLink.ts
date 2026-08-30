import { createHmac, timingSafeEqual } from "crypto";

/** Signs a user id so the payment-screenshot image route can be fetched
 * by an external service (WasenderAPI) without exposing every candidate's
 * screenshot at a guessable URL. */
function sign(userId: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set in the environment.");
  return createHmac("sha256", secret).update(userId).digest("hex");
}

export function verifyPaymentProofSignature(userId: string, sig: string): boolean {
  let expected: string;
  try {
    expected = sign(userId);
  } catch {
    return false;
  }
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Builds the full public URL for a candidate's payment screenshot, for use
 * in outbound WhatsApp notifications only. */
export function buildPaymentProofImageUrl(userId: string): string {
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  if (process.env.NODE_ENV === "production" && siteUrl.includes("localhost")) {
    console.error(
      "SITE_URL is unset or still localhost in production — WasenderAPI won't be able to fetch this image."
    );
  }
  const sig = sign(userId);
  return `${siteUrl}/api/payment-proof/image?userId=${encodeURIComponent(userId)}&sig=${sig}`;
}
