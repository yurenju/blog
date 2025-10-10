# language: zh-TW
功能: 翻譯中文部落格文章為日文和英文
  作為 部落格作者
  我想要 快速將中文文章翻譯成日文和英文
  以便 觸及更多不同語言的讀者

  背景:
    假設 系統已安裝並可使用 /translate 指令
    並且 存在範例中文文章檔案

  場景: 翻譯 Tech 分類文章
    假設 存在檔案 "public/posts/2025-04-23_ai-coding-doesnt-understand-me/叫 AI 幫我寫程式，結果他聽不懂人話？.md"
    並且 該檔案的 frontmatter 包含 categories: tech
    當 執行指令 /translate "public/posts/2025-04-23_ai-coding-doesnt-understand-me/叫 AI 幫我寫程式，結果他聽不懂人話？.md"
    那麼 應該產生檔案 "public/posts/2025-04-23_ai-coding-doesnt-understand-me/index.ja.md"
    並且 應該產生檔案 "public/posts/2025-04-23_ai-coding-doesnt-understand-me/index.en.md"
    並且 兩個檔案都應包含翻譯後的 title frontmatter
    並且 兩個檔案都應包含中文回譯內容（使用 --- 分隔）

  場景: 正確處理 Frontmatter - 有 title 欄位
    假設 中文文章的 frontmatter 包含 title: "測試標題"
    當 執行翻譯指令
    那麼 日文翻譯的 frontmatter 應包含翻譯後的日文標題
    並且 英文翻譯的 frontmatter 應包含翻譯後的英文標題
    並且 翻譯檔案的 frontmatter 不應包含 slug 或 categories 欄位

  場景: 正確處理 Frontmatter - 無 title 欄位
    假設 中文文章的 frontmatter 沒有 title 欄位
    並且 檔名為 "叫 AI 幫我寫程式，結果他聽不懂人話？.md"
    當 執行翻譯指令
    那麼 日文翻譯應使用檔名翻譯為標題
    並且 英文翻譯應使用檔名翻譯為標題
    並且 日文 frontmatter 應為 "title: AIにコードを書いてもらったら、理解してもらえない？"
    並且 英文 frontmatter 應為 "title: Asked AI to Write Code, But It Can't Understand Me?"

  場景: Tech 分類使用理性專業翻譯風格
    假設 文章分類為 tech
    當 執行翻譯指令
    那麼 翻譯內容應使用理性、專業的口吻
    並且 技術術語應精準翻譯
    並且 保持技術文章的清晰度和準確性

  場景: Life 分類使用抒情表達翻譯風格
    假設 文章分類為 life
    當 執行翻譯指令
    那麼 翻譯內容應使用抒情、表達性的口吻
    並且 翻譯應根據目標語言語境調整而非逐字翻譯
    並且 注重閱讀節奏和情感傳達

  場景: 正確翻譯程式碼區塊中的註解
    假設 文章包含程式碼區塊，其中有中文註解 "// 這是測試"
    當 執行翻譯指令
    那麼 日文版應將註解翻譯為 "// これはテストです"
    並且 英文版應將註解翻譯為 "// This is a test"
    並且 程式碼本身（變數名、函數名）應保持不變

  場景: 保留英文註解不翻譯
    假設 文章包含程式碼區塊，其中有英文註解 "// This is a test"
    當 執行翻譯指令
    那麼 日文版和英文版都應保留原始英文註解
    並且 不應將英文註解翻譯成其他語言

  場景: 正確處理圖片連結
    假設 文章包含圖片 "![[reduce-development-cycle.png]]"
    當 執行翻譯指令
    那麼 翻譯後的檔案應保持相同的圖片路徑
    並且 如果有 alt text 應翻譯為目標語言

  場景: 正確處理超連結
    假設 文章包含連結 "[浦澤直樹的專訪](https://www.youtube.com/watch?v=pVr3sEeus6E)"
    當 執行翻譯指令
    那麼 日文版應為 "[浦沢直樹のインタビュー](https://www.youtube.com/watch?v=pVr3sEeus6E)"
    並且 英文版應為 "[Naoki Urasawa's interview](https://www.youtube.com/watch?v=pVr3sEeus6E)"
    並且 URL 應保持不變

  場景: 查詢並使用作品的官方名稱
    假設 文章提到漫畫作品 "歷史之眼"
    當 執行翻譯指令
    那麼 系統應使用 WebSearch 查詢該作品的官方名稱
    並且 日文翻譯應使用 "ヒストリエ"
    並且 英文翻譯應使用 "Historie"
    並且 不應使用直譯如 "歴史の目" 或 "Eye of History"

  場景: 查詢並使用人名的正確寫法
    假設 文章提到 "浦澤直樹"
    當 執行翻譯指令
    那麼 系統應使用 WebSearch 查詢人名的正確寫法
    並且 日文翻譯應使用 "浦沢直樹"
    並且 英文翻譯應使用 "Naoki Urasawa"
    並且 不應使用錯誤的 "溥澤直樹"

  場景: 提供中文回譯供驗證
    假設 執行翻譯指令成功
    當 查看翻譯後的檔案
    那麼 日文翻譯檔案應在內容最後使用 "---" 分隔後附上中文回譯
    並且 英文翻譯檔案應在內容最後使用 "---" 分隔後附上中文回譯
    並且 回譯內容應幫助使用者理解翻譯後的實際意思

  場景: 同時產生兩種語言翻譯
    假設 執行翻譯指令
    當 翻譯完成
    那麼 應同時產生日文和英文兩個翻譯檔案
    並且 兩個檔案都應包含各自的中文回譯
    並且 不需要使用者指定要翻譯哪種語言

  場景: 檔案不存在時的錯誤處理
    假設 指定的檔案路徑不存在
    當 執行 /translate "path/to/nonexistent/file.md"
    那麼 應顯示清楚的錯誤訊息
    並且 說明檔案不存在

  場景: Frontmatter 格式錯誤時的處理
    假設 中文文章的 frontmatter 格式不正確
    當 執行翻譯指令
    那麼 應給予警告訊息
    並且 應繼續嘗試翻譯內容
    並且 不應中斷翻譯流程

  場景: 無法判斷分類時預設為 Tech
    假設 中文文章沒有 categories 欄位
    並且 無法從內容明確判斷分類
    當 執行翻譯指令
    那麼 應預設使用 tech 分類的翻譯策略
    並且 應告知使用者使用了預設分類
