export const LOCALES = ['zh', 'ja', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export type HtmlLang = 'zh-Hant-TW' | 'ja' | 'en';
export const HTML_LANG: Record<Locale, HtmlLang> = {
  zh: 'zh-Hant-TW',
  ja: 'ja',
  en: 'en',
};

export type Hreflang = 'zh-Hant' | 'ja' | 'en';
export const HREFLANG: Record<Locale, Hreflang> = {
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
  site: {
    description: string;
  };
  rss: {
    allPosts: string;
    tech: string;
    life: string;
  };
  archives: {
    moreArchived: string;
  };
  theme: {
    toggle: string;
  };
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
    site: {
      description: '撰寫就是一種思考方式，發佈與分享只是副產品，而真正的意義是在自我的知識脈絡裡面有了歸屬與連結。',
    },
    rss: {
      allPosts: '全部文章',
      tech: '技術',
      life: '生活',
    },
    archives: { moreArchived: '更多歸檔文章' },
    theme: { toggle: '切換主題' },
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
    site: {
      description: '書くことは思考の一形態であり、公開と共有は副産物に過ぎません。真の意味は、自己の知識体系における帰属とつながりにあります。',
    },
    rss: {
      allPosts: 'すべての記事',
      tech: '技術',
      life: '生活',
    },
    archives: { moreArchived: 'その他のアーカイブ記事' },
    theme: { toggle: 'テーマ切替' },
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
    site: {
      description: 'Writing is a form of thinking. Publishing and sharing are just byproducts. The real meaning lies in finding belonging and connections within one\'s own knowledge framework.',
    },
    rss: {
      allPosts: 'All Posts',
      tech: 'Tech',
      life: 'Life',
    },
    archives: { moreArchived: 'More archived posts' },
    theme: { toggle: 'Toggle theme' },
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
 * Routes that only exist for the zh locale (no ja/ja translations of these
 * pages). Switching to ja/en from one of these should fall back to the target
 * locale's home page rather than producing a 404.
 */
const ZH_ONLY_PATH_PREFIXES = ['/archives'];

function isZhOnlyPath(pathWithoutLocale: string): boolean {
  return ZH_ONLY_PATH_PREFIXES.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(`${p}/`),
  );
}

/**
 * Build target hrefs for switching language from the current page.
 *
 * - Non-post pages: replace the locale prefix while preserving the rest of the path.
 *   When the current path is zh-only (e.g. /archives) and the target locale is
 *   not zh, link to the target locale's home instead of a non-existent URL.
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
    if (target !== 'zh' && isZhOnlyPath(stripped)) {
      return { locale: target, href: `/${target}` };
    }
    return { locale: target, href: `/${target}${stripped}` };
  });
}
