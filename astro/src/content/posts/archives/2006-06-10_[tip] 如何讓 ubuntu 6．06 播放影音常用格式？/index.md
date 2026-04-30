---
title: '[tip] 如何讓 ubuntu 6.06 播放影音常用格式?'
date: '2006-06-10'
tags:
  - linux
  - software
  - desktop
categories:
  - tech
---
[ubuntu](http://www.ubuntu.com/) 6.06 預設的音樂播放器 [rhythmbox](http://www.gnome.org/projects/rhythmbox/) 無法播放 mp3 格式的音樂，主要是因為 [gstreamer](http://gstreamer.freedesktop.org/) 不支援。如果要讓您的 [gstreamer](http://gstreamer.freedesktop.org/) 支援 mp3 格式，請安裝 gstreamer0.10-plugins-ugly, 若要支援 WMV 等常用影片格式，請安裝 gstreamer0.10-ffmpeg:  
`    sudo aptitude install gstreamer0.10-plugins-ugly gstreamer0.10-ffmpeg    `  
至於 mp3 tag 亂碼問題怎麼解決我就不知道了，因為我的 MP3 音樂都是自己轉的，採 UTF-8 編碼就沒有問題 :P  
  
BTW, 在 Windows 以下使用 iTunes 轉音樂會採用 UTF-8，不過如果用邪惡的 Windows Media Player 轉換在 Linux 底下就會有亂碼。