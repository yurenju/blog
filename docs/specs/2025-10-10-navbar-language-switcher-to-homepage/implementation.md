# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-10-10-navbar-language-switcher-to-homepage/prd.md`
**相關研究文件：** `docs/research/2025-10-10-language-switcher-ux-improvement.md`

> **重要提醒：** 實作過程中請經常參考上述文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 非功能性需求（性能、安全性等）
> - 系統架構和技術決策的背景脈絡
> - 研究文件中的深入分析和建議

## 相關檔案

- `components/LanguageSwitcher.tsx` - 需要修改的主要檔案，包含語言切換器的邏輯
- `components/ArticleLanguageIndicator.tsx` - 參考用，確保功能不受影響
- `components/Navbar.tsx` - 參考用，LanguageSwitcher 的使用位置
- `lib/i18n/locales.ts` - Locale 類型定義
- `lib/i18n/translations.ts` - 語言名稱翻譯
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [ ] 1. 修改 LanguageSwitcher 的 getLanguageUrl 函式
  - 1.1 開啟 `components/LanguageSwitcher.tsx` 檔案
  - 1.2 找到 `getLanguageUrl` 函式（位於第 20-29 行）
  - 1.3 移除所有路徑替換相關的邏輯（包括 `pathname.startsWith` 檢查和 `pathname.replace` 操作）
  - 1.4 簡化函式為單行邏輯：`return targetLocale === 'zh' ? '/' : \`/\${targetLocale}\`;`
  - 1.5 確保 `targetLocale` 參數的類型仍然是 `Locale`

- [ ] 2. 移除不再需要的 usePathname Hook
  - 2.1 檢查 `getLanguageUrl` 函式是否還使用 `pathname` 變數
  - 2.2 如果不再使用，移除 `const pathname = usePathname();` 這一行（第 17 行）
  - 2.3 如果不再使用，移除 `import { usePathname } from "next/navigation";` 這個 import（第 4 行）
  - 2.4 注意：保留 `usePathname` 不會影響功能，但移除可以稍微減少打包大小

- [ ] 3. 驗證程式碼品質
  - 3.1 執行 `npm run lint` 確保沒有 ESLint 錯誤或警告
  - 3.2 檢查 TypeScript 類型是否正確（IDE 應該沒有紅色波浪線）
  - 3.3 確認 `locale` 參數的類型仍然是 `Locale`
  - 3.4 確認下拉選單的其他邏輯（`locales.map`、`className` 條件）都沒有改變

- [ ] 4. 執行建構測試
  - 4.1 執行 `npm run build` 確保建構成功
  - 4.2 檢查建構輸出，確認沒有 TypeScript 或 Next.js 錯誤
  - 4.3 確認所有靜態頁面（首頁、文章頁、關於頁等）都正常生成
  - 4.4 檢查 console 沒有警告訊息

- [ ] 5. 執行驗收測試
  - 5.1 使用 AI 讀取 `acceptance.feature` 檔案
  - 5.2 透過指令或 MCP 瀏覽器操作執行每個場景
  - 5.3 驗證所有場景通過並記錄結果
  - 5.4 如有失敗場景，記錄詳細錯誤資訊並回報

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑：** `docs/research/2025-10-10-language-switcher-ux-improvement.md`

**當前實作的問題**：
- LanguageSwitcher 使用字串替換來切換語言前綴，但不檢查目標頁面是否存在
- 靜態路徑產生（`generateStaticParams()`）只會為存在的檔案建立路徑
- 訪問未產生的路徑會導致 404 錯誤

**設計洞察**：
- 建立分層的語言切換策略：
  - Navbar 語言切換器 = 全站語言環境切換（導向首頁）
  - ArticleLanguageIndicator = 文章特定的語言版本切換（基於 `availableLocales`）
- 這個分層設計符合使用者的認知模型，也符合 UX 最佳實踐

**技術架構**：
- 專案使用檔案命名規則區分語言版本：
  - 繁體中文：`index.md` 或 `原文標題.md`
  - 日文翻譯：`index.ja.md`
  - 英文翻譯：`index.en.md`
- 路由結構：
  - 繁體中文：`/posts/[slug]`（無語言前綴）
  - 其他語言：`/[locale]/posts/[slug]`

### 來自 PRD 的實作細節
> **文件路徑：** 參考上方 PRD 參考章節

**修改前的程式碼**：
```typescript
const getLanguageUrl = (targetLocale: Locale) => {
  // If we're on app/ (no locale prefix), navigate to /[locale]/path
  if (!pathname.startsWith('/zh') && !pathname.startsWith('/ja') && !pathname.startsWith('/en')) {
    return `/${targetLocale}${pathname}`;
  }

  // If we're on app/[locale]/, switch locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(zh|ja|en)/, '');
  return targetLocale === 'zh' ? pathWithoutLocale || '/' : `/${targetLocale}${pathWithoutLocale || ''}`;
};
```

**修改後的程式碼**：
```typescript
const getLanguageUrl = (targetLocale: Locale) => {
  return targetLocale === 'zh' ? '/' : `/${targetLocale}`;
};
```

**技術相依性**：
- 繼續使用 `next/link` 的 `<Link>` 元件進行客戶端路由
- 修改後不再需要 `usePathname()` Hook
- 繼續使用 `lib/i18n/locales` 中定義的 `Locale` 類型

**向後相容性保證**：
- 不影響現有的路由結構
- 不影響靜態頁面生成（`generateStaticParams()`）
- 不影響 SEO（`hreflang` 標籤由文章頁面的 `generateMetadata()` 管理）
- 不影響其他元件（ArticleLanguageIndicator、Navbar）的功能

### 關鍵技術決策

**為什麼選擇導向首頁而不是檢測翻譯狀態？**
1. **實作簡單**：只需要修改一個函式，邏輯清晰
2. **完全避免 404**：首頁是所有語言都有的頁面，保證不會出錯
3. **符合語義**：Navbar 的語言切換器代表「切換全站語言環境」
4. **維護成本低**：不需要客戶端資料載入或複雜的狀態管理
5. **符合 UX 最佳實踐**：業界建議在無翻譯時導向目標語言的首頁

**為什麼不需要特殊處理邊緣情況？**
- 查詢參數和 Hash：一律導向純淨的首頁路徑，保持簡單
- 同語言點擊：重新載入當前頁面是可接受的行為
- 404 頁面：不需要特殊處理，因為首頁永遠存在

**效能影響**：
- 正面影響：移除了 `pathname` 的讀取和字串處理
- 邏輯更簡單，執行速度更快
- 無負面影響
