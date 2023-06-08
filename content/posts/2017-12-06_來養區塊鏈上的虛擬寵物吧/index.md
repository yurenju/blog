---
title: "來養區塊鏈上的虛擬寵物吧"
author: "Yuren Ju"
date: 2017-12-06T01:31:36.700Z
lastmod: 2023-06-06T13:40:33+08:00
categories: [tech]

description: ""

subtitle: "這陣子以太坊圈子的人或多或少都在討論這個剛上線一周的遊戲 CryptoKitties。這是一個線上虛擬寵物卡蒐集系統，可以收藏、交易虛擬貓咪卡片，同時也可以讓兩隻虛擬貓咪卡片孕育新的貓咪卡片。"

images:
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/1.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/2.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/3.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/4.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/5.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/6.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/7.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/8.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/9.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/10.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/11.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/12.png"
  - "/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/13.png"
---

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/1.png#layoutTextWidth)

這陣子以太坊圈子的人或多或少都在討論這個剛上線一周的遊戲 CryptoKitties。這是一個線上虛擬寵物卡蒐集系統，可以收藏、交易虛擬貓咪卡片，同時也可以讓兩隻虛擬貓咪卡片孕育新的貓咪卡片。

聽起來並不是一個太複雜的系統，但特別是這個系統是建置在以太坊區塊鏈上的遊戲，也就是當你擁有了虛擬貓咪卡片後，他們將會被儲存在區塊鏈上面，並且利用 Smart Contract 進行各式各樣的操作！

剛開始聽到網路上提到這個系統時並沒有太在意，直到昨天 [TechCrunch 報導](https://techcrunch.com/2017/12/03/people-have-spent-over-1m-buying-virtual-cats-on-the-ethereum-blockchain/)在這個遊戲上面的交易量竟然達到了一百萬美金！這麼有意思的事情就跟風來玩一下了 😆

這篇先解釋一下要如何開始購買虛擬貓咪卡片與繁衍，以後如果還有機會可以解釋一下背後的 Smart Contract。
`註：虛擬寵物卡跟寵物不一樣，虛擬寵物只是虛擬資產，但是寵物並不是資產，而是陪伴你一生的夥伴。如果你想要養真實的寵物的話，請用領養代替購買。`

### 遊戲設定

CryptoKitties 基本上就是卡牌蒐集遊戲。至於最剛開始這些卡片怎麼來的呢？根據 TechCrunch 的報導，遊戲最剛開始先創造了一百隻元老貓咪卡片，然後每十五分鐘都還會有一張初代 (Gen 0) 貓咪卡片被遊戲製造出來。而這些後來被製造出來的卡片，價格會是最後五張賣出的初代卡價格的平均再乘以 50%。初代卡在 2018 年的十一月後就不會再產生。

除了以上由遊戲提供的卡片外，玩家擁有卡片後也可以出售自己的卡片。出售時可以訂起始價格跟結束價格，價格會在 24 小時內漸漸從起始價格改變至結束價格，比如說你起始價格定價 10 ETH，結束價格定 0 ETH，在 24 小時內價格就會慢慢地滑落，如果有人在你出售期間的正好一半買了你的卡片，費用就會剛好是 5 ETH。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/2.png#layoutTextWidth)

比如說這張的初始價格是 13.775 ETH，結束價格是 0

除了出售外，你也可以孕育新卡片。每張卡片都有獨特的基因。當孕育新卡片的時候，會取上一代兩隻貓咪的部分基因孕育出新的貓咪卡。而每次繁衍後，會需要等待冷卻時間結束後才可以進行下次繁衍，而每次繁衍後冷卻時間都會增加，比較後代的卡片通常冷卻時間也較長。

### 購買

因為這是購買、孕育而後售出或是轉送的卡牌蒐集遊戲，而整個遊戲有一部份建構在以太坊 Ethereum 區塊鏈上面，所以第一件要做的事情就是安裝瀏覽器擴充套件，讓你的瀏覽器可以連結上區塊鏈。

CryptoKitties 網站是採用 [MetaMask] (https://metamask.io/)與區塊鏈互動，請先上官方網站安裝 Chrome 或是 Firefox 的擴充套件。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/3.png#layoutTextWidth)

[https://metamask.io/](https://metamask.io/)

安裝後會需要設定你的以太坊錢包，這邊就不多作說明了。你會需要先用台幣換一些以太幣並且儲存到你的 MetaMask 錢包，目前看過最低價格的虛擬貓咪大概也要 0.02 ETH，而且出現馬上就會被買走，所以大概準備個 0.05 ~ 0.07 ETH 會比較容易買得到。開了 MetaMask 後就匯足夠數量的 ETH 到你的 MetaMask 錢包，在台灣比較簡單獲得以太幣的方式是到 [MaiCoin](https://www.maicoin.com/zh-TW) 買，不過如果你有其他加密貨幣如 BTC 其實也可以到像是 Poloniex 的交易所交易就是了。

匯完了之後，到[官方網站](https://www.cryptokitties.co/)按下 Start meow 就會開始註冊程序，在這邊需要填入你的電子郵件以及你的暱稱。另外因為安裝了 MetaMask 的關係，Wallet Address 這欄會已經填上 MetaMask 的錢包地址。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/4.png#layoutTextWidth)

按下 Save account info 後會出現 Sign Message，按下 Sign 後就註冊完成了。這邊的步驟是要確認使用者確實擁有這個錢包位址的私鑰，感謝台北以太坊社群的 [Ben] (https://benjaminlu.github.io/blog/)提供了參考資料，有興趣可以看一下這篇 [How does recovering the public key from an ECDSA signature work?](https://crypto.stackexchange.com/a/18106)。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/5.png#layoutTextWidth)

註冊完畢後，剛開始你不會擁有任何卡片，所以會先給你瀏覽幾張目前可以在市場上購買的貓咪卡，不過這些卡有些非常貴，比如說下圖的第一隻初代卡竟然要 13 ETH，依照現在的匯率換算成台幣可是要十七萬台幣阿。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/6.png#layoutTextWidth)

你可以按下 `See more Kitties` 瀏覽更多貓咪卡，並且可以用 Cheapest first 先看看比較便宜的卡片。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/7.png#layoutTextWidth)

選好貓咪卡後，按下 Buy now 就可以購買。另外提醒一下目前購買時的 Gas Price 已經到了 25 Wei 了，我最近一次購買實際的交易費是 0.0015111 Ether ($0.69)，也不算太低。

另外一個要注意的點是我之前一直遇到下面這個錯誤：
`Error: insufficient funds for gas * price + value`

結果是撰寫文章時因為 MetaMask 的以太坊節點過載了。後來在官方的 discord 討論群組跟在 [Reddit](https://www.reddit.com/r/CryptoKitties/comments/7hlpp5/psa_how_to_make_your_transactions_go_through/) 上面看到可以把 MetaMask 的 settings 裡面的 current network 網址改成 [https://mainnet.infura.io](https://mainnet.infura.io) 可以解決這個問題，如果不信任的話也可以自己在本地啟動一個以太坊節點並且連到上面的 RPC API。這應該只是個暫時的現象，所以如果你沒遇到跟我上面一樣的問題，就不需要切換 RPC 節點。

按下購買之後會出現下面這個對話框，如果 Gas Limit 太高超過錢包餘額的話可以調低一點，最低是 21000。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/8.png#layoutTextWidth)

按下之後就等待一下，如果沒有人出價比你高的話你就可以購買到該張貓咪卡，不過就我的經驗如果想買比較便宜的貓咪卡通常都很容易有很多人同時要買，成交機率也比較低。如果一直沒辦法成交，可以跟我一樣試著買買看比較貴一點的貓咪卡吧（苦笑）

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/9.png#layoutTextWidth)

### 孕育新貓咪卡

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/10.png#layoutTextWidth)

當你擁有虛擬貓咪卡後，接下來你可以作的事情還有孕育新卡片、出售跟贈送。你可以跟其他人擁有的貓咪卡繁殖，或是如果你有兩張貓咪卡的話也可以自行用它們繁殖，另外貓咪卡沒有性別，所以只要任兩張卡片就可以繁殖了。按下 Breed Kitty 會有兩個選擇，跟其他人的卡片繁殖，或是跟自己的卡片繁殖。

因為我有兩張貓咪卡，所以就先來試試讓他們兩張繁衍出新後代囉。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/11.png#layoutTextWidth)

然後讓我意外的是繁衍後代也要 0.015 ETH，這根本就是錢坑阿。不過頭都洗了，只好還是試試。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/12.png#layoutTextWidth)

如果上面的交易成功，最後你的其中一隻寵物就會出現 Bun is oven 的訊息，接下來就要等新的貓咪卡誕生囉。

![image](/posts/2017-12-06_來養區塊鏈上的虛擬寵物吧/images/13.png#layoutTextWidth)

大致上就是這樣。孕育出來的新的貓咪卡也可以售出、送人或是再孕育新的貓咪卡片。

至於放在以太坊上面的 Smart Contract 其實是一個符合 [ERC-721](https://github.com/ethereum/EIPs/issues/721) 的合約，ERC-721 是用於不可取代的 token (non-fungible tokens)，比如說某個 token 代表的是一棟房子，或是遊戲裡面特定的物品，每個 token 都是有獨特性而不是像一般貨幣每個 token 只要數量一樣代表的價值就一樣。因為貓咪卡片每張都有獨特的屬性，所以使用 ERC-721 也蠻合理的。

CryptoKitties 服務採用的 Smart Contract 在下面，如果後來有細看在來寫另外一篇文章。

#### 拍賣交易合約

[Ethereum Account 0xb1690c08e213a35ed9bab7b318de14420fb57d8c Info](https://etherscan.io/address/0xb1690c08e213a35ed9bab7b318de14420fb57d8c#code)

#### 貓咪核心功能合約

[Ethereum Account 0x06012c8cf97bead5deae237070f9587f8e7a266d Info](https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d#code)

### 感想

當初是覺得繁衍後的卡片還可以拿出來賣，所以就進來實際玩一下看看到底是怎樣的感覺。不過目前我還沒繁衍出新的卡片，所以這也只能說是暫時的感想。

我覺得大家會試著玩玩看搞得交易量這麼大，其實也都是因為新奇，畢竟除了貨幣相關的應用外，以太坊上比較少一般普羅大眾都可以使用的 Dapp (Decentralized app)，而 CryptoKitties 我玩過之後我也不覺得這是一般大眾都可以玩的應用 😆，畢竟光是設定 MetaMask，還有各式各樣的錯誤，如果是一般人早就打退堂鼓了，更何況也[有篇文章](https://medium.com/loom-network/your-crypto-kitty-isnt-forever-why-dapps-aren-t-as-decentralized-as-you-think-871d6acfea)提到其實這個應用並不是那麼的分散式。

不過對我來說還是個很棒的初期應用，展示了以太坊上給一般人使用的 app 可以怎樣的呈現，為開發者們提供了想像，探索不同的可能性。大家也可以從這個應用的優缺點思考一下如果想撰寫 Dapp 該考慮的點有哪些。

回到 CryptoKitties 的營利模式，目前看起來就是當繁衍貓咪卡時，會收 0.015 ETH 的費用加上販售初代貓咪卡的售價，我想初期他們應該是賺翻了，至於後續就看看大家覺得這樣的卡牌蒐集系統可以讓大家覺得多值得擁有了，拭目以待。
