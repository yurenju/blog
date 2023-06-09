---
title: "採用區塊鏈技術的報名系統"
author: "Yuren Ju"
date: 2018-03-27T00:19:26.341Z
lastmod: 2023-06-06T13:41:10+08:00
categories: [tech]

description: ""

subtitle: "這次 Ethereum 全明星技術座談終於到了一個段落，也比較有時間來整理一下資訊。這次最特別的就是採用了基於區塊鏈的報名方式，記錄使用者的報名資訊在區塊鏈上，到場時再出示報名相關的證明來驗證是否報名。Taipei Ethereum Meetup 是一個推廣 Ethereum…"

images:
  - "/posts/2018-03-27_採用區塊鏈技術的報名系統/images/1.png"
  - "/posts/2018-03-27_採用區塊鏈技術的報名系統/images/2.png"
  - "/posts/2018-03-27_採用區塊鏈技術的報名系統/images/3.png"
---

這次 [Ethereum 全明星技術座談](https://ethertw.github.io/tickets/)終於到了一個段落，也比較有時間來整理一下資訊。這次最特別的就是採用了基於區塊鏈的報名方式，記錄使用者的報名資訊在區塊鏈上，到場時再出示報名相關的證明來驗證是否報名。Taipei Ethereum Meetup 是一個推廣 Ethereum 區塊鏈的技術社群，報名時也採用區塊鏈技術再適合不過了！

剛開始的時候我們想解決的問題是上次 BeyondBlock 研討會時出現率過低的問題，這也是免費活動經常會遇到的情況，通常出席率會落在六成到七成之間。而 Taipei Ethereum Meetup 是因為大家的熱情聚集並且一同組織活動，大家花費了很多心力舉辦活動，出席率不彰自然容易澆熄熱情，所以這也是我們上次活動後就想要解決的問題。

首先我們剛開始想做的是押金制，想要透過智能合約收取押金後，在使用者證明出席後退回押金。

![image](/posts/2018-03-27_採用區塊鏈技術的報名系統/images/1.png#layoutTextWidth)

不過這次的活動因為想租用更好的場地來容納更多觀眾，經過社群組織人的討論後，決定應該要改用付費制，在這個當下其實我們已經把押金制的系統建置大約六成並且在社群內進行內部測試了，所以我們又很緊急的將系統改成付費制的報名系統，這也是最後大家看到的報名網站。

當然去除掉押金設計，整個智能合約的功能也會比較簡化，僅需要處理付款之後紀錄錢包地址即可。

![image](/posts/2018-03-27_採用區塊鏈技術的報名系統/images/2.png#layoutTextWidth)

整個系統並不是完全的去中心化應用，而是混合了中心化與去中心化技術。網站採用 react.js 開發，並且透過 ethjs 連接 MetaMask 並且接入區塊鏈。而電子郵件與報名者名字則因為個人隱私考量沒有放在區塊鏈上面，而使用中心化的 Firebase 資料庫儲存這些資訊。

我們的智能合約放在 [Github](https://github.com/EtherTW/tickets/blob/master/contracts/contracts/TEMTicket.sol) 上供大家參考，部署時需要提供幾個參數：

1.  **錢包地址**：活動結束後會需要把 ETH 報名費匯出到一個錢包
2.  **參與人數**：整個活動的參與人數上限
3.  **報名開始時間**：只有在開始報名後智能合約才會接受報名

當使用者前往報名頁面後，系統將會透過 eth.js 與 MetaMask 連接這次報名所使用的智能合約，並且取得智能合約中的目前報名人數資訊。

首先要滿足幾個條件才可以開始報名：(1) 報名時間已經開始 (2) 參與人數還沒到達上限 (3) 使用者呼叫報名的函式時有附上超過 0.015 的 ETH。

當以上條件都滿足時，填妥資料送出後會發出一個 Transaction 到區塊鏈上，當此筆交易成功時你的錢包位址將會被登錄入區塊鏈中的智能合約。

在此同時我們也會將電子郵件與報名者名字紀錄在 Firebase 資料庫當中，並且透過電子郵件送出報名相關資訊。我們的報到機制因為考慮到現場要如何簡易的驗證使用者的資訊，僅採用使用者出示系統所寄送的電子郵件作為證明。

整體來說在這個報名系統中，去中心化平台負責了跟資產相關的邏輯：報名費、入場資格；中心化服務則負責了儲存個人隱私資訊以及寄送電子郵件的功能。

![image](/posts/2018-03-27_採用區塊鏈技術的報名系統/images/3.png#layoutTextWidth)

當然這樣的售票方式是一個實驗，過程中間也遇到一些問題待解決。

首先第一個問題就是有數個使用者希望一次買多張票，但當初沒有這樣的設計，導致有這樣需求的人必須切換不同錢包地址來購買多張票卷，這是個可以在智能合約裡面改進的地方。

另外由於我們寄送信件是透過 Firebase 的寄信功能，寄信的時間點在新增資料到 Firebase 資料庫時即寄出信件，但是資料進入資料庫時並不保證交易已經成功，導致後台系統還需要額外確認資料庫裡面記錄的錢包地址是否有完成交易取得票卷，這也是可以透過 ethereum event 更好的處理，或是也可以考慮完全移除 Firebase 的依賴。

最後其實電子郵件當初是因為需要發出報名資訊方便當天報到所以才額外在 Firebase 紀錄，但是也可以透過其他方法處理報到流程，進而讓這個系統脫離對 Firebase 中心化資料庫的依賴。

其中一個可以的做法是當報名成功後，讓使用者再次透過 MetaMask 簽名特定訊息，並且將簽名後的結果產生成 qrcode，並且提示使用者妥善保存此 qrcode 作為出席的依據，在報到時可以利用此 qrcode 確認這是由特定錢包簽名過的資訊作為入場依據。

### 區塊鏈技術的報名系統適合嗎？

當我們開放報名的那天，我心裡還在反覆思考到底使用這樣的報名方式到底恰不恰當。隨著票券售馨，加上當天超過九成的出席率也讓我放下心中的大石。其實當使用者已經花了不少心力搞清楚怎麼用區塊鏈報名時，不夠感興趣的使用者都放棄了，最後完成報名的出席活動的機率當然會非常的高。

但這也是個雙面刃，這樣的報名方式的技術門檻還是不低，首先要有 ETH 以外，還需要安裝 MetaMask 並且利用它完成報名。採用這樣的報名方式，短期看來還是比較適合採用在跟 Ethereum 相關的技術型活動。

當然我們也期待有更好的基礎建設可以讓所有人使用區塊鏈技術時都可以變得非常簡單的那一天  —  就如同現在大家都可以輕鬆的透過瀏覽器上網際網路一般 😀
` 本報名系統網站方面由我 ([Yuren Ju](https://github.com/yurenju)) 與 [KK Chen](https://github.com/bichenkk) 開發，並且由[謝永宸](https://github.com/willliw)撰寫第一版較複雜的押金制智能合約，後期由我修改成付費制的智能合約。本專案為開放源碼專案以 MIT 授權釋出。``[https://github.com/EtherTW/tickets](https://github.com/EtherTW/tickets) `
