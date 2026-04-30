---
title: ubuntu 下使用 firefly 點陣字
date: '2006-03-19'
tags:
  - linux
  - desktop
categories:
  - tech
---
假設已經有了 ubuntu-tw 的 sources.list 後，使用 apt-cache 指令可以搜尋到 firefly 的字型︰  

>   
> apt-cache search firefly font  
> ttf-arphic-newsung - "AR PL New Sung" Chinese TrueType font by FireFly  
> ttf-arphic-uming - "AR PL ShanHeiSun Uni" Chinese Unicode TrueType font Mingti style  

  
  
安裝，並且連結到 local.conf 檔案：  

>   
> sudo apt-get install ttf-arphic-newsung  
> cd /etc/fonts  
> sudo ln -s conf.d/ttf-arphic-newsung.conf local.conf  

  
  
接下來有一道要改 fonts.conf 的手續，不過 fonts.conf 裡面有註解，說不應該修改這個檔案，所以我不知道這樣作對不對。在 fonts.conf 裡面，會有大約六個地方會有許多字型的列表。這時，請把 firefly 字型插入適當的位置，通常我會把他放在其他 Luxi 字型開頭的後面  
  
然後登出 GNOME就可以看得到效果啦。