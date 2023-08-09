---
title: "CRDT 協同編輯簡例"
author: "Yuren Ju"
date: 2019-03-03T14:24:21.257Z
lastmod: 2023-06-06T13:42:25+08:00
categories: [tech]

description: ""

subtitle: "《數位書寫工具探索之旅》講了一些對書寫工具的調查，另外一邊也在看是不是能透過比較好的演算法來消彌離線優先的筆記軟體跟協作編輯器之間的障礙。這就得來看要怎麼在不同裝置之間也可以離線編輯，上線後同步。"

images:
  - "/posts/2019-03-03_crdt-協同編輯簡例/images/1.jpeg"
---

![image](/posts/2019-03-03_crdt-協同編輯簡例/images/1.jpeg#layoutTextWidth)

《[數位書寫工具探索之旅](/posts/2019-02-06_%E6%95%B8%E4%BD%8D%E6%9B%B8%E5%AF%AB%E5%B7%A5%E5%85%B7%E6%8E%A2%E7%B4%A2%E4%B9%8B%E6%97%85/)》講了一些對書寫工具的調查，另外一邊也在看是不是能透過比較好的演算法來消彌離線優先的筆記軟體跟協作編輯器之間的障礙。這就得來看要怎麼在不同裝置之間也可以離線編輯，上線後同步。

前一陣子看了些 CRDT 的論文，粗略的研究一下要在協同文字編輯上使用 CRDT 類別的演算法具體上要怎麼做紀錄一下。

首先 CRDT 是 conflict-free replicated data type 的簡寫，是一種在處理資料同步的方法，讓不同的 instance 之間可以在不需要每次寫入資料都需要跟其他節點溝通的狀況下解決同步問題，同時又可以保證每次的同步結果都會保持一致。

比起協同文字編輯，一般比較常會看到使用 CRDT 的地方會是 key-value 資料庫解決方案經常會看到。比如說 redislabs 網站上就有簡約的提到 CRDT 為他們的解決方案帶來怎樣的進展，其中一個特點就是寫入的時候也可以在多個 instance 之間寫入時是不需要當下就跟其他 instance 溝通，但是最後同步後的結果仍會保持一致。

[Under the Hood: Redis CRDTs | Redis Labs](https://redislabs.com/docs/under-the-hood/)

至於 CRDT 其實是一個大分類的演算法，其中每個演算法都有各自的限制跟應用場景，比如說 G-Counter 這個 CRDT 演算法就只能做往上遞增的的資料型態等。

#### 協同編輯

至於協同編輯就比較複雜些了，一直以來要在不同的裝置之間保持同步都是滿複雜的工作。在 CRDT 逐漸流行以前，比較常被提及的技術是 Operational transformation (OT)，一個有名的例子就是 Google Wave 當時的文字編輯器就是採用 OT 作為解決同步問題的手段，Google Docs 應該也是使用 OT。而 OT 目前在 JavaScript 的實作中最有名的就是 ShareDB。

[share/sharedb](https://github.com/share/sharedb)

OT 一般來說的問題是比較不容易 scaling，一般來說在使用者較多的狀況下 CRDT 的效率會比較好，基於 CRDT 的 yjs 正好在他們的 github issue 裡面有提到他們認為 ShareDB 跟 yjs 的不同。

[How is this different from ShareDB · Issue #93 · y-js/yjs](https://github.com/y-js/yjs/issues/93)

再說到 CRDT，其實這個分類底下目前針對文字協同編輯的演算法也不少，經常看到的 TreeDoc, WOOT, Logoot, RGA 等。我快速地看了幾篇論文，大致上抓到一個方向，但目前也還沒仔細閱讀比較哪個演算法比較適合協同編輯。

但是在閱讀的同時也找到了 atom 上面用來做協同編輯的套件用 teletype，他們不僅使用了 CRDT 同時也把演算法獨立成一個專案，測試看起來還滿齊全的。

[atom/teletype-crdt](https://github.com/atom/teletype-crdt)

研究了一下之後我也用他們的函式庫兜了一個很簡單的協同編輯網頁。注意這邊的結構雖然還是需要一個集中式的 server 來轉交修改，但是其實 ATOM 的 teletype 是使用 WebRTC 實作 p2p 的編輯，相對來說我的 prototype 還是比較集中式的。

範例用的是很簡單的 textarea 加上用 websocket 讓 server 協助轉交兩邊的輸入跟刪除文字，具體看起來也沒什麼神秘的。

在 client 這邊則是用函式庫提供的 Document 的 `setTextInRange()` 來產生新的 operation，再將操作 serialize 後傳送到 server。

server 端接收到後就把 operation 廣播給其他也連上的 client 就收工了。

整體來講比較拐彎抹角的就是他的訊息是用 protobuf 定義跟封裝的，不過因為目前 grpc-web 還要架設 Envoy proxy 的緣故，太懶的關係就先用 socket.io 傳送由 protobuf serialized 的訊息。

如果你有興趣的話也可以看一下面這個專案的 client.js 跟 server.js 看怎麼使用 teletype-crdt 協助同步訊息。

[yurenju/teletype-demo](https://github.com/yurenju/teletype-demo)
