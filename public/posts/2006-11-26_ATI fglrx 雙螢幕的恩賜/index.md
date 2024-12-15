---
title: ATI fglrx 雙螢幕的恩賜
date: '2006-11-26'
tags:
  - ati
  - ubuntu
  - linux
  - Xserver
categories:
  - tech
---
九月份的時候，我曾經發表一篇 [\[ubuntu\] 兩台不同解析度的雙螢幕設定](http://yurinfore.blogspot.com/2006/09/ubuntu.html)，但是現在沒那麼麻煩了。因為我已經換了新的螢幕了！這次新加入的成員是 Samgsing SyncMaster 920N，研究室新進的螢幕。  
  
趁著這次順便聊一下 ATI 的官方 Linux driver - fglrx 所附的工具 aticonfig 如何設定雙螢幕。因為之前那顆奇美十五吋螢幕並不支援解析度以及掃描頻率偵測，所以我把掃描頻率寫進去 xorg.conf 設定檔裡面。但是這次換上來的這個 920N 是新的螢幕，應該有支援自動偵測頻率（事實上我查閱了 log 檔，的確是支援自動偵測）。  
  
所以我就先重新讓 xorg 重新建立 xorg.conf，這時候會問一些問題以便建立設定檔，我就不提該選什麼了：  

> $ sudo dpkg-reconfigure xserver-xorg

接下來使用 fglrx 附的 aticonfig 設定檔初始化雙螢幕設定：  

> $ sudo aticonfig --initial=dual-head

然後指定一些我想要的設定方式：  

> $ sudo aticonfig --overlay-type=Xv --desktop-setup=horizontal --screen-layout=right

這個的意思是螢幕用水平排列，副螢幕的位置在主螢幕的右邊，至於 overlay 設定為 Xv 是參考 [Unofficial ATI Linux Driver Wiki](http://wiki.cchtml.com/index.php/Ubuntu_Edgy_Installation_Guide) 的設定。  
  
登出之後，再重開 gdm，亦或重新開機後，雙螢幕就設定好囉。[![](images/0.jpg)](http://photos1.blogger.com/x/blogger2/406/860623136532693/1600/48764/00065_m.jpg)