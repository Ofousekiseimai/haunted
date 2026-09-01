import Link from "next/link";

import { PlateImage } from "@/components/ui/plate-image";

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
  /** Scans are matted whole; illustration is cropped. */
  variant?: "gallery" | "plates";
  locale?: "el" | "en";
};

/** Year only. A card in a grid wants a datum it can align, not a sentence. */
function toYear(date?: string) {
  if (!date) return null;
  return date.trim().match(/(1[5-9]\d{2}|20[0-2]\d)/)?.[1] ?? null;
}

export function CategoryArticleCard({
  href,
  title,
  excerpt,
  date,
  location,
  image,
  variant = "gallery",
}: CategoryArticleCardProps) {
  const year = toYear(date);
  const isScan = variant === "plates";
  const meta = [location, year].filter(Boolean).join(" · ");

  return (
    <Link href={href} className={isScan ? "clip group" : "rec group"}>
      <div className={isScan ? "clip__mat" : "rec__plate"}>
        {image?.src ? (
          isScan ? (
            <PlateImage
              src={image.src}
              alt={image.alt ?? title}
              width={640}
              height={480}
              sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            />
          ) : (
            <PlateImage
              src={image.src}
              alt={image.alt ?? title}
              fill
              sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            />
          )
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="mono mono--micro">—</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {meta && <span className="mono mono--micro">{meta}</span>}
        <h3 className={isScan ? "clip__title" : "rec__title"}>{title}</h3>
        {!isScan && excerpt && <p className="rec__excerpt">{excerpt}</p>}
      </div>
    </Link>
  );
}
