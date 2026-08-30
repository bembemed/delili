"use client";

import { useTranslations } from "next-intl";

const ADMIN_WHATSAPP_NUMBER = "22241734317";

export default function WhatsAppButton() {
  const t = useTranslations("whatsapp");

  return (
    <a
      href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("contact")}
      title={t("contact")}
      className="animate-fade-in-up fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7" aria-hidden>
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.362.687 4.564 1.875 6.417L4 29l7.77-1.84A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.354l-.355-.21-4.61 1.093 1.12-4.49-.232-.368A9.71 9.71 0 0 1 5.25 15c0-5.93 4.824-10.75 10.754-10.75S26.758 9.07 26.758 15 21.934 24.75 16.004 24.75Zm5.6-7.98c-.307-.154-1.816-.896-2.098-.998-.281-.103-.486-.154-.69.154-.204.307-.79.998-.968 1.203-.178.204-.357.23-.664.077-.307-.154-1.296-.478-2.469-1.523-.913-.814-1.529-1.82-1.708-2.127-.178-.307-.019-.473.135-.626.138-.138.307-.358.46-.537.154-.178.205-.307.307-.512.103-.204.052-.384-.026-.537-.077-.154-.69-1.663-.946-2.278-.249-.598-.502-.517-.69-.527l-.588-.01c-.204 0-.537.077-.818.384-.281.307-1.073 1.05-1.073 2.559 0 1.51 1.099 2.968 1.252 3.172.153.204 2.163 3.303 5.24 4.632.732.316 1.303.505 1.749.646.735.234 1.404.201 1.933.122.59-.088 1.816-.743 2.072-1.46.256-.717.256-1.332.179-1.46-.077-.128-.281-.204-.588-.358Z" />
      </svg>
    </a>
  );
}
