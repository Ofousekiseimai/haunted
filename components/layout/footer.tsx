import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  const categories = [
    { href: "/laografia", label: "Λαογραφία" },
    { href: "/efimerides", label: "Εφημερίδες" },
    { href: "/etaireia-psychikon-ereynon", label: "Εταιρεία Ψυχικών Ερευνών" },
    { href: "/search", label: "Αναζήτηση" },
  ];

  const resources = [
    { href: "/map2", label: "Χάρτης Λαογραφίας" },
    { href: "/map", label: "Χάρτης Εφημερίδων" },
    { href: "/terms", label: "Όροι Χρήσης" },
    { href: "/privacy", label: "Πολιτική Απορρήτου" },
    { href: "/about-us", label: "Σχετικά" },
  ];

  return (
    <footer className="border-t border-n-6 bg-n-8/80 backdrop-blur-sm">
      <div className="container flex flex-col gap-10 py-12">
        <div className="grid gap-10 text-sm text-n-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-n-5">Κατηγορίες</p>
            <ul className="space-y-2 text-n-3">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-n-1">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-n-5">Προσανατολισμός</p>
            <ul className="space-y-2 text-n-3">
              {resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-n-1">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-n-3">
            <p className="text-xs uppercase tracking-[0.28em] text-n-5">Haunted.gr</p>
            <p className="leading-6 text-n-4">
              Αρχείο λαογραφίας, ιστορικών τεκμηρίων και παραφυσικών ερευνών από κάθε γωνιά της
              Ελλάδας.
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-n-7/60" />

        <p className="caption text-center text-n-4">
          © {year} Haunted.gr — Όλα τα δικαιώματα διατηρούνται.
        </p>
      </div>
    </footer>
  );
}
