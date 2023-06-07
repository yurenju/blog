---
title: Mozart - HTML5 音樂指揮家遊戲
date: '2013-11-12'
tags:
  - Node.js Knockout
  - html5
  - javascript
  - node.js
categories:
  - tech
---
今年我們在 Node Knockout 2013 上面做了一個音樂指揮家的遊戲，可以用手機瀏覽器控制電腦瀏覽器播放音樂的節奏，並且實驗性的支持不同電腦發出不同聲部的音樂，就像交響樂團一樣！下面是我們的 DEMO 影片：  
  
  
  
製作這個遊戲用到了以下技術：  

*   Device Motion event: 用來偵測手機的加速度，[\[按這邊\]](http://yurenju.github.io/dmc/)偵測你的手機跟瀏覽器有沒有支援
*   WebSocket: 用來把手機的加速度資訊從手機傳到 node.js server 再傳到電腦端的網頁
*   [MIDI.js](http://mudcu.be/midi-js/): 播放 midi檔案，據我所知我們應該進行了大量的 patch XD
*   Audio API: 這邊不是我做的所以不是很清楚，不過就我所知有把 midi 音樂切分成不同聲部並且在不同的電腦播放。
*   Canvas: 在電腦端繪出加速度曲線，並且偵測到超過門檻值記錄時間來找到節拍

 晚點我們整理好後會釋出 source code，請拭目以待 :-)  
  
另外如果覺得我們的點子很有趣，請到 [\[這個網址\]](http://mozart.2013.nodeknockout.com/) 玩遊戲，並且按下左上角的 \[VoteKO\] 投給我們一票！