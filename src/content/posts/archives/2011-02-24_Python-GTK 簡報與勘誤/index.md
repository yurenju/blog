---
title: Python-GTK 簡報與勘誤
date: '2011-02-24'
tags:
  - gtk
  - python
categories:
  - tech
---
感謝 Study-Area 與 GNOME Taiwan 的邀請，一月份下旬給了一份 talk，投影片在此。  
  

**[Python-GTK](http://www.slideshare.net/yurenju/python-gtk "Python-GTK")** 

View more [presentations](http://www.slideshare.net/) from [Yuren Ju](http://www.slideshare.net/yurenju)

另外也感謝 [Mosky](http://mosky.tw/) 以及 [Hychen](http://hychen.wuweig.org/) 的指正，部分演講內容作出修改。  
  

*   第 35 頁的奇技淫巧其中的回傳多個變數的能力，實際上內部是透過 tuple 實做，並不是真的可以回傳多個變數。
*   \_\_init\_\_ 並不是建構子，而是物件的初始化 method
*   範例裡面的 gtk-gtr2.py 使用了 except 但卻沒有指定例外種類，這也是不建議的寫法。