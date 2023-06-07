---
title: "用 Serverless 介接 LINE bot API"
author: "Yuren Ju"
date: 2016-09-21T16:10:30.897Z
lastmod: 2023-06-06T13:38:36+08:00
categories: [tech]

description: ""

subtitle: "前陣子跟 Steven Shen 一起弄了一個跟 Facebook bot platform 相關的 side project，前端用 vue.js 並且使用了 github pages, serverless 與 firebase 把這個服務串了起來。"

images:
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/1.png"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/2.png"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/3.png"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/4.jpeg"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/5.png"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/6.png"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/7.png"
  - "/posts/2016-09-21_用-serverless-介接-line-bot-api/images/8.png"
---

前陣子跟 [Steven Shen](https://medium.com/u/13cbc18d6975) 一起弄了一個跟 Facebook bot platform 相關的 side project，前端用 vue.js 並且使用了 github pages, serverless 與 firebase 把這個服務串了起來。

那個時候我主要負責前端的部分，不過我一直對 serverless 很有興趣，所以這次就試著用 serverless 來介接 LINE BOT 來看看使用上的感覺到底是如何。

Serverless 名字聽起來很威，但並不是真的沒有 server，要說 Serverless 前得先從 AWS/Azure 這兩年開始提供的一種新類型的服務開始說起。

### AWS Lambda / Azure Functions

![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/1.png#layoutTextWidth)
AWS Lambda / Azure Functions

大約在兩年前我注意到了 AWS 開始提供了一個新的服務 “Lambda”，這個服務是可以在不需要 host 伺服器的狀況，由 AWS 提供的伺服器幫開發者執行一個 “function”，最常舉的例子就是圖片縮圖。原因就在於縮圖這件工作在一般的服務中很常抽出來成為另一個獨立的服務。

而 Lambda 的功能是「執行一個 function」，所以開發者需要建立一個縮圖服務，就可利用 lambda 建立一個縮圖用的 function，當需要時觸發這個 function 起來運行，這樣就不需要一台 EC2 或是伺服器做這件事情，另外也不需要擔心 scaling 的問題（前提當然是這個服務要切得夠獨立）。

除了不需要自己管理以外，Lambda 的價格非常便宜，以目前來說 AWS 提供了足夠的免費額度來使用：

![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/2.png#layoutTextWidth)
[https://aws.amazon.com/tw/lambda/pricing/](https://aws.amazon.com/tw/lambda/pricing/)

不只 AWS, 微軟也提供了 Azure Functions 這樣類似的服務，所以只要你的服務架構得當，有許多功能可以放到 AWS Lambda/Azure Functions 上執行，在成本與擴展性上都有許多好處。

像是 BOT 這樣的應用不需要一直開啟一台伺服器等著，只需要在使用者輸入訊息後回覆即可，這樣的應用就不需要開一台 heroku 或 ec2，很適合使用 lambda 這樣的服務。

### Serverless

![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/3.png#layoutTextWidth)

Serverless 又是什麼呢？它是一套整合了不同廠商如 AWS Lambda 或 Microsoft azure functions 這些服務的框架，並且簡化其設定讓使用者可以很快地就開始使用這類型服務。

舉例來說假如說你想使用 Lambda，除了 Lambda 以外其實還需要設定 API Gateway，新增你所需要的 http endpoint 並且設定 CORS 等等這些雜務，使用了 serverless 之後就可以把這些設定都集中在 serverless.yml 這個設定檔中即可，並且提供 deploy 指令，節省許多功夫。

### Serverless line bot 架構與實作簡介

這邊只會簡介架構與實作，詳細如何設定 serverless 請參考[官方網站的文件](https://serverless.com/framework/docs/guide/)。

我們準備實作一個最簡單的 bot 功能  —  使用者傳訊息給 bot，這個 bot 就再把這個訊息回傳給使用者。

![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/4.jpeg#layoutTextWidth)
iOS 隨機選字，所以對話內容怪怪的

整個服務與 LINE service 互動的架構如下
![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/5.png#layoutTextWidth)
乍看之下跟一般使用 EC2 或 heroku 的結構沒什麼兩樣，但是要記住這邊我們沒有 host 任何伺服器，我們提供給 AWS 的只有一個 “function”，所有需要執行這個 function 的伺服器都由 AWS 管理，我們不用管到底開了幾台伺服器來執行這個功能。

而把上圖 serverless 的區塊拆開來看則是這樣：
![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/6.png#layoutTextWidth)
雖然使用 serverless 框架時，其實只會在 serverless.yml 裡面設定一個 https endpoint 資訊，不過實際上部署時 serverless 會使用 AWS API gateway 開設一個 http endpoint，再由這個 endpoint 去觸發 lambda 裡面的 function 執行。

我們先來看看我們提供給 AWS lambda 的那個 “function” 長怎樣。

由於這是一個十分簡單的功能，所以在這個 module 裡面只有一個 function “receive()” 負責用來接收訊息。接收到訊息後，稍微修改訊息內容並且取得發送訊息的 userId 後，透過 line-bot-sdk module 把訊息回傳給原使用者。

另外這個模組使用 dotenv 這個模組管理環境變數，這些環境變數如 LINE_CHANNEL_ID 等都會寫在 .env 這個檔案裡面，並且在 serverless.yml 設定 .env 檔案要一併上傳到 lambda。

至於要如何設定這個 function 什麼時候被觸發呢？利用 serverless.yml 設定相關資訊即可：

這邊除了設定 AWS 為 provider 外，也設定了目前唯一使用的一個 function “receive” 實際上使用的 JavaScript function 是 handler.js 底下的 receive()。另外也指定了 http endpoint 是 **/receive**，並且只接受 POST method。

最後執行 serverless deploy -v 後，就會出現 http endpoint 的網址。

![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/7.png#layoutTextWidth)

這時候再打開 LINE bot API 的[設定頁面](https://developers.line.me/)，把這個網址填寫到 callback 欄位即可。

![image](/posts/2016-09-21_用-serverless-介接-line-bot-api/images/8.png#layoutTextWidth)

如此這個小小的 LINE bot 服務就完成了！

### 遇到的小麻煩

麻煩說小不小，遇到了還是覺得有點煩。首先 serverless 剛經過一個較大的改版，設定方式都有些不同，因為我現在才開始用所以基本上也不用從舊版的設定方式 migrate 過來。

但是網路上的文件資訊很多都是舊版的設定方法，找資料時有點痛苦，就算找到舊的方法也要想辦法找到要如何套在新版的設定檔上面。

另外一個跟 serverless 比較無關的就是 LINE bot API 的資訊目前還蠻少的，除了文件不夠齊全外，呼叫時遇到錯誤的錯誤訊息寫的也不是很清楚，例如我就收到以下錯誤訊息
`unexpected error found at call bot api sendMessage`

結果是從使用者接收訊息時，最外面有一個屬性 “from” 會顯示一個 user id，而又有一個 content 物件，裡面又有另外一個 “from” 屬性。文件裡面並沒有交代得很清楚這兩個 from 屬性有什麼不一樣，我誤用了後就出現以上的錯誤，但是這樣的錯誤訊息顯然無法幫助我找到錯誤的原因。

LINE API 英文資訊似乎有點少，後來我在一個[日文的網頁](http://qiita.com/mayutan/items/b25d4ac6d8eee07a3e54)上找到了解答，感謝 Google Translate!

### 結論

之前覺得 serverless 很酷，實際用過的感想也是這樣 💯

雖然說目前比較沒機會用到 serverless，不過如果有些 side project 性質適合的話也可以拿來用，把 domain name 設定好後拿來介接一些以前純前端不太方便接的服務好像也不錯。

更何況 lambda 支援 node.js 對 JavaScript 開發者的入手難度也不會太高。之後有適合的機會我會再拿來好好的把玩把玩 👊

另外我把這次寫的範例放在 github，其實基本上跟 serverless 的 hello world 也沒差多少，不過有興趣還是可以看看。

[yurenju/serverless-line-bot](https://github.com/yurenju/serverless-line-bot)
