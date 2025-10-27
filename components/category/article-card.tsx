import Image from "next/image";
import Link from "next/link";

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
  const { href, title, excerpt, date, author, location, tags, image } = props;
  const formattedDate = formatDate(date);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border surface-border surface-card transition hover:border-primary-400 hover:bg-zinc-900">
      {image?.src ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b surface-border surface-card-strong">
          <Image
            src={image.src}
            alt={image.alt ?? title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 360px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center border-b surface-border surface-card-strong text-sm text-muted">
          Χωρίς εικόνα
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <Link href={href} className="block">
            <h3 className="text-2xl font-semibold text-n-1 transition group-hover:text-primary-300">
              {title}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-muted">
            {formattedDate && <span>{formattedDate}</span>}
            {author && <span>{author}</span>}
            {location && <span>{location}</span>}
          </div>
        </div>
        {excerpt && <p className="text-sm leading-6 text-secondary">{excerpt}</p>}

        {tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border surface-border px-3 py-1 text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <Link
          href={href}
          className="mt-auto inline-flex items-center text-sm font-semibold text-primary-300 transition hover:text-primary-200"
        >
          Διάβασε το άρθρο →
        </Link>
      </div>
    </article>
  );
}
