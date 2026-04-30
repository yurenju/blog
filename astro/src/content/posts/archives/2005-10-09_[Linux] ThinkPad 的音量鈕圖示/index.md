---
title: '[Linux] ThinkPad 的音量鈕圖示'
date: '2005-10-09'
tags:
  - linux
  - software
categories:
  - tech
---
[![tpb Screenshot](images/0.jpg)](http://www.flickr.com/photos/yurenju/50667862/ "Photo Sharing")  
  
在 Linux 下，雖然 X31 的音量鈕依然可以調整音效，但是螢幕上卻不會顯示目前音量大小。然而使用 tpb 就可以在螢幕上顯示一些訊息。  
  
在 Gentoo Linux 上可以直接使用 emerge 安裝 tpb。不過因為 nvram 權限的問題，使用一般使用者就不能正常使用 nvram。如果您的 Gentoo 是使用 udev，可以在 /etc/udev/rules/50-udev.rules 加入以下設定：  

> KERNEL=="nvram", NAME="%k", MODE="0666"

  
如此一來下次開機後，nvram 的權限就會改成 666。如果要現在就改，也可以使用以下指令：  

> \# chmod 666 /dev/nvram

  
這樣就可以正確的啟動 tpb 了。不過字形會有點小，我嘗試著在 /etc/tpbrc 裏面改過字形大小，不過都會有點小問題，後來使用 [tpbrc sample](http://www.nongnu.org/tpb/doc/tpbrc.html) 中的字形就不會有問題了。請編輯 /etc/tpbrc，並且加入(或取代)下列設定值：  
  

> OSDFONT -\*-lucidatypewriter-\*-\*-\*-\*-\*-240-\*-\*-\*-\*-\*-\*

  
  
就可以啦。  
  
**update**  
經過 chuany 的提醒，emerge 時別忘了要打開 xosd 的 USE Flages 喔。  
  

>   
> USE="xosd" emerge tpb