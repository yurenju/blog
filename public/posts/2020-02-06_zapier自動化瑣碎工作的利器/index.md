---
title: "Zapier — 自動化瑣碎工作的利器"
author: "Yuren Ju"
date: 2020-02-06T15:36:09.196Z
lastmod: 2023-06-06T13:42:57+08:00
categories: [tech]

description: ""

subtitle: "Zapier 是一個用來自動化各種瑣事的付費服務，它可以把很多不同服務的步驟串起來，比如說像是你收到了一封特定的 email 後他可以自動地幫你加到代辦事項當中，順便再用 Slack 通知你。"

images:
  - "/posts/2020-02-06_zapier自動化瑣碎工作的利器/images/1.png"
  - "/posts/2020-02-06_zapier自動化瑣碎工作的利器/images/2.png"
  - "/posts/2020-02-06_zapier自動化瑣碎工作的利器/images/3.png"
---

![image](/posts/2020-02-06_zapier自動化瑣碎工作的利器/images/1.png#layoutTextWidth)

[Image credit](https://zapier.com/page/partner-kit/)

最近在[科技島讀](https://daodu.tech/)的 Slack 看到這篇文章《[武漢肺炎爆發時在家工作？31 個讓你遠端工作更有效率的工具](https://www.perapera.ai/post/remotework/)》提到 Zapier 這個我已經知道很久但都沒機會嘗試的工具，讓我這幾天終於開始嘗試這套工具了，想來分享一下試用的心得。

Zapier 是一個用來自動化各種瑣事的付費服務，它可以把很多不同服務的步驟串起來，比如說像是你收到了一封特定的 email 後他可以自動地幫你加到代辦事項當中，順便再用 Slack 通知你。我現在設定了幾項工作如下：

![image](/posts/2020-02-06_zapier自動化瑣碎工作的利器/images/2.png#layoutTextWidth)

前面兩項跟 github 相關，在指定的 github repo 當中如果我被指派了新工作或是有人指定我來 review 一個 Pull request 時，Zapier 會自動的把工作放到 Todoist 內指定完成日期是今天（通常這些我都會在一天內做完），並且透過工作用的 Slack account 傳送私訊給我。

第三個稍微複雜些，是我的 Ethereum 區塊鏈錢包收到匯款時會發到個人用的 Slack 通知我，步驟如下：

1.  [etherscan] (https://etherscan.io/)服務提供監看錢包地址功能，地址收到錢後會寄信給我
2.  寄到我 gmail 信箱的信件如果收到標題包含 `[Address Watch Alert]` 的郵件時，會被挑選出來做後續處理
3.  信件內容會透過一個 Regex 的文字處理器解析出最重要的那句話，也就是到底收到多少錢，是什麼貨幣等資訊
4.  最後將這個解析出來的資訊送到個人用的 Slack

第四個則比較簡單，是收到花旗信用卡的帳單後在 Todoist 新增一個代辦事項並且附上信件連結。

如果你有用過 IFTTT 對這樣的工具應該滿熟悉的，一直以來我也都是使用 IFTTT 處理自動化的事情，比如說我站上我家的 WiFi 體重計之後，他會幫我把體重資訊同步到我的 Fitbit 手錶的 app 將健康資訊都整合在一起。Zapier 跟 IFTTT 非常類似，但是有幾點不同：

1.  它是付費服務（也有免費版，但跟 IFTTT 差不多）
2.  Zapier 支援的服務是 IFTTT 的好幾倍這麼多
3.  可以多重步驟像是先記錄到 Todoist 之後再發 Slack
4.  支援處理文字內容，像是上面提到的解析 email 內文提取出有用的資訊
5.  可以處理 multiple condition
6.  還支援 webhook, 真是包山包海…

而提供了這麼多樣的功能，理所當然的是一個[付費服務](https://zapier.com/app/billing/plans)。

![image](/posts/2020-02-06_zapier自動化瑣碎工作的利器/images/3.png#layoutTextWidth)

收費上也不算便宜。雖然也有免費方案，但是沒有多重步驟感覺起來跟 IFTTT 就沒什麼太大的區別，如果要買付費方案的話感覺就是要用好用滿才不會浪費。

到底要不要買呢，我也還需要考慮一下。你有用 Zapier 嗎？你拿來做什麼事情呢？在下面留言一下吧。
