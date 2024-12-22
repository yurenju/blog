---
title: "蘋果日報留言分析"
author: "Yuren Ju"
date: 2015-08-22T10:50:48.925Z
lastmod: 2023-06-06T13:37:06+08:00
categories: [tech]

description: ""

subtitle: "實在太討厭有人會重複的在新聞下面留言，今天根據近日蘋果日報發表的九百多篇新聞擷取了超過八千筆留言，如果你也想分析的話可以在這邊取得"

images:
  - "/posts/2015-08-22_蘋果日報留言分析/images/1.png"
  - "/posts/2015-08-22_蘋果日報留言分析/images/2.png"
  - "/posts/2015-08-22_蘋果日報留言分析/images/3.png"
  - "/posts/2015-08-22_蘋果日報留言分析/images/4.png"
  - "/posts/2015-08-22_蘋果日報留言分析/images/5.png"
---

![image](/posts/2015-08-22_蘋果日報留言分析/images/1.png#layoutTextWidth)

實在太討厭有人會重複的在新聞下面留言，今天根據近日蘋果日報發表的九百多篇新聞擷取了超過八千筆留言，如果你也想分析的話可以在這邊取得

「[試算表：蘋果日報留言](https://docs.google.com/spreadsheets/d/1I4ST3DumEd3Xs9bLONE2mZzeBYqPOCCKU3pelrJav9s/edit#gid=0)」

[更新] 後來我還是覺得儲存成 JSON 比較方便，想拿 JSON 檔可以到 [github](https://github.com/yurenju/fb-comments-fetcher/tree/gh-pages) 上面取得。

我實在不太會用試算表，所以還是寫了 JavaScript 直接分析。首先來看看我常看到的「重複留言」的情形存不存在。以我的資料集來說，確實有一位叫做 Frank Yin 的使用者在不同的新聞複製貼上完全一模一樣的留言，總共有 26 筆

![image](/posts/2015-08-22_蘋果日報留言分析/images/2.png#layoutTextWidth)

根據他貼文的模式應該是新聞出現蔡英文或是洪秀柱他就會複製貼上那篇文章。

![image](/posts/2015-08-22_蘋果日報留言分析/images/3.png#layoutTextWidth)

會完全貼上一模一樣的文字除了這位 Frank Yin 以外，還有另外一位 Mike Wang, 他有去的地方在於剪貼簿裡面其實有很多不同的文字，所以我們也可以說他是比較認真的民眾。

另外意外發現也有人在複製貼上宣傳宋楚瑜粉絲頁的訊息

![image](/posts/2015-08-22_蘋果日報留言分析/images/4.png#layoutTextWidth)

至於拿下最多讚的是評論「[錦雯烏來救災 酸社運學生沒半個去幫忙](http://www.appledaily.com.tw/realtimenews/article/new/20150820/674271/)」的一位民眾：

![image](/posts/2015-08-22_蘋果日報留言分析/images/5.png#layoutTextWidth)

大家覺得還有什麼好分析的呢？你可以直接下載那份試算表回去做分析，或是留言告訴我你想看到什麼分析資料！

另外儲存擷取留言的 script 我放在 [github/fb-comments-fetcher](https://github.com/yurenju/fb-comments-fetcher) 裡面，可以改成別的網站的格式，另外目前的分析結果也可以從 [gh-pages](https://github.com/yurenju/fb-comments-fetcher/tree/gh-pages) 裡取得。
