const BASIC_GREEK_TO_LATIN: Record<string, string> = {
  ά: "a",
  α: "a",
  Ά: "a",
  Α: "a",
  έ: "e",
  ε: "e",
  Έ: "e",
  Ε: "e",
  ή: "i",
  η: "i",
  Ή: "i",
  Η: "i",
  ί: "i",
  ι: "i",
  Ί: "i",
  Ι: "i",
  ό: "o",
  ο: "o",
  Ό: "o",
  Ο: "o",
  ύ: "y",
  υ: "y",
  Ύ: "y",
  Υ: "y",
  ώ: "o",
  ω: "o",
  Ώ: "o",
  Ω: "o",
  β: "v",
  Β: "v",
  γ: "g",
  Γ: "g",
  δ: "d",
  Δ: "d",
  ζ: "z",
  Ζ: "z",
  θ: "th",
  Θ: "th",
  κ: "k",
  Κ: "k",
  λ: "l",
  Λ: "l",
  μ: "m",
  Μ: "m",
  ν: "n",
  Ν: "n",
  ξ: "x",
  Ξ: "x",
  π: "p",
  Π: "p",
  ρ: "r",
  Ρ: "r",
  σ: "s",
  Σ: "s",
  ς: "s",
  τ: "t",
  Τ: "t",
  φ: "f",
  Φ: "f",
  χ: "ch",
  Χ: "ch",
  ψ: "ps",
  Ψ: "ps",
  γκ: "gk",
  Γκ: "gk",
  ΓΚ: "gk",
  μπ: "mp",
  Μπ: "mp",
  ΜΠ: "mp",
  ντ: "nt",
  Ντ: "nt",
  ΝΤ: "nt",
};

function normalizeCharacters(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ")
    .replace(/Ϊ/g, "ϊ")
    .replace(/Ϋ/g, "ϋ");
}

function transliterateGreek(input: string) {
  const normalized = normalizeCharacters(input);
  let output = "";
  let index = 0;

  while (index < normalized.length) {
    const current = normalized[index];
    const next = normalized[index + 1];

    if (next) {
      const digraph = current + next;
      if (BASIC_GREEK_TO_LATIN[digraph]) {
        output += BASIC_GREEK_TO_LATIN[digraph];
        index += 2;
        continue;
      }
    }

    output += BASIC_GREEK_TO_LATIN[current] ?? current;
    index += 1;
  }

  return output;
}

function sanitizeSegment(segment: string) {
  return segment
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function toSlug(value: string) {
  const transliterated = transliterateGreek(value.toLowerCase());
  const ascii = transliterated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-");

  return sanitizeSegment(ascii) || "article";
}

export function ensureSlug(value?: string | null, fallback?: string) {
  if (typeof value === "string" && value.trim().length > 0) {
    return toSlug(value);
  }

  if (typeof fallback === "string" && fallback.trim().length > 0) {
    return toSlug(fallback);
  }

  return "article";
}

export function ensurePathWithSlug(pathname: string, slug: string) {
  if (pathname.includes(slug)) {
    return pathname;
  }

  const sanitizedSlug = toSlug(slug);
  const segments = pathname.split("/").map((segment) => sanitizeSegment(transliterateGreek(segment.toLowerCase())));

  if (!segments.includes(sanitizedSlug)) {
    segments.push(sanitizedSlug);
  }

  return `/${segments.filter(Boolean).join("/")}`;
}
