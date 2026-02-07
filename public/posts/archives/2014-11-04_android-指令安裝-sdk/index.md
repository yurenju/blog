---
title: "Android 指令安裝 SDK"
author: "Yuren Ju"
date: 2014-11-04T02:55:44.489Z
lastmod: 2023-06-06T13:36:29+08:00
categories: [tech]

description: ""

subtitle: "最近正在設定 Android 自動在 Travis-ci 上建置，發現幾個小技巧。Android 開發工具提供的 “android” 這個 command，可以利用 —no-ui 來用指令安裝，如："

images:
  - "/posts/2014-11-04_android-指令安裝-sdk/images/1.jpeg"
---

![image](/posts/2014-11-04_android-指令安裝-sdk/images/1.jpeg#layoutTextWidth)

最近正在設定 Android 自動在 Travis-ci 上建置，發現幾個小技巧。Android 開發工具提供的 “android” 這個 command，可以利用 —no-ui 來用指令安裝，如：

[https://gist.github.com/yurenju/9830b8605bbaf2ca9331](https://gist.github.com/yurenju/9830b8605bbaf2ca9331)

不過安裝時還會需要回答是否同意 license，所以還需要用個 echo y 來自動回答『同意』

[https://gist.github.com/yurenju/a1202a217a6693ca6301](https://gist.github.com/yurenju/a1202a217a6693ca6301)

那又要如何知道 —filter 要使用什麼代號呢？則可以利用 —extended 來查詢所有 SDK 的代號：

[https://gist.github.com/yurenju/0ce1128a67a9d9aa8048](https://gist.github.com/yurenju/0ce1128a67a9d9aa8048)
