---
title: "LINE Developer Day 見聞 — 火紅的 BOT API"
author: "Yuren Ju"
date: 2016-10-04T01:31:01.519Z
lastmod: 2023-06-06T13:38:40+08:00
categories: [tech]

description: ""

subtitle: "感謝 LINE 與 Tech In Asia 的邀請到了東京參加了 LINE Developer Day 2016，最近正好在研究 Facebook Messenger Platform，這次的 Dev day 正好讓我針對 LINE BOT…"

images:
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/1.jpeg"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/2.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/3.jpeg"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/4.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/5.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/6.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/7.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/8.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/9.png"
  - "/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/10.jpeg"
---

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/1.jpeg#layoutTextWidth)

感謝 LINE 與 Tech In Asia 的邀請到了東京參加了 [LINE Developer Day 2016](http://linedevday.linecorp.com/jp/2016/en/)，最近正好在研究 Facebook Messenger Platform，這次的 Dev day 正好讓我針對 LINE BOT 好好研究一下與其他解決方案比較的優劣。另外雖然這次有很多其他主題，不過本篇會專注在討論 LINE BOT API。

在來 LINE Developer Day 之前，其實我自己有申請 bot trial account 來試試看開發者預覽的 BOT API，當時已經用 LINE BOT 加上 AWS 的 Lambda 串起來玩玩後也寫了一篇[文章分享相關資訊](https://medium.com/technology-coding/用-serverless-介接-line-bot-api-e46f172e8028)。在出發的前幾天我又寫了一個做旅行記帳的 LINE BOT，可以透過 bot 記帳、轉換貨幣並且記錄在 Google Spreadsheet 上面。

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/2.png#layoutTextWidth)

雖然稱不上好用，不過在東京這幾天用這個記帳下來也沒什麼特別的問題，這個小專案待我整理一下會把程式碼放出來。不過藉由寫這樣的小機器人也讓我了解到 LINE BOT API 有幾個不足的地方：

1.  **文件**：這個版本的文件寫得非常的簡略，許多欄位需要摸索才知道要如何正確填入
2.  **錯誤訊息**：當錯誤發生時，回傳的錯誤代碼沒辦法清楚的告訴開發者出了什麼問題，該從哪個方向除錯
3.  **Magic Number**：API 中有數個意味不明的 Magic Number 並且這些數字有些型態是數值，有些是字串，文件上也只標註 fixed value。
4.  **豐富性**：LINE BOT API 送訊息時的樣板選擇很少，不像 Facebook Messenger Platform 上已經支援了多種訊息樣板，可以做出的變化有限，也不支援選單功能。

而這次在 LINE Developer Day 上所發表的新的 Messaging API 則解決了以上大部分的問題，讓我們來看看這次開發者大會發表了什麼吧！

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/3.jpeg#layoutTextWidth)

### LINE Notify

在講 Messaging API 前，講者宣布了啟用 LINE Notify 這個新型態的 API。這樣的 API 其實 Slack 的使用者應該都不陌生。在 Slack 上可以連接各式各樣的服務到 Slack 的 Channel，從 github 事件、app crash、伺服器紀錄等等都可以丟上特定的頻道，而 LINE Notify 正是做相同的事情。

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/4.png#layoutTextWidth)

除了在 github 的頁面上已經可以看到 [LINE 的整合訊息](https://github.com/integrations/line)外，在 IFTTT 上面已經有了對應的資訊。跟 IFTTT 綁定之後，會收到由 LINE Notify 這個帳號送出的相關訊息，把他邀請到要接收訊息的群組即可（也可以直接發送訊息）。

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/5.png#layoutTextWidth)

### Messaging API

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/6.png#layoutTextWidth)

來源：投影片 31 頁 [http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot](http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot)

LINE 這次將 BOT API 更名為 Messaging API，名稱上比較合理。

首先是訊息類型部分，目前訊息的樣板已經額外支援了 Carousel, Confirm 與 Button 三種類型，如果曾經使用 Facebook Messenger Platform 的話對這幾種 layout 應該不陌生，這樣也可以更豐富的表達訊息。

第二個新增的功能是可以將 bot 加入群組了，這個功能其實還蠻重要的，假如說你的機器人想要做在不同使用者之間的互動就需要這樣的功能，比如說安排活動的時間需要每個人填寫自己有空的時間，甚至像「剪刀石頭布」類似的功能需要等到所有人都決定要出什麼後才顯示結果的應用等等都需要機器人可以在群組內使用。

另外有一個我也覺得很有用的就是 Profile API。這個 API 可以讓你透過 API call 取得使用者的相關資訊。在演講的投影片裡面提到可以在 LINE 登入後取得使用者相關資料後直接填入，不需要重複填寫。

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/7.png#layoutTextWidth)

來源：投影片 44 頁 [http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot](http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot)

不過就 [API 文件](https://devdocs.line.me/en/?shell#bot-api-get-profile)看起來應該是無法取得如此多的資訊，可能還需要進一步的資訊才知道這邊是要怎麼取得。

### Rich Menu

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/8.png#layoutTextWidth)

來源：投影片 43 頁 [http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot](http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot)

Rich Menu 目前看起來是只有 LINE@ 可以開啟的功能，而且是直接在帳號設定頁面裡面設定，沒辦法透過 API 啟用。不過確實也是個非常方便的功能，可以設定由這個 menu 去觸發更多的動作，再由 LINE Messaging API 發出進一步的訊息讓使用者使用更多功能。

### Beacon 硬體與 Messaging API

這是這次大會中非常有意思的一個新功能，也是我完全沒預測到這次會釋出的功能。Beacon 是一種藍芽的裝置，會不斷的發出信號，當手機上有相對應的偵測軟體時可以觸發相對應的行為。而 Beacon 的發送訊號範圍可以調整，就可以進一步的瞭解顧客是否走到特定區域，進而進行更詳細的觸發行為，比如說在超市走到冷飲區可以推送跟冷飲相關的特價訊息。

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/9.png#layoutTextWidth)

來源：投影片 47 頁 [http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot](http://www.slideshare.net/linecorp/a-2-new-world-by-the-line-bot)

而這次 LINE Developer Day 大會中就發表了 LINE Beacon 的功能，可以讓使用者走到特定區域後觸發，接著由 Messaging API 傳送相對應的訊息。這個功能讓 LINE Messaging API 跟實體商店的整合更進一步，可以更容易地傳遞訊息給顧客。

LINE 在亞洲算是相當普及的通訊軟體，實體商店如果採用 LINE 與 Beacon 的整合可以想像出更多元的應用，比如說將 Beacon 放在門口，讓使用者逛街的時候收到優惠訊息，吸引使用者到店裡消費。

以前觀光景點常用的不同地點蓋章稅換贈品也可以移到 LINE 的平台上使用。許多使用情境讓這類型的應用有更多想像空間。

至於這樣的應用要怎麼測試呢？LINE 在這次開發者大會在會後填完問卷後，就會收到一盒贈品，其中就包含了 Beacon 裝置，可以讓開發者利用這個裝置測試！

![image](/posts/2016-10-04_line-developer-day-見聞-火紅的-bot-api/images/10.jpeg#layoutTextWidth)

### 結論

雖然說這次我自己是專注在 BOT 的相關開發資訊上較多，不過整個開發者大會還有許多其他開發者議題如安全性議題、提供給遊戲的 Container 技術架構、大型 Graph Database 架構與 Agile 經驗分享等等。以前甚少關注 LINE 開發者相關資訊，但從這次議題的分享也可以感受到 LINE 目前也是相當重視開發者，希望各種類型的開發者都可以使用 LINE 來做為開發平台，舉辦這樣的活動讓一般的開發者可以跟 LINE 內部開發者可以有更多交流是個很棒的機會。

在 Bot/Messaging 相關技術方面，其實各家的平台目前都逐漸補足自己的火力，訊息平台的 API 補齊後無論是 Facebook Messenger Platform 或 LINE Messaging API 都可以看到相似的介面。當一切條件類似後，突破點就變成了自家的使用者數量的比拼與跟自家生態系如何整合。如 Facebook 可以跟原本自家的 Social Network 整合，而 LINE 則是原有的訊息平台搭配上 LINE Pay。大家都使盡全力希望使用者可以留在自己的平台。

不過 Beacon 感覺確實是一個很好的切入點。查了一下其實 Facebook 也有[整合了 Beacon 技術](https://placetips.fb.com/beacons/)，但是使用上的彈性似乎不若目前看到 LINE Beacon 觸發後還可以由開發者自訂訊息這麼有彈性。如果可以藉此將實體店面綁定 LINE 的覆蓋率增加，開發出更多元的用戶體驗，對於開發者或實體店家都會是個很不錯的機會。

**利益揭露**：本次 LINE Developer Day 2016 由 Tech In Asia 與 LINE 邀請參加並提供機票與食宿。
