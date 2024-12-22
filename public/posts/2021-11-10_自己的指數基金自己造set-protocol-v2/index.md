---
title: "自己的指數基金自己造 — Set Protocol V2"
author: "Yuren Ju"
date: 2021-11-10T14:32:23.499Z
lastmod: 2023-06-06T13:44:38+08:00
categories: [tech]

description: ""

subtitle: "你有買台灣 0050 嗎？這樣類似股票形式買賣的指數基金 (Index Fund) 或交易所交易基金 (Exchange-Traded Funds, ETF) 是一個不錯的金融工具，可以針對一個特定選擇條件的資產投資。"

images:
  - "/posts/2021-11-10_自己的指數基金自己造set-protocol-v2/images/1.png"
  - "/posts/2021-11-10_自己的指數基金自己造set-protocol-v2/images/2.png"
  - "/posts/2021-11-10_自己的指數基金自己造set-protocol-v2/images/3.png"
---

你有買台灣 0050 嗎？這樣類似股票形式買賣的指數基金 (Index Fund) 或交易所交易基金 (Exchange-Traded Funds, ETF) 是一個不錯的金融工具，可以針對一個特定選擇條件的資產投資。

指數基金的概念是根據特定條件所挑選的資產配合上每個資產的分配比例所形成的投資組合，當你買了指數基金時，實際上是依據分配比例買了包含在裡面的一籃子資產。比如說平均來說當你花了 100 元買 0050 時，其中 48 元會分配到買台積電股票，4.9 元買聯發科股票，剩下後面的股票一樣是按照比例配置。

管理這個基金的機構會是你信任的管理組織，因為他代替這麼多人管理資金，會需要一個受信任的機構來管理，並且透過國家法律框架約束，讓這個機構會循規蹈矩的來執行其中細節的買賣。當然如果你要買這些基金，投資者本身也會需要身份審查才能進行買賣。

所以不管是創建一個基金或是投資基金都會需要審核才能進行，因為這樣的信任關係確認後才能確保大家一定會依循著規矩做事情，不會因為利益而打破規則作惡。

而區塊鏈上的程式邏輯智能合約就像是一套下筆之後就一定要依循履行的規則，Set Protocol 就是一套可以讓所有人都可以打造自己的基金，並且給其他人使用的協定。

![image](/posts/2021-11-10_自己的指數基金自己造set-protocol-v2/images/1.png#layoutTextWidth)

每個人都可以當基金管理者，自行創造一個指數基金，比如說 PERP 跟 DYDX 都是永續合約的交易平台的代幣，我們可以自行創建一個基金 Perpetual Swap Index (PSI) 並且在這個基金裡面配置 60% PERP 與 40% DYDX。當使用者花 100 元買 PSI 時，他實際上會持有的就是 60 元價值的 PERP 與 40 元價值的 DYDX，而且持有 PSI 的人也可以直接跟智能合約贖回標的資產，如果以 PERP, DYDX 價格都為 20 USD 的情況下，這個使用者就可以贖回 3 PERP 與 2 DYDX。

而隨著價格的變化，指數裡面的資金也可以透過 rebalance 的方式來調整資產到預想的比例。

更好的是這個基金的管理者並沒有辦法提領你的資金，所有人都只能提領自己所投進去比例的資金。因為所有規則都已經寫在智能合約裡面而不能違背，這樣可以讓我們在沒有信任框架如國家、法律的狀況也能保證所有管理者、投資者都照著規則走。

以上的功能是透過 Set Protocol V2 的基礎發行模組 (Basic Issuance Module) 就可以達成的功能，而 Set Protocol 除了一般的指數基金以外，還可以打造出許多不一樣的投資組合。

### 基礎發行模組 (Basic Issuance Module)

就如同我們前面舉例的 PSI，因為造出來的 Set Token PSI (或是其他代幣) 都是 ERC20 標準代幣，所以我們可以在二級市場如 Uniswap, 0x, 1inch 直接買賣，除此之外也可以透過發行功能取得，使用者可以準備相對應比例的 PERP 跟 DYDX 也可以自行發行 (Issue) PSI。

以上面的的例子來說，我們可以準備 600 PERP 跟 400 DYDX，就可以發行出 10 PSI (也可以是 1000 PSI)，鑄造出來的比例也是在建立基金的時候可以調整的選項。

另外如果要出場，相同的可在二級市場上售出換成你想要的代幣如 USDC。另外基礎發行模組也提供贖回 (Redeem) 功能可以換回 PERP 跟 DYDX。

但如果這個投資組合有十種代幣那不就發行的時候就要準備十種代幣？Set Protocol 提供了另外一個模組讓這件事情變簡單。

### 淨資產價值發行模組 (NAV Issuance Module)

NAV (Net Asset Value) 發行模組可以讓投資者在入金的時候使用單一代幣就可以完成。比如說 PSI 代幣如果啟用 NAV 發行模組時，可以選擇直接用 USDC 入金，並且換成相對應的資產，贖回時也會得到 USDC。

使用這個模組時由於會需要用 Oracle 來取得價格資訊來知道要贖回數量是多少，這邊可以設定酬金 (premium) 或折扣 (discount) 來防止套利或 Front running。

### 債務發行模組 (Debt Issuance Module)

如果你需要的投資組合需要透過借貸涉入來提高槓桿比例時，可以用債務發行模組來發行你的指數。

比如說這個用兩倍槓桿追蹤 ETH 的 ETH 2x FLI (Flexible Leverage Index)，除了有 Compound ETH 外，也有 USDC 的債務。

![image](/posts/2021-11-10_自己的指數基金自己造set-protocol-v2/images/2.png#layoutTextWidth)

債務發行模組其實是一個更能自由操作的模組，發行時可以透過 Manager Hook 的方式實作各種邏輯如白名單、發行時間窗口或是發行上限等等功能。

而跟 Compound Leverage Module 或 Aave Leverage Module 一起使用，就可以用這些借貸槓桿模組在借貸協議中透過幾次循環把槓桿拉到二倍，在透過債務發行模組來記錄累進利息以及紀錄清算資訊來達成槓桿倍率指數。

### 史蒂夫在專研全球投資機會時戴夫在 Set Protocol 上面複製他的交易行為

很多人應該都看過這個廣告，eToro 上的史蒂夫很認真在研究投資，而戴夫就利用了 Copy Trading 的方式來做跟史蒂夫一樣的操作。

在 Set Protocol 上也提供了這樣的功能。基金管理者可以透過交易模組 (Trading Module) 將指數基金裏面的資金做他想要的操作，不單只是交易，管理者也可以透過 Wrap Module 把資金放到借貸市場，甚至透過 Governance Module 利用基金內標的資產的代幣對鏈上的治理模組發動投票。

雖然說管理者在啟動這些模組後可以做這些事情，但是每個人的資產都還是按照比例存放在其中。所以他可能會是個爛的管理者讓你賺不到錢，但這些操作都會是透明的，同時他也不能提出其他人所擁有比例的資金。

題外話，如果你很討厭史提夫跟戴夫的廣告，你應該看看[這漫畫](https://www.facebook.com/media/set/?vanity=toodle.onlifegame&set=a.2598774790401665)看看他們最後的結局 😌

### 結論

Set Protocol V2 之後加入了很多功能，在公告文件中也提到了可以執行保證金交易跟永續合約，還可以支援流動性挖礦與空頭等等領取機制，看起來接下來的功能都會透過模組的方式發布，並且讓管理者可以有更多工具可以使用。

上去逛 Set Protocol 的 TokenSet 網站，確實也看到了滿多有趣的基金，甚至有透過 Mirror Protocol 橋接 FAANG 的指數。

![image](/posts/2021-11-10_自己的指數基金自己造set-protocol-v2/images/3.png#layoutTextWidth)

我自己也有買了些 DPI (DeFi Pulse Index)，指數果然是動得比較慢，對我來講就是在這個資訊爆炸的圈子偷懶少研究一點，買個安心的指數。

### 參考資料

- [https://docs.tokensets.com/](https://docs.tokensets.com/)
