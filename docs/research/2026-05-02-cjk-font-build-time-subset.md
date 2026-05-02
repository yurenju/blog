# Build-time CJK 字型子集化研究

## 執行摘要

本研究聚焦於**消除 blog 首次載入時的 CJK 字型切換閃爍（FOUT）**，比對主流做法後，提出在 Astro static site 環境下最務實的路徑：**build 時掃描整站文字內容，產出一份只含實際用到字符的 woff2 subset**，搭配 `<link rel=preload>` 與選擇性的 FOIT 機制讓字型在首次 paint 前就到位。

關鍵發現：

- **Astro Fonts API 走 unicode-range 動態切片**（500+ subsets per font），這是首屏 CJK 字型 swap 的結構性成因，無法用 `font-display`/`fallback` 設定根本解決
- **整站 build-time subset 是 SSG 上最接近 justfont 動態切片效果的做法**，預估 woff2 大小落在 500KB–1MB（涵蓋 ~5000 個常用字）
- 工具鏈成熟：`pyftsubset`（fonttools，Python）或 `subset-font`（純 Node）擇一，半天到一天能寫好

本研究**不**直接執行實作，先把脈絡與選擇紀錄下來，等之後重新設計時再決定是否採用。

## 背景與脈絡

### Phase 5 完成後的字型體驗現況

Astro 遷移到 Phase 5 完成（深色模式落地），整體已經可以上線。但 Phase 4/5 過程中沒有特別處理字型載入體驗，預設仰賴 Astro Fonts API（Astro 6.1 引入的字型管線）的行為。

實測進站時觀察到兩個現象：

1. **Latin 字符大小跳動**（已修）：原因是 Astro 自動產生的 fallback `@font-face` 對 CJK 字型計算錯誤，size-adjust 變成 197% 而非 Capsize 應有的 ~104%。已透過 commit `1a053a9` 設 `optimizedFallbacks: false` 解掉這層 bug。
2. **CJK 字型 swap**（未解）：載入前用系統字（Microsoft JhengHei / PingFang），woff2 載完後 swap 為 Noto Sans/Serif TC。視覺上會「換字體」但不再有大小跳動。多數情況下可接受。

對比 Next.js prod 站台行為：Next.js 也有 swap，但因為 `next/font/google` 走相同的 unicode-range 切片，差別只在 metric 校準正確與否。**兩者都不是「無 FOUT」狀態**。

### 為什麼這個問題對中文站尤其難

CJK 字型相對 Latin 字型有結構性的劣勢：

- 單一字型檔案 5–20 MB（vs Latin 50–100 KB）
- woff2 對 CJK 壓縮率 30–40%（vs Latin 40–50%）
- 沒有像 Capsize 這類能正確處理 CJK 的 metric 校準工具
- 系統 CJK fallback 在不同 OS 視覺差異大

業界因此分裂出多種策略，沒有一個「業界標準」。

## 研究問題與發現過程

使用者最初觀察到 dev preview 進站時字型跳動，提出疑問「這個問題常見嗎？別人怎麼解決？」。研究過程中聚焦於三個問題：

1. **為什麼 Next.js prod 看起來相對穩定？** → 比對 build output，發現 next/font 用 Capsize 校準 fallback metric，size-adjust 對 Noto Sans TC 是 104.76%；Astro Fonts API 算出 197.17%。Astro 端的 metric 校準對 CJK 字體計算錯誤是主要 bug。
2. **能不能徹底消除字型 swap？** → 探討 `font-display: optional` 等 CSS 機制，發現對 unicode-range 切片不友善（500+ subset 每個獨立判斷 100ms timeout，多數會卡在 fallback）。
3. **justfont 為什麼能完全沒閃爍？** → 抓了 [justfont blog](https://blog.justfont.com/) 的 head 原始碼，發現他們同時使用 (a) per-page server-side dynamic subsetting 把 woff 壓到 ~100KB；(b) inline JS 在第一次 paint 前把 body `visibility: hidden`，等字載完才顯示。本質是 forced FOIT，但靠極小的 subset 把白屏時間壓到 < 300ms。

最終問題收斂為：**SSG 環境下能不能模擬 justfont 那種「字型到位才顯示」的體驗，又不需要動態 server？**

答案是：**整站 build-time subset 是最接近的等價做法**。

## 技術分析

### 4.1 程式碼庫現況

當前 `astro/astro.config.ts` 字型設定：

```ts
fonts: [
  {
    provider: fontProviders.google(),
    name: 'Noto Sans TC',
    cssVariable: '--font-sans',
    weights: [400, 500, 700],
    optimizedFallbacks: false,  // commit 1a053a9 加的 workaround
  },
  {
    provider: fontProviders.google(),
    name: 'Noto Serif TC',
    cssVariable: '--font-serif',
    weights: [400, 700],
    optimizedFallbacks: false,
  },
]
```

`BaseLayout.astro` head 用 `<Font cssVariable="--font-sans" preload />` 與 serif 對應的元件渲染 preload link。`global.css` 的 font-family chain：

```css
body {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
}
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif), 'Times New Roman', serif;
}
```

Astro 在 build 時會：

1. 從 Google Fonts CSS API 抓 Noto Sans/Serif TC 的 unicode-range subset 清單
2. 下載每個 subset 的 woff2 檔案（each ~30–100 KB）
3. 重新命名為 hashed URL 放 `_astro/fonts/`
4. 產出帶完整 unicode-range 的 `@font-face` 集合 inline 進每個 page head

實測 `dist/zh/index.html` 含 ~517 個 `font-display: swap` `@font-face` rule。這就是 swap 體驗的來源。

### 4.2 問題根源

Unicode-range 切片本質上適合 Latin（拉丁字母只有幾百個 codepoint，2-3 個 subset 就涵蓋），對 CJK 是一個失敗的設計：

- CJK 漢字 codepoint 散佈在 U+4E00–U+9FFF（CJK Unified Ideographs）等多個 block
- Google Fonts 為了平衡 cache 命中率，把 CJK 切成 100+ 個小 subset
- 一個首屏中文段落很容易觸發 30–50 個 subset 的下載
- 每個 subset 是獨立的 `@font-face`，獨立的 woff2 download，獨立的 swap 時機

結果就是「字一塊一塊地載入並 swap」，視覺上像是字體在閃。Latin 站不會有這個感受，因為 Latin subset 通常一個 woff2 就涵蓋了。

**這個問題在 Astro Fonts API 的 abstraction 下沒有出口** — 沒有「合併所有 subset 成一個 woff2」的設定。要解決必須繞過或取代 Astro Fonts API。

### 4.3 業界做法的譜系

從研究過程整理出幾種策略，依「介入層級」由淺到深：

**A. 接受 swap，只校準 fallback metric**
- 代表：next/font + Capsize、Astro Fonts API + optimizedFallbacks（Latin 適用）
- 機制：Capsize 計算 fallback Arial 跟目標 web font 的 ascent/descent/size-adjust 差異，產出 metric-overridden `@font-face`，`src: local('Arial')`
- 優點：實作簡單、無 JS、Latin 視覺差異小
- 對 CJK 限制：Capsize 算法不支援 CJK，CJK 部分仍會 swap

**B. 動態 per-page subsetting（justfont 路線）**
- 機制：JS 掃 DOM 取得實際用到的字 → 跟 server 要對應 subset → 載完才顯示
- 代表服務：justfont、Adobe Fonts (Typekit)
- 優點：woff 極小（~100 KB），首屏白屏 < 300ms 不易察覺
- 限制：需要 server / 動態 CDN，static site 不適用

**C. Build-time 整站 subsetting（本文討論的方案）**
- 機制：build 時掃所有內容 → 列出 unique 字符 → 用 `pyftsubset` 切出 subset → preload
- 代表：Hugo / Eleventy / Jekyll 上的中文 blog 自架解決方案
- 優點：適合 SSG、單一 woff2 cache 友善、整站任何頁都命中
- 限制：subset 比 per-page 大（500 KB–1 MB），build 流程多一步

**D. 整檔載入**
- 機制：不切片，整個 Noto Sans/Serif TC（~1.5 MB compressed）一次下載
- 優點：無 swap 體驗、無 build script
- 限制：首屏要等 1.5 MB，慢網路 fallback 時間長

**E. 純系統字**
- 機制：放棄 web font，font-family 直接用 PingFang TC、Microsoft JhengHei 等
- 代表：Medium 中文版、知乎、PTT、YouTube、Wikipedia
- 優點：零 swap、零下載、零 build
- 限制：各 OS 視覺不一致

對追求設計一致性的 blog，C 是 SSG 上的合理上限。再進一步就要走 D（接受首屏延遲）或 B（架 server）。

## 解決方案：Build-time 整站 subsetting

### 5.1 核心思路

「Astro Fonts API + unicode-range 切片」這層整個拿掉，改成：

1. Build script 掃描 `src/content/posts/**/*.md`、`src/pages/**/*.astro`、`src/lib/i18n.ts`、`src/static-pages/**/*.md`
2. 抽出所有 unique Unicode codepoint，去重
3. 用 fonttools 工具把原始 Noto Sans TC TTF / Noto Serif TC TTF subset 成只含這些字的 woff2
4. 輸出到 `astro/public/fonts/`
5. `BaseLayout.astro` 自己寫 `@font-face` + `<link rel="preload">`

過程中**不再向 Google Fonts 抓 CSS**，整套字型管線改成本地控制。

### 5.2 工具鏈選擇

兩個成熟方案：

**選項一：fonttools (Python)**
- 套件：`pip install fonttools brotli zopfli`
- 命令：`pyftsubset NotoSansTC.ttf --unicodes=4e00,4e01,... --flavor=woff2 --output-file=output.woff2`
- 優點：業界標準工具、Google Fonts 內部用的就是它、品質高
- 缺點：需要 Python 環境，Windows 可能要額外設定

**選項二：subset-font (Node)**
- 套件：`npm install subset-font`
- 介面：純 JavaScript API，吃 Buffer 回 Buffer
- 底層：包了 `harfbuzz-subset` WebAssembly 版本
- 優點：純 Node，跟 Astro / npm 流程整合簡單，CI 不用 Python
- 缺點：較少人用，遇到邊界情況時 issue 不一定有解

對這個 blog 我傾向 **選項二（subset-font）** — 不引入 Python 依賴，跟 Astro tooling 更一致。

### 5.3 實作流程

預期目錄結構：

```
astro/
├── scripts/
│   ├── build-subset.ts       ← 主腳本
│   └── fonts-source/         ← 原始 TTF 放這（git ignore）
│       ├── NotoSansTC-Regular.ttf
│       ├── NotoSansTC-Medium.ttf
│       ├── NotoSansTC-Bold.ttf
│       ├── NotoSerifTC-Regular.ttf
│       └── NotoSerifTC-Bold.ttf
├── public/
│   └── fonts/                ← subset 輸出
│       ├── noto-sans-tc-400.woff2
│       ├── noto-sans-tc-500.woff2
│       ├── noto-sans-tc-700.woff2
│       ├── noto-serif-tc-400.woff2
│       └── noto-serif-tc-700.woff2
└── package.json (新 prebuild script)
```

腳本概念（簡化）：

```ts
import { readFile, writeFile, glob } from 'node:fs/promises';
import subsetFont from 'subset-font';

// Step 1: 收集字符
const chars = new Set<string>();
const files = await glob('src/content/posts/**/*.md', { /* ... */ });
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const c of text) chars.add(c);
}
// 同樣處理 src/pages/**/*.astro、src/static-pages/**/*.md、src/lib/i18n.ts

// Step 2: 加上必備字符（標點、ASCII、常用符號）
const baseChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ' +
                  '，。！？「」『』（）：；、…—·' +
                  // ... 其他必加項
                  '';
for (const c of baseChars) chars.add(c);

// Step 3: 對每個字重切片
const fontDefs = [
  { src: 'NotoSansTC-Regular.ttf',  out: 'noto-sans-tc-400.woff2'  },
  { src: 'NotoSansTC-Medium.ttf',   out: 'noto-sans-tc-500.woff2'  },
  { src: 'NotoSansTC-Bold.ttf',     out: 'noto-sans-tc-700.woff2'  },
  { src: 'NotoSerifTC-Regular.ttf', out: 'noto-serif-tc-400.woff2' },
  { src: 'NotoSerifTC-Bold.ttf',    out: 'noto-serif-tc-700.woff2' },
];

const text = [...chars].join('');
for (const { src, out } of fontDefs) {
  const ttf = await readFile(`scripts/fonts-source/${src}`);
  const woff2 = await subsetFont(ttf, text, { targetFormat: 'woff2' });
  await writeFile(`public/fonts/${out}`, woff2);
}
```

`package.json` 加 `"prebuild": "tsx scripts/build-subset.ts"` 串進 `npm run build`。

`astro.config.ts` 移除 `fonts:` 區塊。

`BaseLayout.astro` head 改成：

```html
<link rel="preload" href="/fonts/noto-sans-tc-400.woff2"
      as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/noto-serif-tc-700.woff2"
      as="font" type="font/woff2" crossorigin />
<style is:global>
  @font-face {
    font-family: 'Noto Sans TC';
    src: url('/fonts/noto-sans-tc-400.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: 'Noto Sans TC';
    src: url('/fonts/noto-sans-tc-500.woff2') format('woff2');
    font-weight: 500;
    font-display: swap;
  }
  /* ... 其他字重與 Serif */
</style>
```

`global.css` 的 `var(--font-sans)` 改成直接 `'Noto Sans TC'`。

### 5.4 預估產出

從 `src/content/posts/` 約 1500 篇 markdown 粗估：

| 範圍 | Unique chars | 單檔 woff2 大小（推估）|
|---|---|---|
| 整站全部 1564 頁 | ~5000–6000 | ~600–900 KB |
| 只 active posts（非 archives）| ~3500–4500 | ~400–600 KB |
| 主要列表頁 + 50 篇近期 posts | ~2500–3000 | ~300–500 KB |

5 個字型（3 sans + 2 serif）總大小可能落在 2–4 MB，但每個 page 只 preload 主要兩個字重（Regular sans + Bold serif），其他延後載入。

實際數字需要先寫 prototype 量。可以先寫一個 read-only 版本只統計字符數，不出 woff2。

### 5.5 跟 justfont / Astro 比較

| | Astro Fonts API（現況）| Build-time subset（本方案）| justfont |
|---|---|---|---|
| 切片時機 | build | build | request |
| Subset 範圍 | unicode-range（500+ 個小 subset）| 整站合一 | per-page |
| 首屏 woff2 數量 | 30–50 個 | 1–2 個 | 1 個 |
| 首屏總大小 | 1–3 MB（多個檔案） | 300–500 KB（preload 命中）| ~100 KB |
| 後續頁面 | 部分新 subset 要再下載 | 全 cache 命中 | 每頁要新 subset |
| FOUT 體驗 | 字一塊一塊載入 swap | 第一次有極短 swap，之後無 | 短白屏 |
| Build 工程 | 0 | ~半天設定 + 維護 | N/A（動態）|
| Server 需求 | 否 | 否 | 是 |

### 5.6 進階：per-page subset 與 common+extra 混合模式

整站合一的 subset 是「夠用」的選擇，理論上**每篇文章自己的 subset 更省流量**。對 SSG 也可行（build 時就知道每頁的字符集），但它在 blog 場景有反直覺的 trade-off。

**Per-page subset 的數字**

每篇 ~2000 字的文章 unique char ~600–1000，subset 後 woff2 ~80–150 KB / 字重。乍看比整站 500 KB 更省。

**但累積反而更貴**

讀者瀏覽行為決定哪個方案實際更省：

| 行為 | 整站 subset 累積下載 | Per-page subset 累積下載 |
|---|---|---|
| 只看 1 篇 | 500 KB | 100 KB |
| 看 3 篇 | 500 KB（cache hit）| 300 KB（每篇都 fetch）|
| 看 10 篇 | 500 KB | 1000 KB |
| 看 50 篇（深度讀者）| 500 KB | 5000 KB |

**Per-page 的真正成本不是大小，是 cache miss**。每篇文章的 woff2 URL 不同，瀏覽器 cache 完全不能跨篇重用。對「讀者通常讀多篇」的 blog 反而吃虧。

justfont 之所以走 per-page，是因為他們服務多個獨立網站，sites 之間沒有 cache 共享需求。對單一 blog 這個前提不成立。

**混合方案：common + extra**

理論最優解是「兩層 subset」：

1. **Common subset**：整站出現頻率 > 50% 的字（~1500 個，~150 KB），所有頁都 preload
2. **Extra subset per page**：該頁額外用到、common 沒有的字（~200–500 個，~30–80 KB）

讀者體驗：
- 第一篇：載 common (150 KB) + 該篇 extra (50 KB) = 200 KB
- 第二篇：common cache hit + 該篇 extra (50 KB) = 50 KB
- 平均每篇 50–80 KB，比 per-page 省、比整站快

這個方案的工程複雜度顯著高於整站方案：

- 要分析整站字頻 → 決定 common threshold
- Build 時要為每篇文章產一個 extra woff2，輸出 1500+ 個檔案
- 每篇 page 的 `@font-face` 要動態 emit 該頁的 extra src
- Build 時間會明顯增加（1500 篇 × 5 字重 = 7500 次 subset 操作）

**結論**：混合方案是「正解」但 ROI 邊際遞減。對這個 blog 規模，**整站合一方案先做，量出實際數字後再決定要不要進化到混合方案**。如果整站 subset 已經 500 KB 內、cache 命中率好，混合方案的優勢不大。

### 5.7 加上 FOIT 機制（可選）

要徹底消除首次的微小 swap，可以再加一層 justfont 風格的 inline script：

```html
<script is:inline>
  document.documentElement.classList.add('fonts-loading');
  const t = setTimeout(() => {
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-timeout');
  }, 1500);
  document.fonts.ready.then(() => {
    clearTimeout(t);
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-loaded');
  });
</script>
<style>
  html.fonts-loading body { visibility: hidden; }
</style>
```

因為 woff2 是單檔 + preload，`document.fonts.ready` 會在 100–500 ms 內 resolve。timeout 從 justfont 的 3000 ms 縮到 1500 ms 保險。

加 FOIT 是「徹底零 swap」的最後一哩，但實務上 preload 後的 swap 通常已經短到可忽略。建議先跳過 FOIT，看實測。

## 解決方案評估

各方案在本專案情境的適用性：

**方案 A：維持現況（Astro Fonts API + optimizedFallbacks: false）**
- 實作複雜度：低（已完成）
- 維護影響：低，跟著 Astro upgrade 走
- 風險等級：低，已驗證可運作
- 適用情境：對字型切換不敏感、優先 Phase 6 上線速度

**方案 B：整站 build-time subset**
- 實作複雜度：中等（半天到一天）
- 維護影響：中等，原始 TTF 要存 source、build script 要跟著 corpus 變化測試
- 風險等級：中，可能遇到 build script edge case（罕用字、emoji、變音符號）
- 適用情境：重新設計時順便升級字型體驗、追求單一 woff2 cache 命中

**方案 C：方案 B + FOIT**
- 實作複雜度：B + 額外 ~30 行
- 維護影響：跟 B 接近
- 風險等級：略高，JS 失敗時需要 fallback 邏輯
- 適用情境：對「無 swap」有強烈視覺要求

**方案 D：放棄 web font，純系統字**
- 實作複雜度：最低（移除 Astro Fonts API + 改 font-family chain）
- 維護影響：最低
- 風險等級：低
- 適用情境：重新設計時若決定走「現代極簡」風格、想專注內容不在意各 OS 字型差異

## 建議

短期（Phase 6 上線前）：**維持現況（方案 A）**。已 commit 的 `optimizedFallbacks: false` 已經消除最明顯的大小跳動，剩下的字體切換在多數情境下可接受。Phase 6 重點應放在 Next.js → Astro 遷移最後一哩。

中期（重新設計時）：**評估方案 B vs D**。重新設計階段會重新思考字型策略，那時兩個關鍵決策點：

1. **整站 typography 決定要不要保 Noto 系列** → 是，走方案 B；否，走方案 D
2. **設計 budget 容許多大的 build complexity** → 高，方案 B 划算；低，方案 D 簡潔

長期觀察：

- Astro Fonts API 還在 experimental 階段，未來版本可能加入 critical subset 或 CJK metric 校準功能。可以先觀察上游動態，避免太早投資自架方案
- 如果 corpus 持續成長到 8000+ unique chars，整站 subset 也會逼近整檔大小，這時投資價值下降

## 下一步行動計畫

研究結論是「現在不做，但留好脈絡」。後續觸發條件：

- **觸發條件**：開始進行整站重新設計（時點未定，至少在 Phase 6 完成之後）
- **觸發後第一步**：寫 prototype script 統計實際 unique char 數量，確認預估的 5000–6000 字符 / 300–600 KB woff2 範圍
- **PRD 評估**：規模上達不到需要獨立 PRD，可以併入「重新設計」整體 PRD 的 typography 章節，引用本研究文件作為技術背景
- **依賴項目**：原始 Noto Sans TC / Noto Serif TC TTF（從 Google Fonts release 下載 OFL 授權版本）
- **驗收標準**：build 成功 + 抽 5 篇文章肉眼比對字型切換體驗 + Lighthouse 字型相關指標不退步

## 參考資料

**技術文件**

- [Astro Fonts API（Experimental）](https://docs.astro.build/en/reference/experimental-flags/fonts/) — 目前管線的官方文件
- [Astro Font Provider Reference](https://docs.astro.build/en/reference/font-provider-reference/) — 自訂 provider 介面（若要寫客製 subset provider 會用到）
- [next/font 原始碼 - Capsize 整合](https://github.com/vercel/next.js/tree/main/packages/font) — Latin metric 校準正解的參考實作

**工具與函式庫**

- [`subset-font` (npm)](https://www.npmjs.com/package/subset-font) — 純 Node subset 工具，本研究推薦選項
- [`fonttools` GitHub](https://github.com/fonttools/fonttools) — Python 端業界標準
- [Capsize](https://github.com/seek-oss/capsize) — Latin metric override 的核心算法（CJK 不支援）
- [unjs/fontaine](https://github.com/unjs/fontaine) — 自動 fallback 校準工具（Latin 為主）

**業界案例與分析**

- [justfont 進階使用技巧](https://webfont.justfont.com/cheats) — 動態 subset + JS FOIT 機制揭露
- [How to avoid layout shifts caused by web fonts · Simon Hearne](https://simonhearne.com/2021/layout-shifts-webfonts/) — FOUT/CLS 系統性整理
- [呈現魔鬼般細節！怎麼去幫網站換字體？· Riven](https://medium.com/rar-design/%E5%91%88%E7%8F%BE%E9%AD%94%E9%AC%BC%E8%88%AC%E7%B4%B0%E7%AF%80-%E6%80%8E%E9%BA%BC%E5%8E%BB%E5%B9%AB%E7%B6%B2%E7%AB%99%E6%8F%9B%E5%AD%97%E9%AB%94-%E5%8F%B0%E7%81%A3%E4%B8%AD%E6%96%87-webfont-%E7%B6%B2%E9%A0%81%E5%AD%97%E5%9E%8B%E6%8E%A8%E8%96%A6-954c60bc46a9)
- [Local Fonts for CJK Languages won't load · withastro/astro#6308](https://github.com/withastro/astro/issues/6308) — Astro 端 CJK 限制的歷史 issue
- [OOM with CJK fonts after v5.16.13 · withastro/astro#15318](https://github.com/withastro/astro/issues/15318) — Astro 處理 CJK 字型的已知 bug

**字型授權**

- [Noto CJK Repository](https://github.com/notofonts/noto-cjk) — 原始 TTF 下載點，OFL 1.1 授權
- [Source Han Sans / 思源黑體](https://github.com/adobe-fonts/source-han-sans) — Adobe 端的同源字型，可作備案
