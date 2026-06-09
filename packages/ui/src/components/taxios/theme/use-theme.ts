"use client";

/**
 * TaxiOS theme controller — dependency-free dark mode.
 *
 * Why hand-rolled instead of `next-themes`?
 *   - No extra dependency in this package.
 *   - The whole design system is driven by CSS custom properties, so all we
 *     ever need to do is toggle a single `dark` class on <html>. Every token
 *     in `tokens.css` (the `.dark { ... }` block) flips automatically.
 *
 * Behaviour:
 *   - Three modes: "light", "dark", "system".
 *   - "system" follows `prefers-color-scheme` and live-updates if the OS theme
 *     changes while the app is open.
 *   - The chosen mode is persisted to localStorage under `taxios-theme`.
 *   - Resolves to the actual applied theme ("light" | "dark") for UI labels.
 *
 * ----------------------------------------------------------------------------
 * HOW TO WIRE THIS INTO YOUR PROJECT
 * ----------------------------------------------------------------------------
 * 1. Make sure `tokens.css` (with the `.dark { ... }` block) is imported once,
 *    globally (e.g. in your root layout / globals.css).
 * 2. Add the anti-flash script to your root layout <head> BEFORE hydration so
 *    the page never flashes light before switching to dark. Copy the string
 *    exported as `THEME_NO_FLASH_SCRIPT` below into a <script> tag:
 *
 *      // app/layout.tsx
 *      <head>
 *        <script dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }} />
 *      </head>
 *
 * 3. Use the hook anywhere under that layout:
 *
 *      const { theme, resolvedTheme, setTheme, toggle } = useTheme();
 *
 *    or just drop in the <ThemeToggle /> component.
 * ----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "taxios-theme";

/**
 * Inline script that applies the persisted theme before React hydrates, to
 * prevent a light→dark flash on first paint. Inject it into the document
 * <head> via a <script> tag in your root layout.
 */
export const THEME_NO_FLASH_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=s==="dark"||((s===null||s==="system")&&m);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return systemPrefersDark() ? "dark" : "light";
  }

  return mode;
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  // Keeps native UI (scrollbars, form controls) in sync with the theme.
  root.style.colorScheme = resolved;
}

export type UseThemeResult = {
  /** The user's chosen mode, including "system". */
  theme: ThemeMode;
  /** The theme actually applied right now ("light" or "dark"). */
  resolvedTheme: ResolvedTheme;
  /** Set an explicit mode and persist it. */
  setTheme: (mode: ThemeMode) => void;
  /** Convenience: flip between light and dark (drops "system"). */
  toggle: () => void;
};

export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Sync from storage on mount (after hydration) so SSR and client agree.
  useEffect(() => {
    const mode = readStoredMode();
    const resolved = resolveTheme(mode);
    setThemeState(mode);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Follow OS changes while in "system" mode.
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = media.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    const resolved = resolveTheme(mode);
    setThemeState(mode);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggle };
}
