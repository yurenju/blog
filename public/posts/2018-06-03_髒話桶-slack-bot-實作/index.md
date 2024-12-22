---
title: "髒話桶 Slack bot 實作"
author: "Yuren Ju"
date: 2018-06-03T10:21:53.010Z
lastmod: 2023-06-06T13:41:41+08:00
categories: [tech]

description: ""

subtitle: "我跟我一群好朋友們很宅的使用 slack 作為平常打屁聊天的工具。為了讓聊天打屁更沒有意義，我們在好久以前就加入了一個髒話桶的 slackbot 設定，講髒話跟講「喔喔」的人要轉 BTC 到髒話桶裡面。"

images:
  - "/posts/2018-06-03_髒話桶-slack-bot-實作/images/1.png"
  - "/posts/2018-06-03_髒話桶-slack-bot-實作/images/2.jpeg"
  - "/posts/2018-06-03_髒話桶-slack-bot-實作/images/3.png"
  - "/posts/2018-06-03_髒話桶-slack-bot-實作/images/4.png"
  - "/posts/2018-06-03_髒話桶-slack-bot-實作/images/5.png"
  - "/posts/2018-06-03_髒話桶-slack-bot-實作/images/6.png"
---

我跟我一群好朋友們很宅的使用 slack 作為平常打屁聊天的工具。為了讓聊天打屁更沒有意義，我們在好久以前就加入了一個髒話桶的 slackbot 設定，講髒話跟講「喔喔」的人要轉 BTC 到髒話桶裡面。

為什麼不能講「喔喔」？因為你再喔，我就一刀捅死你。

![image](/posts/2018-06-03_髒話桶-slack-bot-實作/images/1.png#layoutTextWidth)

[https://www.youtube.com/watch?v=DjUKOqcIxis](https://www.youtube.com/watch?v=DjUKOqcIxis)

想當初訂的價格差不多是一杯五十嵐，所以當年訂了中招一次 0.002 BTC，沒想到放在髒話桶裡面的 BTC 大漲，從一杯五十嵐變成一個便當，然後變成一客鰻魚飯，最高點的時候差不多是 1000 台幣，根本是大吃一頓都沒問題啊。後來我們就拿了髒話桶這些錢連吃了兩次都還有剩，可見大家有多喜歡罵髒話跟找人取經了。

![image](/posts/2018-06-03_髒話桶-slack-bot-實作/images/2.jpeg#layoutTextWidth)

那天雖然我們吃得很好，但是其實我們去錯餐廳了（名字一樣）

最當初的實作因為只是搞笑，所以也是隨便兜一兜。我們用 blockchain.info 作為錢包，然後再用 ifttt 去監測我的信箱有沒有收到 blockchain.info 的信，如果有人轉錢進來時就傳一則訊息到 Slack 去。

![image](/posts/2018-06-03_髒話桶-slack-bot-實作/images/3.png#layoutTextWidth)

這樣的實作有很多缺陷，像是我根本就不知道是誰轉的，也不知道他轉了多少錢。但是基本上只是搞笑的設定，所以這些問題就放了很久沒解決其實也還好。

只是這樣的小毛病還是讓我像是睡在超軟的床墊但最下面放了一個小石子這麼不舒服，但是這麼無用的專案其實也提不起勁好好整理。直到最近真的很想要支援 ETH 跟知道是誰轉錢進來，就認真的來改版一下了，就興趣使然的開始開發了。

### 架構

> 🔨 side project 就是手上有鐵鎚，看到什麼都是釘子的專案。

這次就決定什麼想試的都試一試。首先我決定用 now.sh 來架設我的服務，他使用了 micro 這個超級小的 microservice module，一次只能寫一個 function 並且提供開源專案免費使用，理所當然成為了這個專案背後的服務。

[Now](https://zeit.co/now)

另外因為 blockchain.info 的 API 看起來實在太難用了，所以就決定改用 Coinbase 作為錢包，看了一下他的 API 在不同範圍可以開唯讀權限，看起來炸了也不會太危險，同時他也支援 Notification。

然後我還用了 TypeScript + TDD，這次大多數都是先寫測試再寫程式。並且透過 TypeScript interface 訂出介面，如果之後要接除了 Coinbase 跟 Slack 以外的錢包服務或是通訊軟體應該都不用改太多。

至於功能只提供三個：

- `/jar 指令`：使用者下了 /jar 指令後，產生一組新的地址並且標注為該使用者專用
- `/balance 指令`：顯示目前錢包餘額
- `通知`：如果收到錢了之後，依據收到錢的地址來判斷此地址是產生給哪個使用者的。

系統裡總共有兩個 microservices：slash 跟 notification。比如說使用者 bob 下了 `/jar` 指令，slack 就會通知 slash，然後它會利用 `WalletProvider` 的 `getWalletAddress()` 取得單次使用的地址並且標記上 bob。

![image](/posts/2018-06-03_髒話桶-slack-bot-實作/images/4.png#layoutTextWidth)

當 bob 把錢轉進去髒話桶後，Coinbase 會發出通知到另外一個 notification microservice，而 notification service 會利用 WalletProvider 的 `getTransaction()` 取得這個地址上是標記哪個使用者。

![image](/posts/2018-06-03_髒話桶-slack-bot-實作/images/5.png#layoutTextWidth)

最後到 Slack 時就會顯示是哪個使用者轉的了。

![image](/posts/2018-06-03_髒話桶-slack-bot-實作/images/6.png#layoutTextWidth)

當然這一點都不精準，但是作為一個讓打屁聊天更加沒有意義的專案，這樣根本是神精準啊。

因為一次想試很多新東西，一不小心這個專案就斷斷續續做了幾個週末，今天終於把他完成了。如果你想找個浪費生命的專案，點下面這個連結就對了。

[yurenju/jarbot](https://github.com/yurenju/jarbot)

並且歡迎參加浪費才能大賽幫我上 pull request (全劇終)。
