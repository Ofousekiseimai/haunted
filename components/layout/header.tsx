"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getNavigation } from "@/constants/navigation";
import { LanguageSwitch } from "./language-switch";
import type { Locale } from "@/lib/locale";

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <circle cx="11" cy="11" r="6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 15.5 4 4" />
  </svg>
);

const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

const CaretIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function useDisableBodyScroll(disabled: boolean) {
  useEffect(() => {
    if (!disabled) {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      return;
    }

    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = original.overflow;
      document.body.style.position = original.position;
      document.body.style.width = original.width;
    };
  }, [disabled]);
}

type HeaderProps = {
  initialLocale: Locale;
};

/**
 * A masthead: wordmark left, navigation through the middle, utilities right,
 * on ONE row. The previous header stacked two full-width rows and centred
 * three things independently inside them — the language pill alone at the far
 * left, the wordmark absolutely centred, the search icon at the far right,
 * and the whole navigation centred on a second row below. Nothing lined up
 * with anything, and it cost 5.25rem of vertical space on every page.
 */
export function Header({ initialLocale }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isHome = useMemo(() => pathname === "/", [pathname]);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  const cancelAndOpen = useCallback((id: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(id);
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((current) => {
      if (current) {
        setOpenDropdown(null);
        return false;
      }
      return true;
    });
  }, []);

  useDisableBodyScroll(mobileOpen);

  const navItems = getNavigation(initialLocale).filter(
    (item) => !item.onlyMobile && item.url !== "/search",
  );

  return (
    <header
      className="masthead"
      data-scrolled={scrolled || !isHome}
      data-open={mobileOpen}
      onMouseLeave={scheduleClose}
    >
      <div className="masthead__inner">
        <Link href="/" className="wordmark">
          <span className="wordmark__name">haunted</span>
          <span className="wordmark__sub">Αρχείο</span>
        </Link>

        <nav className="nav hidden lg:flex" aria-label="Κύρια πλοήγηση">
          {navItems.map((item) => {
            const isActive =
              item.url === "/" ? pathname === item.url : pathname.startsWith(item.url);

            if (!item.subitems) {
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="nav__link"
                  data-active={isActive}
                >
                  {item.title}
                </Link>
              );
            }

            return (
              <div key={item.id} className="relative" onMouseLeave={scheduleClose}>
                <button
                  type="button"
                  className="nav__link"
                  data-active={isActive}
                  aria-expanded={openDropdown === item.id}
                  onClick={() =>
                    setOpenDropdown((current) => (current === item.id ? null : item.id))
                  }
                  onMouseEnter={() => cancelAndOpen(item.id)}
                  onFocus={() => cancelAndOpen(item.id)}
                >
                  {item.title}
                  <CaretIcon className="nav__caret" />
                </button>

                {openDropdown === item.id && (
                  <div
                    className="nav__menu"
                    onMouseEnter={() => cancelAndOpen(item.id)}
                    onMouseLeave={scheduleClose}
                  >
                    {item.subitems.map((subitem) => (
                      <Link
                        href={subitem.url}
                        key={subitem.slug}
                        className="nav__menu-link"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="util">
          <div className="hidden sm:block">
            <LanguageSwitch initialLocale={initialLocale} />
          </div>
          <Link href="/search" aria-label="Αναζήτηση" className="util__btn">
            <SearchIcon className="h-4 w-4" />
          </Link>
          <a
            href="https://www.instagram.com/haunted.gr/"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="util__btn hidden sm:flex"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            aria-expanded={mobileOpen}
            className="util__btn lg:hidden"
            onClick={toggleMobileMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[var(--masthead-h)] z-[1300] overflow-y-auto bg-[var(--void)] lg:hidden"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <div className="frame py-6">
            {getNavigation(initialLocale).map((item) => (
              <div key={item.id}>
                {item.subitems ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between border-b py-4 text-left"
                      style={{ borderColor: "var(--rule)" }}
                      onClick={() =>
                        setOpenDropdown((current) => (current === item.id ? null : item.id))
                      }
                    >
                      <span className="mono mono--lit">{item.title}</span>
                      <CaretIcon
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.id && (
                      <div className="border-b py-2" style={{ borderColor: "var(--rule)" }}>
                        {item.subitems.map((subitem) => (
                          <Link
                            key={subitem.slug}
                            href={subitem.url}
                            className="foot__link"
                            onClick={closeMobileMenu}
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.url}
                    className="block border-b py-4"
                    style={{ borderColor: "var(--rule)" }}
                    onClick={closeMobileMenu}
                  >
                    <span className="mono mono--lit">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-6">
              <LanguageSwitch initialLocale={initialLocale} variant="mobile" />
              <a
                href="https://www.instagram.com/haunted.gr/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="util__btn"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
