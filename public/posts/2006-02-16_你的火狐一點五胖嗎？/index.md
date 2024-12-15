---
title: 你的火狐一點五胖嗎？
date: '2006-02-16'
tags:
  - software
  - desktop
categories:
  - tech
---
沒錯，我的也很胖。不過 [Inside Firefox](http://weblogs.mozillazine.org/ben/archives/009749.html)提供了一個小偏方，倒是可以試試看。  
  
請在網址列輸入 about:config ，然後找到 browser.sessionhistory.max\_total\_viewers 屬性。然後對照文中所出現的表，看你記憶體有多大就使用對應的數值，像是我的記憶體是 768MB, 所以我就把這個屬性數值設定為 5。  
  
我做了個小實驗，一次開啟了 31 個分頁，結果總共消耗了 149 MB 的記憶體。不過我平常也沒注意 Firefox 大約會佔多少記憶體，到底有沒有改善，我也不曉得 :P  
  
[![Firefox 1.5 screenshot](images/0.jpg)](http://www.flickr.com/photos/yurenju/100442867/ "Photo Sharing")