# 初步需求整理

## 技術棧選擇
- PRD-001: 使用 TypeScript 和 Next.js 來重構部落格。
- PRD-001: 目標是生成完全靜態的網站，類似於 Hugo 的功能。

## 內容管理
- PRD-002: 所有的部落格內容都存放在 `content` 目錄中。
- PRD-002: 每篇文章由一個目錄表示，目錄中的第一個 `.md` 文件作為文章內容。
- 需要支援 Obsidian 的雙方括號連結格式，方便從 Obsidian 轉移內容。

## 網址結構
- 每篇文章的網址需要與舊網站保持一致，以確保 SEO 和用戶書籤的有效性。
- 所有在 `content/posts` 的文章都會放在 `/posts` 底下。
- 如果 `.md` 文件中有 `slug`，則使用 `slug` 作為網址的一部分。
- 如果沒有 `slug`，則使用目錄名稱作為網址的一部分。
- `/posts` 路徑下需要有一個網頁，列出所有文章的列表。
- 每個列表項應包含文章的標題和鏈接，鏈接指向該文章的詳細頁面。
- 每個分類（如 `life` 和 `tech`）需要有獨立的頁面，並允許不同的排版。
- 分類頁面的路徑應為 `/category-name`，例如 `/life` 和 `/tech`。

## 圖片管理
- 需要簡化封面圖片的管理流程，可能需要自動化或更直觀的方式來處理圖片。
- 每篇文章的資源（如圖片）可以放在該目錄下，或在該目錄下創建一個專門的資源子目錄。

## 開發環境
- PRD-001: 由於對 Golang 的掌握有限，選擇更熟悉的技術棧來提高開發效率和靈活性。

## 網站功能
- 希望能夠輕鬆地調整網站的外觀和功能，以滿足個人需求。
- 支援 RSS 功能，提供整個部落格的 RSS 以及針對不同分類的 RSS。 