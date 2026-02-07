# language: zh-TW
功能: 文章歸檔機制與目錄結構重組
  作為 部落格讀者
  我想要 在主列表只看到近年的高品質文章，並且能透過 Archives 頁面瀏覽舊文章
  以便 更有效率地找到值得閱讀的內容

  背景:
    假設 部落格已完成文章目錄遷移
    並且 開發伺服器已啟動在 http://localhost:3000

  場景: 主文章列表只顯示非歸檔文章
    當 使用 playwright mcp 開啟 /zh/posts 頁面
    那麼 頁面應顯示文章列表
    並且 列表中不應出現 2019 年及以前的年份區塊
    並且 列表中應包含 2020 年至 2026 年的文章

  場景: 主文章列表底部有歸檔入口連結
    當 使用 playwright mcp 開啟 /zh/posts 頁面
    那麼 頁面底部應顯示「查看歸檔文章」連結
    當 點擊「查看歸檔文章」連結
    那麼 應導航到 /zh/archives 頁面

  場景: tech 分類頁面只顯示非歸檔文章
    當 使用 playwright mcp 開啟 /zh/tech 頁面
    那麼 頁面應顯示技術文章列表
    並且 列表中不應出現 2019 年及以前的年份區塊

  場景: tech 分類頁面底部有歸檔入口連結
    當 使用 playwright mcp 開啟 /zh/tech 頁面
    那麼 頁面底部應顯示「更多歸檔文章」連結
    當 點擊「更多歸檔文章」連結
    那麼 應導航到 /zh/archives/tech 頁面

  場景: life 分類頁面只顯示非歸檔文章
    當 使用 playwright mcp 開啟 /zh/life 頁面
    那麼 頁面應顯示生活文章列表
    並且 列表中不應出現 2019 年及以前的年份區塊

  場景: life 分類頁面底部有歸檔入口連結
    當 使用 playwright mcp 開啟 /zh/life 頁面
    那麼 頁面底部應顯示「更多歸檔文章」連結
    當 點擊「更多歸檔文章」連結
    那麼 應導航到 /zh/archives/life 頁面

  場景: Archives 主頁面列出所有歸檔文章
    當 使用 playwright mcp 開啟 /zh/archives 頁面
    那麼 頁面標題應為「歸檔文章」
    並且 頁面應顯示按年份分組的歸檔文章列表
    並且 列表中應包含 2019 年及以前的年份區塊
    並且 列表中不應出現 2020 年及以後的年份區塊

  場景: Archives 根路徑 redirect
    當 使用 playwright mcp 開啟 /archives 頁面
    那麼 應被重新導向到 /zh/archives 頁面

  場景: 分類歸檔頁面正確篩選 tech 文章
    當 使用 playwright mcp 開啟 /zh/archives/tech 頁面
    那麼 頁面應顯示歸檔的技術文章列表
    並且 文章應都屬於 tech 分類

  場景: 分類歸檔頁面正確篩選 life 文章
    當 使用 playwright mcp 開啟 /zh/archives/life 頁面
    那麼 頁面應顯示歸檔的生活文章列表
    並且 文章應都屬於 life 分類

  場景: 舊文章的 URL 維持不變
    假設 存在一篇歸檔文章的 slug 為已知值
    當 使用 playwright mcp 開啟 /zh/posts/{已知的歸檔文章slug} 頁面
    那麼 頁面應正常顯示該文章的完整內容
    並且 不應出現 404 錯誤

  場景: 多語言 Archives 頁面 - 日文
    當 使用 playwright mcp 開啟 /ja/archives 頁面
    那麼 頁面標題應為「アーカイブ」
    並且 頁面應正常顯示歸檔文章列表

  場景: 多語言 Archives 頁面 - 英文
    當 使用 playwright mcp 開啟 /en/archives 頁面
    那麼 頁面標題應為「Archives」
    並且 頁面應正常顯示歸檔文章列表

  場景: RSS feed 正確運作
    當 執行 npm run build 指令
    那麼 建置應成功完成無錯誤
    當 檢查產生的 rss.xml 檔案
    那麼 RSS feed 應包含有效的 XML 結構
    並且 RSS feed 中的文章連結應可正常存取

  場景: 建置成功完成
    當 執行 npm run build 指令
    那麼 建置應成功完成無錯誤
    並且 所有靜態頁面應正確產生
    並且 /archives、/archives/tech、/archives/life 頁面應存在於輸出目錄中
