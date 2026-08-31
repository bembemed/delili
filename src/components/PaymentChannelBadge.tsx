function getInitials(name: string): string {
  const acronymMatch = name.match(/\(([A-Za-z]{2,6})\)\s*$/);
  if (acronymMatch) return acronymMatch[1].toUpperCase();
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return (words[0] ?? "").slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 42%)`;
}

export default function PaymentChannelBadge({
  name,
  logo,
  className = "h-10 w-10",
}: {
  name: string;
  logo?: string | null;
  className?: string;
}) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" className={`${className} shrink-0 rounded-full border border-line object-cover`} />;
  }
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white`}
      style={{ backgroundColor: colorFromName(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
