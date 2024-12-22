---
title: "Witnet: 去中心化預言機— Devcon 5 見聞"
author: "Yuren Ju"
date: 2019-12-03T00:01:01.900Z
lastmod: 2023-06-06T13:42:48+08:00
categories: [tech]

description: ""

subtitle: "去中心化預言機讓擷取外部 Web APIs 的機制不再成為一個 Single point of failure，本篇介紹的為其中一個 Decentralized Oracle — Witnet"

images:
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/1.png"
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/2.png"
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/3.png"
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/4.png"
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/5.png"
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/6.png"
  - "/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/7.png"
---

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/1.png#layoutTextWidth)

前言：這篇會講得比較長一點，會從預言機 (Oracle) 一路講到去中心化的預言機 Witnet，抓緊囉！

一般的軟體如果需要介接任何 Web API 時，可以很直覺的用各種工具如 JavaScript 的 `fetch` API 或 golang 的 `http` 套件完成。但是區塊鏈上的智慧合約 (Smart Contract) 如果要介接 Web API 則沒那麼容易。

舉個例子，一個程式時透過 Web API 查詢特定日期的天氣，在今天查詢的結果可能跟明天查詢時不一致，這是 Web API 理所當然的特性，這樣每次即使輸入參數是一樣時但仍有可能產生不同答案的特性稱為 non-deterministic，絕大多數的 API 都是這種類型。反之，有些系統則是 deterministic 特性，每次輸入相同參數時，一定都會得到相同的結果，Ethereum 區塊鏈就是一種 deterministic 的系統。

因為區塊鏈是去中心化的由許多節點共同執行並且驗證結果，任何一個節點在固定的時間調用同樣的 function call 都需要得到一樣的結果。比如說我需要查 Bob 的帳號餘額還要多少，此時我會呼叫 `getBalance(account, [blockNumber])` 來取得餘額。呼叫這個函式時，輸入的參數除了 bob 的 account address 以外，還有另外一個參數是區塊編號 (或稱區塊高度)，以 Ethereum 為例約每十五秒就換產生一個新的區塊，區塊高度則會加一，呼叫函示時不提供時預設則是最新的區塊。

這個函式在相同的輸入參數包含區塊高度時，不管什麼時候呼叫回傳的結果一定都是一樣的。這樣的特性導致區塊鏈內的 deterministic 程式（也就是智慧合約）不能直接呼叫 non-deterministic 的 Web API。

而當智慧合約需要外部的資料時，會透過一種叫做 “Oracle” (預言機) 的機制來取得外部資料，簡單的說就是把資料從外界帶入區塊鏈當中。

### Centralized Oracle

Oracle 的實作方法有很多種，機制啟動後將會到外部擷取資料後寫回區塊鏈。當資料寫回區塊鏈後就變成 deterministic 的資料，不僅可以在智慧合約中取得資料，就算這個數值更新了，因為呼叫時會需要帶入 block number，所以帶入相同的參數時肯定也可以獲得相同的輸出。

如果要自行實作一個簡易的 Oracle，可以在 Ethereum 內部署一個 Oracle 智慧合約，另外在外部建立一個 daemon 來監控這個 Oracle Event，當收到特定 Event 的時候呼叫相對應的 Web APIs 取得結果後，再把結果透過呼叫智慧合約的 callback 來將資料帶入區塊鏈當中，如下圖所示。

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/2.png#layoutTextWidth)

至於要如何實作這個外部的 Oracle Daemon 作法就很有彈性，簡單實作方法可以是架設一台 AWS EC2，上面放把可以存取 Oracle 智慧合約的私鑰，監測到新的 Event 時去 Web API 擷取所需資料後寫回區塊鏈。

不過如果每次都得要自己實作這一套還是有點麻煩，而市面上也已經有 Oracle 服務可以讓使用者透過服務存取外部資料，其中最有名的就是 Oraclize，現在更名為 Provable。

#### Oraclize / Provable

Provable 提供的機制跟上述自行架設 daemon 的機制類似，不一樣的是 Provable 要提供給不同使用者使用，所以要使用 Provable 服務時需要在智慧合約裡面先寫入你要怎麼讓 Provable 查詢並且解析資料。

以官方的例子來說，如果要從 coinbase 查詢 ETH/USD 的交易資訊，可以在智慧合約中用以下的語法查詢：

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/3.png#layoutTextWidth)

此查詢會發出事件後，Provable daemon 監聽到此事件後將會依據查詢語法執行查詢後，再將得到的結果透過智慧合約的 callback 把資料寫回區塊鏈。完整的範例可以看 [Provable 針對 Ethereum 的範例程式](https://docs.provable.xyz/#ethereum-quick-start)。

在 Ethereum 有許多智慧合約都是涉及金融服務，其中經常有大量資金流動，而根據不同的判斷條件可能會造成將資產轉移到不同地方，所以在智慧合約以及 Web APIs 之間的橋樑  — Oracle 的正確性就扮演非常重要的角色。服務提供方需要保證 Oracle 依據他們所宣稱的方式進行，而不會因為牽涉到不同利益而把不同的資料塞回區塊鏈。

Provable 提供了幾個方法來證明調用資料的正確性，其中一個方法是透過 TLSNotary 證明，簡單的來說這邊會有一個在 AWS 上面一個開源 image 的 Auditor instance 會負責檢驗 Provable 查詢 Web API 時的數據是否正確。

### Decentralized Oracle

回頭來看，為什麼我們要使用區塊鏈技術呢？

其中一個原因是區塊鏈是去中心化架構的系統，系統的操作不需要信任中間人也可以進行。不過當我們需要使用 Web APIs 去擷取一個特定資料時，我們也需要信任這個 Web APIs 回傳的結果。在涉及大量利益的狀況下，我們可以從不同的 Web API 擷取結果並且互相比較之後做出最後的結論是什麼。

即使如此，負責擷取 Web APIs 的 Oracle 仍然有可能是一個安全缺口。試想如果是一個利益涉及十億美金的結果，不論是自己架設的 Oracle 或是使用現成的 Oracle 服務，這樣的利益都有可能導致自行修改 Oracle 給出對自己有利的結果。

舉個例子來說，synthetix 服務雖然使用了智慧合約運行，但此服務曾經直接改變 Oracle 的參數實質上把一個用戶的資金歸零，更詳細的討論可以看[這篇 Reddit](https://www.reddit.com/r/ethereum/comments/d4edxm/the_synthetix_dapp_deleted_my_balance/)，也說明了如果 Oracle 的權力集中在一個人或組織的手上，就有可能因為其中的利益修改結果，不論他們出自好意與否。

而 Decentralized Oracle 是另外一個可以解決問題的方式，Witnet 就是眾多去中心化預言機專案的其中之一。

#### Witnet

Witnet 是一個去中心化的 Oracle 網路，也是另外一個區塊鏈，但與 Ethereum 不同之處是在上面的節點可連結外界資訊，是專門為擷取資料而設計的區塊鏈，可以執行擷取資料、驗證以及將資料提供給其他區塊鏈的能力。

我們先從一個使用者的角度來看要如何使用 witnet 來擷取資料。還記得上面用 Provable 擷取 coinbase 價格的例子嗎？如果我們在開發一個需要擷取 ETH 價格的智慧合約，同樣的例子在 Witnet 首先先寫一個 JavaScript 如下：

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/4.png#layoutTextWidth)

寫完之後，透過 Witnet 提供的工具 rad2sol 編譯這個 JavaScript 成為一個十六進位的字串，而這個字串所代表的是擷取資料的方法，但是用更精簡的格式儲存，當我們需要使用時，則將一個智慧合約宣告為 Witnet Request 並且將該字串放入建構函式當中：

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/5.png#layoutTextWidth)

接著我們就可以在合約之中使用 `UsingWitnet` 所提供的 `witnetPostRequest()` 與 `witnetReadResult()` 分別發出請求以及接收結果。

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/6.png#layoutTextWidth)

使用起來比起 Provable 多出了一個編譯的步驟，但其他部分則不會差太多。而之中要如何利用 Witnet 去中心化的機制取得 Web APIs 的回傳結果呢？請見下圖：

![image](/posts/2019-12-03_witnet-去中心化預言機-devcon-5-見聞/images/7.png#layoutTextWidth)

在 Witnet 上面的節點總共有三種工作類型：

1.  擷取資料：到開放的 Web APIs 擷取資料
2.  橋接：成為橋接到其他區塊鏈如 Ethereum 的節點，負責接受以及回傳資料
3.  礦工：接收數個負責擷取資料的節點所回傳的資料並且包裝成區塊發佈在 witnet 區塊鏈上

而整個運作流程如下。

1.  Ethereum 利用 Witnet 提供的合約介面，把擷取資料的請求發出，此時會發出 Event 通知。
2.  經過 Witnet 所指定的挑選機制定時挑選出此輪的 Bridge 節點，蒐集尚未擷取資料的 request，將此請求轉發送到 Witnet 區塊鏈上，而此 Bridge 則會收到由 Ethereum 區塊鏈這方發起請求那方的獎勵（需要附在 request 內）。
3.  根據 Witnet 的共識系統每個節點擷取資料後得到的信譽指數，在本輪挑選出一些節點來執行擷取資料工作，同時也根據共識機制選出此輪的礦工。
4.  負責擷取資料的節點擷取完資料後，會先將擷取到的資料製作成 nonced hash 之後先提交給礦工，此份資訊稱為 commit-pledge transaction，此時還沒提交真正擷取到的資料，只有 hash。
5.  等礦工蒐集到本輪所有負責擷取資料節點所提供的 commit-pledge 後，接下來會通知所有節點，請他們所有人提交真正的擷取結果，再將結果與他們原本提交的 commit-pledge 比較來確認他們不是看到其他節點的答案才跟著送的。
6.  礦工確認完成後，會將本輪的獎勵發給這次幫忙擷取資料的節點，本輪就完成了。
7.  與剛開始相同，挑選機制挑出的 Bridge 節點將 Witnet 區塊鏈上的結果發送到 Ethereum 區塊鏈上，完成整個流程。

由於 Witnet 本身也是個區塊鏈，並且利用區塊鏈去中心化的機制，以及信譽系統讓節點只有在輪到自己的當下才知道自己在本輪要執行哪種任務，這樣的機制避免的節點提前知道自己要執行哪項與自己利益相關的工作，進而改變執行結果。而即使執行結果不同，雙階段的提交工作也可以懲罰提交錯誤答案的節點以及減低其信譽。

比起集中式的預言機，Witnet 去中心化的機制分散了風險，讓預言機不再成為去中心化系統當中的 single point of failure。然而去中心化系統並不是零風險，此系統依然有可能透過 51% 劫持整個網路來製作錯誤結果，不過當然這樣的攻擊成本也會相對地提高，就要看 Witnet 運作時的狀況了。

### 參考資料

- 基本概觀可以參考官方文件 “[What is Witnet?](https://witnet.io/about)”
- 如何挑選節點以及信譽系統可看 “[Cryptographic Sortition in Blockchains: the importance of VRFs](https://medium.com/witnet/cryptographic-sortition-in-blockchains-the-importance-of-vrfs-ad5c20a4e018)”
- [白皮書](https://witnet.io/witnet-whitepaper.pdf)中 General Case 那節較詳細的講解了整個運作流程
- “[❤ Ethereum loves Witnet ❤](https://medium.com/witnet/ethereum-loves-witnet-9a3fd21e6f5c)” 中提供了 Ethereum Bridge 運作的細節
