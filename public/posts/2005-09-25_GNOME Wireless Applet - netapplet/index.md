---
title: GNOME Wireless Applet - netapplet
date: '2005-09-25'
tags:
  - linux
  - software
categories:
  - tech
---
[![netapplet](images/0.png)](http://www.flickr.com/photos/yurenju/46245674/ "Photo Sharing")  
  
今天胡亂逛進 [kaichan 的書籤](http://del.icio.us/kaichan)中，發現到了一個不錯的 GNOME 無線網路 Applet - netapplet。這個軟體在 debian 下的套件庫裏面已經有了，使用 apt-get 安裝即可。不過在 Gentoo Linux 下就有些麻煩，因為原本的 netapplet 無法在 Gentoo 下直接編譯執行，patch 檔之於現在 GNOME CVS 中的 netapplet 又太舊了，所以安裝起來著實有些麻煩。  
  
  
  
首先必須設定、下載 GNOME CVS 中的 netapplet  

> \# export CVS\_RSH="ssh"  
> \# export CVSROOT=":pserver:anonymous@anoncvs.gnome.org:/cvs/gnome"  
> \# cvs log  
> \# cvs co netapplet

  
接著再下載[舊版的 netdaemon.c](http://cvs.gnome.org/viewcvs/*checkout*/netapplet/src/netdaemon.c?rev=1.1)放到 netapplet/src 下，使得 netapplet 的 patch 可以正常動作。  
  
然後使用[這個 patch](http://www.gnome.org/~carlosg/stuff/netapplet/netapplet-patch.diff)在 netapplet 目錄下進行修補  

> patch -p0 < netapplet-patch.diff

  
  
最後，使用 emerge 安裝 gnome-common，再：  

> \# sh autogen.sh  
> \# make  
> \# make install

  
  
使用 root 啟動 netdaemon，再使用一般權限的使用者啟動 netapplet 就完成了。實在是有夠麻煩，不過應該還有更簡單的方法，像是有人已經包好 ebuild 之類的 XD  
  
會這麼麻煩是因為這隻程式原本是 SUSE 專用的，所以要安裝到別的 Linux 套件會有點麻煩。  
  
  
參考連結：  

*   http://del.icio.us/kaichan
*   http://www.linux.com/article.pl?sid=05/09/13/1914255
*   http://nermal.org/old/?entryid=297
*   http://cvs.gnome.org/