---
title: '[Tip] Linux 底下的 J2SE 1.5 如何解決中文字形問題'
date: '2005-09-07'
tags:
  - linux
  - development
categories:
  - tech
---
這個方法是從 [GOT 星球](http://planet.gentoo.org.tw/) 中的某篇文章得知，但是忘記是哪篇了，如果有那位朋友知道的請提醒一下，他參考的文章則是[飞天的梦想 » Debian下Java 1.5中文字体配置](http://hiei.yeax.com/?p=48)。  
  
方法很簡單，只要在 jre/lib/fonts 裏面新增一個目錄 fallback，再把中文字形複製或是建立連結即可。以下是 Gentoo 環境，並且採用螢火飛新宋體的步驟：  

>   
> \# cd /opt/sun-jdk-**1.5.0.04**/jre/lib/fonts  
> \# mkdir fallback  
> \# cd fallback  
> \# ln -s **/usr/share/fonts/fireflysung/fireflysung.ttf**  

  
如果 J2SE 1.5 的版本不同，或是要使用不同字形，把粗體字的部份更改即可。