---
title: "工程師視角：什麼是區塊鏈的 Smart Contract?"
author: "Yuren Ju"
date: 2018-05-04T05:21:45.648Z
lastmod: 2023-06-06T13:41:32+08:00
categories: [tech]

description: ""

subtitle: "投入區塊鏈社群以及產業一小段時間了，跟工程師朋友們聊到區塊鏈的去中心化架構時，朋友們多半是一頭霧水。今天想試著透過工程師們比較容易理解的角度來解釋一下區塊鏈領域經常被提到的一個名詞：Smart Contract (智慧合約或譯作智能合約)。希望有助於工程師朋友們了解區塊鏈技術。"

images:
  - "/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/1.jpeg"
  - "/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/2.png"
  - "/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/3.png"
  - "/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/4.png"
  - "/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/5.png"
  - "/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/6.png"
---

![image](/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/1.jpeg#layoutTextWidth)

投入區塊鏈社群以及產業一小段時間了，跟工程師朋友們聊到區塊鏈的去中心化架構時，朋友們多半是一頭霧水。今天想試著透過工程師們比較容易理解的角度來解釋一下區塊鏈領域經常被提到的一個名詞：Smart Contract (智慧合約或譯作智能合約)。希望有助於工程師朋友們了解區塊鏈技術。

先提醒一下以下的內容解釋的都是針對 Ethereum (以太坊) 區塊鏈，其他的區塊鏈不見得有 Smart Contract 的概念。

### 一般的程式如何被執行？

開始解釋 Smart Contract 前想來聊聊更基本的事情：一段程式是怎麼被執行的。當你寫了一段 Java、Python 或是 JavaScript 的程式，它會怎麼被執行呢？

假設我們在寫一個賣票程式，可能會需要一個 MeetupEvent 的類別 (Class)，內容如下：

![image](/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/2.png#layoutTextWidth)

[https://gist.github.com/yurenju/284cfb127a8ba9de07eb8e007acca317](https://gist.github.com/yurenju/284cfb127a8ba9de07eb8e007acca317)

這段 Java 程式的執行方式，一般來說源碼會經過 Java 編譯器轉譯成 Bytecode 之後，透過 JVM (Java Virtual Machine) 在電腦中執行。當這個程式在執行時 `main()` 將會建立一個類別的 instance `event`，此時這個 instance 將會儲存在記憶體裡面，並且可以透過我們定義的方法如 `register()`操作這個 instance，直到整個程式結束。

![image](/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/3.png#layoutTextWidth)

不管是寫 Java, Python, JavaScript 或其他較為高階的語言，實作上的細節根據不同程式語言會有差異，但是大致上的情形都會是這樣，相信工程師們對這樣的運作架構也耳熟能詳。

### Smart Contract

讓我們再回到我們的主題：什麼是 Smart Contract 呢？Smart Contract 名字上聽起來很玄，如果你是第一次接觸區塊鏈的工程師，其實：

> Smart Contract 就是一個運行在區塊鏈 VM 上面的 instance。

更精確地來說，在 Ethereum Blockchain 上面 Smart Contract 運作在 Ethereum Virtual Machine (EVM)上面。同樣的 MeetupEvent，我們改用 Smart Contract 的程式語言 solidity 重寫一次：

![image](/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/4.png#layoutTextWidth)

[https://gist.github.com/yurenju/8598564c516facd734834a51df3fc191](https://gist.github.com/yurenju/8598564c516facd734834a51df3fc191)

這段就是被稱作是 “Smart Contract” 的程式，你可以把它當作是一個類別 (class)。要使用這段程式的時候，它必須被部署 (deploy) 到區塊鏈上，上面這段程式會被創造出一個 instance，而這個 instance 將會被放在區塊鏈上。下圖這個 Ethereum VM 則會運行在每一個 Ethereum 節點上面。一旦合約部署成功時會得到一個地址，它就像記憶體位置一樣，取得這個位置後搭配正確的 interface 資訊就可以執行這個合約。

![image](/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/5.png#layoutTextWidth)

在區塊鏈上所有人都可以呼叫這個 smart contract 所開出來的函式 (function)。當然因為它就是一段程式，你也可以寫些邏輯來做權限控管。以我們這個程式的例子，可以執行的函式就是 `register()`。這樣說起來，除了 Smart Contract 是跑在區塊鏈上以外，其實他就是一個 instance，跟使用其他程式語言上的 class instance 沒有太大的差別。

而區塊鏈 VM 上跑的程式（也就是 Smart Contract）跟一般 VM 上跑的程式，最不一樣的地方就在於去中心化架構。

![image](/posts/2018-05-04_工程師視角什麼是區塊鏈的-smart-contract/images/6.png#layoutTextWidth)

在一般程式的架構中，不管那個服務用了分散式運算、load balance 加上多台伺服器或是只在一台機器上面跑，本質上這些伺服器（或說是運算單元）全部都是由單一組織掌管，這樣的架構行之有年，也運作得很好。但這樣的架構下，如果你需要做任何「價值交換」的應用，免不了都要中間人的介入。

在以前只能當面交易的年代，所有東西都是一手交錢一手交貨。需要更方便與有效率的交易時，出現了掮客幫你轉交物品跟金錢的行業，當然這位中間人需要取得雙方的信任。

最終銀行、信用卡公司、金流公司類似的概念逐漸興起，使用者也需要信任銀行或信用卡公司時，這樣的模式才行得通，而搭建在上面的「信任」是國家透過合約、法律約束各式各樣的公司，一層一層的信任關係就這樣搭建起來。

> 你跟網路上的某人交易可以成功，其實背後是一層層的中間人與信任關係。

回到最根本之上，就是「信任」問題。而區塊鏈與 Smart Contract 則是試圖透過去中心化的架構來解決這問題。

不同於一般程式的中心化架構，在 Ethereum 區塊鏈中，如果你想要透過協助別人執行他們的 Smart Contract 獲得獎勵，你可以安裝 ethereum node 的軟體如 [go-ethereum](https://github.com/ethereum/go-ethereum) 或是 [parity](https://www.parity.io/)，並且開啟礦工模式即可。要成為一個礦工並不需要經過誰的同意，而當礦工在 Ethereum 區塊鏈會有挖礦獎勵回饋以及使用者給礦工的交易費。

如此一來 Ethereum 的去中心化節點網路就這樣建構起來了。當你部署一個 Smart Contract，或是發起一筆交易來改變區塊鏈內的狀態時，會需要付出交易費，這筆交易費最終則會由礦工收走作為獎勵之一。

更棒的是 Ethereum 區塊鏈是一個內建數位貨幣金流的平台，開發者可以非常容易的利用在區塊鏈上內建的數位貨幣金流系統來搭建各式各樣的去中心化應用 (Decentralized app, Dapp)。

你跟網路上的某人交易時，如果透過 Smart Contract 雙方先壓了一筆保證金在合約裡面，是不是就可以在沒有中間人擔保的狀況下讓確認交易可以執行呢？內建數位貨幣金流系統，搭配上公開的 Smart Contract 內容（也就是源碼），以前透過現實生活的「合約」來解決的信任問題，就可以重新思考是否可以透過 Smart Contract 解決。

話說回來，區塊鏈跟 Smart Contract 都還在非常早期的發展，說不定現在發現的問題比解決的問題還要多（笑）。我不覺得區塊鏈是銀彈，突然之間就可以解決以往龐大複雜的問題。不過我真的很期待去中心化的思維可以回頭來思考我們已經做過的服務，有哪些可以再透過去中心化架構，提出新的解決方案。

如果你對 Ethereum 區塊鏈有興趣，不妨來參加 [Taipei Ethereum Meetup](https://www.meetup.com/Taipei-Ethereum-Meetup/)，這是一個討論 Ethereum 區塊鏈的技術社群。我們每個月會有一次到兩次的技術分享，歡迎大家一起來研究去中心化的世界！
