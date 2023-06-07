---
title: "Chrome DevTools: DOM 中斷點"
author: "Yuren Ju"
date: 2016-07-01T04:52:37.433Z
lastmod: 2023-06-06T13:38:10+08:00
categories: [tech]

description: ""

subtitle: "Chrome DevTools 幾乎是每個前端工程師每天都要用到的東西，程式開發中出了問題都會需要打開 DevTools 來看看到底是哪邊出了問題。其中一個常用功能就是中斷點，我們會需要在特定的程式片段暫停執行，DevTools 會保留所有的變數、狀態讓開發者了解問題原因。"

images:
  - "/posts/2016-07-01_chrome-devtools-dom-中斷點/images/1.png"
  - "/posts/2016-07-01_chrome-devtools-dom-中斷點/images/2.png"
  - "/posts/2016-07-01_chrome-devtools-dom-中斷點/images/3.gif"
---

Chrome DevTools 幾乎是每個前端工程師每天都要用到的東西，程式開發中出了問題都會需要打開 DevTools 來看看到底是哪邊出了問題。其中一個常用功能就是中斷點，我們會需要在特定的程式片段暫停執行，DevTools 會保留所有的變數、狀態讓開發者了解問題原因。

那你有沒有遇過特定的 DOM 元素在沒預期的狀況移除呢？今天就遇到了這個問題順便跟大家分享一下這樣的狀況要如何除錯。

![image](/posts/2016-07-01_chrome-devtools-dom-中斷點/images/1.png#layoutTextWidth)

這個畫面大家應該很熟悉（笑），這個例子是按鈕按下去的時候會移除掉 &lt;div id=”test”&gt;Hello&lt;/div&gt;，這時可以在你想要中斷的 DOM 元素按下右鍵，

![image](/posts/2016-07-01_chrome-devtools-dom-中斷點/images/2.png#layoutTextWidth)

選擇 Node Removal 後當 Remove 按鈕點擊時就會觸發中斷並且告知你是哪行程式導致這個元素被移除。
![image](/posts/2016-07-01_chrome-devtools-dom-中斷點/images/3.gif#layoutTextWidth)
雖然上面舉的這個例子很簡單，但是當專案已經大到你很難搞清楚到底是哪邊的程式移除元素時，這樣的除錯方式就可以讓你快速地知道問題大略出在哪個範圍，再更進一步地追蹤出問題的緣由。
