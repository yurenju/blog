---
title: "Beancount 系列 (4) — 自動化記帳"
author: "Yuren Ju"
date: 2020-07-02T01:01:01.269Z
lastmod: 2023-06-06T13:43:40+08:00
categories: [tech]

description: ""

subtitle: "這次來講解一下我目前有在用的自動化記帳工具，我自己寫了一組 script 針對國泰世華銀行帳戶、信用卡以及加密貨幣的交易紀錄作自動化記帳的功能，其中信用卡則結合了電子發票用來輔助取得更多資訊。不過這些 script 只能滿足我自己的記賬需求，如果不足的話可以 fork…"

images:
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/1.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/2.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/3.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/4.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/5.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/6.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/7.png"
  - "/posts/2020-07-02_beancount-系列-4自動化記帳/images/8.png"
---

這次來講解目前使用的自動化記帳工具，我自己寫了一組 script 針對國泰世華銀行帳戶、信用卡以及加密貨幣的交易紀錄作自動化記帳的功能，其中信用卡則結合了電子發票輔助取得更多資訊。不過這些 script 只能滿足我自己的記賬需求，如果不足的話可以 fork 一份修改。

[yurenju/soy-cli](https://github.com/yurenju/soy-cli/)

使用 npm 就可以安裝這個 script：
`$ npm install -g @yurenju/soy-cli`

首先先從比較簡單的國泰世華銀行開始。

### 國泰世華銀行轉帳明細

在銀行方面我是解析了國泰世華網路銀行交易明細的 csv。在國泰世華的網路銀行，選擇「台幣帳戶明細」那邊可以將交易明細用 csv 格式儲存，不過因為他是用 big5 編碼儲存，所以直接打開會是亂碼。

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/1.png#layoutTextWidth)

下載後就可以用以下指令來把他轉成 beancount 格式的檔案，達成自動記賬。
`$ soy cathay-bank --config ./cathay-bank.yml --input-file ./cathay-bank.csv`

接下來要準備的是設定檔案用來設定轉換成 beancount 檔案時的一些設定，以下是範例檔案：

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/2.png#layoutTextWidth)

#### defaultAccount

預設的帳戶，income 是轉入時預設的帳戶，expenses 是匯出時預設的帳戶。base 則是這個銀行用的帳戶。

#### encoding

就如同前面說的，國泰世華的 csv 檔案是 big5 編碼的，所以需要在這邊指定。

#### rules

這是可以在轉換成 beancount 檔案時比對是否有符合的規則，如果有符合的規則時可以指定要如何轉換，先來看一下套用規則得到的 beancount 輸出長怎樣。

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/3.png#layoutTextWidth)

如果沒有特別套用規則的轉帳紀錄比如說陽明山住宿，這邊就會是從 `Assets:Bank:Cathay` 轉到 `Expenses:Unknown` 的支出。但是如果像是「信用卡款」就會照著規則重寫。

而每個轉帳紀錄轉成 beancount 格式後每個部份的名稱如下：

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/4.png#layoutTextWidth)

對照著看就是 transaction 底下 metadata/description 如果出現「信用卡款」，原本是 `Expenses:Unknown` 的 posting 的 account 就修改成 `Liabilities:CreditCard:Cathay` 。其他規則也相同，所有出現在明細裡面的欄位都會被轉換成 metadata，有需要的時候就可以從裡面比對欄位並且更改預設值。

### 國泰世華信用卡帳單

跟銀行交易明細相同，國泰世華信用卡帳單也提供了 CSV 格式下載。從 信用卡 &gt; 帳單查詢及繳款可以看到最近五個月的帳單，點進去之後捲到最下面就可以看到下載 CSV 檔案的選項。

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/5.png#layoutTextWidth)

透過 soy 指令一樣也可以把帳單轉換成 beancount 格式：
`$ soy cathay-credit-card --config ./cathay-credit-card.yml --input-file ./cathay-credit-card.csv`

設定檔跟銀行一樣，不過多了一個欄位 `einvoiceIntegration`，這個欄位可以用來整合電子發票紀錄，如果找到有日期與金額符合的，就會把電子發票的交易紀錄引入。

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/6.png#layoutTextWidth)

如果需要啟用電子發票紀錄會需要到[財政部官方網站](https://www.einvoice.nat.gov.tw/APCONSUMER/BTC605W/)申請開發者用的 API Key，申請完之後把以下參數填入對應的環境變數當中：

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/7.png#layoutTextWidth)

如果設定正確，執行完成後除了信用卡帳單提供的資訊還會額外提供電子發票的交易明細，比如說原本信用卡只提供總計 270 元的消費，但是比對電子發票之後就會把品項都一一的記錄下來。

![image](/posts/2020-07-02_beancount-系列-4自動化記帳/images/8.png#layoutTextWidth)

### 加密貨幣

因為加密貨幣的記賬還滿複雜的，而且我目前寫好的部分還需要修一修，之後有機會再介紹好了。基本上就是會記住入帳的價格跟消費的價格來計算損益，並且透過 CoinGecko 來取得新台幣的價格統一用新台幣記賬。基本上也支援 Compound 這類型的 DeFi，但是有些情況還需要再額外處理一下，比如說 DAI Saving。

今天的介紹大概就到這邊，下次會講解一下我平常記帳的方式跟怎麼作版本控制。
