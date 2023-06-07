---
title: HTML5 mobile app 練習
date: '2012-09-28'
tags:
  - firefox
  - html5
  - css3
categories:
  - tech
---
這幾天在練習 HTML5 mobile app，決定找一個 Android 底下的 app 來重刻成 HTML5 版本，我挑的是 News & Weather 的天氣部分。  
  
![](images/0.png) ![](images/1.gif)  
  
這是一個可以根據你現在地點給你當地天氣的 app，按下右邊靠近上面的驚歎號圖示可以看今天一整天的溼度以及溫度變化，在圖形上面用手指滑動可以看指定時間的溼度。  
  
我找了一下如果要每個小時的溼度與溫度的 Weather API 大多都要錢的，所以最後我接了 World Weather Online 的 API, 但是圖表就換成接下來五天的天氣氣溫變化，當作練習就是了。  
  
成果如下，他只能跑在 Firefox for Android 上面，我沒有針對 Chrome/Safari 等 webkit 系列調整。  
  
![](images/2.png)   ![](images/3.gif)  
  
  
作完之後有一些感想...  

1.  如果不考慮相容性，現在的 CSS3 真的很強大，以前很詭異的排版方法現在都變得好排多了，我連右上角驚歎號圖示按下去顯示另外一頁都是用 CSS3 完成的，不需要 javascript。
2.  CORS 我還是沒搞定，最後用比較醜的 JSONP 解決。
3.  SVG 雖然好用，不過看起來效能在 mobile 上面還無法接受，目前應該還是用 Canvas  比較好。
4.  CSS/SVG 的漸層效果在 Firefox For Android 上面看起來很差，不知道爲什麼。

然後我很懶惰的沒有做 SVG path 的圓角，看起來好像沒有像是 rect 的 rx,ry 可以直接設定...  
  
Source code 我放在 [github](https://github.com/yurenju/mobile-weather) 上面，有興趣的參考參考。