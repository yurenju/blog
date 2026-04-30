---
title: expocity
date: '2004-12-16'
tags:
  - linux
categories:
  - tech
---
expocity 是個模仿 Mac OS X 中 [Exposé](http://www.apple.com/macosx/features/expose/) 功能的 Window Manager。他可以讓你開啟很多視窗時，方便的找到你所需要的視窗。  
  
影片： [http://wshlab2.ee.kuas.edu.tw/~yurenju/files/expocity.avi](http://wshlab2.ee.kuas.edu.tw/~yurenju/files/expocity.avi) (472K)  
  
請見下圖：  
  
[![亂糟糟的桌面](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/Screenshot_1_002.sized.png)](http://wshlab2.ee.kuas.edu.tw/~yurenju/gallery/screenshot/Screenshot_1_002?full=1)  
  
這時桌面上擺了許多視窗，而按下 \[alt\] + \[tab\] 後：  
  
[![所有的視窗都縮小了](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/Screenshot_2_002.sized.png)](http://wshlab2.ee.kuas.edu.tw/~yurenju/gallery/screenshot/Screenshot_2_002?full=1)  
  
所有的視窗都縮到適當的大小了。  
  
不過這個 expocity 可能是還在開發的關係，效能並不高，使用時會有些延遲的現象。  
  
  

expocity 安裝方式 (Gentoo Linux)
============================

  
因為 expocity 是 metacity 的 patch ，所以必須先刪除 metacity 後才能安裝 expocity：  
  

> \# emerge unmerge metacity

  
  
接著使用 ~x86 關鍵字安裝 expocity：  

> \# ACCEPT\_KEYWORDS="~x86" emerge expocity

  
  
大功告成 :-)