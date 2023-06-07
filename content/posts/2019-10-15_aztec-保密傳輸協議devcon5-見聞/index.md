---
title: "AZTEC 保密傳輸協議 — Devcon5 見聞"
author: "Yuren Ju"
date: 2019-10-15T07:01:26.314Z
lastmod: 2023-06-06T13:42:44+08:00
categories: [tech]

description: ""

subtitle: "這次去 Devcon5 有機會跟 AZTEC 的開發者聊天，後續討論中也釐清了我自己使用 AZTEC 的一些疑問，搞清楚後也分享本篇文章來介紹此協議。"

images:
  - "/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/1.png"
  - "/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/2.png"
  - "/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/3.png"
  - "/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/4.png"
  - "/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/5.png"
  - "/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/6.png"
---

![image](/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/1.png#layoutTextWidth)
這次去 Devcon5 有機會跟 AZTEC 的開發者聊天，後續討論中也釐清了我自己使用 AZTEC 的一些疑問，搞清楚後也分享本篇文章來介紹此協議。

Ethereum 區塊鏈是一個透明的平台，雖然不知道特定地址的擁有人是誰，但是發生在區塊鏈上的交易都可以看得一清二楚。而在日常使用時交易的保密性還是非常重要的。

先定義一下**保密 (confidentiality)**：我們這邊說的保密是隱藏著雙方交易的金額不顯示於區塊鏈上，但又可以透過其他機制來驗證此筆交易無誤。但是交易的雙方資訊還是公開的。

Ethereum 上面有許多基於零知識證明的解決方案都在試著建立可以提供保密支付的功能，今天要介紹的 Aztec 就是其中之一。

本文不會介紹 AZTEC 密碼學上是如何達到的原理，而主要會聚焦在概觀介紹以及如何使用如何發送保密交易。

### 簡介

AZTEC 提供了一種名為 ZKAsset 的資產，在系統裡面我們稱它為單據 (note)，你可以用任意數量的 ERC20 轉換任一數量的單據，舉個例子，我們可以把 10,000 DAI 轉換成一張單據，而這張單據就是等值的 10,000 DAI，此時這張單據的價值是有被記錄在區塊鏈上的。

但是這個 ZKAsset 的單據是可以切割成任意數量的，而切割時每張單據的價值此時就不是可見於區塊鏈上了，所以當我把這個單據傳給另外一個帳號時，只有單據的擁有者可以利用 AZTEC 的工具得知這張單據的價值是多少。

而這張單據也可以將任意數量的 ERC20 轉換出來使用，直到這張單據裡面的 ERC20 用完為止。而單據跟單據也可以合併，這樣的話裡面到底包含多少數量的 ERC20 就會更無法預測。

這邊我們假設一個使用情境來解釋：一間公司想要保密的支付每個員工的薪水。這樣的情境下，要如何使用 AZTEC 來達成呢？

首先公司先把 100,000 DAI 轉成一張單據 A，此時這張單據價值 100,000 DAI 是公開的。

![image](/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/2.png#layoutTextWidth)

發薪水時，公司把單據 A 切成兩份，分別價值 90,000 DAI 跟 10,000 DAI 的兩張單據 A1, A2。

![image](/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/3.png#layoutTextWidth)

接著把 A2 傳送給員工，此時這兩張單據的價值並不會公開的記錄在區塊鏈上，但是擁有者依然可以透過 AZTEC 的工具來驗證其價值。

![image](/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/4.png#layoutTextWidth)

員工收到代表 10,000 DAI 的單據後，當需要用錢時可以將此單據中一部分的 DAI 如 1,000 DAI 從隱藏價值的 note 切分出來，一部分變成公開的 DAI，另外一部分仍是隱藏價值的 note，此時區塊鏈上可以知道此員工換出了 1,000 DAI，但是不知道他還剩下多少 DAI，此員工也可以一直重複這個步驟把錢領出。

![image](/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/5.png#layoutTextWidth)

如果下份薪水進來後，此員工還可以把他原本的兩張單據合併或切分，讓實際還有多少錢更難被推敲出來。

![image](/posts/2019-10-15_aztec-保密傳輸協議devcon5-見聞/images/6.png#layoutTextWidth)

### DEMO 實作

以上述這樣的情境時，AZTEC 就可以利用其保密交易功能實現薪資保密轉帳。而 AZTEC 的原理則是基於零知識證明的技術完成，使用時則是透過他們提供的工具 aztec.js 來產生零知識證明中所需要的證明，再透過 Aztec 提供的智慧合約來完成這些保密交易。

在看源碼前，一些名詞先解釋一下：

- **ZkAsset**：價值保密的資產，將會綁定特定的 ERC20，比如說 DAI，會透過此智慧合約的介面 `confidentialTransfer()` 進行保密轉帳。保密轉帳時會需要一些對應的資料將會由 aztec.js 工具產生
- **ACE (AZTEC Cryptography Engine)**：Aztec 的主合約，一些驗證相關的合約都註冊其中。在我們的範例中僅直接使用到 `publicApprove()` 功能用於同意 ERC20 轉帳。其他的則會透過 ZkAsset 間接的呼叫到。
- **Aztec.js**：AZTEC 提供的工具集合，用來建立票據、產生證明、透過 private key 產生簽名等等
- **JoinSplitProof**：Aztec.js 之中多用途的證明，進行保密轉帳時，會需要透過 JoinSplitProof 產生證明。

以下範例將利用 Aztec 的工具在 Rinkeby 網路上進行保密轉帳，在看範例之前你可以先到 etherscan 上面看從 [0xa2b19…3a589](https://rinkeby.etherscan.io/address/0x79fb585ffc18acd5b7002dfd8764e3b9f1188651) (block 5265001) 開始的 6 個 transactions，除了：

- [Bob 公開轉入 100 個 ERC20 token](https://rinkeby.etherscan.io/tx/0x36eb10e163878654b05dd72e74d2fb08abefd8c3f381ce1c26639656aa991693)
- [Alice 公開轉出 10 個 ERC20 token](https://rinkeby.etherscan.io/tx/0x40c0dd9a523a1c3a351b9c2df932140dab6f74ee024e478a1c2b76f4c5297090)

你有辦法得知 Bob 實際上轉了多少錢給 Alice 嗎？整個範例的流程如下：

1.  Bob 先無中生有加值 200 元（單純測試用）
2.  Bob 把 100 元的 ERC20 token 轉成一張價值 100 元的單據（公開）
3.  Bob 把單據切成兩張，分別是 20 元的單據跟 80 元的單據（保密），並且把 80 元的單據給 Alice（保密）
4.  Alice 把 80 元的單據領出其中 10 元（公開），保留剩下 70 元的單據（保密）

#### Mint

這個步驟跟 Aztec 無關，單純是測試用的 ERC20 加了一個 mint function 可以幫自己加值任意數量的 ERC20 token。

#### Deposit

這個步驟把 Bob 的 200 元中的 100 元轉換成 aztec note，請注意這部分的金額會公開在區塊鏈上。

首先利用 `erc20.approve(contractAddresses.ace, depositValue)`允許 ACE 合約轉換資產。接著利用 note.create() 來產生單據，其中第一個參數是帳號的公鑰，第二參數是此張單據的價值。
`bob.signers.erc20.approve(contractAddresses.ace, depositValue);
const depositNote = await note.create(bob.publicKey, depositValue);`

接下來透過 aztec.js 提供的 `JoinSplitProof` 來建立一個 proof，之後會作為 `confidentialTransfer()` 的參數傳入。JoinSplitProof 有幾個功能：

1.  合併單據
2.  切分單據
3.  把 ERC20 從一般的公開金額轉換成保密金額
4.  把單據中保密金額的 ERC20 轉移部分金額變成公開金額

因為要達成以上功能，所以 JoinSplitProof 五個參數如下：

- **inputNotes**: 你想要合併的 note，如果要從公開的 ERC20 轉換進來時，就給一個空陣列
- **outputNotes**: 想要輸出的 note，這邊可以是任意數量
- **sender**: 送出這筆交易的帳號地址
- **publicValue**: 要轉出的公開金額，如果是負數是公開轉成保密金額，反之則是保密金額轉成公開金額
- **publicOwner**: 公開金額 ERC20 的擁有者

在我們的例子第一次使用時是將 100 元轉換成一張單據，用法如下：
` const proof = new JoinSplitProof([], depositNotes, bob.address, depositValue * -1, bob.address);``const data = proof.encodeABI(contractAddresses.zkAsset);
const signatures = proof.constructSignatures(contractAddresses.zkAsset, []); `

產生之後，我們會需要利用 encodeABI 以及 constructSignatures 分別產生給 `confidentialTransfer()` 用的參數，signatures 是要產生 inputNotes 的簽名，因為我們這邊沒有任何 inputNotes，所以就會是一個空的陣列。

接著除了 ERC20 要同意 ACE 合約可以動用資產外，因為 ACE 裡面也會記錄哪些資產是什麼人可以動用，所以只要需要動用到公開的 ERC20 時，都會需要在這邊同意資產動用。
`ace.publicApprove(
    contractAddresses.zkAsset,
    proof.hash,
    depositValue
)`

以上都做完了後，將 proof 產生的資料傳入 `confidentialTransfer()` 即可。後面的 ethOptions 則適用於提高 gasLimit 來覆蓋過 ethers.js 提供的預設數值。
` const ethOptions = {
  gasLimit: 1000000
};``zkAsset.confidentialTransfer(data, signatures, ethOptions) `

#### 切分單據與傳送給 Alice

這邊會將原本 Bob 擁有的 100 元單據切成一張 20 元給 Bob，另外一張 80 元給 Alice。

這邊跟前面的原理類似，先利用 `note.create()` 造出兩張單據分別為 Bob 與 Alice 擁有。因為前一張的 inputNotes 是由 Bob 擁有，所以這邊我們利用 `constructSignatures()` 產生 bob 的簽名。
`const transferSignatures = transferProof.constructSignatures(contractAddresses.zkAsset, [
    bob.aztecAccount
  ]);`

最後一樣利用 `confidentialTransfer()` 傳送，但不一樣的是這邊的所有金額都是保密的了，雖然有一張價值為 80 元的票據已經傳送給 Alice，但是金額也是保密的。

#### Alice 提款

Alice 將提款出 10 元，保留剩下的 70 元單據往後繼續使用。

重複之前的過程，但是透過給 JoinSplitProof 不一樣的參數就可以達到這個功能。之前有提到 JoinSplitProof 的第四個參數 publicValue 如果負值是轉換公開金額變成保密金額的單據，反之則是把保密金額的單據轉換部份成公開金額。

所以這邊只要給他正數的數值就可以把錢提出來。
`const withdrawValue = 10;
const [, noteB] = transferNotes;
const noteC = await note.create(alice.publicKey, 70);
const withdrawProof = new JoinSplitProof(
  [noteB],
  [noteC],
  alice.address,
  withdrawValue,
  alice.address
);`

此時到 etherscan 上面可以看到有 [10 元的 ERC20 transfer](https://rinkeby.etherscan.io/tx/0x40c0dd9a523a1c3a351b9c2df932140dab6f74ee024e478a1c2b76f4c5297090)，到這邊就完成了整個情境了。

完整的源碼可以到 yurenju/aztec-demo 裡面找到。

[yurenju/aztec-demo](https://github.com/yurenju/aztec-demo)

### 結論

AZTEC 除了保密轉帳外，其實還有提供許多功能可以建構更複雜的 Dapp，本文提及的功能僅是其中一小部分。

如果你對 AZTEC 有興趣，可以接著參考官方的 medium 所撰寫的介紹文章知道更多細節，更棒的是還有[官方中文版](https://medium.com/@leila.w/aztec-協定簡介-ef38d0b9627)呦 :-)

也感謝 AZTEC 的開發者回答了我們許多疑問，特別是 [Joe Andrews](https://github.com/joeandrews) 協助我們解答了開發上的許多疑問！
