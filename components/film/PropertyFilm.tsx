'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { property, galleryImages } from '@/data';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { cn } from '@/lib/utils';
import { useOnceInView } from '@/lib/hooks';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;
const CHAPTER_SECONDS = 6;

type FilmChapter = { src: string; alt: string; caption: string; chapter: string };

const chapters: FilmChapter[] = galleryImages.slice(0, 8).map((image) => ({
  src: image.src,
  alt: image.alt,
  caption: image.caption,
  chapter: image.chapter,
}));

/**
 * 09 — PROPERTY FILM
 * Plays a real film file when the client supplies one; otherwise runs the
 * still sequence so the section is never an empty frame. Same controls either
 * way: play, pause, mute, fullscreen, progress.
 */
export function PropertyFilm() {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const hasVideo = Boolean(property.film.videoSrc);
  const sectionRef = useOnceInView<HTMLElement>(() => track('section_view', { section: 'film' }));

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ----------------------------------------------------------- still sequence */
  useEffect(() => {
    if (hasVideo || !playing) return;

    const step = 100;
    const id = window.setInterval(() => {
      setElapsed((previous) => {
        const next = previous + step / 1000;
        const total = chapters.length * CHAPTER_SECONDS;
        if (next >= total) {
          setChapter(0);
          return 0;
        }
        const current = Math.min(Math.floor(next / CHAPTER_SECONDS), chapters.length - 1);
        setChapter(current);
        setProgress(next / total);
        if (current !== chapter) track('video_progress', { chapter: current + 1 });
        return next;
      });
    }, step);

    timerRef.current = id;
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, playing]);

  /* -------------------------------------------------------- video listeners */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
        setDuration(video.duration);
      }
    };
    const onEnded = () => setPlaying(false);

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('loadedmetadata', onTime);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('loadedmetadata', onTime);
      video.removeEventListener('ended', onEnded);
    };
  }, [started]);

  const start = useCallback(() => {
    setStarted(true);
    setPlaying(true);
    track('video_play', { mode: hasVideo ? 'video' : 'stills' });

    if (hasVideo) {
      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = muted;
        void video.play().catch(() => setPlaying(false));
      });
    }
  }, [hasVideo, muted]);

  const toggle = useCallback(() => {
    if (hasVideo) {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        void video.play().catch(() => setPlaying(false));
        setPlaying(true);
        track('video_play', { mode: 'video' });
      } else {
        video.pause();
        setPlaying(false);
        track('video_pause', { mode: 'video' });
      }
      return;
    }
    setPlaying((previous) => {
      track(previous ? 'video_pause' : 'video_play', { mode: 'stills' });
      return !previous;
    });
  }, [hasVideo]);

  const toggleMute = useCallback(() => {
    setMuted((previous) => {
      const next = !previous;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }, []);

  const goFullscreen = useCallback(() => {
    const node = shellRef.current;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void node.requestFullscreen?.().catch(() => {});
  }, []);

  const displaySeconds = hasVideo
    ? Math.round((videoRef.current?.currentTime ?? 0) * 10) / 10
    : Math.round(elapsed);
  const displayDuration = hasVideo ? formatClock(duration) : property.film.durationLabel;

  // Declared as a function so it is hoisted above the timecode display above.
  function formatClock(seconds: number) {
    const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const mins = Math.floor(safe / 60);
    const secs = Math.floor(safe % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  const current = chapters[chapter];

  return (
    <section
      id="film"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-24 text-paper md:py-28 lg:py-32"
      aria-labelledby="film-heading"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-end lg:gap-20">
          <div>
            <Reveal variant="fade">
              <p className="label flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/60" />
                {property.film.eyebrow}
              </p>
            </Reveal>
            <h2 id="film-heading" className="display-lg mt-8 text-paper">
              <SplitLines text={property.film.heading} />
            </h2>
          </div>
          <Reveal delay={0.12}>
            <p className="body-lg max-w-md text-paper/60 lg:pb-4">{property.film.intro}</p>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------------------- player */}
      <Reveal variant="fade" delay={0.1} className="mt-14 md:mt-16">
        <div className="shell">
          <div
            ref={shellRef}
            className="group relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[16/9]"
          >
            {/* Video track */}
            {hasVideo && started && (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={property.film.videoSrc as string}
                poster={property.film.posterSrc}
                playsInline
                muted={muted}
                controls={false}
              />
            )}

            {/* Still sequence track */}
            {!hasVideo && (
              <>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={started ? current.src : 'poster'}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: reduced ? 1 : 1.05 }}
                    animate={{ opacity: 1, scale: playing && !reduced ? 1.11 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 1.6, ease: EASE },
                      scale: { duration: playing ? CHAPTER_SECONDS : 1.6, ease: 'linear' },
                    }}
                  >
                    <Image
                      src={started ? current.src : property.film.posterSrc}
                      alt={started ? current.alt : property.hero.imageAlt}
                      fill
                      sizes="100vw"
                      quality={86}
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </>
            )}

            {/* Overlay */}
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/35 transition-opacity duration-[1200ms]',
                started && playing ? 'opacity-70' : 'opacity-100',
              )}
            />

            {/* Poster state */}
            {!started && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <button
                  type="button"
                  onClick={start}
                  className="group/play flex h-20 w-20 items-center justify-center rounded-full border border-paper/35 backdrop-blur-sm transition-all duration-[900ms] ease-luxury hover:scale-105 hover:border-paper md:h-24 md:w-24"
                  aria-label={`Play property film — ${property.film.durationLabel}`}
                >
                  <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-paper" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </button>

                <p className="label mt-8 text-paper/60">{property.film.eyebrow}</p>
                <p className="mt-4 font-display text-[clamp(1.4rem,3vw,2.4rem)] leading-tight">
                  {property.film.ctaLabel}
                </p>
                <p className="label mt-4 text-[9px] text-paper/40">
                  {property.film.durationLabel} · Sound optional
                </p>
              </div>
            )}

            {/* Chapter caption */}
            {started && !hasVideo && (
              <div className="absolute left-5 top-5 md:left-8 md:top-8">
                <p className="label text-[9px] text-paper/50">{current.chapter}</p>
                <p className="mt-2 font-display text-lg text-paper/95 md:text-2xl">{current.caption}</p>
              </div>
            )}

            {/* Controls */}
            {started && (
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 md:px-8 md:pb-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-paper/25 text-paper transition-colors duration-500 hover:border-paper/70"
                    aria-label={playing ? 'Pause film' : 'Play film'}
                  >
                    {playing ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                        <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true">
                        <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                      </svg>
                    )}
                  </button>

                  {hasVideo && (
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="flex h-10 w-10 shrink-0 items-center justify-center border border-paper/25 text-paper transition-colors duration-500 hover:border-paper/70"
                      aria-label={muted ? 'Unmute film' : 'Mute film'}
                      aria-pressed={!muted}
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                        <path d="M4 9h3l4-3v12l-4-3H4z" />
                        {muted ? <path d="M15 9l4 6M19 9l-4 6" /> : <path d="M15 8.5a5 5 0 0 1 0 7M17.5 6a8 8 0 0 1 0 12" />}
                      </svg>
                    </button>
                  )}

                  {/* Progress */}
                  <div className="flex flex-1 items-center gap-3">
                    <span className="hidden shrink-0 text-[10px] tabular-nums tracking-[0.18em] text-paper/50 sm:block">
                      {formatClock(displaySeconds)}
                    </span>
                    <div
                      className="relative h-px flex-1 bg-paper/20"
                      role="progressbar"
                      aria-label="Film progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress * 100)}
                    >
                      <motion.span
                        className="absolute inset-y-0 left-0 block bg-brass"
                        animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                        transition={{ duration: 0.4, ease: 'linear' }}
                      />
                    </div>
                    <span className="hidden shrink-0 text-[10px] tabular-nums tracking-[0.18em] text-paper/50 sm:block">
                      {displayDuration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={goFullscreen}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-paper/25 text-paper transition-colors duration-500 hover:border-paper/70"
                    aria-label="View film fullscreen"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {!hasVideo && (
        <div className="shell relative mt-6">
          <p className="text-[10.5px] leading-relaxed text-paper/30">
            Demonstration mode: the film player is running the still sequence. Supply the client film
            at <span className="text-paper/50">/public/videos/property-film.mp4</span> and set{' '}
            <span className="text-paper/50">property.film.videoSrc</span> to play real footage — the
            controls, poster and analytics are already wired.
          </p>
        </div>
      )}
    </section>
  );
}
