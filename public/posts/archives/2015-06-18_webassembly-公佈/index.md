---
title: "WebAssembly 公佈"
author: "Yuren Ju"
date: 2015-06-18T03:59:29.795Z
lastmod: 2023-06-06T13:36:48+08:00
categories: [tech]

description: ""

subtitle: "今天早上大致上看過了 Brendan Eich Blog 上的 From ASM.JS to WebAssembly，簡單整理一下，有錯跟我說一聲。"

images:
  - "/posts/2015-06-18_webassembly-公佈/images/1.jpeg"
---

今天早上大致上看過了 Brendan Eich Blog 上的 [From ASM.JS to WebAssembly](https://brendaneich.com/2015/06/from-asm-js-to-webassembly/)，簡單整理一下，有錯跟我說一聲。

![image](/posts/2015-06-18_webassembly-公佈/images/1.jpeg#layoutTextWidth)

Brendan Eich, 圖片授權為 CC by-nc, 出自 ModernWeb2015 flickr: [https://flic.kr/p/tiEJF8](https://flic.kr/p/tiEJF8)

**tr;dl**: WebAssembly 是一個新的 binary syntax，當瀏覽器支援時，你可以把你的源碼編譯並輸出成 wasm 格式就可以直接在瀏覽器上執行，準備用 C, C++ 或 Python 寫網頁應用了嗎 :-)

WebAssembly (副檔名是 .wasm) 是一種 binary 格式，瀏覽器需要另外一個除了 JS 以外的 runtime 來執行採用這個格式的程式。可以想像他之後會取代 asm.js，不同的點是 asm.js 基本上還是 JS 的子集，而 WebAssembly 就完全不是基於 JS 的 syntax/runtime。

Asm.js 很不錯，但是當瀏覽器支援 asm.js 後，Parsing asm.js 就變成了一個效能上的瓶頸  —  尤其是在行動裝置上，另外用壓縮來節省傳輸頻寬是必須的，但解壓縮又變成了另外一個瓶頸。

而由於 WebAssembly 是另外一種完全不是 JavaScript 的 syntax / runtime，當瀏覽器直接實作這個 runtime 時，在 JavaScript 中就不用再引入一些不安全或不合適的功能（我強烈懷疑）。

我自己覺得看到了另外一個 java applet, silverlight 或是 flash，只是這個新的 runtime 有成立一個 W3C 社群小組，參與成員有 Mozilla, Google, Microsoft 與其他公司。

大家對這個新 runtime 有什麼看法呢？
