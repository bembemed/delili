/** The Delili seal mark, redrawn as plain SVG (no Tailwind classes) for use
 * inside `ImageResponse` (next/og), which renders via Satori and can't read
 * CSS classes — every icon route needs explicit width/height/fill instead. */
export function BrandSeal({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#0b3d2c" stroke="#cba53e" strokeWidth="1.6" />
      <path d="M24 9 L27.6 20.4 L39 24 L27.6 27.6 L24 39 L20.4 27.6 L9 24 L20.4 20.4 Z" fill="#cba53e" />
      <path
        d="M35.5 7.5 L37 11 L40.5 12.5 L37 14 L35.5 17.5 L34 14 L30.5 12.5 L34 11 Z"
        fill="#fbf9f2"
        opacity="0.92"
      />
    </svg>
  );
}
