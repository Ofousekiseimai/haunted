import Link from "next/link";
import Image from "next/image";

import type { ArticleSummary } from "@/lib/home";

const SITE_BASE_URL = "https://haunted.gr";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  try {
    return new URL(trimmed, SITE_BASE_URL).toString();
  } catch {
    return undefined;
  }
}

type SanSimeraSectionProps = {
  articles: Array<ArticleSummary & { href: string }>;
  dateLabel: string;
};

export function SanSimeraSection({ articles, dateLabel }: SanSimeraSectionProps) {
  if (!articles.length) return null;

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-color-1">
          Σαν σήμερα
        </p>
        <h2 className="mt-2 text-3xl font-bold text-n-1 md:text-4xl">{dateLabel}</h2>
        <p className="mt-2 text-n-3">Από τον Ελληνικό Τύπο</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const imgSrc = toAbsoluteUrl(article.image?.src);
          return (
            <Link
              key={`${article.id}-${article.slug}`}
              href={article.href}
              className="group relative overflow-hidden rounded-2xl border border-n-7 bg-n-8/60 p-4 shadow-lg transition duration-300 hover:scale-[1.02]"
            >
              {imgSrc && (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={imgSrc}
                    alt={article.image?.alt ?? article.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-n-1 transition group-hover:text-color-1">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="mt-3 line-clamp-3 text-sm text-n-3">{article.excerpt}</p>
              )}
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-n-1/80 transition group-hover:text-color-1 group-hover:opacity-100">
                Διαβάστε περισσότερα <span aria-hidden="true">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
