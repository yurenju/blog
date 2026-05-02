---
title: Use centrino wireless in My Gentoo Linux Box
date: '2004-04-17'
tags:
  - linux
categories:
  - tech
---
[![](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/dsc02557.thumb.jpg)](http://wshlab2.ee.kuas.edu.tw/~yurenju/gallery/view_photo.php?set_albumName=screenshot&id=dsc02557)注意看X31中間的無線網路指示燈，是亮起來的。 :-)  
  
最近發現了Gentoo Linux 把 centrino 的 driver 包進了portage中，又加上 GNOME 2.6 的誘惑，所以這幾天又把laptop 重新安裝成Gentoo了。  
  
經過了之前與IBM X31的奮鬥之後，這次的安裝顯得相當的平順。安裝centrino wireless driver 也很簡單，只需要下達：  
  

\# ACCEPT\_KEYWORDS="~x86" emerge ipw2100

  
  
就可以把驅動程式安裝完成。這之中比較要注意的是kernel必須要把  
Library routine ==> Hotplug firmware loading support (EXPERIMENTAL)  
開啟，其他倒是沒有什麼要注意的地方  
  
有了這個driver，以後就不必在外插無線網卡囉！