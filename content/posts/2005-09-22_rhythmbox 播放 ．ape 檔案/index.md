---
title: rhythmbox 播放 .ape 檔案
date: '2005-09-22'
tags:
  - linux
  - software
categories:
  - tech
---
.ape 是一種稱為 Monkey's Audio Codec 的音訊格式，跟 flac 一樣是無失真壓縮的格式，很多對數位音樂龜毛的使用者或許都聽聞過這兩種音訊格式。  
  
繼前陣子裝了 gstreamer flac plugin 後，今天又遇到了 ape 檔案。rhythmbox 剛開始因為 gstreamer 沒有外掛支援的關係，所以無法播放。所以先用了 kyozi 之間說過可以播放的 beep-media-player (bmp) 嘗試。沒想到 bmp 安裝過後還是得另外安裝 libmac 與 ape plugins。不知道怎樣用了一陣子之後 bmp 跟 xmms 竟然同時掛掉！搞什麼 @\*&$(@#  
  
後來逛逛才發現原來 gstreamer 官方網站就有 [ape plugin](http://gstreamer.freedesktop.org/modules/gst-monkeysaudio.html) 支援這類的檔案格式。查了一下 Gentoo portage 沒有這支外掛，就直接下載源檔編譯即可。  
  
比較需要注意的是 gstreamer plugin 安裝後，還必須執行一次 gst-register，註冊新安裝的外掛。如此一來就可以直接使用 rhythmbox 收聽 ape 格式的音樂囉。