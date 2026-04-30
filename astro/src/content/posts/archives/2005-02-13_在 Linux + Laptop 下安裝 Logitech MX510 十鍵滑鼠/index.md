---
title: 在 Linux + Laptop 下安裝 Logitech MX510 十鍵滑鼠
date: '2005-02-13'
tags:
  - linux
categories:
  - tech
---
小紅點 + Logitech MX510, 是天堂的大門，或是地獄的開始？  
  
在我哥的勸敗下，下手買了 Logitech MX510, 若加上滾輪的上下鍵，這支可以說是十鍵的極品滑鼠。不過擔心的事情還是發生啦，他跟我的 Gentoo Linux + ThinkPad X31 似乎不太合，需要調教調教。  
  
在 [linuX-gamers.net](www.linux-gamers.net) 中有篇文章: [Get all mouse buttons working](http://www.linux-gamers.net/modules/wfsection/article.php?articleid=46) 詳細的記載了如何在 Linux 下安裝多自訂鍵滑鼠，但是若在 laptop 上會有些問題，待我娓娓道來…  
  
照著 Get all mouse buttons working 上所敘述的方法去作，在筆記型電腦上會有個問題，因為 xmodmap 僅支援 CorePointer, 而在筆記型電腦上，大部份 CorePointer 都設定為小紅點或者是觸控板，而他們都是五鍵滑鼠，所以 xmodmap 只能偵測到 5 個按鍵，也就是其他多出來按鍵就完全沒有用了。  
  
所以說，當你在 Laptop 上使用 MX510 時，必須要有一個覺悟，也就是要把 MX510 設定為 CorePointer。這代表以後你必須隨時攜帶滑鼠，否則必須手動更改 X 設定，才能正常啟動 X Window。  
  
所以說除了照著上面的步驟作，另外還要修改 xorg.conf, 如下：  
  
```
  
Section "ServerLayout"  
        Identifier     "X.org Configured"  
        Screen      0  "Screen0" 0 0  
        InputDevice    "Mouse1" "CorePointer"  
        InputDevice    "Mouse0" "AlwaysCore"  
        InputDevice    "Keyboard0" "CoreKeyboard"  
EndSection  

```  
  
而我的 .xbindkeysrc 設定如下：  
```
  
"xvkbd -xsendevent -text "\\\[Alt\_L\]\\\[Left\]""  
  m:0x10 + b:6  
"xvkbd -xsendevent -text "\\\[Alt\_L\]\\\[Right\]""  
  m:0x10 + b:7  
"xvkbd -xsendevent -text "\\\[Page\_Up\]""  
  m:0x10 + b:9  
"xvkbd -xsendevent -text "\\\[Page\_Down\]""  
  m:0x10 + b:10  
"xvkbd -xsendevent -text "\\\[Control\_L\]\\\[Page\_Down\]""  
  m:0x10 + b:8  

```  
  
這都是在瀏覽器中使用的功能。  
  
[![mx510](images/0.jpg)](http://www.flickr.com/photos/46509322@N00/4707212/ "Photo Sharing")