"use client";

import { useEffect, useState } from "react";

export default function TypewriterText({
  text,
  className,
  speed = 35,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCount(text.length);
      return;
    }

    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <span className="animate-blink ms-0.5 inline-block" aria-hidden="true">
        |
      </span>
    </span>
  );
}
