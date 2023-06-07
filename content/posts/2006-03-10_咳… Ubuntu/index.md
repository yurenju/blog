---
title: 咳… Ubuntu
date: '2006-03-10'
tags:
  - linux
  - desktop
categories:
  - tech
---
經過了段時間，我又投入了 ubuntu 陣營。因為原本 Gentoo 底下的 Home 磁區掛點了，所以就乾脆重灌，正巧手邊只剩下 Ubuntu 5.10，就順勢安裝起來。  
  
有了上次的經驗，這次安裝起來簡直就是如魚得水。首先修改 /etc/sources.list，新增下面這行：  

> deb http://apt.debian.org.tw unstable main

  
取得 firefly 字型。  

> sudo apt-get install ttf-arphic-newsung

  
接下來我試了 scim, 不過出了點小問題，接下來我又試了 oxim，到下列網址：  
ftp://140.111.128.66/odp/OXIM/Distribute/Ubuntu  
下載三個 Ubuntu 專用安裝檔案，接著用 dpkg -i 進行安裝  
  

>   
> dpkg -i oxim\_1.0.1-1ubuntu1\_i386.deb  
> dpkg -i oxim-gtk2-immodule\_1.0.1-1ubuntu1\_i386.deb  
> dpkg -i oxim-bimsphone\_1.0.1-1ubuntu1\_i386.deb  

  
  
不過裝 oxim-bimsphone\_1.0.1-1ubuntu1\_i386.deb 會有一些相依性問題，再使用以下指令安裝相依的 libtabe，再回頭安裝oxim-bimsphone即可 ：  
  

>   
> sudo apt-get install libtabe-db libtabe2  
> sudo dpkg -i oxim-bimsphone\_1.0.1-1ubuntu1\_i386.deb  

  
  
接著最後安裝 m17n-env，並且依照 /usr/share/doc/m17n-env/README.Debian.gz 的指示用 set-m17n-env 設定欲使用的輸入法：  

>   
> sudo apt-get install m17n-env  
> set-m17n-env  

  
  
好啦，把 oxim 進入 gnome 時啟動，大致上就 OK 了。應該有漏掉什麼步驟吧，哈。  
  
  
PS. 最後在 /etc/X11/xorg.conf 的 Section InputDevice 中加入下面兩行，順手把 TrackPoint 的滾輪功能啟動：  

> Option "EmulateWheel" "on"  
> Option "EmulateWheelButton" "2"