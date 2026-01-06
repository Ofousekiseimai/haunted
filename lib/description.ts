export function formatCollectionDescription(
  metaDescription: string | undefined,
  count: number,
  fallback: string,
) {
  if (!metaDescription) {
    return fallback;
  }

  const withPlaceholder = metaDescription.replace(/\{count\}/gi, String(count));

  const withCollectionCount = withPlaceholder
    .replace(/Συλλογή\s+\d+/i, `Συλλογή ${count}`)
    .replace(/Collection\s+\d+/i, `Collection ${count}`);

  return withCollectionCount;
}
