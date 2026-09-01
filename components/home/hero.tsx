"use client";

import { motion } from "framer-motion";

import type { Locale } from "@/lib/locale";

export type ArchiveStats = {
  records: number;
  collections: number;
  span?: string;
};

type HomeHeroProps = {
  stats: ArchiveStats;
  locale?: Locale;
};

const copy = {
  el: {
    eyebrow: "Ψηφιακό αρχείο λαογραφίας",
    lede:
      "Παραδόσεις, μαρτυρίες του ελληνικού Τύπου και τα αρχεία της Εταιρείας Ψυχικών Ερευνών, σε ένα τεκμηριωμένο σώμα.",
    enter: "Εξερευνήστε το αρχείο",
    records: "Τεκμήρια",
    collections: "Συλλογές",
    span: "Εύρος",
  },
  en: {
    eyebrow: "Digital folklore archive",
    lede:
      "Folk traditions, testimony from the Greek press and the archives of the Society for Psychical Research, held as one documented corpus.",
    enter: "Enter the archive",
    records: "Records",
    collections: "Collections",
    span: "Span",
  },
} as const;

const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 + i * 0.09,
      duration: 0.82,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function HomeHero({ stats, locale = "el" }: HomeHeroProps) {
  const t = locale === "en" ? copy.en : copy.el;
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "el-GR");

  const points = [
    { n: nf.format(stats.records), label: t.records },
    { n: nf.format(stats.collections), label: t.collections },
    ...(stats.span ? [{ n: stats.span, label: t.span }] : []),
  ];

  return (
    <>
      <section className="hero" id="hero">
        <div className="frame hero__inner">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={rise}
            className="hero__eyebrow"
          >
            <span className="mark" aria-hidden="true" />
            <span className="mono">{t.eyebrow}</span>
          </motion.div>

          {/* One face, one style, one colour — the italic second word read as
              a different typeface. The glow sits behind it as its own layer so
              it never tints the letterforms themselves. */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={rise}
            className="hero__titlewrap"
          >
            <span className="hero__glow" aria-hidden="true" />
            <h1 className="hero__title">Haunted Greece</h1>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={rise}
            className="hero__foot"
          >
            <p className="hero__lede">{t.lede}</p>
            <a href="#laografia" className="mono tlink hero__enter">
              {t.enter} &darr;
            </a>
          </motion.div>
        </div>

        <span className="hero__scroll" aria-hidden="true" />
      </section>

      {/* The archive's own numbers, as their own band across the full width. */}
      <section className="band stats" aria-label={t.eyebrow}>
        <div className="frame stats__grid">
          {points.map((point) => (
            <div key={point.label} className="stat">
              <span className="stat__n">{point.n}</span>
              <span className="stat__label">{point.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
