# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-10-10-translate-command/prd.md`

> **重要提醒：** 實作過程中請經常參考上述文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 翻譯策略和品質要求
> - 各類內容元素的處理規則
> - 翻譯範例參考檔案

## 相關檔案

- `.claude/commands/translate.md` - Slash command 的主要實作檔案，包含完整的翻譯提示詞和邏輯
- `public/posts/2025-04-23_ai-coding-doesnt-understand-me/叫 AI 幫我寫程式，結果他聽不懂人話？.md` - 翻譯範例的中文原文
- `public/posts/2025-04-23_ai-coding-doesnt-understand-me/index.ja.md` - 翻譯範例的日文版本
- `public/posts/2025-04-23_ai-coding-doesnt-understand-me/index.en.md` - 翻譯範例的英文版本
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [ ] 1. 建立 `.claude/commands/` 目錄結構
  - 1.1 檢查 `.claude/commands/` 目錄是否存在，若不存在則建立
  - 1.2 確認目錄權限正確，可以寫入檔案

- [ ] 2. 撰寫 `/translate` 指令的 frontmatter 配置
  - 2.1 定義 `argument-hint: <file_path>` 參數提示
  - 2.2 設定 `description` 為簡潔的指令說明
  - 2.3 配置 `allowed-tools: Read, Write, WebSearch` 確保指令可使用必要工具
  - 2.4 確認 frontmatter 格式符合 Claude Code 規範

- [ ] 3. 實作文章讀取與 frontmatter 解析邏輯
  - 3.1 使用 Read 工具讀取指定路徑的中文 markdown 檔案
  - 3.2 解析 frontmatter，提取 `categories` 和 `title` 欄位
  - 3.3 如果沒有 `title` 欄位，從檔名（不含副檔名）提取標題
  - 3.4 根據 `categories` 判斷文章分類（tech/life），若無則根據內容自動判斷
  - 3.5 處理 frontmatter 格式錯誤的情況，給予警告但繼續處理

- [ ] 4. 實作翻譯策略邏輯
  - 4.1 根據文章分類（tech/life）選擇對應的翻譯策略
  - 4.2 Tech 分類：使用理性、專業的口吻，精準翻譯技術術語
  - 4.3 Life 分類：使用抒情、表達性的口吻，根據語境調整而非逐字翻譯
  - 4.4 在提示詞中明確說明兩種翻譯策略的差異和要求

- [ ] 5. 實作內容元素處理規則
  - 5.1 程式碼區塊：翻譯中文註解，保留英文註解和程式碼本身
  - 5.2 圖片連結：翻譯 alt text，保持圖片路徑不變
  - 5.3 超連結：翻譯連結文字，保持 URL 不變
  - 5.4 作品名稱：使用 WebSearch 查詢官方翻譯名稱（書籍、動畫、漫畫、電影等）
  - 5.5 人名和地名：使用 WebSearch 確認目標語言的正確寫法和慣用表記

- [ ] 6. 實作日文翻譯功能
  - 6.1 根據分類選擇翻譯策略進行日文翻譯
  - 6.2 翻譯 title 欄位為日文
  - 6.3 翻譯文章內容，正確處理所有內容元素
  - 6.4 對於作品名稱和人名，使用 WebSearch 查詢日文官方名稱
  - 6.5 產生日文翻譯的中文回譯
  - 6.6 組合 frontmatter、翻譯內容和回譯，格式符合規範

- [ ] 7. 實作英文翻譯功能
  - 7.1 根據分類選擇翻譯策略進行英文翻譯
  - 7.2 翻譯 title 欄位為英文
  - 7.3 翻譯文章內容，正確處理所有內容元素
  - 7.4 對於作品名稱和人名，使用 WebSearch 查詢英文官方名稱
  - 7.5 產生英文翻譯的中文回譯
  - 7.6 組合 frontmatter、翻譯內容和回譯，格式符合規範

- [ ] 8. 實作檔案輸出邏輯
  - 8.1 解析原始檔案路徑，取得目錄位置
  - 8.2 使用 Write 工具將日文翻譯儲存為 `index.ja.md`（與原始檔案同目錄）
  - 8.3 使用 Write 工具將英文翻譯儲存為 `index.en.md`（與原始檔案同目錄）
  - 8.4 確保路徑處理正確（支援 Windows 和 Unix 路徑格式）
  - 8.5 檔案不存在時提供清楚的錯誤訊息

- [ ] 9. 撰寫完整的提示詞內容
  - 9.1 整合所有翻譯規則、策略和內容處理邏輯
  - 9.2 加入範例說明，參考現有翻譯範例
  - 9.3 說明中文回譯的格式和目的
  - 9.4 加入錯誤處理指引
  - 9.5 確保提示詞清晰、完整且易於理解

- [ ] 10. 執行驗收測試
  - 10.1 使用 AI 讀取 acceptance.feature 檔案
  - 10.2 透過指令執行每個場景
  - 10.3 驗證所有場景通過並記錄結果
  - 10.4 如有失敗場景，分析原因並修正實作

## 實作參考資訊

### 來自 PRD 的實作細節
> **文件路徑：** 參考上方 PRD 參考章節

**Slash Command Frontmatter 配置範例**：
```yaml
---
argument-hint: <file_path>
description: Translate Chinese blog post to Japanese and English
allowed-tools: Read, Write, WebSearch
---
```

**翻譯檔案格式**：
```markdown
---
title: [翻譯後的標題]
---

[翻譯後的內容]

---
[中文回譯內容]
```

**檔案結構範例**：
```
public/posts/YYYY-MM-DD_slug/
├── 原始中文標題.md          # 原始中文文章
├── index.ja.md              # 日文翻譯
└── index.en.md              # 英文翻譯
```

**翻譯策略差異**：

1. **Tech 分類**：
   - 理性、專業的口吻
   - 精準翻譯技術術語和概念
   - 考慮目標語言讀者的閱讀習慣
   - 保持技術文章的清晰度和準確性

2. **Life 分類**：
   - 抒情、表達性的口吻
   - 根據目標語言的語境進行調整，不需逐字翻譯
   - 注重閱讀節奏和情感傳達
   - 可適度改寫以符合目標語言的表達習慣

**作品名稱查詢範例**：
- 中文：「歷史之眼」
- 日文：「ヒストリエ」(Historie)
- 英文：Historie
- 需使用 WebSearch 查詢，不可直譯

**人名查詢範例**：
- 中文：浦澤直樹
- 日文：浦沢直樹
- 英文：Naoki Urasawa
- 需使用 WebSearch 確認正確寫法

### 關鍵技術決策

1. **工具權限管理**：
   - 使用 `allowed-tools` frontmatter 配置，讓指令可直接使用 Read, Write, WebSearch
   - 避免使用者需要額外授權，提升使用體驗

2. **路徑處理**：
   - 從原始檔案路徑提取目錄位置
   - 支援 Windows (`\`) 和 Unix (`/`) 路徑分隔符
   - 確保輸出檔案與原始檔案在同一目錄

3. **錯誤處理策略**：
   - 檔案不存在：提供清楚錯誤訊息
   - Frontmatter 格式錯誤：警告但繼續處理
   - 無法判斷分類：預設為 tech 並告知使用者

4. **翻譯品質保證**：
   - 所有翻譯都提供中文回譯，方便使用者驗證
   - 使用 WebSearch 確保作品名稱和人名的正確性
   - 根據文章分類採用不同翻譯策略

5. **提示詞設計**：
   - 包含完整的翻譯規則和範例
   - 明確說明兩種翻譯策略的差異
   - 提供清晰的內容元素處理指引
   - 加入錯誤處理和特殊情況的說明
