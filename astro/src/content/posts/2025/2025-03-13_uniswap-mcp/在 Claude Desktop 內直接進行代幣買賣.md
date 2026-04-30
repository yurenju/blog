---
slug: 2025-03-13_uniswap-mcp
categories:
- tech
---

對話型 AI 工具最早都無法存取任何外部資訊，後來才逐漸地加入外部工具如搜尋功能。但「搜尋」這樣的功能又大又廣，針對一個特殊的功能比如說看天氣、查股票價格等等雖然搜尋網路資料也做得到，但還是比不上直接透過 API 整合一個新的天氣或是股市功能。

回過頭來看網路上的服務成千上萬，不可能一一的透過 API 接上。更何況有些工具並不是 HTTP API 形式，而是本地電腦才有的工具。比如說寫程式的時候，希望編輯器可以存取到瀏覽器的精確畫面、結構以及開發者除錯資訊，這些就無法透過 HTTP API 的形式接上。

而 MCP 就是一套開放標準，用來讓 AI 理解要怎麼樣去取用一個工具。比如說希望它幫忙管理待辦事項，就使用一組 Asana 的 MCP 透過 API 連接上待辦事項服務，這樣就可以讓它協助規畫整個專案以及撰寫所需要的資料，甚至管理任務的相依性等等。

前面舉例的瀏覽器協助開發，也可以透過 [mcp-playwright](https://github.com/executeautomation/mcp-playwright) 來操作瀏覽器以及直接閱讀 console 判斷錯誤以及自動修正。

剛好工作上有個相關的任務需要研究相關的事情，就嘗試透過 Protocolink, Moralis 寫了一個 Uniswap 的 MCP，讓它可以直接在 Claude Desktop 進行交易。

![[uniswap-mcp.png]]

可以到 [這個 Youtube 連結](https://www.youtube.com/watch?v=7fRmwQYaBLg) 看展示。

做完之後又讓我想到了這近十年來傳訊軟體的發展。在最早以前是 LINE 跟 Telegram 的 mini app 開始流行推廣，不過後來大多都導到外部網頁實作大部分功能，僅有小部分簡易的 UI 會內嵌在傳訊對話裡面。如果是我也會這麼做，畢竟在外部網站實作還是比較簡單，只要在最必要的使用者驗證在 LINE 裡面處理就好。

而前幾個月看到 Vercel 的  [AI SDK 3.0](https://vercel.com/blog/ai-sdk-3-generative-ui) 是我意識到未來軟體使用者介面可能會很不一樣的時刻。他的公告裡面包含了一個工具可以詢問天氣之後，直接產生一個天氣的顯示介面。

![[vercel-ai-sdk.png]]

我原本以為是完全動態產生 UI，後來仔細看了一下文件原來還是要[預先定義 UI](https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces#create-ui-components)。

不過即使他們還沒做到，但是也開啟了一個想像空間：假如說未來 UI 元件可以根據收到資料的脈絡，動態的組合出適合的 UI 介面，那會是怎麼樣的體驗？如果往後的使用者互動跟現在完全不一樣呢？會是語音對談之後，直接完全動態的產生合適的使用者介面嗎？

那在你我所在的產業，又會產生怎麼樣的影響？

我覺得嘗試著去投射或是想像未來是件有趣的事情，未來看起來是混沌又有趣的，但我希望有趣的成分多一點。

## 後記
這個 uniswap-mcp 只是為了研究目的而撰寫，程式碼 99% 全部都是由 Cursor 寫的。你我都知道，我們不該把私鑰透過環境變數傳入程式，但如果還是很好奇的話，以下是它的源碼，請只拿來做測試與研究，還有不要放太多錢進去。

- [https://github.com/yurenju/uniswap-mcp](https://github.com/yurenju/uniswap-mcp)