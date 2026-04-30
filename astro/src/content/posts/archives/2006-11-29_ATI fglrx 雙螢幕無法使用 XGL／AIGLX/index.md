---
title: ATI fglrx 雙螢幕無法使用 XGL/AIGLX
date: '2006-11-29'
tags:
  - ati
  - open source
  - ubuntu
  - dual-monitor
  - linux
  - desktop
  - Xserver
categories:
  - tech
---
這真的是很慘的一件事情。前幾天很開心的用 aticonfig 無痛設定好了雙螢幕。但是接下來又發現一件很無奈的事情。  
  
我花了一個晚上企圖想搞定使用專屬的驅動程式 fglrx 來跑 XGL 或者是 AIGLX 其中一項。先試試 XGL。照著設定跑過了一次，每次要進去 XGL 的 Xserver 時就 crash，又跳回登入畫面，什麼鬼…，後來在 [Unofficial ATI Linux Driver wiki](http://wiki.cchtml.com/index.php/Main_Page) 上面看到 fglrx 運作在 XGL 上幾個[問題](http://wiki.cchtml.com/index.php/Xgl)，其中一個就是目前最高解析度支援到 2048x1024，所以不能用雙螢幕…。  
  
好吧！那我就用 AIGLX 囉，沒差，反正可以跑就好。好不容易終於可以啟動 beryl 了，但是 window manager 還是一直 crash，接著切換回 metacity。這…又是怎麼回事…。後來用終端機直接執行 beryl-manager，上面寫說我的 composite extension 沒開。  
  
呃，但是 fglrx 正巧也[不支援](http://wiki.cchtml.com/index.php/Frequently_Asked_Questions#Troubleshooting) composite extension 阿 XD  
  
所以很衰的，我沒辦法在 fglrx 下跑 3D desktop。其實換成 Open Source 的驅動程式應該是可以正常的驅動的。但是我很懶阿…aticonfig 這麼好用的工具，用 Open Source 的 radeon driver 就沒這個福氣使用了。  
  
所以等到哪天我真的很閒了，再來換成 Open Source 的驅動程式。  
  
PS. Ubuntu forums 上我之前有看到篇提到 [XGL + 雙螢幕 + fglrx 設定](http://ubuntuforums.org/showthread.php?t=256965)，不過那個人也是失敗了，正在問問題，不過晚些我還是會上去搜搜看有沒有什麼 solution 可以用，謝謝 [Muser](http://www.blogger.com/profile/04452808714445883121) 的提醒囉。 :-)  
  
延伸閱讀： [在 Linux 中你該選擇哪個3D桌面視窗管理員？](http://metamuse.blogspot.com/2006/11/linux-3d.html)