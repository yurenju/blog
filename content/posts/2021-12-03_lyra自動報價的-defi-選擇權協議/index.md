---
title: "Lyra — 自動報價的 DeFi 選擇權協議"
author: "Yuren Ju"
date: 2021-12-03T11:48:32.357Z
lastmod: 2023-06-06T13:44:44+08:00
categories: [tech]

description: ""

subtitle: "Lyra 是一個有自動報價功能 (也就是 Automated Market Maker, AMM) 的 DeFi 選擇權協議，透過流動性提供者注入避險所需資金，並且自動提供報價給交易者來進行選擇權交易的去中心化選擇權交易協議。"

images:
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/1.jpeg"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/2.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/3.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/4.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/5.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/6.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/7.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/8.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/9.png"
  - "/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/10.png"
---

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/1.jpeg#layoutTextWidth)

Lyra 是一個有自動報價功能 (也就是 Automated Market Maker, AMM) 的 DeFi 選擇權協議，透過流動性提供者注入避險所需資金，並且自動提供報價給交易者來進行選擇權交易的去中心化選擇權交易協議。

跟一般的選擇權交易平台不同的是 Lyra 並不是訂單簿 (Orderbook) 的形式，在交易時不需要先有其他交易者放上訂單才可以成交，而是直接由 Lyra 報價後購買。

但是與現貨交易平台如 Uniswap 相較起來的挑戰是選擇權有履約價、到期日以及四種不同類型的交易 (Buy Call, Buy Put, Sell Call, Sell Put)，一個 AMM 系統要如何針對這些不同的參數來有效的提供流動性，這就是 Lyra 透過客製化的 AMM 所解決的問題。

Lyra 協議有兩種參與角色：

- 流動性提供者 (Liquidity Provider)：提供用於避險的資金，並且於交易中獲得交易費分潤
- 交易者 (Trader)：在平台上的交易者，可以買賣看漲選擇權 (Call Option) 以及看空選擇權 (Put Option)
  ![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/2.png#layoutTextWidth)
  當交易者選擇了特定的標的資產 (Underlying Asset)、到期日與履約價 (Strike Price)，並且輸入所要購買或賣出的選擇權時，系統會根據 Black-Scholes Model 以及系統設定的參數計算出價格，並且在交易時鎖定避險所需的抵押品（或是押金），這些抵押品與押金由流動性提供者的資金提供，並且後續執行避險策略。

接下來我們就從流動性提供者與交易者參與系統時所發生的事情來講解系統。如果你對選擇權沒有概念，建議先閱讀前導文《選擇權簡介》來了解選擇權。

[選擇權簡介](/posts/2021-12-02_%E9%81%B8%E6%93%87%E6%AC%8A%E7%B0%A1%E4%BB%8B/)

同時你也會需要選擇權中關於希臘字母 (Greeks) 的知識，建議也先閱讀由 Anton 撰寫的《[選擇權的定價與避險參數](https://antonassocareer.medium.com/%E9%82%A3%E4%BA%9B%E5%B9%B4-%E6%B2%92%E5%AD%B8%E5%A5%BD%E7%9A%84%E9%81%B8%E6%93%87%E6%AC%8A-2-6934483b2f78)》。

### 開始之前：Lyra 是 AMM?

Lyra Protocol 在介紹時經常會介紹自己是個 AMM (Automated market maker)的系統。這樣說並沒有錯，只是一般說到 AMM 時，心裡經常會想到 x\*y=k 或者是類似的模型。但是 Lyra 並不是用類似的定價方式。

但 Lyra 仍然提供了自動報價機制以及交易後會獲得 ERC-1155 代幣，所以他確實是 AMM，只是在研究的時候不要有他是 xy=k 的模型的預先假設會比較容易進入狀況。

### 名詞定義

在開始前有些名詞先定義一下，之後會比較好理解。

#### Listing

相同標的資產、相同履約價與相同到期日的選擇權我們稱為一個 listing。比如說 2021/12/31 到期，履約價為 $4500 的 ETH 選擇權我們稱為一個 listing；相同到期日但履約價是 $5000 的又是另外一個 listing。

#### Board

一群相同到期日的 listing 稱為 Board。比如說 2021/12/31 的 ETH 選擇權，不管履約價多少的 Listing，他們都屬於同一個 board。

#### Standard Size

一個用來衡量 IV (Implied Volatility) 的合約數量稱為 Standard Size，比如說 20 個 ETH 選擇權合約是一個 Standard Size，在衡量 IV 的時候都會以 20 個 ETH 選擇權合約數量來做為一個衡量單位，我們在後面計算 IV 的章節會用到。

### 流動性提供者 (Liquidity Provider)

流動性提供者在 Lyra 的角色是提供避險 (Hedge) 所需的資金，並且在選擇權交易中賺取手續費，具體如何避險會在後面的章節解釋。

在 Lyra 中流動性提供是分「回合」的，如果回合已經正在進行中，資金是無法加入跟移除的。但是其實還是可以入金，只是資金在下個回合才會正式啟用，到時候才會開始收到交易手續費。

如果要移除流動性時同樣回合進行中也無法移除，但可以發出一個 “Withdraw signal”，在本回合結束之後你的資金就不會再加入下個回合了，當然你在回合結束前都可以隨時取消移除流動性。

一般的現貨流動性提供因為資產是現貨交易，如果要移除只要照著比例移除就可以了，但在 Lyra 中資金會用於選擇權的抵押品（或押金），而且隨著時間變化這些抵押品的價值都會有所不同，如果要做到隨時可以離開代表整個池子的未實現損益 (Unrealized PnL) 都要計算，實現這樣的功能會導致系統比較容易被操縱，所以目前流動性提供是以回合的方式來運行系統。

### 選擇權交易定價

在 Lyra 中交易流程可以分成幾個階段：定價、交易、避險，我們這邊就照著著個順序講解。

定價之中又分成了三個階段：

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/3.png#layoutTextWidth)

中間的選擇權定價 (Pricing) 方法我們在前一篇《[選擇權簡介](/posts/2021-12-02_%E9%81%B8%E6%93%87%E6%AC%8A%E7%B0%A1%E4%BB%8B/)》裡面有提到選擇權有一個常用的定價模型 Black-Scholes Model，其中定價會需要以下幾個輸入參數：Underlying Price, Strike Price, Expiry, Volatility, Risk-free interest rate，欲知詳情請閱讀前導文。

這些參數裡面其實就只有 Volatility 是比較難以直接觀測，其他都是可觀測因素。那在 Lyra 中是怎麼計算出 Volatility 呢？這個時候就要講第一個步驟 “Decide IV”。

#### Decide IV

IV 會在兩個時間點調整：初始化 Board 與每次交易時都會調整 IV。Lyra 要輸入到 BS Model 的 IV input 是由以下兩個參數相乘：
`IV Input = Baseline IV * Strike Volatility Ratio`

當一個 Board 建立的時候會先給定一個 baseline IV (以下都簡稱 baseIv)作為 IV 調整的起點，這個數值通常由歷史波動率得出。而 Strike Volatility Ratio (以下都簡稱 skew) 在每一個 listing 建立的時候設定。

為什麼需要兩個參數來計算出 IV Input，原因是因為實際上觀察市場時，每個不同的履約價的 listing 其實會是會形成一個 Volatility Smile 的觀察結果，也就是履約價越靠近標的資產價格 (Underlying Price) 的 listing 它的 IV 會愈小，履約價遠離標的資產價格的 listing IV 會愈大。

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/4.png#layoutTextWidth)

所以在 board 建立時給的 baseIv 基本上會套用到同一個 board 裏面的所有 listing，可以想像如果 skew 是 1.0 的狀況 baseIv 就會是 IV Input。舉例來說建立 board 時根據歷史波動率設定 baseIv 為 30%，針對 Strike Price 為 4500, 4400, 4300 分別設定 skew 為 1.0, 1.1, 1.2 來將初始的 IV 設定為符合波動率微笑曲線的百分比。

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/5.png#layoutTextWidth)

以上就是初始化 board 的時候會設定的基礎 IV，而每次交易時還會再次調整 IV。在交易的時候會先判斷此交易是不是買單，比如說 buy call/put options 會標記為買單，另外 close sell call/put positions 也會歸類到買單，在系統裡用 isBuy 來表示。

我們把情況分成買選擇權（不論是看漲或是看空選擇權），跟賣選擇權兩種情形來看。

當交易者買選擇權的時候通常是因為認為價格的漲幅（或跌幅）可以讓他獲利，所以我們可以說他覺得現在的波動率被低估了。反之如果交易者賣選擇權，因為賣單主要是賺權利金 (Premium)，所以他其實是認為波動率被高估了，所以才會想要來賣選擇權。

這邊都沒討論漲跌的方向影響（也就是履約價跟標的資產現價），因為這個因素其實會在後面的定價模型裡面被考慮到，所以這邊只需要考慮波動率。

所以每個交易進來之後會根據他是買單或賣單來調整 IV。如果是買單代表波動率被低估了，所以要增加波動率，反之則減少波動率。調整的方式是先以 Standard Size 來衡量交易大小並且作為 baseIv 的調整幅度。接下來再將這個調整幅度乘以系統參數 skewAdjustmentFactor 來做為調整 skew 的幅度。

系統內用 `OptionMarketPricer.ivImpactForTrade()` 來調整 baseIv 跟 skew，這些調整從這次交易就開始套用，往後的交易也都會套用此次的 baseIv 跟 skew。

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/6.png#layoutTextWidth)

#### Option Pricing

當我們在上個步驟 “Decide IV” 求出 Volatility 後就滿足了 Black-Scholes Model 定價的五個參數，所以只要把這五個參數帶入即可求出價格：

- Underlying Price: 標的資產的價格，比如說 ETH 現在的價格
- Strike Price: 履約價，比如說三個月後約定要結算的價格
- Expiry: 到期日，比如說三個月後
- Volatility: 波動率，價格波動的可能性
- Risk-free interest rate: 無風險利率，在沒有任何風險的狀況下可以獲得的利潤

#### 最後的權利金計算

當我們算出這個選擇權的定價後，最後 Lyra 就可以訂定出最後要跟交易者收的權利金費用 (Premium)，最後收取的費用總共有三個要素決定：

1.  選擇權的價格：上節計算出的選擇權價格乘上一個固定比例
2.  標的資產現價：標的資產現價乘上一個固定比例
3.  動態費用：根據交易池的 vega 風險來決定的動態費用

(1) 與 (2) 都是系統定義好的比例，可以透過社群治理變更，而 (3) 則是根據 vega 的風險程度來決定的動態費用，不過這邊太深入了就不再詳述。

這三個費用加起來就是要收取的交易費，而這邊前面提到的 isBuy 又要再拿出來用，當這筆交易是個買單時代表系統要用更多資金去避險，所以這個時候最後權利金的計算會是 `optionPrice * amount+ fee`。如果這是個賣單代表他會減低系統風險，為了激勵這樣的行為，權利金的計算就會變成扣除交易手續費 `optionPrice * amount - fee` 。

而這就是最後會跟交易者收取的權利金 (Premium)。當交易完成後，交易者會收到一個 ERC1155 的代幣作為持有證明。

### 避險 (Hedge)

當交易者在 Lyra 買選擇權時，Lyra 就會作為對家賣選擇權給交易者。

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/7.png#layoutTextWidth)

作為賣選擇權的角色，不管是賣 Call option 或是 Put option 都會承擔風險，所以 Lyra 在賣選擇權時會透過 Synthetix 進行避險，在賣 Call Option 的時候買現貨，並且在賣 Put Option 時做空標的資產。

比如說交易者買 1 ETH Call Option 時，Lyra 會從流動性提供者取得 sUSD 資金並且買 sETH，而交易者買 1 ETH Put Option 時，Lyra 會抵押 sUSD，借出 sETH 並且在市場上賣掉。關於避險方式可以參考《[選擇權簡介](/posts/2021-12-02_%E9%81%B8%E6%93%87%E6%AC%8A%E7%B0%A1%E4%BB%8B/)》的「賣方的風險」一節。

當 Lyra 執行以上的避險時，結算所需的資金風險就被抵銷了，但是這樣的避險方式其實是會花比較多資金在避險上面同時也有可能避險不足，如果考慮 Delta 的情形就可以解決上述問題，也就是下個章節會講解的 delta hedge。

#### Delta Hedge

講 Delta Hedge 之前，我們要先講一下什麼是 Delta。

Delta 是一個會影響選擇權價格的指標，指的是當標的資產上漲 1 元時，選擇權的價格會如何被影響。比如說一個交易者用 100 美金買了 2 ETH Call Option，平均一個 50 元，而此時 ETH 現價為 4500 美金。假如說這個選擇權的 delta 為 40 (或標記為 0.4)，代表當 ETH 上漲 1 元時，這個選擇權的價格會上漲 0.4 元，也就是會從 50 元變成 50.4 元，如果這個時候使用者關閉這個倉位，意思就是賣回這個選擇權給 Lyra 的 AMM，此時價格會變成 50.4 元，總價為 100.8 元。

如果我們採用原本的全抵押制的避險方法，我們來看考慮 Delta 後他的盈虧如何。

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/8.png#layoutTextWidth)

這邊可以看到當 ETH 價格增加 1 元時，如果交易者選擇關閉倉位把選擇權賣回給 AMM，此時 AMM 會有 1.2 元的盈餘。但是反過來說，如果 ETH 價格減少 1 元時，AMM 反而就會有 1.2 元的虧損了，會這樣是因為過多倉位的避險會讓系統的盈虧隨著市價價格波動，這樣的話系統就有可能造成虧損。

但如果我們考慮了 Delta 來調整避險的倉位時，此時就可以形成一個不被市場價格影響的避險。Delta 避險的計算方式也很簡單，就是把交易者買的選擇權倉位數量乘以 delta 就可以了，以上面的例子來說就是 `2 * 0.4 = 0.8`。接下來我們看看如果用這樣的數量避險，對於市場價格變化的應對能力如何。

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/9.png#layoutTextWidth)

在考慮過 delta 在進行的避險倉位，就可以正好抵消標的資產的漲幅，讓系統可以在漲跌的狀況都保持損益兩平，這樣就可以說達成了 delta neutral。

另外 Delta Hedge 是一個動態的過程，隨著標的資產價格的漲跌，會需要再次進行重新平衡 (Rebalance)，而 Lyra 也提供了一個帶有獎勵的觸發系統，讓外部參與者可以呼叫這個函式來執行 Delta Hedge。

### 智能合約簡介

![image](/posts/2021-12-03_lyra自動報價的-defi-選擇權協議/images/10.png#layoutTextWidth)

[Contract Details — Lyra Documentation](https://docs.lyra.finance/implementation/contract-details)

這邊針對智能合約重點簡介。

- LiquidityPool: 提供流動性提供者出入金的合約，Option Market 會在買賣時鎖定 LiquidityPool 中避險所需的押金，也跟 Synthetix 整合交易避險所需的合成資產
- Optionmarket: 實際跟交易者買賣選擇權的 AMM 智能合約，交易時會呼叫 OptionMarketPricer 計價，也會呼叫 LiquidityPool 鎖定資金
- OptionToken: 當交易者完成交易後，會收到一個 ERC1155 的代幣
- ShortCollateral: 當交易者賣選擇權給 AMM 時，負責管理交易者的抵押品如 sETH
- OptionMarketPricer: 計價用的智能合約，包含 IV 以及 Premium 都在這個模組作為計算入口，實際計算會取用 OptionGreekCache 的資訊並且在 BlackScholes 合約計算
- OptionGreekCache: Greek 如 vega, gamma, delta 等希臘字母參數會儲存在這裡，因為這些數據會隨著市場變化而變化，除了交易會改變這些數值外，也會需要外部參與者執行有獎勵的函式來協助更新希臘字母參數
- BlackScholes: 執行 Black Scholes Model 計算的智能合約
- PoolHedger: 提供帶有獎勵的 `hedgeDelta()` 讓外部參與者觸發來針對目前的 net delta 進行避險，同時也會調用 OptionGreekCache 取得參數並且於 Synthetix 進行避險所需的交易

### Lyra 風險

Lyra 在官方文件中提及了一些目前 Lyra 的風險，這邊也列給大家參考一下（合約被駭那種就不寫了）。

- Trading Cutoff: 交易時有一些限制，比如說合約結束前的二十四小時是不能交易的，另外 Lyra 有設定一個 Delta 的上下限，超過這個限制時該市場也不能交易，也不能關倉，直到 delta 回到上下限內
- Delta Hedge 還沒上線！！官方文件花了很多篇幅講的 Delta Hedge 但卻因為之前 Optimism 的 gas limit 問題還沒上線，本文撰寫的前一週我問了一下，他說他們正在緊鑼密鼓地測試中，總之就是還沒上線

### 結論

因為這是我第一個接觸的選擇權平台，所以暫時也看不出他的問題。但從文件齊全且易懂（從一個沒接觸選擇權的人的角度），dapp frontend 設計的不錯，使用流程順暢跟 discord 的問答交流來看，目前感覺起來是個認真的團隊。不過目前沒有 delta hedge 也是個隱憂，希望他們很快就可以就可以將這個功能上線來解決這部分的問題。

### 致謝

感謝 Perpetual Protocol 的 Daniel 跟我說明了許多關於選擇權的知識，感謝 Lyra Discord 上面的 Spreek, ⚡Telonic, Nick | Lyra, Domrom | Lyra 回答了我很多關於 Lyra 的問題，感謝各位！
