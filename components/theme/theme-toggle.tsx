"use client";

import { useMemo } from "react";

import { useTheme } from "./theme-provider";

type ThemeToggleProps = {
  className?: string;
  variant?: "default" | "compact";
};

export function ThemeToggle({ className = "", variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const { label, icon } = useMemo(() => {
    if (theme === "light") {
      return {
        label: "Φωτεινό θέμα",
        icon: (
          <svg
            aria-hidden
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1.5M12 19.5V21M4.219 4.219l1.06 1.06M18.72 18.72l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.06-1.061M18.72 5.28l1.061-1.061M12 6.75a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5Z"
            />
          </svg>
        ),
      };
    }

    return {
      label: "Σκούρο θέμα",
      icon: (
        <svg
          aria-hidden
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79Z"
          />
        </svg>
      ),
    };
  }, [theme]);

  const baseClasses =
    variant === "compact"
      ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-n-6 text-n-1 transition hover:border-primary-400 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-70"
      : "inline-flex items-center gap-2 rounded-full border border-n-6 px-4 py-2 text-sm font-medium text-n-1 transition hover:border-primary-400 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <button
      type="button"
      className={`${baseClasses} ${className}`.trim()}
      onClick={toggleTheme}
      aria-label="Εναλλαγή θέματος"
      title="Εναλλαγή θέματος"
    >
      {icon}
      {variant === "compact" ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="whitespace-nowrap">{label}</span>
      )}
    </button>
  );
}
