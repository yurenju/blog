# language: zh-TW
功能: 國際化連結與導航改善
  作為部落格的多語言使用者
  我想要在不同語言之間流暢切換並保持瀏覽上下文
  以便獲得一致且專業的多語言瀏覽體驗

  背景:
    假設部落格系統已經啟動並可正常訪問
    並且系統支援三種語言：繁體中文 (zh)、日文 (ja) 和英文 (en)

  場景: LanguageNotice 在技術分類頁面顯示正確的連結和數量
    假設我使用日文介面訪問技術分類頁面 "/ja/tech"
    當 我在頁面上看到 LanguageNotice 元件
    那麼 連結應該導向 "/zh/tech"
    並且 顯示的文章數量應該是技術分類的中文文章數
    並且 連結 URL 應該包含 "/zh/" 前綴

  場景: LanguageNotice 在生活分類頁面顯示正確的連結和數量
    假設我使用英文介面訪問生活分類頁面 "/en/life"
    當 我在頁面上看到 LanguageNotice 元件
    那麼 連結應該導向 "/zh/life"
    並且 顯示的文章數量應該是生活分類的中文文章數
    並且 連結 URL 應該包含 "/zh/" 前綴

  場景: LanguageNotice 在全部文章頁面顯示正確的連結和總數
    假設我使用日文介面訪問全部文章頁面 "/ja/posts"
    當 我在頁面上看到 LanguageNotice 元件
    那麼 連結應該導向 "/zh/posts"
    並且 顯示的文章數量應該是所有中文文章的總數
    並且 連結 URL 應該包含 "/zh/" 前綴

  場景: 英文頁面的 LanguageNotice 使用正確的標點符號
    假設我使用英文介面訪問任一頁面
    當 我查看 LanguageNotice 元件的文字內容
    那麼 應該使用英文句號 "."
    並且 不應該出現中文全形句號 "。"

  場景: 日文頁面的 LanguageNotice 使用正確的標點符號
    假設我使用日文介面訪問任一頁面
    當 我查看 LanguageNotice 元件的文字內容
    那麼 應該使用全形句號 "。"

  場景: 中文頁面不顯示 LanguageNotice
    假設我訪問中文技術分類頁面 "/zh/tech"
    那麼 頁面上不應該顯示 LanguageNotice 元件

  場景大綱: 所有中文頁面的連結都包含 /zh/ 前綴
    假設我訪問中文頁面 "<page>"
    當 我檢查頁面上的所有內部連結
    那麼 所有連結都應該包含 "/zh/" 前綴
    並且 點擊連結時不應該經歷重定向跳轉

    例子:
      | page           |
      | /zh/           |
      | /zh/about      |
      | /zh/tech       |
      | /zh/life       |
      | /zh/posts      |

  場景大綱: 非中文頁面的連結都包含對應的 locale 前綴
    假設我訪問頁面 "<page>"
    當 我檢查頁面上的所有內部連結
    那麼 所有連結都應該包含 "<locale_prefix>" 前綴
    並且 點擊連結時不應該經歷重定向跳轉

    例子:
      | page        | locale_prefix |
      | /ja/        | /ja/          |
      | /ja/about   | /ja/          |
      | /ja/tech    | /ja/          |
      | /en/        | /en/          |
      | /en/life    | /en/          |

  場景: 在首頁切換語言保持在首頁
    假設我訪問中文首頁 "/zh/"
    當 我點擊 LanguageSwitcher 切換到日文
    那麼 應該導向日文首頁 "/ja/"
    並且 URL 應該包含 "/ja/" 前綴

  場景: 在關於頁面切換語言保持在關於頁面
    假設我訪問中文關於頁面 "/zh/about"
    當 我點擊 LanguageSwitcher 切換到英文
    那麼 應該導向英文關於頁面 "/en/about"
    並且 URL 應該包含 "/en/" 前綴

  場景: 在技術分類頁面切換語言保持在技術分類
    假設我訪問中文技術分類頁面 "/zh/tech"
    當 我點擊 LanguageSwitcher 切換到日文
    那麼 應該導向日文技術分類頁面 "/ja/tech"
    並且 URL 應該包含 "/ja/" 前綴

  場景: 在生活分類頁面切換語言保持在生活分類
    假設我訪問日文生活分類頁面 "/ja/life"
    當 我點擊 LanguageSwitcher 切換到英文
    那麼 應該導向英文生活分類頁面 "/en/life"
    並且 URL 應該包含 "/en/" 前綴

  場景: 在文章詳情頁切換語言導向首頁
    假設我訪問中文文章詳情頁 "/zh/posts/2024-01-01_example-post"
    當 我點擊 LanguageSwitcher 切換到日文
    那麼 應該導向日文首頁 "/ja/"
    並且 URL 應該包含 "/ja/" 前綴

  場景: 切換到中文時 URL 包含 /zh/ 前綴
    假設我訪問英文關於頁面 "/en/about"
    當 我點擊 LanguageSwitcher 切換到中文
    那麼 應該導向中文關於頁面 "/zh/about"
    並且 URL 應該包含 "/zh/" 前綴

  場景: TypeScript 型別檢查通過
    假設所有修改的元件和函式都已完成
    當 執行 TypeScript 型別檢查
    那麼 不應該出現型別錯誤或警告

  場景: 專案建構成功
    假設所有修改的檔案都已完成
    當 執行 "npm run build" 指令
    那麼 建構應該成功完成
    並且 靜態頁面生成不應該出現錯誤
