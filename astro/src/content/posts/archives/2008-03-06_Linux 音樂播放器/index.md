---
title: Linux 音樂播放器
date: '2008-03-06'
tags:
  - music player
  - linux
categories:
  - tech
---
基本上 Linux 的圖形化介面音樂播放器可以分成兩類，一類是類似 winamp 利用播放清單管理曲目的軟體，有 xmms, bmp, Audacious 等。另外一類是類似 iTunes 有歌手、專輯分類功能的軟體，如 Amarok, Rhythmbox, banshee 等。由於我習慣一次聽整張專輯，所以多選用後者的音樂播放軟體。原本我都採用 GNOME 內建的 Rhythmbox (也就是音樂播放器)。不過我最近的歌曲都是用 wma 格式存放，沒想到 Rhythmbox 並沒有辦法解析 wma 曲目編號，每次都會把順序搞亂，這應該是 Rhythmbox 使用的多媒體引擎 gstreamer 沒辦法解析的問題。  
  
[![Rhythmbox](http://farm4.static.flickr.com/3232/2314139470_7b695fc9ea.jpg)](http://www.flickr.com/photos/yurenju/2314139470/ "Flickr 上 yurenju 的 Rhythmbox")  
  
  
後來我又改用 EeePC 內建的 Amarok，但也有同樣的問題。附帶一提， Amarok 的多媒體引擎用的是 xine。更慘的是 Amarok 分類的時候，會把歌手的姓氏相同的分成一類，這樣的話反而增加我找歌的困難，更何況我聽的音樂也沒多到要用姓氏來分門別類。  
  
[![Amarok](http://farm4.static.flickr.com/3231/2314139548_11c868936f.jpg)](http://www.flickr.com/photos/yurenju/2314139548/ "Flickr 上 yurenju 的 Amarok")  
  
最後我用了 banshee 這套用 C# 寫的音樂播放器。banshee 除了可以正確顯示曲目編號，分類上也比較乾淨。最好的是它的 last.fm 可提供的資訊比 Amarok, Rhythmbox 還要更多。所以就選定這套囉。  
  
[![banshee](http://farm3.static.flickr.com/2012/2314139620_b5a4dd8ed8.jpg)](http://www.flickr.com/photos/yurenju/2314139620/ "Flickr 上 yurenju 的 banshee")