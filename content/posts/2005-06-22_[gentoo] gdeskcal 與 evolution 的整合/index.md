---
title: '[gentoo] gdeskcal 與 evolution 的整合'
date: '2005-06-22'
tags:
  - linux
  - software
  - desktop
categories:
  - tech
---
其實我一直都很想有個在桌面上的 Evolution 行事曆，原本的 gnome-panel 中的 clock applet 原本就已經支援 evolution，不過因為視窗太小，導致行事曆上的事情都會被截斷，就像這樣：  
![gnome-panel 日曆](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/Screenshot_007.png)  
  
後來找到 gdeskcal 後，明明就有安裝 evolution，但是 gdeskcal 硬是認不出 evolution。看了一下 code，原來是 gdeskcal 把 evolution 的行事曆檔案位置搞錯了，修改一下便可以了。  
  
修改 /usr/share/gdeskcal/code/values.py，把  

> EVOLUTION\_CALENDAR = ""

  
改成  

> EVOLUTION\_CALENDAR = "~/.evolution/calendar/local/system/calendar.ics"

  
就可以了。  
  
[![gdeskcal](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/gdeskcal.thumb.png)](http://wshlab2.ee.kuas.edu.tw/~yurenju/gallery/screenshot/gdeskcal)