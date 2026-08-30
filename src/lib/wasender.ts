const WASENDER_SEND_URL = "https://www.wasenderapi.com/api/send-message";

/** Converts a Mauritanian local number (e.g. "36954983") or one already
 * carrying the 222 country code into E.164 format (e.g. "+22236954983"). */
export function toE164Mauritania(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("222") ? `+${digits}` : `+222${digits}`;
}

type SendResult = { ok: true } | { ok: false; error: string };

async function send(payload: { to: string; text: string; imageUrl?: string }): Promise<SendResult> {
  const apiKey = process.env.WASENDER_API_KEY;
  if (!apiKey) {
    console.error("WASENDER_API_KEY is not configured — skipping WhatsApp notification.");
    return { ok: false, error: "WASENDER_API_KEY not configured" };
  }

  try {
    const res = await fetch(WASENDER_SEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("WasenderAPI request failed:", res.status, body);
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("WasenderAPI request errored:", err);
    return { ok: false, error: String(err) };
  }
}

export function sendWhatsAppText(to: string, text: string) {
  return send({ to, text });
}

export function sendWhatsAppImage(to: string, imageUrl: string, caption: string) {
  return send({ to, text: caption, imageUrl });
}
