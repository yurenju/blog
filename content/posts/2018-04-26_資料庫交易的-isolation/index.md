---
title: "資料庫交易的 Isolation"
author: "Yuren Ju"
date: 2018-04-26T08:22:50.363Z
lastmod: 2023-06-06T13:41:28+08:00
categories: [tech]

description: ""

subtitle: "最近在讀 High Performance MySQL 時讀到了 Isolation 的章節，想想總覺得以前上資料庫系統課程時應該有學過，不過真的完全忘了，只好來複習一下。"

images:
  - "/posts/2018-04-26_資料庫交易的-isolation/images/1.png"
  - "/posts/2018-04-26_資料庫交易的-isolation/images/2.png"
  - "/posts/2018-04-26_資料庫交易的-isolation/images/3.png"
  - "/posts/2018-04-26_資料庫交易的-isolation/images/4.png"
  - "/posts/2018-04-26_資料庫交易的-isolation/images/5.png"
---

最近在讀 High Performance MySQL 時讀到了 Isolation 的章節，想想總覺得以前上資料庫系統課程時應該有學過，不過真的完全忘了，只好來複習一下。

幾個著名的關連式資料庫都支援 Transaction，這是一種連續執行一連串的 SQL 指令的方式，如果 Transaction 在這一連串指令執行的期間失敗，則整個 Transaction 都會被退回原本的狀態，用來保證 Transaction 要不是成功，不然就是失敗，不會有一部份成功一部份失敗的情形。

舉個例子，Alice 跟 Bob 在各自的帳戶裡有 1000 元，這個資料表叫做 `balances`。

![image](/posts/2018-04-26_資料庫交易的-isolation/images/1.png#layoutTextWidth)

接著 Alice 轉帳 300 元給 Bob，通常你會下這樣的 SQL：
`UPDATE balances SET balance = 700 WHERE account = &#34;Alice&#34;;
UPDATE balances SET balance = 1300 WHERE account = &#34;Bob&#34;; `

如果你在執行第一行的時候系統發生了問題沒執行第二行，這樣 Alice 的錢被扣了，但是 Bob 的錢沒有增加，這樣的錯誤發生後要修復會很頭痛。Transaction 就是拿來解決這樣的問題，讓整個交易要不是成功，不然就是失敗，不會有卡在中間的情形發生。SQL 裡面可以宣告 Transaction 開始跟完成，或是恢復原本的值，這樣就可以避免上面遇到的問題：
`BEGIN TRANSACTION;
UPDATE balances SET balance = 700 WHERE account = &#34;Alice&#34;;
UPDATE balances SET balance = 1300 WHERE account = &#34;Bob&#34;;
COMMIT;`

在關聯式資料庫處理 transaction 時通常會具備四個特性：Atomicity, Consistency, Isolation, Durability，也就是 ACID，我們今天只講 Isolation。Isolation 就是拿來確保當系統有很多 transactions 同時進行時，每個 transaction 不會互相影響到。

這邊先來列出 isolation 裡面通常會討論到的幾個現象。以下的圖表 Y 軸代表的都是時間順序。

#### Dirty Read

如果一個 transaction 還沒有 commit，但是你卻讀得到已經更新的結果，這個情形叫做 Dirty Read。

如下圖 Transaction A 在交易中連續讀取了兩次 Alice’s balance，但是第一次讀的時候是 1000，但是在交易還沒完成前，另外一個 Transaction B 正好也在執行中，並且更改了 Alice’s balance 變成 700，但是這個交易還沒有 commit 時，Transaction A 再次讀取 Alice’s balance，數值卻讀取出尚未 commit 的數據 700，這個現象我們就稱為 Dirty Read。

![image](/posts/2018-04-26_資料庫交易的-isolation/images/2.png#layoutTextWidth)

#### Non-repeatable reads

如果你在同一個 transaction 裡面連續使用相同的 Query 讀取了多次資料，但是相同的 Query 卻回傳了不同的結果，這個現象稱為 Non-repeatable reads。

如下圖，Transaction A 第一次取得 Alice’s balance 時是 1000，當它還在執行時，Transaction B 修改了 Alice’s balance 成 700 並且 commit transaction。此時 Transaction A 再次讀取相同的數值時，卻變成 700，這就是 Non-repeatable reads。另外 Dirty Read 也是一種 Non-repeatable reads。

![image](/posts/2018-04-26_資料庫交易的-isolation/images/3.png#layoutTextWidth)

#### Phantom reads

當在同一個 transaction 連續兩次讀取時，讀取出來的筆數跟上次不同，這個情況稱為 Phantom reads。

下面這張圖 Transaction A 第一次讀取了帳戶裡面餘額介於 900–1000 這個範圍的帳戶，結果總共有兩筆：Alice 跟 Bob。在 Transaction A 還沒結束的同時，Transaction B 更新了 Alice’s balance 為 700，這時如果 Transaction A 再次查詢相同條件時，筆數從原本的 2 筆變成 1 筆，這個情況就是 Phantom reads。

![image](/posts/2018-04-26_資料庫交易的-isolation/images/4.png#layoutTextWidth)

以上就是討論 Isolation 時會遇到的情況。

#### Isolation Levels

根據上一節所述的三個問題，在 SQL 內也透過不同的 Isolation 等級來標明哪個等級的 Isolation 可以解決上述問題。Isolation 分成四個等級：

- **Read Uncommitted**: 代表 transaction 可以讀到別的 transaction 尚未 commit 的資料，在這個等級中三個問題都沒有解決。
- **Read Committed**: 代表 transaction 只能讀到別的 transaction 已經 commit 的資料，沒有 commit 的話就不會讀到，在這個等級解決了 Dirty Read 的問題。
- **Repeatable Read**: 代表每次 transaction 要讀取特定欄位的資料時，只要 query 條件相同，讀取到的資料就會相同。在這個等級解決了 Non-repeatable reads 的問題。
- **Serializable**: 代表在多個 transaction 同時執行時，只要 transaction 的順序相同時，得到的結果一定相同。比如說 Transaction A 先執行了接下來再執行 Transaction B，在同樣的條件下，每次執行都會得到一樣的結果。在這個等級下連同 Phantom reads 也會一併被解決。

在這邊引用 [Wikipedia](https://en.wikipedia.org/wiki/Isolation_%28database_systems%29#Isolation_levels_vs_read_phenomena) 的表格：

![image](/posts/2018-04-26_資料庫交易的-isolation/images/5.png#layoutTextWidth)

順道一提 MySQL 預設的等級是 Repeatable Read，但是也可以透過下面的指令調整：
```
SET SESSION transaction_isolation=&#39;SERIALIZABLE&#39;;
```

如果你對這個主題有興趣的話，也可以讀讀 Gea-Suan Lin 的 [從頭學一次 Isolation level 的 REPEATABLE-READ 與 SERIALIZABLE](https://blog.gslin.org/archives/2015/09/18/5989/%E5%BE%9E%E9%A0%AD%E5%AD%B8%E4%B8%80%E6%AC%A1-isolation-level-%E7%9A%84-repeatable-read-%E8%88%87-serializable/)。
