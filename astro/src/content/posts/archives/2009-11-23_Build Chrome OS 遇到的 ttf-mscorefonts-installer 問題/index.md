---
title: Build Chrome OS 遇到的 ttf-mscorefonts-installer 問題
date: '2009-11-23'
tags:
  - google chrome os
categories:
  - tech
---
今天有兩個人問我同樣的問題，所以 post 出來讓大家參考。  
  
在 build Chrome OS 的時候，台灣的朋友會遇到安裝 ttf-mscorefonts-installer 會到 sourceforce 下載 corefonts 的字型，而衰的是在台灣通常 sourceforce 會幫你選擇 ncu 的鏡像站，正巧 NCU 下載這個 package 有時候會有問題。  
  
我的解法有點無厘頭…我是自己先切換 mirror 站後，把 [corefonts](http://sourceforge.net/projects/corefonts/files/) 底下所有的字型檔案都先載下來。接著 ./enter\_chroot 進去 build system 後，執行  

> sudo apt-get install ttf-mscorefonts-installer  

等到下載出問題時按 ctrl + z 暫停程序，這時候去看 /tmp 目錄底下會有一個 ttf-mscorefonts-installer-xxx 的目錄。再把剛剛自行下載的字型檔案全部都複製進去這個目錄。然後再下 fg 指令繼續安裝即可。  
  
\[update\]  
補上一個更簡單的方法，在 /etc/hosts 多加下面這行即可  
211.79.60.17 ncu.dl.sourceforge.net