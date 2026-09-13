# Photos

These are web-optimized copies (resized to a 2400px long edge, ~78% JPEG
quality via `sips`) of the photos you uploaded. The full-resolution
originals are kept untouched in `photos-originals/` at the project root —
outside `public/`, so they don't get bundled into the production build.

To change what's on the site, edit `src/data/photos.ts` (add/remove/reorder
entries — the array is generated from a filename list at the top of that
file). To swap in a different edit of an existing photo, replace the file
here with a similarly-sized copy, or re-run the same `sips` resize on a new
original.

Any tile whose image fails to load falls back automatically to a bordered
placeholder frame.
