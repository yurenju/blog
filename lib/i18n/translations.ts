import type { Locale } from './locales'

export type Translations = {
  nav: {
    home: string
    about: string
    subscription: string
    allPosts: string
  }
  categories: {
    tech: string
    life: string
    shorts: string
  }
  post: {
    writtenBy: string
    alsoAvailableIn: string
  }
  languageNames: {
    zh: string
    ja: string
    en: string
  }
  languageNotice: {
    mainlyInChinese: string
    currentlyHas: string
    articles: string
    switchToChinese: string
  }
  site: {
    description: string
  }
  theme: {
    toggleToDark: string
    toggleToLight: string
  }
}

export const translations: Record<Locale, Translations> = {
  zh: {
    nav: {
      home: '首頁',
      about: '關於',
      subscription: '訂閱',
      allPosts: '全部文章',
    },
    categories: {
      tech: '技術',
      life: '生活',
      shorts: '照片',
    },
    post: {
      writtenBy: '撰於',
      alsoAvailableIn: 'Also available in:',
    },
    languageNames: {
      zh: '繁體中文',
      ja: '日本語',
      en: 'English',
    },
    languageNotice: {
      mainlyInChinese: '本站主要以繁體中文撰寫',
      currentlyHas: '目前有',
      articles: '篇文章',
      switchToChinese: '切換到中文版以瀏覽所有內容',
    },
    site: {
      description: '撰寫就是一種思考方式，發佈與分享只是副產品，而真正的意義是在自我的知識脈絡裡面有了歸屬與連結。',
    },
    theme: {
      toggleToDark: '切換至暗色模式',
      toggleToLight: '切換至亮色模式',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      about: '概要',
      subscription: '購読',
      allPosts: 'すべての記事',
    },
    categories: {
      tech: '技術',
      life: '生活',
      shorts: '写真',
    },
    post: {
      writtenBy: '',
      alsoAvailableIn: 'Also available in:',
    },
    languageNames: {
      zh: '繁體中文',
      ja: '日本語',
      en: 'English',
    },
    languageNotice: {
      mainlyInChinese: 'このサイトは主に繁体字中国語で書かれています',
      currentlyHas: '現在',
      articles: '件の記事があります',
      switchToChinese: '中国語版に切り替えるとすべてのコンテンツをご覧いただけます',
    },
    site: {
      description: '書くことは思考の一形態であり、公開と共有は副産物に過ぎません。真の意味は、自己の知識体系における帰属とつながりにあります。',
    },
    theme: {
      toggleToDark: 'ダークモードに切り替え',
      toggleToLight: 'ライトモードに切り替え',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      subscription: 'Subscribe',
      allPosts: 'All Posts',
    },
    categories: {
      tech: 'Tech',
      life: 'Life',
      shorts: 'Photos',
    },
    post: {
      writtenBy: 'Written on',
      alsoAvailableIn: 'Also available in:',
    },
    languageNames: {
      zh: '繁體中文',
      ja: '日本語',
      en: 'English',
    },
    languageNotice: {
      mainlyInChinese: 'This site is mainly written in Traditional Chinese',
      currentlyHas: 'Currently there are',
      articles: 'articles',
      switchToChinese: 'Switch to the Chinese version to browse all content',
    },
    site: {
      description: 'Writing is a form of thinking. Publishing and sharing are just byproducts. The real meaning lies in finding belonging and connections within one\'s own knowledge framework.',
    },
    theme: {
      toggleToDark: 'Switch to dark mode',
      toggleToLight: 'Switch to light mode',
    },
  },
}

export function getTranslation(locale: Locale): Translations {
  return translations[locale]
}
