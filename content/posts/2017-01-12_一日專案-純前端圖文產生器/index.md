---
title: "一日專案 — 純前端圖文產生器"
author: "Yuren Ju"
date: 2017-01-12T15:01:19.359Z
lastmod: 2023-06-06T13:39:31+08:00
categories: [tech]

description: ""

subtitle: "昨天也不知道在查些什麼資料，發現了之前一直沒找到可以用純前端可以利用 Canvas 加上 Facebook Graph API 的方式，在不需要後端的狀況下完成產生圖片與分享。"

images:
  - "/posts/2017-01-12_一日專案-純前端圖文產生器/images/1.jpeg"
---

![image](/posts/2017-01-12_一日專案-純前端圖文產生器/images/1.jpeg#layoutTextWidth)

昨天也不知道在查些什麼資料，發現了之前一直沒找到可以用純前端可以利用 Canvas 加上 Facebook Graph API 的方式，在不需要後端的狀況下完成產生圖片與分享。

[https://gist.github.com/andyburke/1498758](https://gist.github.com/andyburke/1498758)

而這幾天正逢「搶救台灣希望聯盟」打馬賽克讓小孩子拿著標語來表達該社團的訴求，加上數位圖文作者開始繪圖諷刺這樣的行為時，我覺得正好是時候寫一個純前端的圖文產生 + 分享到 Facebook 的小專案。

大家可以先去玩玩這個小專案：

[小孩標語，大人決定？](https://yurenju.github.io/youknownothing/)

其實第一件最麻煩的事情是要索取 publish_actions 權限需要 Facebook 審核，而且審核還需要有隱私頁面跟一些相關資料，並且頁面上還說需要五天的審核期，還好昨天睡一覺醒來已經通過了。

通過審核剩下的事情就簡單得多，其實上面那個 gist 基本上已經把所有事情都做完了，不過有一點可以改善的是他自己實作了簡易的 multipart/form-data，不過在分享中文時出了一點問題，這邊我則是改用目前原生的 formData()，語法上也更加簡單。
`var data = new FormData();
data.append(&#39;source&#39;, dataURItoBlob(imageData), filename);
data.append(&#39;message&#39;, message);`

另外遇到一個要額外處理的問題是 retina 的電腦如果直接把圖畫到 canvas 上面圖片會有些模糊，我用了一個 hidpi-canvas 的 polyfill 來解決這個問題，不過要注意到這個 polyfill 是在 getContext(‘2d’) 的時候才重新計算到底要用什麼大小的 canvas，所以改變 canvas 大小後，一定要接著呼叫 getContext(‘2d’) 讓 canvas 自動調整到適合的大小。

剩下的就直接上 github 稍微研究一下就知道做法囉！本專案程式部分為 MIT 授權，有興趣的自己看看吧！

[yurenju/youknownothing](https://github.com/yurenju/youknownothing)
