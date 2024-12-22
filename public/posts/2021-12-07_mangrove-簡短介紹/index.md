---
title: "Mangrove 簡短介紹"
author: "Yuren Ju"
date: 2021-12-07T07:56:10.218Z
lastmod: 2023-06-06T13:44:48+08:00
categories: [tech]

description: ""

subtitle: "Mangrove 是一個不需鎖定資產的 Orderbook 形式的 DeFi 交易協定，不需要先將資產存入一個智能合約中才可以開始提供流動性，更可以用靈活的策略來提供流動性，比如說直接用放在 Compound 的資產提供流動性。"

images:
  - "/posts/2021-12-07_mangrove-簡短介紹/images/1.png"
  - "/posts/2021-12-07_mangrove-簡短介紹/images/2.png"
---

Mangrove 是一個不需鎖定資產的 Orderbook 形式的 DeFi 交易協定，不需要先將資產存入一個智能合約中才可以開始提供流動性，更可以用靈活的策略來提供流動性，比如說直接用放在 Compound 的資產提供流動性。

達成這個目的的方式，就是讓每筆訂單（或是說 Offer）都是一段可執行的程式碼 (稱為腳本 Script，不過要注意這段 Script 也是智能合約) 加一個觸發條件，當觸發條件滿足後就這段 Script 就會被執行，並且在執行完之後會再次檢查是否有滿足觸發條件，也就是有沒有確實地交換兩種代幣，如果沒有交換成功，這筆交易就會 revert。

![image](/posts/2021-12-07_mangrove-簡短介紹/images/1.png#layoutTextWidth)

舉例來說如果上圖為 Mangrove 訂單簿，每個訂單都會是一個 Offer。每個 Offer 裡面都包含了：

1.  打算提供多少數量的 Token A
2.  打算需要多少數量的 Token B
3.  這段程式執行需要多少 gas
4.  腳本 (Script)，實際執行的程式片段（智能合約）

當 Taker 下了一個訂單，符合 Maker 的 Offer 時，腳本就會被執行。我們先設定腳本的內容就是從 Maker 的帳號裡面取出 1 ETH 轉給 Taker。當一個 Taker 發出一個 Market Order 符合上述 Maker 提出的 offer 時，此時就會執行 Maker 的腳本。

腳本最簡單的版本，就是直接從 Maker 的帳戶轉 1 ETH 給 Taker 完成這筆交易，此時 Mangrove 會驗證交易內容，如果條件都符合（或是訂單部分符合），那這筆交易就順利完成。若腳本執行完的狀態不符合 Offer 的條件，此筆交易就會 revert，此時 gasreq 會補償給 Taker。

但因為 Code 就是 Offer 本體 (Code as an Offer?)，所以這邊可以用很多靈活的方法來提供流動性。Maker 除了可以從自己的帳戶拿錢出來，也可以直接從 Compound, Aave 把自己在裡面定存的錢拿出來交易，甚至也可以從 Uniswap 把自己的 Liquidity 抽出來當流動性，如果有找到適當的方式甚至可以用 Flashloan 來提供流動性；更可以將交易完之後取得的代幣，再放回其他 DeFi 產品，比如說再塞回 Compound 生利息。

這樣有幾個好處：

1.  不需要剛開始就鎖定資金，入金到某個智能合約
2.  資金利用效率比較高，沒在用的時候還是可以放在其他 DeFi 產品生利息
    ![image](/posts/2021-12-07_mangrove-簡短介紹/images/2.png#layoutTextWidth)
    另外在 Mangrove 裡面還可以用一段 Code 管理許多 Offers，當一個 Offer 被吃掉後，他也可以同時更新其他由同一份 Code 管理的 Offer 的價格資訊，不需要像是一般 Maket Maker 那樣重複的取消、建立新的訂單，只需要更新 Offer 的參數即可。

### 參考資料

- EthCC 的演講 “[Vincent Danos : A dex with reactive liquidity — YouTube](https://www.youtube.com/watch?v=O_Dqe_3TDuA)”
- [Mangrove developer documentation — Mangrove](https://docs.mangrove.exchange/)
