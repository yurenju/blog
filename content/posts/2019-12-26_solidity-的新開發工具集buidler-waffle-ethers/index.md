---
title: "Solidity 的新開發工具集：Buidler, Waffle, ethers"
author: "Yuren Ju"
date: 2019-12-26T09:02:54.568Z
lastmod: 2023-06-06T13:42:53+08:00
categories: [tech]

description: ""

subtitle: "在 Ethereum 上面寫智慧合約 (Smart Contract) 經常都會有開發工具不夠順手的問題，之前使用 truffle 時常會感到他提供的 migration 有點雞肋，而使用 web3 經常也遇到 bug 需要自己 workaround。"

images:
  - "/posts/2019-12-26_solidity-的新開發工具集buidler-waffle-ethers/images/1.png"
---

在 Ethereum 上面寫智慧合約 (Smart Contract) 經常都會有開發工具不夠順手的問題，之前使用 truffle 時常會感到他提供的 migration 有點雞肋，而使用 web3 經常也遇到 bug 需要自己 workaround。

當開始要寫新的智慧合約時，不禁都會想要上網找找看有沒有其他替代方案，後來我先發現了 ethers.js 作為取代 web3 的方案，後來又在 Hacker Noon 上面發現了 waffle 跟 buidler，這篇文章就分別介紹這三個我新發現的開發工具。

如果你已經看過 Hacker Noon 介紹的這篇文章就可以不用看下去囉，我也是從那邊看過來的。如果你只是想知道要怎麼快速的設定好這個開發環境也可以參考 Hacker Noon 提供的 [starter kit](https://github.com/rhlsthrm/typescript-solidity-dev-starter-kit)。

**注意**：寫這篇文章的時候我還沒有使用這三個工具在正式的專案上，如果你想使用在 production 環境請自行評估是否合用。

[The New Solidity Dev Stack: Buidler + Ethers + Waffle + Typescript [Tutorial]](https://hackernoon.com/the-new-solidity-dev-stack-buidler-ethers-waffle-typescript-706830w0)

### Ethers.js

不知道大家對 web3.js 的使用經驗如何？

就我自己的使用經驗 web3 經歷了 1.0 與 1.0 之前 APIs 的變更，那時一些工具如 truffle 或 metamask 內建不同版本 web3 的混亂，直到最近一次寫智慧合約時正好遇到當時 web3 版本竟然沒辦法送 transaction，讓我一直以來對 web3 沒什麼好印象，每次當我要寫智慧合約時就會搜尋一下有沒有新的替代方案。

ethers.js 是最近我找到的 web3.js 的替代方案，用起來不會相差太多，主要的差異在於 ethers.js 多了 Wallet/Provider 的類別用於管理私鑰，你可以使用本地的私鑰對 transaction 簽章後由 ethereum node 送出，也可以設定好之後透過 metamask 進行簽名。

另外一個不同處是兩個專案用的 abi 敘述方式不同，ethers.js 多支援了一個比較簡易的 abi 表達方式。

我對於 ethereum client library 的要求不多，只要可以正常運作、穩定就好，ethers.js 符合這個要求。

不過之前跟 [Ping Chen](https://medium.com/u/1f76e2783ed6) 聊的時候他提到了在一些比較複雜的操作下 web3 的支援還是比較好。我目前還沒寫過太過於複雜的操作，可能還是會需要到那個時候再來看看如果使用 ethers 要怎麼解決。

以下這篇文章有 web3 跟 ethers.js 的比較可以參考一下。

[adrianmcli/web3-vs-ethers](https://github.com/adrianmcli/web3-vs-ethers)

### Waffle

有了 ethers.js 負責與智能合約溝通後，開發上的下個問題就是要如何編譯、管理合約相依套件以及測試了。一般來說大家的第一選擇都是 truffle，不過 truffle 內建了 web3，同時 truffle 意味不明的 migration 也一直讓我困惑為什麼需要這個步驟，我的意見跟這位[網友](https://ethereum.stackexchange.com/a/61210)一樣：

> Migrations are a bunch of boilerplate that Truffle requires and which you will copy-paste and then forget you ever did it.

後來同時發現了 waffle 跟 buidler 可以讓我擺脫 truffle。waffle 是一套用來開發以及測試智慧合約的工具，同時要跟 typechain 整合並且提供型別給 solidity 撰寫的智能合約也非常方便。

這邊是一段 waffle 支援的 TypeScript 測試，跟 truffle 不同的是 waffle 使用的是標準的 mocha，你可以 `describe` 跟 `it` 來撰寫測試，不像 truffle 還特地多了一個 `contract` 代替 `describe`，也不像 truffle 一樣有全域的 `accounts` 變數，需要什麼就從 `ethereum-waffle` 引入。

同時 TypeScript 支援也讓撰寫測試的時候自動補齊讓生活開心點，不過 web3 應該也有支援就是了。

### Buidler

Buidler (注意 d 跟 l 的位置，並不是 “builder”) 是一個針對智慧合約的 task runner，提供了 plugin 介面來引入各式各樣的功能，比如說針對 etherscan 的整合，可以將佈署後的合約上傳 etherscan，讓使用者可以在 etherscan 上面直接看到合約源碼，更重要的是 buidler 內建了一個 buidler-vm，提供了 solidity 的 error stack，在開發的時候可以更容易的除錯。
![image](/posts/2019-12-26_solidity-的新開發工具集buidler-waffle-ethers/images/1.png#layoutTextWidth)
不過對我來說覺得針對智能合約製作了一個新的 task runner 有些多餘，根據 Hacker Noon 的文章除了除錯的 Error Stack 外他也負責了 deploy 到 testnet 以及支援 typescript 等功能。

我自己比較理想的開發環境應該是可以直接在 Waffle 做到這些事情，而不需要額外透過 buidler。會想使用 Buidler 完全就只是因為它提供了 Error Stack。這部分我還會研究一下，看看可不可以使用 waffle + ethers 就完成所有的工作。

如果你也對這些新的工具集有興趣，Hacker Noon 提供了完整的入門教學以及範例可以參考。

[The New Solidity Dev Stack: Buidler + Ethers + Waffle + Typescript [Tutorial]](https://hackernoon.com/the-new-solidity-dev-stack-buidler-ethers-waffle-typescript-706830w0)
