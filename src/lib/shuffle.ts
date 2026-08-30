/** Returns up to `count` items from `items`, chosen uniformly at random
 * without replacement, in random order. If `items.length <= count`, every
 * item is returned (shuffled). */
export function sampleRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
