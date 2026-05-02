---
title: Ubuntu 的 Mplayer 中文字幕設定
date: '2007-03-10'
tags:
  - ubuntu
  - linux
  - mplayer
categories:
  - tech
---
這個問題不知道談過幾百遍了。不知道什麼時後才可以一打開播放器，中文字幕就可以很正常的運作，所幸現在也很簡單。  
  
用管理者權限編輯以下檔案  

> /etc/mplayer/mplayer.conf

加入以下內容  

> subcp=cp950  
> font=/usr/share/fonts/truetype/arphic/ukai.ttf  
> subfont-text-scale=3

結束。字型可以換成自己想要的字型，雖然已經很方便了，但是真的還是希望一打開就可以看中文字幕阿。