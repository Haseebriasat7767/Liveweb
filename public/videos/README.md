# /public/videos

Drop the client's film files here and point the configuration at them.

| File | Config | Effect |
|------|--------|--------|
| `hero.mp4` | `property.hero.videoSrc` in `data/property.ts` | Replaces the hero photograph with a muted, looping, autoplaying film |
| `property-film.mp4` | `property.film.videoSrc` in `data/property.ts` | Replaces the still sequence in **09 — Property Film** with real footage |

Recommendations for a luxury listing:

* **Hero:** 10–20 s, 1920×1080, H.264 (or H.265/WebM for smaller files), no audio track,
  under ~6 MB. The hero is the first paint — keep it light.
* **Property film:** 2–4 min, 1920×1080 or 2560×1440, audio normalised to −14 LUFS.
  Provide a poster frame at `public/images/hero.jpg` (or set `property.film.posterSrc`).
* Always keep the poster images: they are what the visitor sees before pressing play,
  and what loads on slow connections.

Both players already have play/pause, mute, fullscreen, progress and analytics wired —
swapping the source is all that is required. `.mp4`/`.webm` files in this folder are
git-ignored so client footage never lands in the repository; store the masters in the
agency's own media library.
