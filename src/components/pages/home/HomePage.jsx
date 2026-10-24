"use client";

import React, { useContext, useMemo, useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from "@/hooks/useFont";
import useData from "@/hooks/useData";
import { filterByLanguage } from "@/utils/filterByLanguage";
import { formatDateRange } from "@/components/pages/exhibition/utils/exhibitionDates";

// ═════════════════════════════════════════════════════════════════════════
// TEXT
// ═════════════════════════════════════════════════════════════════════════
const T = {
  artworks: { en: "Artworks", cn: "作品" },
  recent: { en: "Recent Works", cn: "近期作品" },
  exhibitions: { en: "Exhibitions", cn: "展览" },
  bibliography: { en: "Bibliography", cn: "文献" },
  empty: { en: "Nothing here yet.", cn: "暂无内容。" },
  sortNewest: { en: "Newest", cn: "最新" },
  sortOldest: { en: "Oldest", cn: "最早" },
  scrollRight: { en: "Show more", cn: "查看更多" },
  viewAll: { en: "View all", cn: "查看全部" },
};
const pick = (e, isCn) => (isCn ? e.cn : e.en);

// ═════════════════════════════════════════════════════════════════════════
// CONFIG — all visuals live here
// ═════════════════════════════════════════════════════════════════════════
const HOME = {
  PAGE: {
    PADDING_DESKTOP: "24px 40px 80px",
    PADDING_MOBILE: "16px 18px 56px",
    MAX_WIDTH: 1680,
  },
  SECTION: {
    GAP_DESKTOP: 64, // space between sections
    GAP_MOBILE: 44,
    PADDING_TOP: 40, // space above the rule that separates sections
    RULE: true, // thin hairline above every section after the first
  },
  HEADING: {
    SIZE_DESKTOP: "20px",
    SIZE_MOBILE: "16px",
    WEIGHT: 700, // bold
    LETTER_SPACING: "-0.01em",
    GAP: 12, // between heading and the chevron
    BAR_GAP: 10, // gap between the leading "|" bar and the label
  },
  ARROW: { SIZE_DESKTOP: 30, SIZE_MOBILE: 24, STROKE: 2.6, HOVER_OPACITY: 0.5 },

  // Section A — horizontal scroller
  SCROLLER: {
    ROW_GAP_DESKTOP: 20,
    ROW_GAP_MOBILE: 14,
    CARD_WIDTH_DESKTOP: "300px",
    CARD_WIDTH_MOBILE: "72vw",
    IMAGE_ASPECT: "100%", // square
    TAG_SIZE: "11px",
    TITLE_SIZE_DESKTOP: "20px",
    TITLE_SIZE_MOBILE: "18px",
    LIMIT: 40,
  },

  // Section B — "criticism"-style 3-column grid
  GRID: {
    COLUMNS_DESKTOP: 3,
    COLUMNS_MOBILE: 1,
    COLUMN_GAP: "40px",
    ROW_GAP: "48px",
    LIMIT: 6,
  },
  CARD: {
    TITLE_SIZE: "19px",
    SUB_SIZE: "17px",
    META_SIZE: "14px",
    BODY_SIZE: "13px",
    BODY_LINE_HEIGHT: 1.65,
    BYLINE_SIZE: "13px",
  },

  // Sections C/D — "notes"-style date-led grid
  NOTES: {
    COLUMNS_DESKTOP: 4,
    COLUMNS_MOBILE: 2,
    COLUMN_GAP: "28px",
    ROW_GAP: "40px",
    LIMIT: 8,
    DATE_SIZE: "12px",
    BADGE_BG: "#000000",
    BADGE_COLOR: "#ffffff",
  },
};

// ═════════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════════
const slugify = (text) =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

const coverOf = (item) => item?.cover_img_url || item?.cover_image_url || "";

const yearValue = (item) => {
  const n = parseInt(item?.year, 10);
  return Number.isNaN(n) ? null : n;
};
const byYearDesc = (a, b) => {
  const ay = yearValue(a);
  const by = yearValue(b);
  if (ay === null && by === null) return 0;
  if (ay === null) return 1;
  if (by === null) return -1;
  return by - ay;
};

const truncate = (str, n) => {
  const s = String(str || "").trim();
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
};

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
function formatLooseDate(value, isCn) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  if (isCn) return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
const itemDateOf = (item) => item?.date || item?.published_at || item?.date_start || item?.year || "";

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
function ArrowRightIcon({ size, stroke }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="6 5 10 12 6 19" />
      <polyline points="11 5 15 12 11 19" />
      <polyline points="16 5 20 12 16 19" />
    </svg>
  );
}
function ArrowLeftIcon({ size, stroke }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="18 5 14 12 18 19" />
      <polyline points="13 5 9 12 13 19" />
      <polyline points="8 5 4 12 8 19" />
    </svg>
  );
}
function ChevronDownIcon({ size, stroke }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────────────────────
function Loading({ text }) {
  return (
    <div style={{ padding: "32px 0", fontSize: 13, opacity: 0.45 }}>{text || "—"}</div>
  );
}

function Empty({ isCn, fontSize = 13 }) {
  return (
    <div style={{ padding: "24px 0", fontSize, opacity: 0.42 }}>{pick(T.empty, isCn)}</div>
  );
}

function ArrowButton({ href, onClick, label, size, stroke, color, hoverOpacity, left }) {
  const [hover, setHover] = React.useState(false);
  const style = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer",
    color: color || "inherit", lineHeight: 0,
    opacity: hover ? hoverOpacity : 1, transition: "opacity 0.2s ease",
  };
  const inner = left
    ? <ArrowLeftIcon size={size} stroke={stroke} />
    : <ArrowRightIcon size={size} stroke={stroke} />;
  if (href) {
    return (
      <Link href={href} aria-label={label} title={label}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={style}>
      {inner}
    </button>
  );
}

/**
 * Section wrapper: heading (with optional sort-chevron) on the left, an arrow
 * on the right. Rules a hairline above itself (except the first section).
 */
function Section({ title, isCn, isFirst, colors, isMobile, rules, fontFamily,
  showChevron, sortDesc, onToggleSort,
  moreHref,
  pair, showLeft, showRight, onLeft, onRight, children }) {
  const { HEADING, ARROW, SECTION } = HOME;
  const rule = rules;
  const arrowSize = isMobile ? ARROW.SIZE_MOBILE : ARROW.SIZE_DESKTOP;
  const arrowColor = colors.text;
  return (
    <section
      data-nav-section
      style={{
        marginTop: isFirst ? 0 : (isMobile ? SECTION.GAP_MOBILE : SECTION.GAP_DESKTOP),
        paddingTop: isFirst ? 0 : SECTION.PADDING_TOP,
        borderTop: !isFirst && SECTION.RULE ? `1px solid ${rule}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: isMobile ? 20 : 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: HEADING.GAP, minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontFamily,
            fontSize: isMobile ? HEADING.SIZE_MOBILE : HEADING.SIZE_DESKTOP,
            fontWeight: HEADING.WEIGHT, letterSpacing: HEADING.LETTER_SPACING,
            color: colors.text, lineHeight: 1.1,
            display: "inline-flex", alignItems: "center",
          }}>
            <span aria-hidden="true" style={{ marginRight: HEADING.BAR_GAP, fontWeight: HEADING.WEIGHT }}>|</span>
            {title}
          </h2>
          {showChevron && (
            <button type="button" onClick={onToggleSort}
              aria-label={pick(sortDesc ? T.sortNewest : T.sortOldest, isCn)}
              style={{ background: "none", border: "none", padding: 2, margin: 0, cursor: "pointer", color: colors.text, lineHeight: 0, opacity: 0.7 }}>
              <ChevronDownIcon size={isMobile ? 18 : 22} stroke={1.5} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 14 : 20 }}>
          {pair ? (
            <>
              {showLeft && (
                <ArrowButton left onClick={onLeft} label={isCn ? "向左滚动" : "Scroll left"}
                  size={arrowSize} stroke={ARROW.STROKE} color={arrowColor} hoverOpacity={ARROW.HOVER_OPACITY} />
              )}
              {showRight && (
                <ArrowButton onClick={onRight} label={isCn ? "向右滚动" : "Scroll right"}
                  size={arrowSize} stroke={ARROW.STROKE} color={arrowColor} hoverOpacity={ARROW.HOVER_OPACITY} />
              )}
            </>
          ) : (
            moreHref ? (
              <ArrowButton href={moreHref} label={pick(T.viewAll, isCn)}
                size={arrowSize} stroke={ARROW.STROKE} color={arrowColor} hoverOpacity={ARROW.HOVER_OPACITY} />
            ) : null
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//  SECTION A — horizontal artwork scroller
// ═════════════════════════════════════════════════════════════════════════
const ScrollerCard = React.memo(function ScrollerCard({ artwork, isCn, isMobile, colors, fonts }) {
  const { SCROLLER } = HOME;
  const href = `/artworks/${slugify(artwork.title)}`;
  const img = coverOf(artwork);
  const [hover, setHover] = React.useState(false);
  return (
    <Link href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ flex: "0 0 auto", width: isMobile ? SCROLLER.CARD_WIDTH_MOBILE : SCROLLER.CARD_WIDTH_DESKTOP, textDecoration: "none", color: "inherit", scrollSnapAlign: "start" }}>
      <div style={{ width: "100%", paddingBottom: SCROLLER.IMAGE_ASPECT, position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.03)" }}>
        {img ? (
          <img src={img} alt={artwork.title || ""} loading="lazy" decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 0.6s ease" }} />
        ) : null}
      </div>
      <div style={{ marginTop: 10, fontFamily: fonts.title, fontSize: isMobile ? SCROLLER.TITLE_SIZE_MOBILE : SCROLLER.TITLE_SIZE_DESKTOP, lineHeight: 1.25, textAlign: "center", color: colors.text }}>
        {artwork.title}
      </div>
    </Link>
  );
});

function ArtworkScroller({ items, isCn, isMobile, colors, fonts, scrollRef, onScroll }) {
  const { SCROLLER } = HOME;
  return (
    <div ref={scrollRef} className="hj-scroller" onScroll={onScroll} style={{
      display: "flex", gap: isMobile ? SCROLLER.ROW_GAP_MOBILE : SCROLLER.ROW_GAP_DESKTOP,
      overflowX: "auto", overflowY: "hidden", paddingBottom: 10,
      scrollSnapType: "x proximity", WebkitOverflowScrolling: "touch",
    }}>
      {items.map((a, i) => (
        <ScrollerCard key={a.id || a._id || `${a.title}-${i}`} artwork={a} isCn={isCn} isMobile={isMobile} colors={colors} fonts={fonts} />
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//  SECTION B — "criticism"-style recent-works grid
// ═════════════════════════════════════════════════════════════════════════
const CriticismCard = React.memo(function CriticismCard({ artwork, isCn, colors, fonts }) {
  const { CARD } = HOME;
  const href = `/artworks/${slugify(artwork.title)}`;
  const img = coverOf(artwork);
  const meta = [artwork.type, artwork.year].filter(Boolean).join(", ");
  const body = truncate(artwork.caption || artwork.medium || artwork.size || "", 220);
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{ fontFamily: fonts.title, fontSize: CARD.TITLE_SIZE, fontWeight: 600, textAlign: "center", lineHeight: 1.25, color: colors.text }}>
        {artwork.title}
      </div>
      {meta && (
        <div style={{ marginTop: 6, fontFamily: fonts.body, fontSize: CARD.META_SIZE, fontStyle: "italic", textAlign: "center", color: colors.text, opacity: 0.5 }}>
          {meta}
        </div>
      )}
      {body && (
        <p style={{ margin: "14px 0 0", fontFamily: fonts.body, fontSize: CARD.BODY_SIZE, lineHeight: CARD.BODY_LINE_HEIGHT, color: colors.text, opacity: 0.72 }}>
          {body}
        </p>
      )}
      {img && (
        <div style={{ marginTop: 16, width: "100%", paddingBottom: "75%", position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.03)" }}>
          <img src={img} alt={artwork.title || ""} loading="lazy" decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
    </Link>
  );
});

// ═════════════════════════════════════════════════════════════════════════
//  SECTIONS C/D — "notes"-style date-led grid (exhibitions / bibliography)
// ═════════════════════════════════════════════════════════════════════════
const NoteCard = React.memo(function NoteCard({ item, kind, isCn, colors, fonts }) {
  const { NOTES, CARD } = HOME;
  const isExhibition = kind === "exhibition";
  const href = isExhibition ? `/exhibitions/${slugify(item.title)}` : null;
  const img = coverOf(item);
  const badge = (isExhibition ? item.type : item.type) || "";
  const byline = isExhibition
    ? [item.venue, item.location].filter(Boolean).join(", ")
    : item.author;
  const dateLine = isExhibition
    ? (formatDateRange(item, isCn) || formatLooseDate(itemDateOf(item), isCn))
    : formatLooseDate(itemDateOf(item), isCn);

  const body = (
    <>
      {dateLine && (
        <div style={{ fontFamily: fonts.body, fontSize: NOTES.DATE_SIZE, color: colors.text, opacity: 0.5 }}>{dateLine}</div>
      )}
      <div style={{ marginTop: 8, fontFamily: fonts.title, fontSize: CARD.TITLE_SIZE, fontWeight: 600, lineHeight: 1.25, color: colors.text }}>
        {item.title}
      </div>
      {item.subtitle && (
        <div style={{ marginTop: 4, fontFamily: fonts.title, fontSize: CARD.SUB_SIZE, lineHeight: 1.3, color: colors.text, opacity: 0.85 }}>
          {item.subtitle}
        </div>
      )}
      {img && (
        <div style={{ marginTop: 12, width: "100%", paddingBottom: "75%", position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.03)" }}>
          <img src={img} alt={item.title || ""} loading="lazy" decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          {badge && (
            <span style={{ position: "absolute", left: 0, top: "58%", background: NOTES.BADGE_BG, color: NOTES.BADGE_COLOR, fontFamily: fonts.body, fontSize: 11, letterSpacing: "0.02em", padding: "3px 8px" }}>
              {badge}
            </span>
          )}
        </div>
      )}
      {byline && (
        <div style={{ marginTop: 12, fontFamily: fonts.body, fontSize: CARD.BYLINE_SIZE, color: colors.text, opacity: 0.72 }}>
          {byline}
        </div>
      )}
    </>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{body}</Link>;
  }
  return <div>{body}</div>;
});

// ═════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { colors, isDark } = useReverseTheme();

  const { fontFamily: headingFont } = useFont("bodyText");
  const { fontFamily: titleFont } = useFont("artistName");
  const { fontFamily: bodyFont } = useFont("bodyText");

  const fonts = useMemo(
    () => ({ heading: headingFont, title: titleFont, body: bodyFont, meta: bodyFont }),
    [headingFont, titleFont, bodyFont]
  );

  // Section A scroller — arrows appear only when there's content that way:
  //   left arrow  → only when scrolled away from the start
  //   right arrow → only while more content remains to the right
  const artworkScrollerRef = useRef(null);
  const [arrows, setArrows] = useState({ left: false, right: false });
  const updateArrows = useCallback(() => {
    const el = artworkScrollerRef.current;
    if (!el) return;
    setArrows({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);
  const scrollArtworks = useCallback(() => {
    const el = artworkScrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  }, []);
  const scrollArtworksLeft = useCallback(() => {
    const el = artworkScrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth * 0.85, behavior: "smooth" });
  }, []);

  const { data: rawArtworks = [], isLoading: artworksLoading } = useData("/api/artwork");
  const { data: rawExhibitions = [], isLoading: exhibitionsLoading } = useData("/api/exhibition");
  const { data: rawBibliography = [], isLoading: bibliographyLoading } = useData("/api/bibliography");

  // Normalise (API may return { data: [...] } or a bare array — useData handles it).
  const asList = (raw) => (Array.isArray(raw) ? raw : raw?.data && Array.isArray(raw.data) ? raw.data : []);

  const [sortDesc, setSortDesc] = useState(true); // newest → oldest by default

  const artworks = useMemo(() => {
    const list = filterByLanguage(asList(rawArtworks), isCn).filter((a) => a && a.title);
    return list.sort(sortDesc ? byYearDesc : (a, b) => byYearDesc(b, a));
  }, [rawArtworks, isCn, sortDesc]);

  const exhibitions = useMemo(() => {
    const list = filterByLanguage(asList(rawExhibitions), isCn).filter((e) => e && e.title);
    return list;
  }, [rawExhibitions, isCn]);

  const bibliography = useMemo(() => {
    const list = filterByLanguage(asList(rawBibliography), isCn).filter((b) => b && b.title);
    return [...list].sort((a, b) => byYearDesc(a, b));
  }, [rawBibliography, isCn]);

  const line = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)";

  const gridStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    columnGap: HOME.GRID.COLUMN_GAP,
    rowGap: HOME.GRID.ROW_GAP,
  });

  // Keep the scroller arrows in sync (on resize, and whenever items/reorder change).
  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);
  useEffect(() => {
    updateArrows();
  }, [artworks, updateArrows]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <div style={{
        maxWidth: HOME.PAGE.MAX_WIDTH,
        margin: "0 auto",
        padding: isMobile ? HOME.PAGE.PADDING_MOBILE : HOME.PAGE.PADDING_DESKTOP,
      }}>
        {/* ── Section A: Artworks (horizontal scroller + arrow) ── */}
        <Section
          title={pick(T.artworks, isCn)} isCn={isCn} isFirst colors={colors} isMobile={isMobile}
          rules={line} fontFamily={fonts.heading}
          showChevron sortDesc={sortDesc} onToggleSort={() => setSortDesc((v) => !v)}
          pair showLeft={arrows.left} showRight={arrows.right}
          onLeft={scrollArtworksLeft} onRight={scrollArtworks}
        >
          {artworksLoading ? (
            <Loading />
          ) : artworks.length === 0 ? (
            <Empty isCn={isCn} />
          ) : (
            <ArtworkScroller
              items={artworks.slice(0, HOME.SCROLLER.LIMIT)}
              isCn={isCn} isMobile={isMobile} colors={colors} fonts={fonts}
              scrollRef={artworkScrollerRef} onScroll={updateArrows}
            />
          )}
        </Section>

        {/* ── Section B: Recent Works (criticism grid) ── */}
        <Section
          title={pick(T.recent, isCn)} isCn={isCn} colors={colors} isMobile={isMobile}
          rules={line} fontFamily={fonts.heading} moreHref="/artworks"
        >
          {artworksLoading ? (
            <Loading />
          ) : artworks.length === 0 ? (
            <Empty isCn={isCn} />
          ) : (
            <div style={gridStyle(isMobile ? HOME.GRID.COLUMNS_MOBILE : HOME.GRID.COLUMNS_DESKTOP)}>
              {artworks.slice(0, HOME.GRID.LIMIT).map((a, i) => (
                <CriticismCard key={a.id || a._id || `${a.title}-${i}`} artwork={a} isCn={isCn} colors={colors} fonts={fonts} />
              ))}
            </div>
          )}
        </Section>

        {/* ── Section C: Exhibitions (notes grid) ── */}
        <Section
          title={pick(T.exhibitions, isCn)} isCn={isCn} colors={colors} isMobile={isMobile}
          rules={line} fontFamily={fonts.heading} moreHref="/exhibitions"
        >
          {exhibitionsLoading ? (
            <Loading />
          ) : exhibitions.length === 0 ? (
            <Empty isCn={isCn} />
          ) : (
            <div style={gridStyle(isMobile ? HOME.NOTES.COLUMNS_MOBILE : HOME.NOTES.COLUMNS_DESKTOP)}>
              {exhibitions.slice(0, HOME.NOTES.LIMIT).map((ex, i) => (
                <NoteCard key={ex._id || ex.id || `${ex.title}-${i}`} item={ex} kind="exhibition" isCn={isCn} colors={colors} fonts={fonts} />
              ))}
            </div>
          )}
        </Section>

        {/* ── Section D: Bibliography (notes grid) ── */}
        <Section
          title={pick(T.bibliography, isCn)} isCn={isCn} colors={colors} isMobile={isMobile}
          rules={line} fontFamily={fonts.heading}
        >
          {bibliographyLoading ? (
            <Loading />
          ) : bibliography.length === 0 ? (
            <Empty isCn={isCn} />
          ) : (
            <div style={gridStyle(isMobile ? HOME.NOTES.COLUMNS_MOBILE : HOME.NOTES.COLUMNS_DESKTOP)}>
              {bibliography.slice(0, HOME.NOTES.LIMIT).map((b, i) => (
                <NoteCard key={b.id || b._id || `${b.title}-${i}`} item={b} kind="bibliography" isCn={isCn} colors={colors} fonts={fonts} />
              ))}
            </div>
          )}
        </Section>
      </div>
    </motion.div>
  );
}
