---
title: '[Windows] 讓小紅點(TrackPoint)可以在 OpenOffice 上使用'
date: '2006-03-24'
tags:
  - MS Windows
  - software
  - desktop
categories:
  - tech
---
原文： [Laptop Touchpad and OpenOffice.org...](http://www.oooforum.org/forum/viewtopic.phtml?t=4912)  
  
編輯 C:\\WINDOWS\\system32\\tp4table.dat 檔案，在  

> ; Pass 1 rules (These rules run last)

  
這行前面加上：  

>   
> \*,\*,soffice.bin,\*,\*,\*,WheelStd,0,9  

  
  
重新登入，就可以了。