import type { Locale } from "@/lib/locale";
import { getArticleCopy } from "@/lib/i18n/ui";

type LocationDetailsProps = {
  mainArea?: string | null;
  subLocation?: string | null;
  subLocation2?: string | null;
  locale?: Locale;
};

function normalize(value?: string | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function LocationDetails({
  mainArea,
  subLocation,
  subLocation2,
  locale = "el",
}: LocationDetailsProps) {
  const copy = getArticleCopy(locale);
  const cleanMainArea = normalize(mainArea);
  const subLocations = [normalize(subLocation), normalize(subLocation2)].filter(
    (entry): entry is string => Boolean(entry),
  );

  if (!cleanMainArea && subLocations.length === 0) {
    return null;
  }

  return (
    <section className="panel">
      <h2 className="panel__head mono">{copy.location.heading}</h2>
      <dl className="panel__rows">
        {cleanMainArea && (
          <div className="panel__row">
            <dt className="mono mono--micro">{copy.location.mainArea}</dt>
            <dd>{cleanMainArea}</dd>
          </div>
        )}
        {subLocations.length > 0 && (
          <div className="panel__row">
            <dt className="mono mono--micro">{copy.location.subLocations}</dt>
            <dd>{subLocations.join(", ")}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
