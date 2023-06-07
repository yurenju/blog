---
title: 小紅點 (TrackPoint) 在 Ubuntu 8.10 的設定方法
date: '2008-11-02'
tags:
  - ubuntu
  - X-Window
  - TrackPoint
categories:
  - tech
---
現在新的 X Server 愈來愈懶。現在 /etc/X11/xorg.conf 的設定檔已經砍到只剩幾行。不過這也讓我有點疑惑，如果沒有設定檔，那要如何設定一些奇怪的設定，諸如小紅點的設定？  
  
原來新的 X 已經支援直接從 HAL 給參數，由 X 去讀取這些參數。所以你可以建立 /etc/hal/fdi/policy/mouse-wheel.fdi, 檔案內容如下：  
  
  
  
接下來重開 hal 跟 X。不過我還不知道這樣有什麼好處，感覺起來應該是 User 可以直接傳遞 HAL 變數才比較有用。不然是把設定檔移到另外一個地方放而已。