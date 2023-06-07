---
title: "SRP (Secure Remote Password) — 更健全的登入及資料傳輸保護協議"
author: "Yuren Ju"
date: 2019-07-26T01:31:01.413Z
lastmod: 2023-06-06T13:42:34+08:00
categories: [tech]

description: ""

subtitle: "SRP 是一種強化登入以及資料傳輸保護的機制，此機制可以不透過網路傳輸密碼的狀況下完成註冊與登入，並且為後續通訊建立一個端對端加密通訊管道，即使在不安全的傳輸管道如 HTTP 也可以建立加密連線。Apple 的 iCloud 以及 1Password 都有使用 SRP…"

images:
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/1.jpeg"
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/2.png"
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/3.png"
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/4.png"
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/5.png"
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/6.png"
  - "/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/7.png"
---

![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/1.jpeg#layoutTextWidth)
[Lock me blue — Paolo Dallorso](https://www.flickr.com/photos/27868169@N00/15466412315/), CC 2.0 by-nc-nd

在開發 web service 時，你是怎麼實作註冊 (register) 以及登入 (login) 功能呢？一般來說我們會讓 client 透過安全的管道把帳號密碼傳輸到伺服器，並且透過 salt 與單向 hash 將 hashed password 儲存到資料庫中。
![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/2.png#layoutTextWidth)
下次登入的時候使用者輸入帳號密碼時會將帳號密碼傳到伺服器上，再透過相同的方式來計算出 hashed password 並且比對與資料庫中儲存的是否一致來驗證，如此一來伺服器就不需要儲存你的明文密碼，並且在後續通訊時依靠既有的安全通道如 https 來確保資料傳輸的安全。
![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/3.png#layoutTextWidth)
不過當處理更敏感的資訊時，通道的安全就會愈來愈重要。[2015 年時曾發生](https://www.bnext.com.tw/article/35854/BN-2015-04-03-041513-81)由中國互聯網路信息中心（CNNIC）發出的有問題的憑證導致其可以在使用者完全無法發現的狀況進行中間人攻擊，這代表以上常見的登入機制形同虛設，所有機密資訊都將會暴露在外。此事件導致 Google 與 Mozilla 往後都不信任由 CNNIC 所發出的憑證。

![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/4.png#layoutTextWidth)

在這樣 HTTPS 通道安全都不可信賴時，我們要怎麼保護通道安全呢？SRP 提供了一種加強保護登入及資料傳輸安全的機制。

### SRP — Secure Remote Password

SRP 是一種強化登入以及資料傳輸保護的機制，此機制可以不透過網路傳輸密碼的狀況下完成註冊與登入，並且為後續通訊建立一個端對端加密通訊管道，即使在不安全的傳輸管道如 HTTP 也可以建立加密連線。[Apple 的 iCloud](https://www.apple.com/business/site/docs/iOS_Security_Guide.pdf) 以及 [1Password](https://github.com/1Password/srp) 都有使用 SRP 強化保護。

相對於 HTTPS 的 session 加密的範圍是 browser 對於 server 之間每個 browser 的每個 session 都會採用不同的加密金鑰，SRP 是服務中每個不同的 user 都會採用不同的加密金鑰。

比如說今天是一個 blog 系統，SRP 在每個使用者登入後的 Session 都會採用不同的金鑰加密，相對於 HTTPS 是針對每個 browser session 採用不同金鑰的範圍不同，透過不同範圍的加密和在一起使用可以近一步增進通道安全。

我們這邊講解註冊以及登入這兩件工作 SRP 協定透過怎樣的流程來進行。

#### Register

![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/5.png#layoutTextWidth)
註冊相對簡單，跟平常的註冊流程不一樣的地方是密碼不會直接傳送到 server 去，而是在本地直接計算出 hashed password 才傳到伺服器端。

#### Login

SRP 在登入機制的重點就在於 client 跟 server 之間互相交換的資料，即使被中間人監聽時，中間人也無法依據這些訊息來假造登入，其中的道理就是在網路中傳輸的資訊就算被攔截了也無法利用這些資料進行登入，同時登入的流程不會傳輸任何密碼甚至 hashed password 也不會傳輸。

開始前我們要先建立一個密碼學的概念，考慮以下算式 `A = g^a`，並且數字範圍都非常大的狀況時（比如說範圍是 2 的 2048 bit 次方），在 A 與 g 已知的狀況，要計算出 a 是非常困難的事情，這是密碼學中經常提到的[離散對數問題](https://zh.wikipedia.org/wiki/%E7%A6%BB%E6%95%A3%E5%AF%B9%E6%95%B0)。

SRP 協定規範了一個登入程序，當登入開始時 client 跟 server 都會各自產生一個秘密，並且經由類似 `A = g^a` 計算後得出一個可以明文在網路上傳輸的數值 A，而即使知道 g 與 A 也幾乎無法推算出 a。

下圖中的 A, B 就是這樣產生的。

![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/6.png#layoutTextWidth)

第一步使用者會使用自己的 username 跟伺服器索取自己的 salt 作為後續使用。

接著 User 跟 Server 會個別產生 secret `a` 跟 secret `b`，這兩個秘密只會保留在本地端不會互相傳輸。但是我們透過剛提到的 `A = g^a` 跟 `B = g^b `所計算出的 A 與 B 則會互相交換。當 A, B 互換完成後，client 與 server 就可以各自利用手邊的資訊，獨立的計算出一模一樣的 session key `S`，用虛線框起來的就是整個 SRP 最神秘的一步了。

這個 session key 除了可以接著再產生 Challenge M1 傳給 Server 來驗證 client 外，同時也可以作為後續通訊加密用的密鑰。至於 session key `S` 要怎麼在雙方沒有交換機密訊息的狀況下雙方自行產生的呢？方法就是雙方使用手邊持有的資訊用不同的公式來產生 S。

下圖裡有幾個變數定義如下：
`### 使用者有的資訊

- a: 使用者在這個 session 挑選的秘密
- s: user&#39;s salt
- p: user&#39;s password``### 伺服器有的資訊
- b: 伺服器在這個 session 挑選的秘密
- v: Password verifier, g^(H(s, p))``### 雙方都有的資訊
- H: hash function
- N: 一個很大的質數
- g: N 的產生因子，g 不斷的乘以自己並且用 N 取餘數可以產生 1~N-1 中的所有數值
- k: Multiplier parameter (k = H(N, g)，可以想像他是一個常數
- A: 使用者用公式 A = g^a 產生出來的數值
- B: 伺服器用公式 B = kv + g^b 產生出來的數值`
  ![image](/posts/2019-07-26_srp-secure-remote-password更健全的登入及資料傳輸保護協議/images/7.png#layoutTextWidth)
  這邊 user 沒有 server 的秘密 b，而 server 沒有 user 的秘密 a，但是卻可以透過不同的公式（上圖中的最後一行）來組出相同的 session key S，而這把 session key 還可以為後續的通訊加解密來保證通訊安全，如此一來即使 https 通道被監聽了中間人還是無法解密這些資訊。

註：本文沒有解釋為什麼這樣可以組出相同的資訊，不過我會把實作細節跟附在文末。

### 總結

看了這麼複雜的理論，讓我們拉回現實世界吧。目前 SRP 已經有幾套實作可以使用了，我們這邊以 Mozilla 實作的 node-srp 為例來看看實際上如果要使用 SRP 要如何使用。

看這段程式碼片段的時候可以參考上面的流程圖就可以知道哪些數值是要用什麼函式產生。

SRP 中複雜的部分都已經被包裝起來了，透過函式庫很簡單的就可以完成整個流程。

回到通道安全本身，在理想的狀況下 HTTPS 理論上是可以保證通道的安全，但是由於 SRP 在每個不同的使用者都會產生不同的端對端加密金鑰，如果 HTTPS 憑證有問題時會影響到整個通道的安全，但是 SRP 的其中一個 session key 就算洩露了，也只會影響到該使用者的那個 session，範圍也比 HTTPS 小。

不過這邊不是說 SRP 就可以取代 HTTPS，因為雙方加密的範圍不同，而且 SRP 還需要在服務端額外儲存對應的資料如 password verifier 與 salt 等才能達成，也跟 HTTPS 不太一樣。兩種機制加在一起使用才會讓通道更安全。

如果你的服務所處理的資料是非常敏感的機密，可以研究一下 SRP 作為另外一層額外保護的機制。

### 參考資料

這邊分別有 JavaScript, .NET 以及 golang 的實作可以參考一下：

- [mozilla/node-srp](https://github.com/mozilla/node-srp) (node.js)
- [secure-remote-password/srp.net](https://github.com/secure-remote-password/srp.net) (C#)
- [1Password/srp](https://github.com/1Password/srp) (golang)

另外 SRP Protocol Design 這個網頁也交代了如何實作 SRP，該網頁文末也有附上 SRP 的論文可以參考。

[SRP: Design Specifications](http://srp.stanford.edu/design.html)

最後感謝 AMIS 的密碼學家 ChihYun Chuang 與其他工作夥伴對本文提供了充足的參考資訊與解釋，感謝大家 👋。
