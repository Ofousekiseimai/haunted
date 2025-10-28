type LocationDetailsProps = {
  mainArea?: string | null;
  subLocation?: string | null;
  subLocation2?: string | null;
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
}: LocationDetailsProps) {
  const cleanMainArea = normalize(mainArea);
  const subLocations = [normalize(subLocation), normalize(subLocation2)].filter(
    (entry): entry is string => Boolean(entry),
  );

  if (!cleanMainArea && subLocations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-n-7 bg-n-8 p-6">
      <h2 className="text-lg font-semibold text-n-1">Τοποθεσία</h2>
      <div className="mt-4 space-y-4 text-sm text-n-3">
        {cleanMainArea && (
          <div className="flex flex-wrap gap-2">
            <span className="font-medium text-n-2">Κύρια περιοχή:</span>
            <span>{cleanMainArea}</span>
          </div>
        )}

        {subLocations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="font-medium text-n-2">Υπο-τοποθεσίες:</span>
            <span>{subLocations.join(", ")}</span>
          </div>
        )}
      </div>
    </section>
  );
}
