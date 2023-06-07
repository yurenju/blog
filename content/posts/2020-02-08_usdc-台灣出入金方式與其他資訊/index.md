---
title: "USDC 台灣出入金方式與其他資訊"
author: "Yuren Ju"
date: 2020-02-08T05:35:23.020Z
lastmod: 2023-06-06T13:43:00+08:00
categories: [tech]

description: ""

subtitle: "最近這幾個月都一直有用穩定幣的需求，目前最常使用的是 USDC 跟 DAI。USDC 目前可以透過在台灣的銀行的美金帳戶進行 1:1 的轉換。為了使用 USDC 研究了在台灣的出入金方式，順便也把最近找到的 USDC 與 DAI 的兌幣管道分享一下。"

images:
  - "/posts/2020-02-08_usdc-台灣出入金方式與其他資訊/images/1.png"
---

![image](/posts/2020-02-08_usdc-台灣出入金方式與其他資訊/images/1.png#layoutTextWidth)

最近這幾個月都一直有用穩定幣的需求，目前最常使用的是 USDC 跟 DAI。USDC 目前可以透過在台灣的銀行的美金帳戶進行 1:1 的轉換。為了使用 USDC 研究了在台灣的出入金方式，順便也把最近找到在 Circle USDC 官方網站上 USDC 與 DAI 的兌幣管道分享一下。

**2020/3/5 更新**：根據 [MaiCoin 的公告說明](https://medium.com/max-exchange/%E4%B8%80%E5%88%86%E9%90%98%E7%9C%8B%E6%87%82%E5%85%A8%E7%90%83%E7%AC%AC2%E5%A4%A7%E7%A9%A9%E5%AE%9A%E5%B9%A3-usd-coin-usdc-997603d2217b)，該平台也即將支援 USDC 買賣了，這樣一來除了在 Circle 以外也可以直接在 MaiCoin 使用台幣出入金！

**2020/10/26 更新**：目前看起來 Circle 僅支援商務帳號註冊，看起來個人註冊目前已經無法使用了。

### USDC 背景

[CENTRE | USD Coin](https://www.centre.io/usdc)

USDC 是 [Coinbase] (https://www.coinbase.com/)與 [Circle](https://www.circle.com/) 聯合發行以美金儲備的穩定幣，由於 coinbase 是美國公司，所以 USDC 也是由美國監管並且由世界第七大的 Grant Thornton LLP 會計事務所進行審計，可以在 USDC 官方網站上找到[會計事務所每月的審計報告](https://www.centre.io/usdc-transparency)。

而 USDC 也逐步受到各種應用的支援，除了 coinbase 外其他的一些 Dapp 也開始支援 USDC, 如 compound 以及 MakerDao 的 Oasis Trade 等，中心化的交易所如 Binance 也支援了 USDC 為基礎的交易對。

雖然目前最流通的穩定幣是 USDT，但是此幣種也因為監管不透明被詬病，MakerDao 的經濟研究員潘超在[區塊勢的 Podcast](https://soundcloud.com/blocktrend/ep-31#t=13:25) 中曾解釋過 USDT 比較像是離岸美金（沒有美聯儲的儲備保險的美金替代品）。簡而言之 USDT 雖然流通但是還是相對沒保障。這也是我比較偏好 USDC 的原因。

### USDC 在台灣的出入金方式

USDC 由 Coinbase 跟 Circle 聯合發行，而台灣的民眾則可以透過 Circle 官方網站出入金台幣。

[Tokenize and Redeem USD Coin (USDC)](https://usdc.circle.com/start)

在官方網站上面的說明文件 “[Linking a bank account](https://support.usdc.circle.com/hc/en-us/articles/360015246792-Linking-a-bank-account)” 也提及了台灣的銀行是在支援的範圍內。如果你需要進行出入金，你需要：

1.  USDC Circle 帳號
2.  銀行開啟美金帳戶

這兩個帳戶就行了。你可以先在 Circle 網站上先開好帳戶直到要填寫銀行相關資訊的地方，然後再去銀行開外幣帳戶。

我自己是在國泰世華開的帳戶，開帳戶時他應該會給你 SWIFT code、銀行的英文名稱跟英文地址。記住**每個分行都不一樣**，你可以開外幣帳戶完畢後跟他索取，我開完帳號時他就有提供以上的所有資訊給我。

開完帳戶後再回 Circle 把銀行相關資訊都填入，等待審核通過之後就可以開始出入金了。我自己在國泰世華的測試是出入金都需要手續費 300 台幣，而且都是付給國泰世華而不是 Circle 的，所以出入金的時候金額要大一些會比較划算。

出入金時間則是三到七天不等，入金是可以用國泰世華的網銀就可以完成轉帳，Circle 會提供一個美國的轉帳帳號給你，你把美金轉到那個帳號，過幾天後就會看到 Circle 的帳戶出現 USDC。

出金則是在 Circle 網站上面操作填入要出金多少 USDC，實際上他就是把等值的美金轉帳到國泰世華的美金帳戶。轉帳實際到帳前，國泰世華會打電話來問你這筆美金的來源，這樣就完成了。

### USDC 與 DAI 的兌換方式

MakerDAO 推出的 DAI 是整個去中心化應用最重要的穩定幣，許多 Dapp 都採用 DAI 作為基礎貨幣。

最近官方推出的服務 Oasis Dai Savings Rate 年利率 (Annual Percentage Yield, APY) 高達了 8.75% (2020/2/9 下降到 7.5%)，而且跟 Compound 不一樣的是存進去的 DAI 並不會被拿去貸款，目的僅是保持 DAI 對美元的穩定性，相對來講是比較安全的儲蓄方式，有穩定幣目前沒有使用的人可以考慮儲蓄在 [Oasis Save](https://oasis.app/save)。

我找了一下一些 USDC 跟 DAI 的兌換方式，我自己有用過以下這些。

- [**Kyber Swap**](https://kyberswap.com/swap/usdc-dai): 因為內含了 Uniswap 作為兌換基礎，原本覺得匯率應該還行，但看起來沒很好。不過不需要用戶審核還是不錯。
- [**Coinbase Pro**](https://pro.coinbase.com/trade/DAI-USDC): 比 Kyber Swap 匯率好，但是要做證件審核（比如說護照）。
- [**Curve**](https://compound.curve.finance/): 同事推薦給我的兌幣 Dapp，交易費極低，原理也挺有趣的：裡面的儲備是 cUSDC 跟 cDAI，儲備同時還可以產生利息，所以兌幣的交易費一部份就從利息裡面支出了，真是漂亮的一手。
- [**Oasis Trade Instant**](https://oasis.app/trade/instant): 最後我還是用了 Oasis，因為他的匯差滿小的，而 Curve 因為官方網站上寫他目前是 Alpha，雖然他是上面這些選擇中會差最小的，不過我還是比較信任 Oasis，最後選擇了在上面兌幣。

大致上就是這樣，當然資訊變化的很快，如果你發現上面有任何資訊已經過時了請告訴我，我可以更新目前的現況在文章裡面。
