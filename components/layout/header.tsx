"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/constants/navigation";

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

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const isDarkBackground = useMemo(() => pathname !== "/", [pathname]);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((current) => {
      const next = !current;
      if (!next) {
        setOpenDropdown(null);
      }
      return next;
    });
  }, []);

  useDisableBodyScroll(mobileOpen);

  useEffect(() => {
    if (!mobileOpen && !openDropdown) {
      return;
    }

    closeMobileMenu();
  }, [closeMobileMenu, pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1200] border-b border-n-6 transition-colors ${
        mobileOpen
          ? "bg-n-8"
          : isDarkBackground
            ? "bg-n-8/90 backdrop-blur-sm"
            : "bg-n-8/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 py-4 lg:px-7.5 xl:px-10">
        <div className="flex w-1/2 items-center">
          <Link
            href="/"
            className="block text-sm font-semibold uppercase tracking-[0.32em] text-n-1 transition-colors hover:text-color-1"
          >
            haunted.gr
          </Link>
        </div>

        <nav className="hidden w-1/2 items-center justify-end lg:flex">
          <div className="relative flex items-center gap-2">
            {navigation.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === item.url
                  : pathname.startsWith(item.url) && item.url !== "/";

              return (
                <div key={item.id} className="relative group">
                  {item.subitems ? (
                    <>
                      <button
                        type="button"
                        className={`flex items-center whitespace-nowrap px-4 py-3 font-code text-xs font-semibold uppercase tracking-widest transition-colors hover:text-color-1 xl:px-6 xl:text-sm ${
                          isActive ? "text-n-1" : "text-n-1/70"
                        }`}
                        onClick={() =>
                          setOpenDropdown((current) => (current === item.id ? null : item.id))
                        }
                        onMouseEnter={() => setOpenDropdown(item.id)}
                      >
                        {item.title}
                        <svg
                          className="ml-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div
                        className={`absolute left-1/2 top-full hidden -translate-x-1/2 rounded-lg border border-n-6 bg-n-8/95 py-2 shadow-xl transition group-hover:block ${
                          openDropdown === item.id ? "lg:block" : ""
                        }`}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {item.subitems.map((subitem) => (
                          <Link
                            href={subitem.url}
                            key={subitem.slug}
                            className="block px-5 py-2 text-sm text-n-1/80 transition hover:bg-n-7 hover:text-n-1"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.url}
                      className={`block px-4 py-3 font-code text-xs font-semibold uppercase tracking-widest transition-colors hover:text-color-1 xl:px-6 xl:text-sm ${
                        isActive ? "text-n-1" : "text-n-1/70"
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="flex w-1/2 justify-end lg:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-n-6 text-n-1 transition hover:border-color-1 hover:text-color-1"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-6 w-6"
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

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] bg-n-8 lg:hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[.03] bg-n-8" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-n-8/0 to-n-8/100" />

          <button
            type="button"
            aria-label="Κλείσιμο μενού"
            className="absolute right-5 top-5 z-[81] flex h-10 w-10 items-center justify-center text-n-1 transition hover:text-color-1"
            onClick={(event) => {
              event.stopPropagation();
              closeMobileMenu();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-8 w-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-[81] flex h-full flex-col pt-16">
            <div
              className="mobile-menu-container flex-1 overflow-y-auto px-4 pb-10 pt-6 no-scrollbar"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {navigation.map((item) => (
                <div key={item.id} className="mb-4">
                  {item.subitems ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between border-b border-n-6 px-4 py-4 text-left text-xl uppercase text-n-1"
                        onClick={() =>
                          setOpenDropdown((current) => (current === item.id ? null : item.id))
                        }
                      >
                        <span>{item.title}</span>
                        <svg
                          className={`h-5 w-5 transition-transform ${
                            openDropdown === item.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openDropdown === item.id && (
                        <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-lg bg-n-7 px-2 pb-2 pt-2 no-scrollbar">
                          {item.subitems.map((subitem) => (
                            <Link
                              key={subitem.slug}
                              href={subitem.url}
                              className="block border-b border-n-6 px-4 py-3 text-lg text-n-1 transition-colors hover:bg-n-6 last:border-b-0"
                              onClick={() => {
                                closeMobileMenu();
                              }}
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
                      className="block border-b border-n-6 px-4 py-4 text-xl uppercase text-n-1 transition-colors hover:text-color-1"
                      onClick={closeMobileMenu}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}

              <a
                href="https://www.instagram.com/haunted.gr/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-3 px-4 text-lg text-n-1 transition-colors hover:text-color-1"
              >
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
