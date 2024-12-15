---
title: Linux 上轉換及解碼單眼相機 Raw 檔
date: '2009-01-06'
tags:
  - f-spot
  - nikon d200
  - dcraw
categories:
  - tech
---
最近去香港玩，帶了新買的 Nikon D200。回來第一個問題就是要怎麼在 linux 解 raw 檔。看了一下網路上的資料後，其實主要有兩個基底軟體：dcraw 跟 ufraw 可以解 raw 檔，而 gimp 與 f-spot 都利用 dcraw/ufraw 來讓本身也可以瀏覽及修改 raw 檔案。  
  
不過讓我感到疑惑的是只用 dcraw/ufraw 解出來的影像感覺起來顏色跟白平衡都不太正確。但是基於 dcraw 的 f-spot 解出來竟然是正確的。其實如果我可以用 f-spot 解決所有問題的話當然好，重點是 f-spot 匯出 raw 成 jpg 的時候又會爛掉…。  
  
所以解法就是看 f-spot 怎麼對 dcraw 下參數的就好了。有興趣的可以看看 [f-spot 的源碼](http://svn.gnome.org/svn/f-spot/trunk/src/Imaging/DCRawFile.cs)。  
  
所以只要鍵入以下參數就可以匯出跟 f-spot 上看到相同的影像了：  

> dcraw -h -w -t 0 YOUR\_RAW\_FILES