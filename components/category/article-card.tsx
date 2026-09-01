import Image from "next/image";
import Link from "next/link";

import { GlowCard } from "@/components/ui/glow-card";

type CategoryArticleCardProps = {
  href: string;
  title: string;
  excerpt?: string;
  date?: string;
  author?: string;
  location?: string;
  tags?: string[];
  image?: {
    src: string;
    alt?: string;
  };
  locale?: "el" | "en";
};

function formatDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) {
    return date;
  }

  try {
    return new Intl.DateTimeFormat("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsed);
  } catch {
    return date;
  }
}

export function CategoryArticleCard(props: CategoryArticleCardProps) {
  const { href, title, excerpt, date, author, location, tags, image, locale = "el" } = props;
  const formattedDate = formatDate(date);
  const readMoreLabel = locale === "en" ? "Read Article →" : "Διάβασε το άρθρο →";

  return (
    <article className="group h-full">
      <Link href={href} className="block h-full">
        <GlowCard className="flex h-full flex-col">
          {image?.src ? (
            <div className="relative -mx-6 -mt-6 mb-4 aspect-[4/3] w-[calc(100%+3rem)] overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt ?? title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(min-width: 1280px) 360px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
          ) : (
            <div
              className="flex -mx-6 -mt-6 mb-4 aspect-[4/3] w-[calc(100%+3rem)] items-center justify-center text-sm"
              style={{ background: "var(--surface)", color: "var(--ash-dim)" }}
            >
              Χωρίς εικόνα
            </div>
          )}
          <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
              <h3
                className="text-2xl font-semibold transition group-hover:text-[var(--accent-bright)]"
                style={{ color: "var(--bone)" }}
              >
                {title}
              </h3>
              <div
                className="flex flex-wrap gap-3 uppercase"
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "var(--fs-meta)",
                  letterSpacing: "0.18em",
                  color: "var(--ash-dim)",
                }}
              >
                {formattedDate && <span>{formattedDate}</span>}
                {author && <span>{author}</span>}
                {location && <span>{location}</span>}
              </div>
            </div>
            {excerpt && (
              <p className="text-sm leading-6" style={{ color: "var(--ash)" }}>
                {excerpt}
              </p>
            )}

            {tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: "var(--hairline)",
                      color: "var(--ash-dim)",
                      fontFamily: "var(--font-code)",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <span
              className="mt-auto inline-flex items-center text-sm font-semibold transition hover:text-[var(--accent-bright)]"
              style={{ color: "var(--accent)" }}
            >
              {readMoreLabel}
            </span>
          </div>
        </GlowCard>
      </Link>
    </article>
  );
}
