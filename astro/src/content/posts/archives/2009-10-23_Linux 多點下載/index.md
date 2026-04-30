---
title: Linux 多點下載
date: '2009-10-23'
tags:
  - lftp
categories:
  - tech
---
前幾天 [tsung 在 blog 上](http://plog.longwin.com.tw/my_note-unix/2009/10/15/linxu-shell-lftp-pget-thread-2009)提到了 lftp 多點下載的方式。不過每次都要打指令有點麻煩，其實只要在 .bashrc 裏面加入一個 function 就可以簡化下載方式。(請先裝 lftp)  
  
編輯家目錄的隱藏檔 .bashrc，在最後面加入以下內容：  
  
  
  
接下來重新載入設定檔：  

> source ~/.bashrc

接下來就可以用簡單的指令下載囉，比如說要下載 Ubuntu 9.10 rc，請直接用以下指令：  

> pget ftp://ftp.twaren.net/ubuntu-cd/9.10/ubuntu-9.10-rc-desktop-i386.iso

這樣就可以多線程下載囉。