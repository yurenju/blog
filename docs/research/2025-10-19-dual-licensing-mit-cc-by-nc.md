# 部落格專案雙重授權研究報告

## 執行摘要

本研究探討如何在同一個 GitHub 儲存庫中實施雙重授權機制,將程式碼以 MIT License 授權,同時將部落格文章內容以 Creative Commons BY-NC 4.0 授權。經過深入調查業界最佳實踐、技術實作方案以及法律考量後,我們確認了這個雙重授權策略的可行性,並提供了完整的實施指引。

關鍵發現包括:
- **業界認可的做法**: 大型開源專案如 dotnet core、React.js 已採用類似的雙重授權模式(程式碼 MIT、文件 CC BY 4.0),證明這是一個成熟且被廣泛接受的實踐方式。
- **GitHub 原生支援**: GitHub 支援在單一儲存庫中放置多個 LICENSE 檔案,並會自動在專案頁面中顯示,讓使用者容易發現不同的授權條款。
- **程式碼片段的處理策略**: 文章中的程式碼範例建議採用雙重授權方式,同時適用文章的 CC BY-NC 4.0 和程式碼的 MIT License,讓讀者可以根據使用場景選擇適當的授權。

## 背景與脈絡

這是一個基於 Next.js 15 構建的個人部落格專案,使用靜態導出方式生成網站。專案的特殊性在於它同時包含兩種截然不同性質的內容:一方面是構建部落格的程式碼(包括 TypeScript、React 元件、樣式表等技術實作),另一方面是作者創作的部落格文章內容(從 2003 年至今超過 20 年的技術文章和生活隨筆)。

目前專案尚未設定明確的授權條款,README.md 中僅註明「此專案為個人部落格,內容版權歸作者所有」。隨著開源協作的普及以及內容保護意識的提升,作者希望建立更明確的授權機制:讓程式碼可以被自由使用和修改(採用寬鬆的 MIT License),同時保護文章內容不被商業利用(採用 Creative Commons BY-NC 4.0)。

這個需求反映了一個普遍存在的問題:當一個專案同時包含技術實作和創作內容時,如何用適合的授權條款來保護不同類型的智慧財產權?

## 研究問題與發現過程

### 初始問題

使用者的核心問題是:「我想要把文章跟程式碼分開授權的話,想知道 LICENSE 該怎麼寫。我想要程式碼是 MIT,文章是 CC-by-nc」

### 釐清過程

為了深入理解需求並提供準確的建議,我們進行了以下釐清:

1. **授權範圍確認**: 確認「程式碼」指所有原始碼檔案(`.ts`, `.tsx`, `.js`, `.css` 等),「文章」包含 `public/posts/` 和 `public/pages/` 目錄下的所有 Markdown 檔案。
2. **CC 版本選擇**: 確認使用最新的 CC BY-NC 4.0 版本。
3. **現有內容處理**: 確認所有從 2000 年至今的文章都要套用新的授權,無需排除任何文章。
4. **授權聲明位置**: 確認程式碼授權聲明放在 README.md,文章授權聲明放在 about.md。
5. **媒體檔案處理**: 確認圖片等媒體檔案歸類為文章內容,使用 CC BY-NC 4.0。

### 關鍵問題定義

經過釐清後,研究的核心問題聚焦在:
1. 如何在單一儲存庫中正確實施雙重授權?
2. 文章中的程式碼範例應該如何授權?
3. LICENSE 檔案的結構和內容該如何組織?
4. 如何確保使用者容易理解和遵守這兩種授權?

## 技術分析:深入理解問題

### 程式碼庫現況探索

審視專案結構後,我們發現內容分布相當明確:

**程式碼部分**:
- `app/` - Next.js 應用程式頁面與元件
- `components/` - React 元件
- `lib/` - 核心邏輯(文章管理、Markdown 處理、RSS 生成)
- `scripts/` - 建置腳本
- 設定檔: `tailwind.config.ts`, `next.config.ts`, `tsconfig.json` 等

**內容部分**:
- `public/posts/` - 部落格文章(從 2003 年至今,包含繁中、日文、英文翻譯版本)
- `public/pages/` - 靜態頁面(關於、訂閱)
- 文章中的圖片和媒體檔案

這種清晰的內容分離為雙重授權提供了良好的基礎,因為不同授權對象在檔案系統層級就已經明確區分。

**文章中的程式碼範例問題**:

經過檢視實際文章,我們發現技術文章中確實包含程式碼範例。例如《自製 Chai Plugin》一文中包含多個 JavaScript 程式碼範例。這些程式碼片段既是文章內容的一部分,同時也可能被讀者複製使用到自己的專案中,因此需要特別處理。

### 問題根源追蹤

雙重授權的挑戰主要來自以下幾個面向:

1. **授權的技術可行性**: 一個儲存庫能否同時存在兩種授權?GitHub 和法律層面是否支援?
2. **程式碼範例的歸屬模糊性**: 文章中的程式碼範例究竟應該被視為「文章內容」還是「程式碼」?
3. **使用者理解成本**: 如何讓儲存庫的使用者清楚知道哪些內容適用哪種授權?
4. **授權文件的組織方式**: LICENSE 檔案應該如何撰寫和組織?

### 業界智慧與最佳實踐

經過深入的網路研究,我們發現了幾個關鍵的業界實踐:

**成熟的雙重授權模式**:
- **React.js 和 dotnet core**: 這些大型開源專案明確地對程式碼使用 MIT License,對文件使用 Creative Commons Attribution 4.0,證明雙重授權是成熟且被接受的實踐。
- **Stack Exchange 的做法**: Stack Overflow 網站內容採用 CC BY-SA 授權,但程式碼片段可以選擇性地採用 MIT License,這種混合授權模式已經運行多年。

**GitHub 的多授權支援**:
- GitHub 在 2022 年推出了多授權檔案顯示功能,會自動偵測儲存庫根目錄下所有符合命名規範的 LICENSE 檔案(如 `LICENSE`、`LICENSE-MIT`、`LICENSE-CC-BY-NC` 等)。
- 當儲存庫包含多個授權時,GitHub 會在專案頁面的 About 區域顯示授權列表,使用者點擊後可以看到所有授權的詳細內容。

**程式碼片段的授權處理**:
根據多個開源社群的討論和最佳實踐:
- **雙重授權是合理的做法**: 程式碼片段可以同時受到文章授權(CC BY-NC)和程式碼授權(MIT)的約束,讓使用者根據使用情境選擇適用的授權。
- **明確聲明很重要**: 應該在 LICENSE 或 README 中明確說明程式碼範例的授權狀態,避免產生混淆。
- **實務考量**: 對於教學性質的程式碼範例,採用寬鬆授權(如 MIT)可以讓讀者更容易應用到自己的專案中,這也符合技術分享的精神。

**Creative Commons 與程式碼的關係**:
- Creative Commons 官方不建議將 CC 授權用於程式碼本身,因為 CC 授權沒有處理程式執行權、專利等軟體特有的權利。
- 但是,將 CC 授權用於「描述軟體的文件和文章」是完全適當且廣泛被接受的做法。
- CC BY-NC(非商業性使用)意味著他人可以分享和改作內容,但不得用於商業目的,且必須註明出處。

## 解決方案探索與評估

基於研究發現,我們提出以下實施方案:

### 方案一:單一 LICENSE 檔案包含兩種授權(建議採用)

**核心概念**:
在專案根目錄建立一個 `LICENSE` 檔案,在其中清楚說明不同類型內容適用的授權,並包含兩種授權的完整條文。

**結構**:
```
LICENSE (主檔案,說明授權分配)
├─ MIT License 完整條文
└─ CC BY-NC 4.0 完整條文
```

**優點**:
- **單一真相來源**: 所有授權資訊集中在一個檔案,降低維護成本
- **清晰的範圍界定**: 在檔案開頭明確說明哪些內容適用哪種授權
- **傳統做法**: 許多專案採用這種方式,使用者較為熟悉

**缺點**:
- **檔案較長**: 包含兩個完整授權條文,檔案會比較長
- **GitHub 顯示限制**: GitHub 可能只顯示第一個授權(需驗證)

**評估總結**:
- **實作複雜度**: 低 - 只需建立一個檔案
- **維護影響**: 低 - 單一檔案易於維護
- **風險等級**: 低 - 成熟的實踐方式

### 方案二:多個 LICENSE 檔案

**核心概念**:
建立多個 LICENSE 檔案,利用 GitHub 的多授權偵測功能自動顯示。

**結構**:
```
LICENSE (說明檔,指向其他授權)
LICENSE-MIT (MIT 授權完整條文)
LICENSE-CC-BY-NC (CC BY-NC 4.0 完整條文)
```

**優點**:
- **GitHub 原生支援**: GitHub 會自動偵測並在 About 區域顯示多個授權
- **模組化**: 每個授權獨立,更容易閱讀
- **明確的檔案對應**: 可以在子目錄放置對應的 LICENSE 檔案(但本專案不需要)

**缺點**:
- **檔案數量增加**: 需要維護多個檔案
- **需要主 LICENSE 檔案**: 仍需要一個說明檔來解釋授權分配

**評估總結**:
- **實作複雜度**: 中 - 需要建立並維護三個檔案
- **維護影響**: 中 - 需要同步更新多個檔案(雖然授權條文通常不變)
- **風險等級**: 低 - GitHub 官方支援的方式

### 程式碼片段授權的處理建議

針對文章中的程式碼範例,我們建議採用**雙重授權**策略:

**建議做法**:
文章中的程式碼範例同時受到以下兩種授權約束:
1. 作為文章的一部分,受 CC BY-NC 4.0 授權約束
2. 作為可執行的程式碼,同時提供 MIT License 授權選項

**使用情境**:
- 如果有人想要「轉載整篇文章」(包含程式碼範例),則受 CC BY-NC 4.0 約束(需註明出處,不得商業使用)
- 如果有人只想要「使用文章中的程式碼」到自己專案中,可以選擇適用 MIT License(自由使用,包含商業用途)

**在 LICENSE 中的聲明方式**:
```markdown
### 程式碼範例

文章中出現的程式碼範例採用雙重授權:
- 作為文章內容的一部分,受上述 CC BY-NC 4.0 授權約束
- 同時,這些程式碼範例也可以選擇性地適用 MIT License

您可以根據使用情境選擇適用的授權條款。
```

**理由**:
1. **符合技術分享精神**: 技術文章的目的之一是讓讀者學習和應用,過於限制程式碼使用會違背這個初衷
2. **降低使用門檻**: MIT License 讓讀者可以安心地將範例程式碼用在商業專案中
3. **保護文章完整性**: CC BY-NC 4.0 仍然保護文章整體不被商業轉載利用
4. **業界慣例**: Stack Overflow 等平台已經證明這種做法的可行性

## 建議與決策指引

### 推薦方案

基於上述分析,我們推薦採用**方案一:單一 LICENSE 檔案包含兩種授權**,主要考量包括:

1. **簡潔性**: 雖然檔案較長,但所有授權資訊集中管理,降低混淆風險
2. **維護性**: 單一檔案更容易維護,不會出現授權資訊不同步的問題
3. **清晰性**: 在檔案開頭用淺顯易懂的語言說明授權分配,讓使用者一目了然

### 實施指引

#### 1. 建立 LICENSE 檔案

在專案根目錄建立 `LICENSE` 檔案,結構如下:

```markdown
# 授權聲明

本儲存庫包含兩種不同性質的內容,分別採用不同的授權條款:

## 程式碼部分 - MIT License

以下內容採用 MIT License:
- 所有程式碼檔案 (`.ts`, `.tsx`, `.js`, `.jsx`, `.css` 等)
- 設定檔案 (`*.config.ts`, `tsconfig.json`, `package.json` 等)
- 建置腳本 (`scripts/` 目錄)
- 文章中出現的程式碼範例(雙重授權,也可選擇適用 MIT License)

## 文章內容部分 - Creative Commons BY-NC 4.0

以下內容採用 Creative Commons Attribution-NonCommercial 4.0 International License:
- 所有文章內容 (`public/posts/` 目錄下的 `.md` 檔案)
- 靜態頁面 (`public/pages/` 目錄下的 `.md` 檔案)
- 文章中的圖片和媒體檔案
- 文章中的程式碼範例(雙重授權,也同時受 CC BY-NC 4.0 約束)

### 程式碼範例說明

文章中出現的程式碼範例採用雙重授權:
- 作為文章內容的一部分,受 CC BY-NC 4.0 授權約束
- 同時,這些程式碼範例也可以選擇性地適用 MIT License

您可以根據使用情境選擇適用的授權條款:
- 如果要轉載整篇文章,請遵循 CC BY-NC 4.0
- 如果只使用文章中的程式碼到您的專案,可以選擇適用 MIT License

---

## MIT License

[MIT License 完整條文]

---

## Creative Commons Attribution-NonCommercial 4.0 International License

[CC BY-NC 4.0 完整條文,或連結到官方授權條文]
```

#### 2. 更新 README.md

將 README.md 第 172-174 行的授權區塊更新為:

```markdown
## 授權

- **程式碼**: 採用 [MIT License](LICENSE) 授權
- **文章內容**: 採用 [Creative Commons BY-NC 4.0](LICENSE) 授權

詳細授權資訊請參閱 [LICENSE](LICENSE) 檔案。
```

#### 3. 更新 about.md

在 `public/pages/about.md`、`about.ja.md` 和 `about.en.md` 的結尾加入簡短的授權聲明。

**繁體中文版 (about.md)**:
```markdown
---

這裡的文章採用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 授權，歡迎分享與改作。若有商業用途需求，請與我聯絡洽談 ([blog@yurenju.me](mailto:blog@yurenju.me))。授權詳情請參閱 [GitHub 儲存庫](https://github.com/yurenju/blog)。
```

**日文版 (about.ja.md)**:
```markdown
---

ここにある記事は [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) でライセンスされており、共有や改変は歓迎します。商業利用をご希望の場合は、お問い合わせください ([blog@yurenju.me](mailto:blog@yurenju.me))。ライセンスの詳細については、[GitHub リポジトリ](https://github.com/yurenju/blog)をご覧ください。
```

**英文版 (about.en.md)**:
```markdown
---

Articles here are licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You're welcome to share and adapt them. For commercial use, please contact me ([blog@yurenju.me](mailto:blog@yurenju.me)). For detailed licensing information, please refer to the [GitHub repository](https://github.com/yurenju/blog).
```

**說明**: 這個版本保持簡短且符合 about 頁面的人文調性,避免過於技術性的說明。詳細的授權資訊則導引使用者到 GitHub 儲存庫的 LICENSE 和 README 檔案。

#### 4. 考慮加入版權聲明年份

在 LICENSE 檔案的 MIT License 部分,建議加入:
```
Copyright (c) 2003-2025 Yuren Ju
```

這樣可以明確標示版權起始年份和持有人。

### 後續維護建議

1. **新增文章時**: 不需要在每篇文章中加入授權聲明,統一的 LICENSE 和 about.md 已經涵蓋
2. **接受貢獻時**: 如果有人提交 Pull Request 修改程式碼,他們的貢獻會自動受 MIT License 約束;如果有人貢獻文章內容,則受 CC BY-NC 4.0 約束
3. **定期檢視**: 每年檢視一次授權是否需要更新,特別是在 Creative Commons 發布新版本時

## 下一步行動計畫

實施雙重授權需要分階段進行,以確保完整性和正確性。第一階段重點是建立核心的授權文件,第二階段則是更新專案中的相關說明文件。

### 立即行動

1. **建立 LICENSE 檔案**
   - 在專案根目錄建立 LICENSE 檔案
   - 包含授權說明、MIT License 完整條文、CC BY-NC 4.0 完整條文
   - 特別說明程式碼範例的雙重授權狀態

2. **更新 README.md**
   - 修改授權章節,簡潔說明雙重授權
   - 連結到 LICENSE 檔案

3. **更新 about.md**
   - 加入文章授權說明
   - 用淺顯易懂的語言解釋 CC BY-NC 4.0 的含義
   - 說明程式碼範例的 MIT License 選項

### 中期規劃

1. **提交 Git Commit**
   - 將授權檔案的變更提交到版本控制
   - Commit message 建議: "feat: add dual licensing (MIT for code, CC BY-NC 4.0 for content)"

2. **驗證 GitHub 顯示**
   - 推送到 GitHub 後,確認專案頁面正確顯示授權資訊
   - 檢查 About 區域是否正確顯示授權

3. **社群溝通(選擇性)**
   - 如果有固定讀者群,可以考慮寫一篇文章說明授權變更
   - 在社群媒體上分享授權變更的決定和理由

### 長期考量

1. **監控法律變化**
   - 關注 Creative Commons 授權的更新
   - 如果未來有 CC BY-NC 5.0,評估是否需要升級

2. **考慮貢獻者協議**
   - 如果專案開始接受外部貢獻,考慮建立 CONTRIBUTING.md
   - 明確說明貢獻者的內容會受到哪種授權約束

## 參考資料

### 官方文件
- [Creative Commons BY-NC 4.0 授權條款](https://creativecommons.org/licenses/by-nc/4.0/)
- [MIT License 官方文本](https://opensource.org/licenses/MIT)
- [Creative Commons 授權選擇工具](https://creativecommons.org/choose/)

### 業界實踐範例
- [GitHub: Easily discover multiple licenses in repositories](https://github.blog/changelog/2022-05-26-easily-discover-and-navigate-to-multiple-licenses-in-repositories/)
- [Stack Exchange: Content Licensing](https://meta.stackexchange.com/questions/344491/an-update-on-creative-commons-licensing)

### 技術討論
- [Software Engineering Stack Exchange: Declaring multiple licences in a GitHub project](https://softwareengineering.stackexchange.com/questions/304874/declaring-multiple-licences-in-a-github-project)
- [Open Source Stack Exchange: How to document licenses of code snippets in CC licensed content](https://opensource.stackexchange.com/questions/2119/how-do-i-document-licenses-of-code-snippets-on-a-web-page-with-a-cc-by-4-0-licen)
- [Open Source Stack Exchange: License for code snippets](https://opensource.stackexchange.com/questions/887/license-for-code-snippets)

### 延伸閱讀
- [Creative Commons: FAQ](https://wiki.creativecommons.org/wiki/frequently_asked_questions)
- [GitHub Docs: Licensing a repository](https://docs.github.com/articles/licensing-a-repository)
- [Choose an open source license](https://choosealicense.com/)
