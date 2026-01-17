"use client";

import { cn } from "@/lib/cn";
import { useLanguage } from "../providers";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-white px-1 py-1",
        "ring-1 ring-gray-200/60 shadow-sm",
        "dark:bg-dark-900 dark:ring-dark-800"
      )}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        aria-pressed={language === "pt"}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold uppercase transition",
          language === "pt"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-gray-600 dark:text-gray-300"
        )}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold uppercase transition",
          language === "en"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-gray-600 dark:text-gray-300"
        )}
      >
        EN
      </button>
    </div>
  );
}
