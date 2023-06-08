---
title: "透過 MetaMask 使用 EtherTW Tickets 報名活動"
author: "Yuren Ju"
date: 2018-03-12T09:01:22.375Z
lastmod: 2023-06-06T13:41:04+08:00
categories: [tech]

description: ""

subtitle: "這次 Taipei Ethereum Meetup 使用去中心化技術在 Ethereum 區塊鏈上建立了一個報名機制，並且於 2018/3/21 的活動採用這個報名系統。這篇文章將會講解如何利用 MetaMask 報名。"

images:
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/1.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/2.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/3.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/4.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/5.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/6.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/7.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/8.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/9.png"
  - "/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/10.png"
---

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/1.png#layoutTextWidth)

這次 Taipei Ethereum Meetup 使用去中心化技術在 Ethereum 區塊鏈上建立了一個報名機制，並且於 2018/3/21 的活動採用這個報名系統。這篇文章將會講解如何利用 MetaMask 報名。

### 機制簡介

[Taipei Ethereum Meetup Tickets](https://ethertw.github.io/tickets/)

EtherTW Tickets 系統是透過 MetaMask 瀏覽器外掛與以太坊區塊鏈整合，透過智能合約來紀錄使用者的購票紀錄。所以在購票前一定需要安裝 MetaMask 或是類似軟體來連接區塊鏈。

如果你打算採用手機報名，請使用 [Cipher Browser](https://www.cipherbrowser.com/) 或是 [Trust Browser](https://trustwalletapp.com/) 進行報名，以下範例將示範如何使用 MetaMask 報名。

### 安裝 MetaMask

如果你已經安裝 MetaMask 可以跳過這個步驟。

請先到 [MetaMask 官方網站](https://metamask.io/)安裝延伸套件，目前 MetaMask 支援 Chrome 以及 Firefox 瀏覽器，經過測試目前 Chrome 瀏覽器的支援程度較佳。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/2.png#layoutTextWidth)

按下後會導到 Chrome Web Store

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/3.png#layoutTextWidth)

按下「加到 CHROME」來安裝延伸套件

安裝完畢，按下瀏覽器右上角的狐狸圖示後會出現使用者條款，同意後後會進入輸入密碼的畫面，請輸入一組密碼並且妥善保存。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/4.png#layoutTextWidth)

接著會顯示一組恢復帳號用的復原碼，也請記下這組復原碼妥善保管後，按下「I’ve copied it somewhere safe」

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/5.png#layoutTextWidth)

最後會到以下的這個畫面，到這邊的話代表你的帳號已經開設完成。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/6.png#layoutTextWidth)

### 儲值 / 匯入 ETH

安裝完畢 MetaMask 後，如果你是第一次使用 MetaMask，你的餘額將會是 0 ETH。你會需要匯入 ETH 到 metamask 所開設的錢包。

本次報名需要 0.015 ETH 的報名費用，但當在執行區塊鏈的交易時，還會需要支付礦工費用，所以請不要只匯入正好 0.015 ETH 到 MetaMask 當中，建議可以匯 0.02 ETH 來確保有足夠的費用來支付礦工費用。

在台灣有幾種較為便利的台幣兌換 ETH 的管道，其中一種是透過 [MaiCoin](https://www.maicoin.com) 這個網站購買。一般來說開通銀行匯款購買 ETH 需要一些時間，如果你剛註冊帳號，也可以透過萊爾富便利超商的方式購買，僅需填妥帳號基本資料與綁定手機號碼，以下付上兩種方式：

- [銀行匯款](https://www.maicoin.com/zh-TW/faq/buy-and-sell-bitcoin/15)
- [便利商店購買](https://www.maicoin.com/zh-TW/faq/payment-methods/21?currency=khr)

除了 MaiCoin 買賣幣服務以外，也可以透過台灣的交易所如 [BitoPro](https://www.bitopro.com/) 與 [MAX](https://max.maicoin.com/)。另外國外還有許多其他服務就不在這邊詳列。

如果你已經有 BTC 並且已經在國外的交易所開設帳號，也可以考慮直接將你的 BTC 兌換至 ETH。

### 報名

當你擁有足夠的 ETH 並且匯到 MetaMask，等到報名時間到了後，網站就會開始接受報名。到報名頁面後，填妥名字與電子郵件後，你可以選擇填寫高於 0.015 ETH 以上的報名費用來支持我們舉辦與推廣 Ethereum，你也可以維持原本的報名費 0.015 ETH。

按下「使用 MetaMask」完成報名後，將會跳出 MetaMask 的視窗讓你確認是否要送出此筆交易。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/7.png#layoutTextWidth)

跳出的視窗會包含你預計付出的報名費、以及用於給礦工費用計算的 Gas Limit 以及 Gas Price，以及最後的總額，請注意總額會稍微高於報名費用因為其中包含了報名費以及支付給礦工的交易費。

確認執行此筆交易後，按下「Submit」即可送出交易，送出交易後下面會出現一個提示你可以到 Etherscan 查詢你的交易是否成功，通常交易會在一分鐘內完成。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/8.png#layoutTextWidth)

你可以按下 Etherscan 來查詢你的交易，這筆交易剛開始會是顯示 Pending，過了一段時間後會顯示 **Success** 或是 **Failed**，請注意只有出現 Success 才代表你的報名已經成功。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/9.png#layoutTextWidth)

如果報名成功，重新整理報名頁面後會看「本錢包位址已經報名，當天請出示寄給您的電子郵件即可。」，同時你也會收到電子郵件，確認交易成功後，請在活動當天活動報到時出示此電子郵件即可。

![image](/posts/2018-03-12_透過-metamask-使用-ethertw-tickets-報名活動/images/10.png#layoutTextWidth)

如果你報名時遇到任何問題，請直接透過 [Facebook 傳訊](https://www.facebook.com/messages/t/eth.taipei)跟我們聯絡。
`再次提醒，只有在 Etherscan 頁面的交易顯示「Success」才代表報名成功，如果出現其他訊息都代表報名沒有成功，請聯絡我們取得協助。`
