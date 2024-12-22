---
title: '[Ubuntu] 更換音效卡'
date: '2007-02-11'
tags:
  - ubuntu
  - hardware
  - linux
  - sound card
categories:
  - tech
---
在以前更換音效卡，大概就是自己去找這張音效卡配哪個驅動程式，把那個驅動程式 modprobe 起來就可以使用了，但是，我想用些相對於初學者比較簡單的方法就可以換的。正巧今天有了一張新音效卡 Creative Labs SB Audigy，就順便找了一下 Ubuntu 要怎麼簡易的更換音效卡驅動程式。  
  
找到了一個解決方案，應該還算可以。  
  
換上新的音效卡以後，使用下面指令搜尋目前可以使用的音效卡：  

> $ sudo asoundconf list

在這邊我的音效卡名稱是 Audigy，接下來，將這張音效卡設定成預設採用的音效卡。  

> $ sudo asoundconf set-default-card Audigy

這樣就好了，還算簡單 :-)