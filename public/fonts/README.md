# Fonts

Currently used:

- `ABCMonumentGroteskMono-Bold.otf` — registered in `src/styles/fonts.css`
  as the "Monument Grotesk Mono" family (weights 400–700), since it's the
  only true mono weight uploaded so far.

Present but **not** wired up:

- `ABCMonumentGrotesk-Regular.otf` — this is the non-mono sibling face
  (different letterforms, not fixed-width), so it isn't mapped to the
  "Monument Grotesk Mono" family. If you actually want it used somewhere,
  say so and it can be added as its own font-family.

To get real weight variation (regular vs. bold instead of one face doing
both), add `ABCMonumentGroteskMono-Regular.otf` / `-Medium.otf` here and a
matching `@font-face` block in `src/styles/fonts.css`.
