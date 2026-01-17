"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Map as LeafletMapInstance } from "leaflet";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import type { Layout, Layouts } from "react-grid-layout";
import LanguageToggle from "./components/language-toggle";
import { useLanguage } from "./providers";
import { cn } from "@/lib/cn";

const ResponsiveGridLayout = dynamic(
  async (): Promise<ComponentType<any>> => {
    const mod = await import("react-grid-layout");
    const grid = (mod as { default?: unknown }).default ?? mod;
    const Responsive =
      (grid as { Responsive?: unknown }).Responsive ??
      (mod as { Responsive?: unknown }).Responsive;
    const WidthProvider =
      (grid as { WidthProvider?: (component: unknown) => unknown })
        .WidthProvider ?? (mod as { WidthProvider?: (component: unknown) => unknown }).WidthProvider;
    const Component = WidthProvider ? WidthProvider(Responsive) : Responsive;
    return Component as ComponentType<any>;
  },
  { ssr: false, loading: () => null }
);

const LeafletMap = dynamic(() => import("./components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-3xl bg-gray-100 dark:bg-dark-800" />
  )
});

const BREAKPOINTS = {
  lg: 1199,
  md: 799,
  sm: 374,
  xs: 319,
  xxs: 0
} as const;

const ROW_HEIGHT = {
  lg: 280,
  md: 180,
  sm: 164,
  xs: 136,
  xxs: 132
} as const;

const COLS = {
  lg: 12,
  md: 8,
  sm: 2,
  xs: 2,
  xxs: 2
} as const;

const LAYOUTS: Layouts = {
  lg: [
    { i: "description", x: 0, y: 0, w: 6, h: 1 },
    { i: "location", x: 6, y: 0, w: 3, h: 1 },
    { i: "project", x: 9, y: 0, w: 3, h: 2 },
    { i: "spotify", x: 0, y: 1, w: 3, h: 1 },
    { i: "article", x: 3, y: 1, w: 6, h: 1 },
    { i: "theme", x: 0, y: 2, w: 3, h: 1 },
    { i: "linkedin", x: 3, y: 2, w: 3, h: 1 },
    { i: "contact", x: 6, y: 2, w: 6, h: 1 }
  ],
  md: [
    { i: "description", x: 0, y: 0, w: 4, h: 1 },
    { i: "location", x: 4, y: 0, w: 2, h: 1 },
    { i: "project", x: 6, y: 0, w: 2, h: 2 },
    { i: "spotify", x: 0, y: 1, w: 2, h: 1 },
    { i: "article", x: 2, y: 1, w: 4, h: 1 },
    { i: "theme", x: 0, y: 2, w: 2, h: 1 },
    { i: "linkedin", x: 2, y: 2, w: 2, h: 1 },
    { i: "contact", x: 4, y: 2, w: 4, h: 1 }
  ],
  sm: [
    { i: "description", x: 0, y: 0, w: 2, h: 2 },
    { i: "location", x: 0, y: 2, w: 2, h: 1 },
    { i: "linkedin", x: 0, y: 3, w: 1, h: 1 },
    { i: "project", x: 1, y: 3, w: 1, h: 2 },
    { i: "theme", x: 0, y: 4, w: 1, h: 1 },
    { i: "spotify", x: 0, y: 5, w: 2, h: 2 },
    { i: "article", x: 0, y: 7, w: 2, h: 2 },
    { i: "contact", x: 0, y: 9, w: 2, h: 2 }
  ],
  xs: [
    { i: "description", x: 0, y: 0, w: 2, h: 2 },
    { i: "location", x: 0, y: 2, w: 2, h: 1 },
    { i: "linkedin", x: 0, y: 3, w: 1, h: 1 },
    { i: "project", x: 1, y: 3, w: 1, h: 2 },
    { i: "theme", x: 0, y: 4, w: 1, h: 1 },
    { i: "spotify", x: 0, y: 5, w: 2, h: 2 },
    { i: "article", x: 0, y: 7, w: 2, h: 2 },
    { i: "contact", x: 0, y: 9, w: 2, h: 2 }
  ],
  xxs: [
    { i: "description", x: 0, y: 0, w: 2, h: 2 },
    { i: "location", x: 0, y: 2, w: 2, h: 1 },
    { i: "linkedin", x: 0, y: 3, w: 1, h: 1 },
    { i: "project", x: 1, y: 3, w: 1, h: 2 },
    { i: "theme", x: 0, y: 4, w: 1, h: 1 },
    { i: "spotify", x: 0, y: 5, w: 2, h: 2 },
    { i: "article", x: 0, y: 7, w: 2, h: 2 },
    { i: "contact", x: 0, y: 9, w: 2, h: 2 }
  ]
};

type Theme = "light" | "dark";
type Breakpoint = keyof typeof BREAKPOINTS;
const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[];

const GRID_UNITS: Record<Breakpoint, number> = {
  lg: 3,
  md: 2,
  sm: 1,
  xs: 1,
  xxs: 1
};

const MAP_CENTER: [number, number] = [-30.0346, -51.2306];
const MAP_ZOOM = 10.5;

const resolveBreakpoint = (width: number) =>
  breakpointKeys.find((key) => width >= BREAKPOINTS[key]) ?? "xxs";

const cloneLayouts = (layouts: Layouts) =>
  Object.fromEntries(
    Object.entries(layouts).map(([key, value]) => [
      key,
      value?.map((item) => ({ ...item })) ?? []
    ])
  ) as Layouts;

const clampLayoutsToGrid = (
  layouts: Layouts,
  breakpoint: Breakpoint
): Layouts => {
  const unit = GRID_UNITS[breakpoint] ?? 1;
  const cols = COLS[breakpoint];
  const maxRows =
    breakpoint === "lg" || breakpoint === "md" ? 4 : undefined;
  const next = cloneLayouts(layouts);

  next[breakpoint] = (next[breakpoint] ?? []).map((item) => {
    const maxX = Math.max(0, cols - item.w);
    let x = Math.round(item.x / unit) * unit;
    if (x > maxX) {
      x = Math.floor(maxX / unit) * unit;
    }
    x = Math.max(0, x);

    let y = item.y;
    if (maxRows !== undefined) {
      const maxY = Math.max(0, maxRows - item.h);
      y = Math.min(maxY, Math.max(0, y));
    }

    return {
      ...item,
      x,
      y
    };
  });

  return next;
};

type NowPlayingData = {
  title: string;
  artist: string;
  songUrl: string;
  albumImageUrl: string;
  isPlaying: boolean;
};

const nowPlayingFallback: NowPlayingData = {
  title: "Midnight City",
  artist: "M83",
  songUrl: "https://www.last.fm/",
  albumImageUrl: "/images/og-image.png",
  isPlaying: false
};

const COPY = {
  en: {
    headerTitle: "Seibel Portfolio",
    name: "Joao Pedro Petermann Seibel",
    introLead: "Hi, I'm",
    introBody:
      "a full-stack developer at RaioWeb, based in Porto Alegre, Brazil.",
    introMore:
      "I build and ship web products with Next.js/React, Supabase, and a bias for clean UX.",
    mapTitle: "Porto Alegre map",
    locationLabel: "Porto Alegre, RS",
    projectAlt: "Go to my projects",
    projectCta: "Go To My Projects",
    cvLabel: "Download CV",
    cvHref: "/CV.pdf",
    nowPlayingErrorTitle: "Failed to load",
    nowPlayingErrorBody: "Unable to load now playing",
    nowPlayingPlaying: "Now Playing",
    nowPlayingOffline: "Offline. Last Played",
    articleTitle: "How it's going?",
    articleExcerpt:
      "A short note about how I started building on the web and what keeps me curious today.",
    articleDate: "May 2, 2025",
    readMore: "Read More",
    contactTitle: "Have a project in mind?",
    contactBody:
      "If you have a project that you want to get started, think you need my help with something or just fancy saying hey, then get in touch.",
    contactCta: "Contact Me",
    contactCtaAria: "Send email"
  },
  pt: {
    headerTitle: "Seibel Portfolio",
    name: "Joao Pedro Petermann Seibel",
    introLead: "Oi, eu sou",
    introBody:
      "desenvolvedor full-stack na RaioWeb, em Porto Alegre, Brasil.",
    introMore:
      "Construo e entrego produtos web com Next.js/React, Supabase e foco em UX clara e confiável.",
    mapTitle: "Mapa de Porto Alegre",
    locationLabel: "Porto Alegre, RS",
    projectAlt: "Ir para meus projetos",
    projectCta: "Ver projetos",
    cvLabel: "Baixar CV",
    cvHref: "/CV.pdf",
    nowPlayingErrorTitle: "Nao foi possivel carregar",
    nowPlayingErrorBody: "Nao foi possivel carregar",
    nowPlayingPlaying: "Tocando agora",
    nowPlayingOffline: "Offline. Ultima tocada",
    articleTitle: "Como esta indo?",
    articleExcerpt:
      "Um resumo de como comecei a construir na web e o que me motiva hoje.",
    articleDate: "2 de maio de 2025",
    readMore: "Leia mais",
    contactTitle: "Quer tirar um projeto do papel?",
    contactBody:
      "Se voce tem um projeto que quer tirar do papel, precisa de ajuda em algo ou so quer dizer oi, me chama.",
    contactCta: "Fale comigo",
    contactCtaAria: "Enviar email"
  }
} as const;

export default function Home() {
  const { language } = useLanguage();
  const [languageReady, setLanguageReady] = useState(false);
  const t = COPY[languageReady ? language : "pt"];
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });
  const [layouts, setLayouts] = useState<Layouts>(() =>
    JSON.parse(JSON.stringify(LAYOUTS))
  );
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(() =>
    typeof window === "undefined" ? "lg" : resolveBreakpoint(window.innerWidth)
  );
  const [isGridLayout, setIsGridLayout] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.innerWidth >= BREAKPOINTS.md + 1;
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const suppressLayoutChangeRef = useRef(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [nowPlayingLoading, setNowPlayingLoading] = useState(true);
  const [nowPlayingError, setNowPlayingError] = useState(false);

  useEffect(() => {
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [currentBreakpoint, isGridLayout]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDragEnabled(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    const update = () =>
      setIsGridLayout(window.innerWidth >= BREAKPOINTS.md + 1);

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchNowPlaying = async () => {
      setNowPlayingLoading(true);
      try {
        const response = await fetch("/api/now-playing", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch now playing");
        }
        const data = (await response.json()) as NowPlayingData;
        if (!isActive) {
          return;
        }
        setNowPlaying(data);
        setNowPlayingError(false);
      } catch (error) {
        if (!isActive) {
          return;
        }
        setNowPlayingError(true);
      } finally {
        if (isActive) {
          setNowPlayingLoading(false);
        }
      }
    };

    fetchNowPlaying();
    const interval = window.setInterval(fetchNowPlaying, 30000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  const rowHeight = ROW_HEIGHT[currentBreakpoint] ?? ROW_HEIGHT.lg;
  const canDrag =
    isDragEnabled &&
    isGridLayout &&
    (currentBreakpoint === "lg" || currentBreakpoint === "md");
  const maxRows =
    currentBreakpoint === "lg" || currentBreakpoint === "md" ? 4 : undefined;
  const nowPlayingData = nowPlaying ?? nowPlayingFallback;
  const nowPlayingCover =
    nowPlaying?.albumImageUrl || nowPlayingFallback.albumImageUrl;
  const stackedCardClass = isGridLayout ? "" : "min-h-[220px]";
  const cardItems = [
    {
      key: "description",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn(
            "flex h-full flex-col justify-center gap-4 p-8",
            stackedCardClass
          )}
        >
          <div className="relative h-14 w-14 shrink-0 self-start overflow-hidden rounded-full md:h-[55px] md:w-[55px] md:min-h-[55px] md:min-w-[55px]">
            <Image
              src="https://avatars.githubusercontent.com/u/106558489?v=4"
              alt={t.name}
              fill
              className="h-full w-full rounded-full object-cover object-center"
              sizes="(min-width: 768px) 56px, 56px"
              priority
            />
          </div>
          <p className="leading-relaxed">
            {t.introLead}{" "}
            <span className="inline-block font-pixel text-base md:leading-[1.35] md:tracking-[0.02em]">
              {t.name}
            </span>
            ,{" "}
            {t.introBody}{" "}
            <span className="hidden md:inline">{t.introMore}</span>
          </p>
        </CardShell>
      )
    },
    {
      key: "location",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn("relative h-full overflow-hidden", stackedCardClass)}
        >
          <div className="absolute inset-0 h-full w-full">
            <LeafletMap
              className="h-full w-full pointer-events-none"
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              theme={theme}
              onReady={(map) => {
                mapRef.current = map;
                window.setTimeout(() => map.invalidateSize(), 0);
              }}
            />
            <div className="absolute bottom-2 left-3 text-[10px] text-black/60 dark:text-white/60">
              (c) OpenStreetMap (c) CARTO
            </div>
          </div>
        </CardShell>
      )
    },
    {
      key: "project",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn("relative h-full bg-red-100", stackedCardClass)}
        >
          <Image
            src="/images/project.png"
            alt={t.projectAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-3 left-3">
            <Link
              href="/projects"
              aria-label={t.projectAlt}
              className={cn(
                "cancel-drag group inline-flex items-center justify-center gap-3",
                "overflow-hidden whitespace-nowrap rounded-full bg-white",
                "px-4 py-2 ring-2 ring-gray-200/45 transition-all duration-300",
                "hover:ring-4 focus:outline-none focus:ring-4",
                "dark:text-black dark:ring-gray-200/30"
              )}
            >
              <ArrowIcon className="h-4 w-4 -rotate-45 text-black transition-transform duration-300 group-hover:rotate-0" />
              {t.projectCta}
            </Link>
          </div>
        </CardShell>
      )
    },
    {
      key: "spotify",
      node: (
          <CardShell
          isDraggable={canDrag}
          className={cn(
            "flex h-full flex-col justify-end gap-3 bg-cover",
            stackedCardClass
          )}
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95)), url(${nowPlayingCover})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        >
          {nowPlayingLoading ? (
            <div className="flex flex-col gap-3 px-8">
              <div className="h-6 rounded-md bg-dark-300 animate-pulse" />
              <div className="h-4 rounded-md bg-dark-300 animate-pulse" />
            </div>
          ) : nowPlayingError ? (
            <div className="flex flex-col gap-3 px-8 text-dark-50">
              <h2 className="font-pixel text-lg md:leading-[1.4] md:tracking-[0.02em]">
                {t.nowPlayingErrorTitle}
              </h2>
              <p className="font-medium">{t.nowPlayingErrorBody}</p>
            </div>
          ) : (
            <div className="px-8 text-dark-50">
              <h2
                className="line-clamp-2 font-pixel text-lg md:leading-[1.4] md:tracking-[0.02em] md:line-clamp-1 lg:line-clamp-2"
                title={nowPlayingData.title}
              >
                <a
                  href={nowPlayingData.songUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="cancel-drag"
                >
                  {nowPlayingData.title}
                </a>
              </h2>
              <p className="truncate font-medium" title={nowPlayingData.artist}>
                {nowPlayingData.artist}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 border-t border-dark-50 bg-white px-8 py-2 text-dark-400 dark:border-dark-800 dark:bg-dark-900">
            {nowPlayingData.isPlaying && (
              <div className="inline-flex items-center justify-center gap-1">
                <span
                  className="block w-1 rounded-full bg-[#1DB954]"
                  style={{ animation: "playing 0.85s ease infinite" }}
                />
                <span
                  className="block w-1 rounded-full bg-[#1DB954]"
                  style={{ animation: "playing 0.62s ease infinite" }}
                />
                <span
                  className="block w-1 rounded-full bg-[#1DB954]"
                  style={{ animation: "playing 1.26s ease infinite" }}
                />
                <span
                  className="block w-1 rounded-full bg-[#1DB954]"
                  style={{ animation: "playing 0.85s ease infinite" }}
                />
                <span
                  className="block w-1 rounded-full bg-[#1DB954]"
                  style={{ animation: "playing 0.49s ease infinite" }}
                />
                <span
                  className="block w-1 rounded-full bg-[#1DB954]"
                  style={{ animation: "playing 1.26s ease infinite" }}
                />
              </div>
            )}
            <p className="text-sm">
              {nowPlayingData.isPlaying
                ? t.nowPlayingPlaying
                : t.nowPlayingOffline}
            </p>
          </div>
        </CardShell>
      )
    },
    {
      key: "article",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn(
            "flex h-full flex-col justify-center gap-6 p-8",
            stackedCardClass
          )}
        >
          <h2 className="font-pixel text-lg md:leading-[1.4] md:tracking-[0.02em]" title={t.articleTitle}>
            <Link href="/posts/how-its-going" className="cancel-drag">
              {t.articleTitle}
            </Link>
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            {t.articleExcerpt}
          </p>
          <div className="inline-flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <Link
              href="/posts/how-its-going"
              className={cn(
                "cancel-drag group inline-flex items-center justify-center gap-3",
                "overflow-hidden whitespace-nowrap rounded-full bg-white",
                "px-4 py-2 ring-2 ring-gray-200/45 transition-all duration-300",
                "hover:ring-4 focus:outline-none focus:ring-4",
                "dark:text-black dark:ring-gray-200/30"
              )}
            >
              <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              {t.readMore}
              <span className="sr-only">{t.articleTitle}</span>
            </Link>
            <small className="text-xs text-gray-600 dark:text-gray-400">
              {t.articleDate}
            </small>
          </div>
        </CardShell>
      )
    },
    {
      key: "theme",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn(
            "relative flex h-full items-center justify-center",
            stackedCardClass
          )}
        >
          {isMounted && (
            <button
              type="button"
              aria-label="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cancel-drag flex h-10 w-20 items-center rounded-full bg-gray-200 transition duration-300 focus:outline-none lg:h-12 lg:w-24"
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200",
                  "text-white transition duration-300 lg:h-12 lg:w-12 lg:border-4",
                  theme === "dark"
                    ? "translate-x-full bg-dark-700"
                    : "bg-yellow-500"
                )}
              >
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
              </span>
            </button>
          )}
        </CardShell>
      )
    },
    {
      key: "linkedin",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn(
            "relative flex h-full flex-col items-center justify-center !bg-[#0A66C2]",
            stackedCardClass
          )}
        >
          <div className="absolute bottom-3 left-3">
            <a
              href="https://www.linkedin.com/in/joaopedroseibel/"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "cancel-drag group inline-flex items-center justify-center gap-3",
                "overflow-hidden whitespace-nowrap rounded-full bg-white p-3",
                "ring-2 ring-gray-200/45 transition-all duration-300",
                "hover:ring-4 focus:outline-none focus:ring-4",
                "dark:text-black dark:ring-gray-200/30"
              )}
              aria-label="LinkedIn"
            >
              <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
          <LinkedInIcon className="h-16 w-16 text-white" />
        </CardShell>
      )
    },
    {
      key: "contact",
      node: (
        <CardShell
          isDraggable={canDrag}
          className={cn(
            "flex h-full flex-col justify-center gap-6 p-8",
            stackedCardClass
          )}
        >
          <h2 className="text-center font-pixel text-lg md:leading-[1.4] md:tracking-[0.02em] md:text-left">
            {t.contactTitle}
          </h2>
          <p className="leading-relaxed max-md:hidden">{t.contactBody}</p>
          <div className="inline-flex flex-col items-center gap-6 lg:flex-row">
            <a
              href="mailto:hi@seibeldev.com.br"
              className={cn(
                "cancel-drag group inline-flex items-center justify-center gap-3",
                "overflow-hidden whitespace-nowrap rounded-full bg-white",
                "px-4 py-2 ring-2 ring-gray-200/45 transition-all duration-300",
                "hover:ring-4 focus:outline-none focus:ring-4",
                "dark:text-black dark:ring-gray-200/30"
              )}
              aria-label={t.contactCtaAria}
            >
              <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              {t.contactCta}
            </a>
            <div className="inline-flex gap-6">
              <a
                href="https://github.com/seibel777"
                className="cancel-drag"
                aria-label="My Github"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/joaopedroseibel/"
                className="cancel-drag"
                aria-label="My LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/SeibelDEV"
                className="cancel-drag"
                aria-label="My Twitter"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </CardShell>
      )
    }
  ] as const;

  return (
    <>
      <header className="mx-auto flex items-center justify-between px-4 py-4 max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px]">
        <h1 className="sr-only">{t.headerTitle}</h1>
        <div className="ml-auto flex items-center gap-3">
          <a
            href={t.cvHref}
            download
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "rounded-full bg-white px-4 py-2 text-xs font-semibold",
              "ring-2 ring-gray-200/60 shadow-sm transition-all duration-300",
              "hover:-translate-y-0.5 hover:shadow-md",
              "focus:outline-none focus:ring-4 focus:ring-gray-200/60",
              "dark:bg-dark-900 dark:ring-dark-800 dark:text-white"
            )}
          >
            {t.cvLabel}
          </a>
          <LanguageToggle />
        </div>
      </header>
      <main className="pt-4 pb-48 md:pb-20">
        <section
          className={cn(
            "mx-auto w-full max-w-[1200px] px-4 max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px]",
            isLoaded ? "opacity-100" : "opacity-0",
            "transition-opacity duration-700"
          )}
        >
          {isGridLayout ? (
            <ResponsiveGridLayout
              layouts={layouts}
              breakpoints={BREAKPOINTS}
              cols={COLS}
              rowHeight={rowHeight}
              isBounded={false}
              isResizable={false}
              autoSize
              compactType="vertical"
              preventCollision={false}
              useCSSTransforms={false}
              draggableCancel=".cancel-drag"
              onLayoutChange={(
                _layout: Layout[],
                allLayouts: Layouts
              ) => {
                if (suppressLayoutChangeRef.current) {
                  suppressLayoutChangeRef.current = false;
                  return;
                }
                setLayouts(cloneLayouts(allLayouts));
              }}
              onDragStop={(layout: Layout[]) => {
                const activeBreakpoint =
                  typeof window === "undefined"
                    ? currentBreakpoint
                    : resolveBreakpoint(window.innerWidth);
                suppressLayoutChangeRef.current = true;
                setLayouts((prev) => {
                  const next = cloneLayouts(prev);
                  next[activeBreakpoint] = layout.map((item) => ({ ...item }));
                  return clampLayoutsToGrid(next, activeBreakpoint);
                });
              }}
              onBreakpointChange={(next: string) =>
                setCurrentBreakpoint(next as Breakpoint)
              }
              isDraggable={canDrag}
              margin={[16, 16]}
              maxRows={maxRows}
            >
              {cardItems.map((item) => (
                <div key={item.key}>{item.node}</div>
              ))}
            </ResponsiveGridLayout>
          ) : (
            <div className="grid gap-4">
              {cardItems.map((item) => (
                <div key={item.key}>{item.node}</div>
              ))}
              <div aria-hidden className="h-40" />
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function CardShell({
  className,
  children,
  style,
  isDraggable = false
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  isDraggable?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-full w-full rounded-3xl transition-shadow duration-300",
        "shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]",
        "dark:shadow-[0_16px_40px_rgba(0,0,0,0.65)] dark:hover:shadow-[0_22px_60px_rgba(0,0,0,0.75)]"
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-3xl bg-white",
          "dark:bg-dark-900 dark:ring-1 dark:ring-dark-800",
          "text-sm md:text-[12px] lg:text-[13px]",
          isDraggable ? "select-none cursor-grab active:cursor-grabbing" : "",
          className
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 448 512"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.5-3.5a1 1 0 0 1-1 1H17a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1zm-12 0a1 1 0 0 1-1 1H5a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1zm8.49 5.49a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0zm-7.98 0a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41zM12 18a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V19a1 1 0 0 1 1-1zM16.55 6.45a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41 0zm-9.1 0a1 1 0 0 1-1.41 0L4.98 5.39a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7.5 7.5 0 1 0 11.5 11.5z"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 496 512" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 448 512" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
      />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 312.2 98.6 464H28l164.5-189.2L16.9 48H162l100.7 133.1L389.2 48zM363.4 421.8h39.1L142.6 88.6h-42L363.4 421.8z"
      />
    </svg>
  );
}
