---
title: Ubuntu 如何播放 DVD?
date: '2006-02-09'
tags:
  - linux
  - software
  - desktop
categories:
  - tech
---
當我用眾多播放程式想播放 DVD 時，Ubuntu 中卻沒有何一支程式可以讓我播放 DVD！在失望之際，突然發現 mplayer 跟 ogle 播放 DVD 時都出現了同一行錯誤訊息：  
  
  

>   
> `************************************************   libdvdread: Encrypted DVD support unavailable.   ************************************************   ** **   ** No css library available. See **   ** /usr/share/doc/libdvdread3/README.Debian **   ** for more information. **   ** **   ************************************************   `  

  
看來似乎有解，趕緊去看了這個檔案，原來又是因為一些授權的原因，讓這個函式庫不能包進 Debian/Ubuntu。只要按照指示執行文件中所提到的 shell script 就可以順利安裝函式庫，之後就可以看 DVD 了。  
  
恩，奇怪的是我這個長年使用 Gentoo 的使用者怎麼會用起 Debian base 的 Ubuntu？欲知分曉，下回待續。