---
title: "自製 Chai Plugin"
author: "Yuren Ju"
date: 2020-04-11T04:43:21.590Z
lastmod: 2023-06-06T13:43:20+08:00
categories: [tech]

description: ""

subtitle: "作為經常使用 Mocha/Chai 的開發者，有時還是覺得 Chai 的功能沒辦法滿足需求。雖然知道 chai 可以自行撰寫 plugin 來更改預設行為，不過一直都沒研究要怎麼做，不過這次正好有機會認真讀了 Chai 的文件後寫了專案要用的 plugin 後來分享一下做法。"

images:
  - "/posts/2020-04-11_自製-chai-plugin/images/1.jpg"
  - "/posts/2020-04-11_自製-chai-plugin/images/2.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/3.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/4.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/5.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/6.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/7.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/8.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/9.png"
  - "/posts/2020-04-11_自製-chai-plugin/images/10.png"
---

![image](images/1.jpg#layoutTextWidth)

Credit: [Github repo](https://github.com/chaijs)

作為經常使用 Mocha/Chai 的開發者，有時還是覺得 Chai 的功能沒辦法滿足需求。雖然知道 chai 可以自行撰寫 plugin 來更改預設行為，不過一直都沒研究要怎麼做，不過這次正好有機會認真讀了 Chai 的文件後寫了專案要用的 plugin 後來分享一下做法。

這次介紹的範例會放在以下的 github repository 可以參考一下。

[yurenju/chai-plugin-example](https://github.com/yurenju/chai-plugin-example)

### 定義 eq 新功能

不知道大家開始用 JavaScript 新的內建型態 BigInt 了沒？在 node.js v10 也開始支援，理論上已經可以廣泛使用了。使用時跟一般整數一樣，但是要在後綴加個 `n` 代表它是 BigInt，比如說 100n 就是型態為 BigInt 的整數 100。

但是如果你嘗試著在 Chai 裡面撰寫如下的測試範例時：

![image](images/2.png#layoutTextWidth)

按照邏輯在第二個測試應該會出錯，並且顯示 30n 不等於 20n，但實際上則會丟出一個莫名其妙的錯誤訊息：

![image](images/3.png#layoutTextWidth)

原因其實就是 Chai 內部運作沒有考慮到 BigInt 的邏輯。而等待官方支援[目前看起來是遙遙無期](https://github.com/chaijs/chai/issues/1321)，不過我們可以利用 Chai plugin 很簡單的就可以解決這個問題。

Chai 的框架提供了許多更改原先邏輯的方法。首先新增一個 helper 模組，並且利用 `overwriteMethod` 來修改 `eq` 原本的邏輯：

![image](images/4.png#layoutTextWidth)

其中有幾個參數：

- this.\_obj: 這是原本的 expect() 裡面傳入的參數
- this.assert: 用來判斷正確與否、訊息以及要比較的兩個數值
- \_super: 原本的判斷式，如果不是我們要處理的狀況則用原本的處理方法

寫完 helper 之後利用 `chai.use()` 就可以將寫好的模組注入 chai 當中：

![image](images/5.png#layoutTextWidth)

這樣錯誤訊息就會清楚很多了

![image](images/6.png#layoutTextWidth)

### 新增函式

除了可以改寫原本運作邏輯外，也可以新增自訂函式來擴展功能，比如說我們專案裡面有個特殊的回傳格式，我們希望驗證裡面的某個陣列裡特定數值是什麼。

在這個例子裏面，我們希望驗證 response.logs 裡面有個 event 是 SwapToken，而且 log.args 裡面有兩個屬性 fromToken, toToken 分別是特定數值。

![image](images/7.png#layoutTextWidth)

在 Chai 我們在沒有任何 helper 之前依然可以完成這項工作，但是如果有 helper 之後，我們可以把它寫成更為精簡。比如說我們先設定預期目標是將語法修正成這樣：

![image](images/8.png#layoutTextWidth)

這樣的語法更容易閱讀，需要的行數也較少。接著我們就可以依照我們想要達成的效果利用 `addMethod()` 為 Chai 新增 emit 以及 withArgs 函式：

![image](images/9.png#layoutTextWidth)

就即可達成用更簡潔的語法達成相同效果的驗證。

![image](images/10.png#layoutTextWidth)

除了這兩個函式外，Chai 還提供了不少功能可以擴展功能，有興趣的可以研讀一下官方文件。

[Core Plugin Concepts](https://www.chaijs.com/guide/plugins/)

這次的範例都可以在以下的 Github repository 找到，想要自己寫 Chai helper 可以試試。當測試寫起來更簡潔易懂後，心情愉快起來感覺開發效率就更高了呢 🤣
