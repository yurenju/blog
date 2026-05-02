---
title: Linux 硬碟最佳化
date: '2003-08-29'
tags:
  - linux
categories:
  - tech
---
hdparm是一個可以將硬碟最佳化的程式。  
你可以參考 [Speeding up Linux Using hdparm](http://linux.oreillynet.com/pub/a/linux/2000/06/29/hdparm.html) 這份文件，增快Linux的速度。  
  
在Gentoo Linux底下，可以在 /etc/conf.d/hdparm 裡面設定參數  
ex:  
\# /etc/conf.d/hdparm  
all\_args="-X69 -d1 -u1 -m16 -c3"  
  
使用 hdparm -tT /dev/hdX 可以測試硬碟及硬碟快取的讀取速度