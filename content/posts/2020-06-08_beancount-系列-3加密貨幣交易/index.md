---
title: "Beancount 系列 (3) — 加密貨幣交易"
author: "Yuren Ju"
date: 2020-06-08T00:31:00.924Z
lastmod: 2023-06-06T13:43:34+08:00
categories: [tech]

description: ""

subtitle: "說完了基礎記帳，這次來講要如何用 beancount 來做加密貨幣的記帳，同樣的概念也可以用在投資股票上。"

images:
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/1.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/2.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/3.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/4.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/5.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/6.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/7.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/8.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/9.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/10.png"
  - "/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/11.png"
---

說完了基礎記帳，這次來講要如何用 beancount 來做加密貨幣的記帳，同樣的概念也可以用在投資股票上。在進入正題前先跟大家解釋一下資產價值的紀錄的幾種方式。

假設這樣的情境：

- 原本有 3000 TWD
- 今天用 1000 TWD 買 1 ETH (價格 1000 TWD)
- 明天用 2000 TWD 買 4 ETH (價格 500 TWD)
- 後天賣掉了 2 ETH 得到了 5000 TWD (價格 2500 TWD)

請問收益是多少呢？

這答案依據怎麼計算收益會有很多種不同的版本。如果用平均來看，買 ETH 的平均價格是每顆 600 元，賣 2 ETH 原本只能得到 1200 TWD，所以可以說賺了 3800 TWD。但如果計算方式是先買的 ETH 先賣掉，所以其實成本應該是賣掉的 2 ETH 當中，其中 1 ETH 價格是 1000 TWD，另外 1 ETH 價格是 500 TWD，這樣計算則是賺了 3500 TWD。

不同的計算方法會得出不同的收益，所以記帳軟體通常可以選擇要如何計算收益的方式。而 beancount 則支援了 FIFO (先進先出), LIFO (後進先出) 以及預設 (每次都要指定要使用的 ETH 價格)，至於上面例子的第一種平均記帳目前則還沒有支援，我自己在紀錄時都是採用 FIFO，用以下語法就可以設定。
```
option &#34;booking_method&#34; &#34;FIFO&#34;
```

而這三筆交易可以這樣被紀錄，第一筆如下：

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/1.png#layoutTextWidth)

這樣代表花了 1000 TWD，得到了 1 ETH，其中每個 ETH 的成本 (cost) 為 1000 TWD，利用花括號 {1000 TWD} 紀錄。這個成本會分別標記在每個 ETH 上面。以下範例淺紅色是移除，淺藍色是新增，TWD 中的矩形代表 1000 TWD，ETH 中的矩形代表 1 ETH。

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/2.png#layoutTextWidth)

第二次買 4 ETH 時則這麼紀錄：

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/3.png#layoutTextWidth)

這些 ETH 相同的也會紀錄上成本，此時原本 3000 TWD，上次花掉 1000 TWD 後這次又花掉了 2000 TWD，此時 TWD 已經為 0，而換得 4 ETH，每個 ETH 上面則會標記成本為 500 TWD。

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/4.png#layoutTextWidth)

而當我們要賣掉 ETH 時則如此紀錄：

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/5.png#layoutTextWidth)

當要賣掉 ETH 時，原本標示成本處直接使用空白的花括號 {}，這代表會利用設定好的記帳方法來轉換資產。以本文的例子採用 FIFO 記帳方式來說，原本的 5 ETH 當中第一個 ETH 成本是 1000 TWD，接下來四個 ETH 成本是 500 TWD，依照先進先出的順序則會取用 1 ETH {1000 TWD} 以及 1 ETH {500TWD} 這兩個 ETH 出售，並且剩下 3 ETH 成本都為 500 TWD。

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/6.png#layoutTextWidth)

還記得 beancount 會自動平衡交易中的所有金額吧？如果售出了 1 ETH {1000 TWD} 與 1 ETH {500 TWD} 金額應是 1500 TWD，但是實際上得到的金額卻是 5000 TWD，此時 beancount 就會提醒你這筆交易的數據沒辦法平衡：

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/7.png#layoutTextWidth)

此時就可以加入 Income:Crypto:PnL 來將所有收益放入這個帳號內。

如果打開 fava 來看一下目前的資產狀況，就可以看得到目前的損益以及剩下 3 ETH 的成本以及目前價值（需要額外提供價格資訊）

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/8.png#layoutTextWidth)

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/9.png#layoutTextWidth)

### 交易費

不過在交易所裡面通常有可能額外需要不同貨幣的交易費，如在 Max 會收取 MAX Token，在 Binance 會收取 BNB。這樣的狀況可以開一個新的支出帳戶如 TrnsactionFee，接著就可以透過相同方式紀錄交易。在標明價格的狀況下就可以一次處理多貨幣，像是下面這個例子把交易費使用不同貨幣的情形也考慮進來：

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/10.png#layoutTextWidth)

如果再回到 fava 看就可以看得到收益有微幅的下降，這其實就是因為交易費所用的貨幣從原本的 3.5 TWD 到最後是 3.0 TWD 導致的微幅下降。

![image](/posts/2020-06-08_beancount-系列-3加密貨幣交易/images/11.png#layoutTextWidth)

完整的範例可以在 [github.com/yurenju/beancount-demo](https://github.com/yurenju/beancount-demo) 裡面找到。

另外別忘了雖然這樣紀錄規則感覺很複雜，但好處是純文字記賬可以自動化的處理帳務，這些規則的講解僅是需要理解運作方式，沒意外的話下次的文章會講我是怎麼記賬以及我所使用的自動化處理工具。

下次見 😁
