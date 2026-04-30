---
title: GNOME 2.8 使用心得
date: '2004-10-14'
tags:
  - linux
categories:
  - tech
---
咳…我原本還信誓旦旦的說不會寫 GNOME 2.8 的使用心得。  
  
但今天在 [Gnome jounal: Looking at GNOME 2.8](http://gnomejournal.org/gnome28_review.php) 後，我改變主意，決定還是要來寫一點 GNOME 2.8 比較大的改變。  
  

GNOME System Tools
------------------

  
因為自己已經用 GNOME System Tools (以下簡稱GST) 很久了，所以剛開始使用 GNOME 2.8 的時候並沒有注意到這個功能。GST 讓使用者可以透過友善的圖形化介面設定你的系統。當然各家的 Linux Distro. 都有工具可以設定，但是 GST 方便的地方在於它整合了各家 Linux Distro. ，所以只要使用 GST ，不管在任何 Linux 底下你要設定開機所要開啟的服務、調整時間日期、設定使用者與群組、開機程式管理…等方式都統一，這樣就不會因為不同的 Linux 導致操作環境不熟的問題。  
  
延伸連結：[GNOME System Tools Website](http://www.gnome.org/projects/gst/index.html)  
  

GPdf
----

  
GPdf 又有什麼新改變呢？在今天以前，我覺得 GPdf 實在是有夠難用，我使用 GPdf 的經驗非常的差，因為他有時候連開英文的 pdf 檔案都會有問題，所以我已經一陣子沒有用他了。但這次閱讀完 Gnome journal 又試用了一下 GPdf 。沒想到…我手邊的 pdf 都可以正常的開啟了，就連我自己用 StarSuite 製作的中文 PDF 檔案都沒有問題。  
  
但是遇到使用新細明體製作的 PDF 狀況就有點糟，字型破碎的問題仍然沒有解決。可喜可賀的是我又發現了 [這篇文章](http://linux.hiweed.com/node/790) 中似乎提到有一個 hiweed Distro. 解決的中文的問題，雖然說還沒時間去看，不過應該也是可以解決繁體中文(還是新細明體)的問題。  
  
BTW. 我覺得 xpdf 跟 Acrobat Reader Linux version 都沒有 GPdf 來的方便，只是 GPdf 太年輕，有些問題還沒有解決就是了。  
  

GNOME Volume Properties
-----------------------

  
這才是最重要的呀…。  
  
GNOME Volume Properties 是一支可以讓你管理可攜式儲存媒體的小程式，根據上面的說明，你可以讓隨身碟聯接到電腦後，它就會直接使用 Nautilus 開啟，就跟 Windows 一樣 ;-)  
  
但是，我沒弄出來 :)  
在 Gentoo 下他是被 Mask 起來的，安裝好後雖然程式都正常的執行，但是卻沒有作用。不過這個連 release note 都沒提到的功能，或許可用性方面還是有待改進的。另外，使用這套軟體必須要有 freedesktop.org 所開發的 dbus 跟 hal 軟體，並且gnome-vfs 在編譯時必須要開啟 hal 支援。  
  
如果那位朋友在 Gentoo 下搞出來了，可別忘了通知我一聲，指教一下哪裡需要注意的。  
  
![gnome-volume-properties](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/Screenshot_Drives_and_Media_Preferences.png)