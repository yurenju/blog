---
title: X31 於 Ubuntu 7.10 的調校
date: '2007-10-15'
tags:
  - ubuntu
  - ThinkPad
categories:
  - tech
---
今天重灌了 ThinkPad X31。之前直接升級的時候，X31 上的開機速度慢的要命，所以這次一重灌好就拿 bootchart 測一下開機速度。如下圖：  
  
[![gutsy-20071015-1](images/0.jpg)](http://www.flickr.com/photos/yurenju/1577485417/ "相片分享")  
  
開機要 54 秒！別鬧了！所以就開始針對 ThinkPad X31 進行調校。首先看 bootchart 的圖發現，usplash 花太多時間了。所以先把開機的 splash 拿掉。提醒一下，splash 參數拿掉會導致開機時沒有漂亮的開機畫面，變成指令一直跑的畫面，但不影響功能。方法是修改 /boot/grub/menu.lst，將開機選項中的 splash 改成 nosplash：  

> title Ubuntu 7.10, kernel 2.6.22-14-generic  
> root (hd0,0)  
> kernel /boot/vmlinuz-2.6.22-14-generic root=UUID=3cd59194-5bd7-4ed3-b238-ca5b83a90dcb ro quiet nosplash  
> initrd /boot/initrd.img-2.6.22-14-generic

接著再繼續看 bootchart，發現 fsck 檢查的時間花太久，所以 fsck 檢查我也關掉了。不過這步是有風險的，對 [reiserfs](http://zh.wikipedia.org/wiki/ReiserFS) 沒信心的可別試阿 XD  
  
修改 /etc/fstab，把開機的兩個磁區的檢查關閉：  

> UUID=3cd59194-5bd7-4ed3-b238-ca5b83a90dcb / reiserfs notail 0 0  
> UUID=8e6a1c42-85b6-48b4-af08-bcd4657856aa /home reiserfs defaults 0 0

接下來在系統→管理→服務裏面把我的電腦上用不到的藍牙、APMD關閉。  
[![Screenshot-服務設定值](images/1.jpg)](http://www.flickr.com/photos/yurenju/1578462750/ "相片分享")  
  
稍微設定一下 Xorg，讓 compiz fusion 正常跑順便加快一點速度。如何設定請參照 [\[解決\] 使用 Beryl 後最大化視窗後標題列空白](http://yurinfore.blogspot.com/2007/04/beryl.html)。最後依照 powertop 的建議，開啟一些省電的功能，在 /etc/rc.local 中加入：  

> echo 10 >/sys/bus/usb/devices/usb1/power/autosuspend  
> echo auto >/sys/bus/usb/devices/usb1/power/level  
> echo 1 > /sys/module/snd\_ac97\_codec/parameters/power\_save  
> echo 1500 > /proc/sys/vm/dirty\_writeback\_centisecs

大功告成。那現在的開機速度呢？  
  
[![gutsy-20071015-3](images/2.jpg)](http://www.flickr.com/photos/yurenju/1577485423/ "相片分享")  
  
24 秒，比起 原本的 54 秒快了一倍，不賴吧 ^^