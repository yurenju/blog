export const LOCALES = ['zh', 'ja', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const HTML_LANG: Record<Locale, string> = {
  zh: 'zh-Hant-TW',
  ja: 'ja',
  en: 'en',
};

export const HREFLANG: Record<Locale, string> = {
  zh: 'zh-Hant',
  ja: 'ja',
  en: 'en',
};

export const LANGUAGE_NAMES: Record<Locale, string> = {
  zh: '繁體中文',
  ja: '日本語',
  en: 'English',
};

export function localePath(locale: Locale, ...segments: string[]): string {
  const parts = [locale, ...segments].filter((s) => s !== '' && s !== undefined);
  return '/' + parts.join('/');
}

export interface UiText {
  nav: {
    home: string;
    tech: string;
    life: string;
    archives: string;
    about: string;
    subscription: string;
  };
  post: {
    alsoAvailableIn: string;
  };
  languageNotice: {
    mainlyInChinese: string;
    currentlyHas: string;
    articles: string;
    switchToChinese: string;
  };
  switchLanguage: string;
}

export const UI_TEXT: Record<Locale, UiText> = {
  zh: {
    nav: { home: '首頁', tech: '技術', life: '生活', archives: '歸檔', about: '關於', subscription: '訂閱' },
    post: { alsoAvailableIn: '其他語言版本：' },
    languageNotice: {
      mainlyInChinese: '本站主要以繁體中文撰寫',
      currentlyHas: '目前有',
      articles: '篇文章',
      switchToChinese: '切換到中文版以瀏覽所有內容',
    },
    switchLanguage: '切換語言',
  },
  ja: {
    nav: { home: 'ホーム', tech: '技術', life: '生活', archives: 'アーカイブ', about: '概要', subscription: '購読' },
    post: { alsoAvailableIn: 'Also available in:' },
    languageNotice: {
      mainlyInChinese: 'このサイトは主に繁体字中国語で書かれています',
      currentlyHas: '現在',
      articles: '件の記事があります',
      switchToChinese: '中国語版に切り替えるとすべてのコンテンツをご覧いただけます',
    },
    switchLanguage: '言語切替',
  },
  en: {
    nav: { home: 'Home', tech: 'Tech', life: 'Life', archives: 'Archives', about: 'About', subscription: 'Subscribe' },
    post: { alsoAvailableIn: 'Also available in:' },
    languageNotice: {
      mainlyInChinese: 'This site is mainly written in Traditional Chinese',
      currentlyHas: 'Currently there are',
      articles: 'articles',
      switchToChinese: 'Switch to the Chinese version to browse all content',
    },
    switchLanguage: 'Switch language',
  },
};

export function t(locale: Locale): UiText {
  return UI_TEXT[locale];
}

export interface LanguageLink {
  locale: Locale;
  href: string;
}

export interface BuildLanguageLinksInput {
  currentLocale: Locale;
  pathname: string;
  isPostPage: boolean;
  slug?: string;
  availableLocales?: Locale[];
}

/**
 * Build target hrefs for switching language from the current page.
 *
 * - Non-post pages: replace the locale prefix while preserving the rest of the path.
 * - Post pages: if the target locale has a translation, link to /{target}/posts/{slug};
 *   otherwise link to the target locale's home /{target}.
 */
export function buildLanguageLinks(input: BuildLanguageLinksInput): LanguageLink[] {
  const { currentLocale, pathname, isPostPage, slug, availableLocales } = input;
  const others = LOCALES.filter((l) => l !== currentLocale);
  return others.map((target) => {
    if (isPostPage && slug && availableLocales?.includes(target)) {
      return { locale: target, href: `/${target}/posts/${slug}` };
    }
    if (isPostPage) {
      return { locale: target, href: `/${target}` };
    }
    // Non-post page: swap prefix.
    const stripped = pathname.replace(/^\/(zh|ja|en)/, '');
    return { locale: target, href: `/${target}${stripped}` };
  });
}
