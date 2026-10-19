export interface Photo {
  id: string;
  /** Path under /public/photos — see that folder's README for how these get here. */
  src: string;
  alt: string;
}

/**
 * Kept sorted for easy maintenance (add/remove/spot-check filenames here).
 * The actual display order is shuffled below, so this list's order has no
 * effect on the grid itself.
 */
const filenames = [
  "theresa-schantz-001.jpg",
  "theresa-schantz-002.jpg",
  "theresa-schantz-003.jpg",
  "theresa-schantz-004.jpg",
  "theresa-schantz-005.jpg",
  "theresa-schantz-006.jpg",
  "theresa-schantz-007.jpg",
  "theresa-schantz-008.jpg",
  "theresa-schantz-009.jpg",
  "theresa-schantz-010.jpg",
  "theresa-schantz-011.jpg",
  "theresa-schantz-012.jpg",
  "theresa-schantz-013.jpg",
  "theresa-schantz-014.jpg",
  "theresa-schantz-015.jpg",
  "theresa-schantz-016.jpg",
  "theresa-schantz-017.jpg",
  "theresa-schantz-018.jpg",
  "theresa-schantz-019.jpg",
  "theresa-schantz-020.jpg",
  "theresa-schantz-021.jpg",
  "theresa-schantz-022.jpg",
  "theresa-schantz-023.jpg",
  "theresa-schantz-024.jpg",
  "theresa-schantz-025.jpg",
  "theresa-schantz-026.jpg",
  "theresa-schantz-027.jpg",
  "theresa-schantz-028.jpg",
  "theresa-schantz-029.jpg",
  "theresa-schantz-030.jpg",
  "theresa-schantz-031.jpg",
  "theresa-schantz-032.jpg",
  "theresa-schantz-033.jpg",
  "theresa-schantz-034.jpg",
  "theresa-schantz-035.jpg",
  "theresa-schantz-036.jpg",
  "theresa-schantz-037.jpg",
  "theresa-schantz-038.jpg",
  "theresa-schantz-039.jpg",
  "theresa-schantz-040.jpg",
  "theresa-schantz-041.jpg",
  "theresa-schantz-042.jpg",
  "theresa-schantz-043.jpg",
  "theresa-schantz-044.jpg",
  "theresa-schantz-045.jpg",
  "theresa-schantz-046.jpg",
  "theresa-schantz-047.jpg",
  "theresa-schantz-048.jpg",
  "theresa-schantz-049.jpg",
  "theresa-schantz-050.jpg",
  "theresa-schantz-051.jpg",
  "theresa-schantz-052.jpg",
  "theresa-schantz-053.jpg",
  "theresa-schantz-054.jpg",
  "theresa-schantz-055.jpg",
  "theresa-schantz-056.jpg",
  "theresa-schantz-057.jpg",
  "theresa-schantz-058.jpg",
  "theresa-schantz-059.jpg",
  "theresa-schantz-060.jpg",
  "theresa-schantz-061.jpg",
  "theresa-schantz-062.jpg",
  "theresa-schantz-063.jpg",
  "theresa-schantz-064.jpg",
  "theresa-schantz-065.jpg",
  "theresa-schantz-066.jpg",
  "theresa-schantz-067.jpg",
  "theresa-schantz-068.jpg",
  "theresa-schantz-069.jpg",
  "theresa-schantz-070.jpg",
  "theresa-schantz-071.jpg",
  "theresa-schantz-072.jpg",
  "theresa-schantz-073.jpg",
];

/**
 * Small seeded PRNG (mulberry32) so the shuffle below is reproducible —
 * same diverse order on every load/build, rather than re-shuffling (and
 * visibly jumping around) on every page refresh. Change SHUFFLE_SEED to
 * get a different fixed arrangement.
 */
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const SHUFFLE_SEED = 20260913;

/**
 * Photos for the home page drag-grid, sourced from `public/photos/`
 * (web-optimized copies — the full-resolution originals you uploaded live
 * untouched in `photos-originals/` at the project root, outside of
 * `public/`, so they aren't shipped in the production build).
 *
 * The display order is shuffled (see above) rather than following the
 * filenames list, so photos taken back-to-back don't cluster together in
 * the repeating grid block — it reads as a more varied mix. Add or remove
 * filenames above to change what shows; reorder there does nothing.
 * Any tile whose image fails to load falls back to a placeholder frame.
 */
export const photos: Photo[] = shuffle(filenames, SHUFFLE_SEED).map((filename, index) => ({
  id: String(index + 1).padStart(2, "0"),
  src: `/photos/${filename}`,
  alt: `Photo ${index + 1}`,
}));
