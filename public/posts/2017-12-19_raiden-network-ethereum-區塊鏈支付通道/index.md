---
title: "Raiden Network — Ethereum 區塊鏈支付通道"
author: "Yuren Ju"
date: 2017-12-19T01:05:15.516Z
lastmod: 2023-06-06T13:40:40+08:00
categories: [tech]

description: ""

subtitle: "這幾天開始在消化 BeyondBlock 演講的內容，聽完了 Raiden Network 後作了一些功課，這篇來消化整理一下目前我所知的 Raiden 網路。"

images:
  - "/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/1.png"
  - "/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/2.png"
  - "/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/3.png"
  - "/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/4.png"
  - "/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/5.png"
  - "/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/6.png"
---

這幾天開始在消化 BeyondBlock 演講的內容，聽完了 Raiden Network 後作了一些功課，這篇來消化整理一下目前我所知的 Raiden 網路。

注意這篇文章假設你已經瞭解 Smart Contract 了，如果不了解 Smart Contract 的話讀起來會有點吃力。

![image](/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/1.png#layoutTextWidth)

[https://raiden.network/](https://raiden.network/)

Raiden 是一個基於 Ethereum (以太坊)的**鏈下交易方案**，主要想解決三大問題：速度、費用與隱私。

速度跟費用是在 Ethereum 上蠻需要解決的問題，依照目前的資訊目前網路上每秒的平均交易數量為 10 個，而交易費雖然可以每次 Transaction 都可以調整 gas price，不過網路雍塞時卻不得不調高來讓自己的交易可以完成，最近的[虛擬貓咪](https://www.cryptokitties.co/)之亂讓整個 Ethereum 網路擁塞想必有些支援以太幣 (Ether) 的交易所像是熱鍋上的螞蟻一樣吧。

雖然 [Sharding] (https://github.com/ethereum/sharding)與 [Plasma] (https://plasma.io/)等等解決交易速度的擴展解決方案愈來愈常提及，不過距離正式的釋出似乎都還需要一段時間的醞釀。而 Raiden 在目前看起來是完成度較高的擴展方案。
`註：我沒介紹隱私方面有什麼問題，因為覺得速度跟費用這兩個問題比較嚴重。`

### 速度與交易費的問題

但這實際上問題到底是出在哪裡呢？

在速度方面，因為所有交易都需要全網共識的關係，所以每個交易都須要等到新的區塊被算出來時，並且此筆新交易需要包含在其中之後才會成立，依照目前 Ethereum 的出塊速度交易可能會需要數十秒到數分鐘才有辦法確認，在網路壅塞時甚至需要等更久。

交易費的狀況則是因為 Ethereum 中所設計的 gas 機制的關係，每筆交易都會支付給礦工一筆交易費用，這交易費用如果放到比較大額的交易時還好，不過如果在小額交易時費用比例就會太高。比如說最近幾次我完成的交易費用大約在 0.3USD~0.37USD 之間，如果只是作幾百塊台幣的交易那就顯然太貴了。

### Raiden 網路的解決方案

最前面有提到一個讓人很疑惑的句子：`Raiden 是一個基於 Ethereum (以太坊)的鏈下交易方案`，既然是鏈下解決方案，怎麼會又基於 Ethereum 呢？

因為 Raiden 是一個輔佐型的網路，利用開啟通道 (Channel) 來處理一批次的交易，再用一些加密演算法的機制在鏈下紀錄並核實真正的交易數據，最後在關閉 Channel 時將交易數據送入區塊鏈中進行實際的加密貨幣交易與核實。這樣實際在區塊鏈上的交易筆數就會減少許多，達成減低交易費與加速的目的了。

聽起來很神奇（確實也是），但是要達成這樣的目的需要有許多細節，會在下面一一的解釋。

首先要先說明 Raiden 是一個多節點的網路，但是為了先從簡單的情境開始，我們會先說明兩個節點之間要怎麼利用 Raiden 的原理達成減少交易費以及加速的目的，最後再解釋在許多 Raiden 的節點所形成的網路要怎麼達成目的。

另外 Raiden 可以轉任何 ERC20 的 token，我們以下雖然用以太幣 Ether (ETH) 作為範例，不過實際上會被包裝成一個相容於 ERC20 的 token。

#### 先想像一下…

因為我還沒看過 Raiden 的服務或錢包長怎樣，為了比較好的解釋跟想像 Raiden Network，請先想像使用 Raiden 時會像是悠遊卡一樣的儲值卡 app，不一樣的是它是一個 app，平常你會到捷運的儲值機儲值悠遊卡，在 Raiden Network 底下你需要要一個 app 把你的 Ether 以太幣儲值入 Raiden 裡面。

![image](/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/2.png#layoutTextWidth)

抱歉我畫得很醜 🤣

你可以在這個 app 上面看到你的 Ethereum 帳戶與 Raiden 帳戶裡面分別有多少餘額、列出你曾經在 Raiden 網路上作的轉帳，最後 app 底端有三個功能：

- 儲值 (Deposit)：把以太幣從 Ethereum 帳戶轉到 Raiden 帳戶
- 提領 (Withdraw)：把以太幣從 Raiden 帳戶轉回 Ethereum 帳戶
- 轉帳 (Transfer)：把以太幣轉給同樣在 Raiden 網路裡面的帳戶

### 先談兩個節點之間的互動

說了這麼多，終於要開始解釋兩個節點之間的互動了。前面有提到 Raiden 網路的原理是在 Ethereum 上開一個通道來處理多筆交易，讓我們來好好檢視一下之中的細節。

#### **開啟通道**

首先，其實通道 (Channel) 其實就是一個 Smart Contract。當你打開了一個通道後就是佈署了一個新的 Smart Contract。舉例來說 Bob 跟 Alice 之間經常一起吃飯，三天兩頭就要互相 Cover 飯錢，他們之間的互動會是這樣：

![image](/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/3.png#layoutTextWidth)

上面的這張圖虛線以上是區塊鏈上的互動，虛線以下是 Raiden 網路上的互動。

首先他們要先開啟一個通道（部署一個 Smart Contract），接著兩個人都先放 5 以太幣到這個 Smart Contract 裡面，讓資金足夠可以在兩人之間流動。當這個 Smart Contract 已經儲存了兩人的以太幣後，雙方就可以開始在 Raiden 網路中進行交易了。當 Bob 在 Raiden 網路送出第一筆 1 ETH 的交易給 Alice 時，此筆交易並不會發到區塊鏈上，取而代之的是 Bob 會將此筆交易資訊包含雙方在通道中的餘額利用自己的私鑰簽章過後，送給 Alice 保存此筆資訊，此筆資訊稱為 Balance Proof。當 Alice 也通知 Bob 收到 Balance Proof 後，這筆交易在 Raiden 上面就會成立了。

在這個時間點，雙方都會有通道上的餘額資訊，如 Alice 會擁有一份 Balance Proof `Bob: 4 ETH, Alice 6 ETH` 並且已經經過了 Bob 的簽章。

接下來的三筆交易都會用同樣的方式僅在 Raiden 當中檢查、簽名與傳送，這些資訊都不會上到 Ethereum 區塊鏈網路上。

另外在 Raiden 網路上面並不需要保存所有的交易紀錄，僅需要保存最後的餘額即可。

#### **關閉通道**

當這兩個節點的任何一個節點想要把在 Smart Contract 的儲值的錢領回時，可以關閉通道 (Close Channel)。

假設是 Bob 想要關閉通道，則 Bob 呼叫 Smart Contract 的 `close()`，此時 Bob 會在 `close()` 的參數內附上自己最新取得的一次 Balance Proof，同時在一段時間內 Alice 也可以呼叫 `updateTransfer()` 更新雙方餘額數據。

當雙方都更新完數據後，此通道可以被任何一個人（不限於雙方，可以是 Ethereum 上的任一節點）觸發 `settle()` 將雙方的錢都發回。Bob 跟 Alice 當初都存了 5 ETH 進去這個通道，最後餘額的狀況則是發回給 Bob 6 ETH, 給 Alice 4 ETH。

![image](/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/4.png#layoutTextWidth)

這邊的重點就是因為每個人擁有的 Balance Proof 都會經過對方的私鑰簽名，所以不論是哪一方呼叫了 `close()` 或是 `updateTransfer()`，此通道的 Smart Contract 都可以利用 Solidity 中的 `ecrecover()` 驗證簽名，當 Balance Proof 驗證正確後，Smart Contract 就可以確認這筆餘額雙方都確認無誤。
`註：[Brian Po-han Chen](https://medium.com/u/b808cc1f2067) 寫過一篇文章[解釋如何使用 ecrecover](https://medium.com/taipei-ethereum-meetup/%E7%94%A8ecrecover%E4%BE%86%E9%A9%97%E7%B0%BD%E5%90%8D-694fa8ae3638)。`

### 整個 Raiden 網路

剛剛先說明了兩個節點在 Raiden 網路的運作狀況，但是如果每次都要在需要支付的雙方開一個通道來轉帳顯得很不合理，所以 Raiden 網路上的多個節點就派上用場，假如說 Alice (A) 現在要轉帳給 David (D)，他們之間其實並不需要雙方存在直接通道，僅需要 Alice 跟 David 都在 Raiden 網路上即可，也就是說他們都跟 Raiden 網路上的其中一些節點之間已經開啟了通道。

![image](/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/5.png#layoutTextWidth)

原圖出自 [Raiden Network 101](https://raiden.network/101.html) ，但是把格式改成橫的方便閱讀

當 Alice 要轉帳給 David 時，首先他要先在 Raiden 中找到一條通往 David 節點的路徑，找到後就可以借用這些節點之間的通道把以太幣轉給 David。而在整個傳輸完成前，這條通道上交易會使用 Hash Lock 鎖定住，直到 David 在通道上確認已經收到款項，跟 Alice 用 `SecretRequest` 要求解鎖的 Key 後，整個交易才會解鎖。

最後每個傳送者都會傳送 Balance Proof 給下一個接收者，最終的狀態則是在這個通道上的所有人，都會擁有上一個的 Balance Proof。比如說 Bob (B) 有 Alice (A) 簽名過的 Balance Proof，Carol (C) 有 Bob (B) 簽名過的 Balance Proof，這些 Balance Proof 就可以在關閉通道時使用。

如果你不熟悉 Hash Lock，可以參考這篇 [A Simple Hash Locked Contract: Part 1](https://medium.com/@DontPanicBurns/a-simple-hash-locked-contract-part-1-28d7c6065417) 用比較簡單的方式介紹了 Hash Lock。

而這些通道不必然要馬上關閉，因為這些通道還可以用在其他人的轉帳，這樣就可以在不需要 Ethereum 交易費的狀況下繼續轉帳。這個時候讓我們再回到原本的那張草圖，你的 Raiden app 就像是儲值卡一樣，可以快速地拿它來做小額交易，直到你認為需要把錢提領回你的 Ethereum 帳號時，才按 Withdraw 提領把錢領出來。在你的通道還沒關閉時，都可以透過 Raiden 網路轉帳給另外一個人。

![image](/posts/2017-12-19_raiden-network-ethereum-區塊鏈支付通道/images/6.png#layoutTextWidth)

由於不需要全網共識的關係，所以 Raiden 可以在相對快的速度當中完成交易。另外在這邊要說 Raiden 網路中傳輸還是會有費用的，總共有兩種，其中一種 Protocol level fees 會在你轉帳時收取，不過理論上費用會非常少。另外一個費用是 Peripheral fees，如果你只有使用 Raiden 的輕節點 (light node) 時因為自身沒有跑完整的 Raiden 服務的關係，所以會需要全節點替你提供服務，所以會收取費用。

但如果是跑全節點 (full node) 就不需要收取費用，反而還可以因為提供轉發服務而從輕節點那邊收取到 Peripheral fees，關於費用的詳情請參考 [Raiden FAQ](https://raiden.network/faq.html)。

### 結論

總之 Raiden Network 就是利用上述的方式用鏈下的方案來解決目前 Ethereum 交易速度與費用的問題，不過我目前都僅是在文件上的閱讀與理解，還沒試著跑過他們的網路來實際體驗一下效果。所以實際上到底能不能解決問題還需要更深入的探討才能知道目前實作的狀況。

另外在 Raiden Network 要解決交易費太少的這個問題上，其實在透過多個節點轉送交易時，交易費的高低會依照中間經過的節點數量會有所不同，數量愈高交易費也會伴隨著提高。所以問題會回到在 Raiden 網路上找到的最短路徑所產生的交易費是不是可以比原本直接在 Ethereum 區塊鏈上直接交易要來得低。

最後這篇文章主要是參考下面兩篇 Raiden Network 的官方文件與 Github 源碼：

- [Raiden Network 101](https://raiden.network/101.html)
- [Raiden Network FAQ](https://raiden.network/faq.html)
- Raiden 的 Smart Contract: [NettingChannelContract.sol](https://github.com/raiden-network/raiden/blob/993d7fc7c468d83ed2580b5a3a8a19f05591c348/raiden/smart_contracts/NettingChannelContract.sol), [NettingChannelLibrary.sol](https://github.com/raiden-network/raiden/blob/993d7fc7c468d83ed2580b5a3a8a19f05591c348/raiden/smart_contracts/NettingChannelLibrary.sol)

感謝 Will 跟昶吾在 Ethereum Taipei Meetup 的 Slack 上面回答了我的疑問，也謝謝兩位在發布前先看過了文章，給了我一些建議。

#### 延伸資訊

這篇文章並沒有講到 TimeLock 部份的設計，如果你對這部分的資訊有興趣，可以參考下面這場演講《閃電網路/支付通道於 Ethereum 的基礎介紹》
