import PaymentChannelBadge from "./PaymentChannelBadge";

export type PaymentChannelDisplay = { id: string; name: string; phone: string; logo: string | null };

export default function PaymentChannelsList({
  channels,
  noChannelsLabel,
}: {
  channels: PaymentChannelDisplay[];
  noChannelsLabel: string;
}) {
  if (channels.length === 0) {
    return <p className="text-sm text-ink-soft">{noChannelsLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {channels.map((c, i) => (
        <li
          key={c.id}
          style={{ animationDelay: `${0.3 + i * 0.06}s` }}
          className="animate-fade-in-up flex items-center justify-between gap-3 rounded-lg bg-sand px-4 py-3"
        >
          <span className="flex items-center gap-3">
            <PaymentChannelBadge name={c.name} logo={c.logo} className="h-9 w-9" />
            <span className="font-medium text-ink">{c.name}</span>
          </span>
          <span className="font-mono text-sm text-forest-800" dir="ltr">
            {c.phone}
          </span>
        </li>
      ))}
    </ul>
  );
}
