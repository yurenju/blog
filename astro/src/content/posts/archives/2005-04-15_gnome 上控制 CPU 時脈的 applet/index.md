---
title: gnome 上控制 CPU 時脈的 applet
date: '2005-04-15'
tags:
  - linux
  - software
categories:
  - tech
---
![emifreq](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/emifreq_applet_0_18.png)  
  
emifreq-applet 是一個可以在 GNOME 上面控制 CPU 時脈，以及顯示溫度的 Applet 。有了這個以後，調整筆記型電腦的時脈就不是那麼煩雜的工作啦 ^^  
  
emifreq 還內附了一個 daemon，你可以在開機的時候啟動之，接下來 applet 就可以自由的控制時脈了。  
  
安裝方法也蠻簡單的。  
  
在 gentoo 下請如此安裝： (其他 Linux 也差不多)  

> \# ./configure --prefix=/usr  
> \# make  
> \# make install  
> \# echo /usr/sbin/emifreqd >> /etc/conf.d/local.start  
> \# /usr/sbin/emifreqd

  
  
接著再把 applet 加入面板中就大功告成囉。  
  
![新增 applet](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/Screenshot_J_Top_Panel.png)  
  
PS. 不過使用這支程式時請注意一下安全性，他可能會讓在你筆記型電腦上的任何帳戶都可以修改 CPU 頻率。(不過這個問題應該不嚴重啦)