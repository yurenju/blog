---
title: "Beancount 系列 (2) — 基礎記賬"
author: "Yuren Ju"
date: 2020-05-23T15:15:48.793Z
lastmod: 2023-06-06T13:43:29+08:00
categories: [tech]

description: ""

subtitle: "暨上次 beancount 簡介後，今天來介紹安裝以及基礎使用方式。beancount 是一個由 python 3 撰寫的程式，我慣用的 beancount 視覺化軟體 fava 也是 python 所撰寫，所以可以利用 pip3 來安裝這些程式。"

images:
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/1.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/2.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/3.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/4.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/5.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/6.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/7.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/8.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/9.png"
  - "/posts/2020-05-23_beancount-系列-2基礎記賬/images/10.png"
---

暨上次 beancount 簡介後，今天來介紹安裝以及基礎使用方式。beancount 是一個由 python 3 撰寫的程式，我慣用的 beancount 視覺化軟體 fava 也是 python 所撰寫，所以可以利用 pip3 來安裝這些程式：
`$ pip3 install beancount fava`

如果你也習慣使用 vscode，可以安裝 [beancount 延伸套件](https://marketplace.visualstudio.com/items?itemName=Lencerf.beancount)，除了彩色語法外，當帳務不平衡時也會直接在 vscode 當中提醒你。

而一個基礎的 beancount 檔案大致上是這樣：
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/1.png#layoutTextWidth)
首先是帳戶，帳戶包含了銀行帳戶、現金、信用卡等等都可以分別開帳戶，除了以上最直觀如銀行這樣的帳戶外，所有的消費分類、收入分類都也是一種帳戶，比如說像支出類我就有如此分類：
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/2.png#layoutTextWidth)
要如何分類端看你自己決定。如果剛開始記帳的話我建議會先不要開太多帳戶，先從簡單的開始會比較好。

帳戶總共有五種分類：

- **Assets**：資產，如銀行帳號、現金等等
- **Liabilities**：負債，如別人跟我借錢（或是反過來）或信用卡都屬於負債
- **Equity**：權益，這比較模糊，除了 Opening-Balances 用來平衡資產外比較少用到
- **Income**：收入，像是薪資或投資收益等等
- **Expenses**：支出

開啟帳號時可以指定用的貨幣，但不指定也可以。像是我銀行裡面有不同種的貨幣，所以就定義了 TWD。

### 初始金額

當開始記帳時，通常你的銀行帳號都已經有了一些存款，此時你可以先打開你的網路銀行（或存款簿），把你最新的餘額用以下語法填入：
`2020-01-01 balance Assets:Bank:Cathay 50000 TWD`

如果你是在 vscode 編輯 (而且檔名是 main.bean)，此時 vscode 會出現一個錯誤訊息，告知你的存款跟預期不符。
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/3.png#layoutTextWidth)
因為在這個日期時銀行的存款還沒那麼多餘額，這個時候你就可以新增一筆交易來填入初始金額，你可以從任何一個帳戶來轉入這筆初始金額，而官方建議採用 `Equity:Opening-Balances`這個帳戶。
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/4.png#layoutTextWidth)
乍看之下很麻煩，但是其實 balance 語法是用在每次檢查餘額的時候提醒你是不是有帳目沒有輸入。我自己在自動從銀行交易明細自動分析後都會在最後用 `balance` 語法檢查，如果有疏漏的部分就會有提醒訊息。

接下來我們看下一個例子，4/13 時透過銀行轉帳匯款的方式繳交房租 10000 元，我們可以用以下記法：
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/5.png#layoutTextWidth)
範例中 `Expenses:Living:HouseRent` 增加了 10,000 TWD，而 `Assets:Bank:Cathay` 沒有填寫，此時 beancount 系統內會自動平衡，也就是 Assets:Bank:Cathay 會 -10,000 TWD。

而 beancount 記帳時不限於僅兩個帳戶的轉移，你可以一次使用多個帳戶轉移資產，你可以用這個方法來做更詳細的記賬，比如說晚餐花了 60 元買飲料、 200 買正餐可以如此記錄：

![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/6.png#layoutTextWidth)

今天晚餐跟小明、小美一起吃飯，我先付了所有的人 1000 元，替小明代墊 300 TWD，替小美代墊 400 TWD：

![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/7.png#layoutTextWidth)

所以雖然我付了 1000 元，但我自己的晚餐錢還是 300 元，但是帳上會記錄我跟小明還有小美之間的債務。當然這都是展示 beancount 可以怎麼記賬，但是要不要記到這麼細通常就看自己。

對我來說我是拿來自動記賬，除非有必要否則現金我只要從銀行帳戶領出去就當作是餐費，如果我有其他用途會盡量用轉帳的，如果一定要現金我就會領出來之後就會先在筆記軟體紀錄，下個月記帳的時候再寫入帳本裡面。

記完帳後，我們就可以利用 fava 來視覺化的看目前記帳的狀況了。假如我們的帳本資訊如下

![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/8.png#layoutTextWidth)

我們用 fava 打開這個檔案：
`$ fava main.bean`

接著用瀏覽器打開 [http://localhost:5000/](http://localhost:5000/) 可以瀏覽許多資訊，比如說損益表：
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/9.png#layoutTextWidth)
可以看到收入與支出狀況，以及目前盈餘還有 12,700。系統內的正負號會需要熟悉一下，Salary 是負的是因為我們轉到銀行帳戶是正的，這邊就會自然為負。
![image](/posts/2020-05-23_beancount-系列-2基礎記賬/images/10.png#layoutTextWidth)
點選資產負債表可以看到目前的資產狀況以及跟其他人的債務關係為何，當然裡面還有很多資訊，開始記帳後可以打開 fava 到處逛逛。

下篇文章會講在多種貨幣（包含加密貨幣）的記賬方法，同時也解釋投資要怎麼記賬。
