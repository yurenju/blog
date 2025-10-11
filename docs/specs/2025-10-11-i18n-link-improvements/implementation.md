# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-10-11-i18n-link-improvements/prd.md`
**相關研究文件：** `docs/research/2025-10-11-explicit-locale-in-links.md`

> **重要提醒：** 實作過程中請經常參考上述文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 非功能性需求（性能、安全性等）
> - 系統架構和技術決策的背景脈絡
> - 研究文件中的深入分析和建議

## 相關檔案

- `lib/posts.ts` - 文章資料處理邏輯，需新增分類文章計數函式
- `components/LanguageNotice.tsx` - 語言提示元件，需增強分類上下文感知和標點符號處理
- `components/LanguageSwitcher.tsx` - 語言切換器，需實作路徑保持機制
- `components/pages/CategoryPage.tsx` - 分類頁面，需傳遞分類參數給 LanguageNotice
- `components/pages/PostsPage.tsx` - 文章列表頁面，需確認維持原有行為
- `components/Navbar.tsx` - 導航列，需更新為使用明確的 locale 前綴
- `components/pages/HomePage.tsx` - 首頁，需更新連結生成邏輯
- `components/PostsList.tsx` - 文章列表元件，需更新連結生成邏輯
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [x] 1. 新增分類文章計數函式
  - 1.1 在 `lib/posts.ts` 中新增 `getPostCountByCategoryAndLocale(category: Category, locale: Locale)` 函式
  - 1.2 函式應重用現有的 `fetchCategoryPosts` 函式以保持一致性
  - 1.3 函式回傳指定分類和語言的文章數量
  - 1.4 確保函式簽章和型別定義正確

- [x] 2. 更新所有元件使用明確的 locale 前綴
  - 2.1 修改 `components/Navbar.tsx`：移除 `prefix` 條件判斷，改用 `/${locale}/` 格式
  - 2.2 修改 `components/pages/HomePage.tsx`：更新連結生成邏輯為 `/${locale}/life` 和 `/${locale}/tech`
  - 2.3 修改 `components/PostsList.tsx`：更新文章連結為 `/${locale}/posts/${slug}` 格式
  - 2.4 確保所有連結都包含明確的 locale 前綴，包括中文頁面

- [x] 3. 增強 LanguageNotice 元件
  - 3.1 更新型別定義，新增可選的 `category?: Category` prop
  - 3.2 實作動態連結生成邏輯：根據 `category` 決定連結路徑（`/zh/tech`、`/zh/life` 或 `/zh/posts`）
  - 3.3 實作標點符號國際化：根據 locale 使用正確的標點符號（英文用 `.`，中文和日文用 `。`）
  - 3.4 確保連結使用 `/zh/` 前綴格式
  - 3.5 更新元件邏輯以處理 `category` 為 undefined 的情況（全部文章頁面）

- [x] 4. 更新頁面元件以傳遞分類資訊
  - 4.1 修改 `components/pages/CategoryPage.tsx`：
    - 使用 `getPostCountByCategoryAndLocale('zh', category)` 取得該分類的中文文章數
    - 傳遞 `category` prop 給 LanguageNotice 元件
  - 4.2 確認 `components/pages/PostsPage.tsx` 維持原有行為（不傳遞 category prop）

- [x] 5. 增強 LanguageSwitcher 元件實作路徑保持
  - 5.1 引入 Next.js 的 `usePathname()` hook 取得當前路徑
  - 5.2 實作路徑解析邏輯，識別路徑類型（首頁、about、subscription、分類、文章詳情）
  - 5.3 實作智慧型語言切換邏輯：
    - 對於首頁、about、subscription、分類頁面：保持在相同類型的頁面
    - 對於文章詳情頁：導向目標語言的首頁
  - 5.4 確保所有切換後的連結都使用 `/${locale}/` 格式，包括中文

- [x] 6. 執行驗收測試
  - 6.1 使用 AI 讀取 `acceptance.feature` 檔案
  - 6.2 透過指令或 MCP 瀏覽器操作執行每個場景
  - 6.3 驗證所有場景通過並記錄結果

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑：** `docs/research/2025-10-11-explicit-locale-in-links.md`

**問題根源分析**：
- LanguageNotice 元件缺少分類上下文，無法區分不同的使用情境（全部文章、tech 分類、life 分類）
- 現有程式碼使用條件判斷 `const prefix = locale === 'zh' ? '' : '/${locale}'`，導致中文連結缺少 locale 前綴
- 標點符號在元件層級硬編碼為中文全形句號，未考慮 locale 差異

**現有 locale 處理模式**：
```typescript
// 現有模式（需要移除）
const prefix = locale === 'zh' ? '' : `/${locale}`;
<Link href={`${prefix}/posts`}>...</Link>
```

**路由架構**：
- 專案採用 Next.js 15 App Router 架構
- 使用 `[locale]` 動態路由實現國際化
- 根路徑（如 `/tech`、`/life`）僅用於重定向到 `/zh/` 版本
- 實際頁面都在 `app/[locale]/` 目錄下

**業界最佳實踐參考**：
- 使用 `usePathname()` hook 取得當前路徑
- 手動解析和替換路徑中的 locale 部分
- 透過 `useRouter().push()` 進行導航

**可選 Props 處理模式**：
```typescript
interface LanguageNoticeProps {
  locale: Locale;
  chinesePostCount: number;
  category?: Category;  // 可選：undefined 表示全部文章頁面
}

export function LanguageNotice({
  locale,
  chinesePostCount,
  category = undefined  // 明確的預設值
}: LanguageNoticeProps) {
  // 根據 category 決定連結路徑
  const targetPath = category ? `/${category}` : '/posts';
  // ...
}
```

### 來自 PRD 的實作細節
> **文件路徑：** `docs/specs/2025-10-11-i18n-link-improvements/prd.md`

**連結生成邏輯**（重要設計原則）：
```typescript
// 正確：所有語言都包含 locale
const fullPath = `/${locale}${targetPath}`;
// 例如：/zh/tech, /ja/life, /en/posts

// 錯誤：不要使用這種模式
// const prefix = locale === 'zh' ? '' : `/${locale}`;
```

**標點符號選擇邏輯**：
```typescript
const period = locale === 'en' ? '.' : '。';
```

**LanguageNotice 型別定義**：
```typescript
interface LanguageNoticeProps {
  locale: Locale;
  chinesePostCount: number;
  category?: Category;  // 可選：undefined 表示全部文章頁面
}
```

**資料層函式簽章**：
```typescript
async function getPostCountByCategoryAndLocale(
  category: Category,
  locale: Locale
): Promise<number>
```

**LanguageSwitcher 實作要點**：
- 使用 `usePathname()` 取得當前路徑（例如：`/zh/life`）
- 解析路徑識別類型（首頁、about、分類、文章詳情）
- 文章詳情頁特殊處理：導向目標語言首頁
- 其他頁面：保持相同類型的頁面

### 關鍵技術決策
1. **統一 locale 前綴策略**：所有內部連結都使用明確的 locale 前綴（`/zh/`、`/ja/`、`/en/`），不使用條件判斷
2. **分類上下文感知**：LanguageNotice 透過可選的 `category` prop 適應不同使用情境
3. **標點符號國際化**：在元件層級根據 locale 動態選擇標點符號
4. **路徑保持機制**：LanguageSwitcher 使用 `usePathname()` 解析當前路徑並構建對應的 locale 路徑
5. **文章詳情頁例外處理**：由於可能缺少翻譯，切換語言時導向首頁而非文章詳情頁
6. **重用現有函式**：`getPostCountByCategoryAndLocale` 重用 `fetchCategoryPosts` 以保持程式碼一致性
