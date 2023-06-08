---
title: "Nightwatch.js 應用 — 歸檔 pocket 所有文章"
author: "Yuren Ju"
date: 2016-07-05T02:06:25.084Z
lastmod: 2023-06-06T13:38:20+08:00
categories: [tech]

description: ""

subtitle: "Nightwatch.js 是個 JavaScript 編寫自動化程序好用的小工具，通常拿來做 end-to-end testing，不過當然他也可以拿來解決一些我曾經做的一些愚蠢事情。很久以前我用了 IFTTT 隨便設定了一堆文章透過 RSS 餵給…"

images:
  - "/posts/2016-07-05_nightwatch.js-應用-歸檔-pocket-所有文章/images/1.png"
---

![image](/posts/2016-07-05_nightwatch.js-應用-歸檔-pocket-所有文章/images/1.png#layoutTextWidth)

Nightwatch.js 是個 JavaScript 編寫自動化程序好用的小工具，通常拿來做 end-to-end testing，不過當然他也可以拿來解決一些我曾經做的一些愚蠢事情。很久以前我用了 IFTTT 隨便設定了一堆文章透過 RSS 餵給 pocket，所以我的未讀文章有數千篇。

當然愚蠢的不只有我，pocket 竟然沒實作歸檔所有文章的功能，而且在文件裡面只寫到因為「技術限制」所以沒有實作。

[Bulk Editing in Pocket on your Computer](https://help.getpocket.com/customer/portal/articles/1335207-bulk-editing-in-pocket-on-your-computer)

在捲了無數次的畫面還看不到未讀文章的盡頭後，懶人如我決定寫一個 script 解決這個問題。更蠢的是事實證明這樣沒有比較快，我花了兩三個小時編寫跟測試，這個時間拿來手動用 bulk editing 功能早就已經做完了。

可以說這是興趣使然的寫 script (one~~~~~ punch man!!!!)

### Nightwatch.js

Nightwatch.js 的設定我就不細說了，請上官方網站閱讀一下就可以知道如何設定，這次我的使用環境是用本地端的 selenium 與 chrome-driver。

### 觀察

仔細看 getpocket.com，按下 bulk edit 之後，可以先點選第一篇文章，之後捲動到底部後更多文章會載入。所以自動化程序的流程可以訂成這樣：

1.  登入
2.  點選 bulk edit
3.  選擇第一篇文章
4.  不停地按下鍵盤上的 End 按鍵捲到最下面
5.  直到沒有更多文章出來
6.  按著 Shift 與跟著按下最後一篇文章，所有的文章會被選取
7.  按下 archive

這個流程看起來合理，但是實際上撰寫後是不可行的。pocket 載入到第 2442 篇後就不會有新文章出來，更重要的是按下 archive 後 chrome 會卡死，而且文章也不會真的歸檔，所以替代方案就變成每捲動兩頁後就先按下 archive，然後看看是不是有更多文章出來，如果沒有更多文章出來後就完成了，所以調整流程如下：

1.  登入
2.  點選 bulk edit
3.  選擇第一篇文章
4.  按兩次鍵盤上的 End 按鍵
5.  按著 Shift 與跟著按下最後一篇文章選取這兩頁的文章
6.  按下 archive
7.  檢查是否有更多文章，如是則繼續做，否就大功告成。

先來看一下執行過程，指定了 POCKET_USER 跟 POCKET_PASS 作為帳號密碼，npm start 之後就會開啟 chrome 自動執行 script。

### 實作

整個 script 寫完後長這樣（因為是一次性 script 就別太講究效率跟美觀了了）：

首先來看看第一部份

首先到 pocket 登入帳號的頁面，並且使用環境變數裡面的 POCKET_USER 跟 POCKET_PASS 帳號密碼登入，並且等待 “bulk edit” 這個按鈕出現。

第二段有點長，首先 async.doWhilst 是個非同步的流程控制工具，其實就是 do…while 的非同步版。
```
doWhilst(fn, test, callback)
```

第一個參數是 do {} 本身，第二個是測試的 condition，如果為 true 就繼續跑，false 則停。第三個 callback 是當這個 do…while 跑完之後會呼叫的 callback。

接下來我們先來看第一個參數 fn：

第一個是直接輸入網址到未讀清單。會這樣做的原因有兩個。第一個是當按下 archive 時，其實文章只是被隱藏起來，但是卻沒有消失，所以用 css selector “a.item_link.start_articleview” 計算剩餘還有幾篇文章時會失準，重新整理頁面才可以得到正確的數字。但是重新整理頁面之後又不會回到頁面的開頭，而 pocket 的設計是往下捲動之後 bulk edit 按鈕就會隱藏，所以會點不到。最好的做法就是直接在前往該頁面一次，就不用 refresh 而且位置也會在最上面了。
```
client.keys([client.Keys.END])
```

.keys 是個可以使用鍵盤按鍵的 function，所有的按鍵列表可以到源碼內的 [keys.json](https://github.com/nightwatchjs/nightwatch/blob/master/lib/util/keys.json) 查詢。

這邊最麻煩的地方，就是要如何點選所有 selector 選取到的所有元素裡面的最後一個了，原因是因為 css selector 並沒有 :last-match 這樣的選項，雖然說還是可以很迂迴的拿到最後一個元素，不過使用 xpath 可以更容易地拿到最後一個元素，所以可以在這邊先把 selector 切換成 xpath，操作完畢後再切回 css selector。

xpath 就不介紹了，我也是臨時抱佛腳上網找到的方法，總之用 [last()] 就可以選到最後一個元素。

這邊另外一個值得一提的是假如說你按的按鍵是修飾鍵（也就是 Shift, Ctrl, alt 或 cmd），nightwatch 會一直持續地按著，直到滑鼠 click 事件發生後才會放開。另外我在別人的範例裡面看到放開後還會多呼叫一個 NULL，沒仔細研究，不過猜想是明確的指定放開鍵盤按鍵。

在這個 fn 裡面最後會使用到 client.elements 來取得目前文章的數量

完成後就利用 async.doWhilst 的第二的參數來決定要不要繼續執行，或是所有文章已經歸檔：

current 等於零代表已經沒有更多文章，大功告成了！

### 感想

說實在 nightwatch 雖然已經是很方便的工具，但是撰寫自動化 script 還是需要不停的測試，而每個人的環境還是會有點不一樣，比如說 pocket 會依照螢幕大小隱藏按鈕，所以這個 script 在別的地方也不見得可以用。

而用在測試上 e2e 測試要花的時間也比起 unit test 多上不少，在公司裡使用時大多也只拿來概略性的測試整個 app 沒問題，多數測試還是採用 unit test 保持更穩定的測試環境，與花更少時間測試。

不過 nightwatch 還是很好用，可以拿來處理一些各式各樣需要自動化的場合。

另外我也把完整的 nightwatch 設定跟 script 放在 github，有興趣的讀者可以去看一下。

[yurenju/pocket-archive-all](https://github.com/yurenju/pocket-archive-all/)
