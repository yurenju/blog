---
title: Ubuntu 安裝各種輸入法的通用方法
date: '2006-03-19'
tags:
  - linux
  - software
  - desktop
categories:
  - tech
---
Ubuntu 底下提供了一個很方便的工具 m17n-env。在安裝輸入法如 scim, gcin 或者是 oxim 時，總要設定些環境參數，m17n-env 可以將這些設定過程簡化。  
  
首先，ubuntu-tw 提供了本地的 sources.list, 先把原本的 sources.list 備份，換上 ubuntu 提供的：  

>   
> cd /etc/apt/  
> sudo mv sources.list sources.list.bak  
> sudo wget http://apt.ubuntu.org.tw/sources.list  

  
  
接著跟 respository 進行同步更新。  

>   
> sudo apt-get update  

  
  
以安裝支援新酷音的 scim 為例，我們必須安裝 m17n-env, scim-chewing, scim-gtk2-immodule還有要讓 scim 支援 m17n-env 設定的 scim-m17n：  

>   
> sudo apt-get install m17n-env scim scim-chewing scim-m17n scim-gtk2-immodule  

  
  
安裝完畢後，使用 set-m17n-env 指令設定所需要的輸入法：  

>   
> set-m17n-env  

  
  
選擇 ZH\_TW.UTF-8，按下確定，接著選擇 30im-scim，再按確定：  
[![set-m17n-env (1)](images/0.jpg)](http://www.flickr.com/photos/yurenju/114212489/ "Photo Sharing")  
[![set-m17n-env (2)](images/1.jpg)](http://www.flickr.com/photos/yurenju/114212490/ "Photo Sharing")  
  
接著再到 \[系統\] -> \[偏好設定\] -> \[作業階段\] 中初始啟動程式按下新增，並且鍵入 scim：  
[![session scim](images/2.jpg)](http://www.flickr.com/photos/yurenju/114215171/ "Photo Sharing")  
  
這時候先登出 GNOME, 到登入畫面後，再按下 \[alt\]+\[ctrl\]+\[<-\](倒退鍵)重新啟動 X，再登入就有輸入法啦。其他的輸入法方法也一樣。