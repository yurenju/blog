---
title: Ubuntu 7.10 的切換螢幕程式
date: '2007-10-17'
tags:
  - ubuntu
  - python
categories:
  - tech
---
不知道是我太蠢還是怎樣，Ubuntu 7.10 新的螢幕與顯示卡工具真的很難用。在筆記型電腦上我只是需要切換要不要用外接螢幕而已，以前在 Ubuntu 7.04 直接插上去不用切換就會自動偵測到，但換到 7.10 後就沒辦法了。  
  
所以我就自己寫了個簡單切換螢幕程式的小軟體。  
  
而前幾天介紹的 xrandr 是 Xorg 新版才有的工具，可以用來偵測現在有幾個螢幕可用。其實使用指令就可以很輕易的切換螢幕，但身為一個 Ubuntu 使用者，我還是想動動滑鼠就可以解決問題，所以就搭配 zenity 寫了一個 [switch\_monitor.py](http://people.linux.org.tw/%7Eyurenju/switch_monitor.py)。  
  
程式碼很少，使用也很簡單。  
  
[![](images/0.png)](http://4.bp.blogspot.com/_iOO0fC4NKLE/RxYWKLPj09I/AAAAAAAACpY/o3GeA4LJKKI/s1600-h/Screenshot-%E5%88%87%E6%8F%9B%E9%A1%AF%E7%A4%BA%E5%99%A8.png)選第一個就是 LCD, 第二個就是兩邊都開啟。有興趣可以看一下源碼，主要的程式碼只有六行 XD