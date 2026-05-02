---
title: Ubuntu 的 Mplayer 中文字幕設定 (new!)
date: '2007-04-23'
tags:
  - font
  - ubuntu
  - subtitle
  - linux
  - mplayer
categories:
  - tech
---
又來了，月經題。升級 Ubuntu 7.04 後發現 mplayer 的字幕又不能動了。這次又發現更簡單的設定方法。首先安裝 mplayer，我個人偏好沒有 GUI 的版本，簡單好用。  

> sudo aptitude install mplayer-nogui

接著編輯設定檔，家目錄底下的 .mplayer/config  

> subcp=cp950 #字型編碼  
> subfont-text-scale=3 #字型縮小一點  
> fontconfig=yes #開啟 fontconfig 支援  
> font='方正黑體'  
> \# 指定你自己想要的字型  
> \# 找系統、偏好設定、字型裏面挑個自己喜歡的字型。  
> \# 我的電腦裡有裝方正黑體

接下來對你要看的檔案按右鍵選擇用其他程式開啟，點選使用自訂指令，鍵入 mplayer。顯示字幕就大功告成囉。  
  
如果有 ssa 字幕不能看，可以用 iconv 轉換成 utf8，大多目前流通的 ssa 字幕都是 utf16。  
  
參考資料：[Ubuntu 正體中文站論壇 - 請問影片字幕的問題](http://www.ubuntu.org.tw/modules/newbb/viewtopic.php?topic_id=2259&forum=10&post_id=8669#forumpost8669)