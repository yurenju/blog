---
title: 'Firefox plugins: pcmanx on Gentoo Linux'
date: '2005-08-27'
tags:
  - linux
  - software
categories:
  - tech
---
感謝 pcman, jserv 跟包裝這個 ebuild 的 scsi。今天把 Gentoo 底下的 pcmanx 更新到 0.3.1-r1 之後，pcmanx 的 Firefox plugins 已經可以順利使用囉！不過在安裝的時候卻出了點問題，USE Flags 必須同時加入 Mozilla 與 Firefox，只加 Firefox 就不會動了。請先更新 GOT 的 ebuild 到最新版，再依照下面程序安裝：  
  

> \# USE="mozilla firefox" emerge pcmanx  
> \# rm ~/.mozilla/firefox/<someone\_directory>/comreg.dat

  
  
再重新啟動 Firefox，就可以直接利用 Firefox 連接 BBS！  
  
[![Screenshot-bbs.kuas.edu.tw - Mozilla Firefox](images/0.jpg)](http://www.flickr.com/photos/yurenju/37505336/ "Photo Sharing")  
  
延伸閱讀：[pcmanx 官方網站](http://pcmanx.csie.net/)