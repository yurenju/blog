// src/lib/locale-helpers.ts
import { LOCALES, type Locale } from './i18n';

/**
 * Infer post locale from the source filename (without extension).
 * `index.ja` -> ja, `index.en` -> en, anything else -> zh.
 */
export function inferLocaleFromFilename(filename: string): Locale {
  if (filename === 'index.ja') return 'ja';
  if (filename === 'index.en') return 'en';
  return 'zh';
}

/**
 * Group rows by `${group}::${dirname}` and produce the sorted locale list per group.
 * Locales are sorted to follow LOCALES order (zh, ja, en) so the output is stable.
 */
export function computeAvailableLocales(
  rows: { group: string; dirname: string; locale: Locale }[],
): Map<string, Locale[]> {
  const sets = new Map<string, Set<Locale>>();
  for (const row of rows) {
    const key = `${row.group}::${row.dirname}`;
    let set = sets.get(key);
    if (!set) {
      set = new Set();
      sets.set(key, set);
    }
    set.add(row.locale);
  }
  const result = new Map<string, Locale[]>();
  for (const [key, set] of sets) {
    result.set(key, LOCALES.filter((l) => set.has(l)));
  }
  return result;
}
