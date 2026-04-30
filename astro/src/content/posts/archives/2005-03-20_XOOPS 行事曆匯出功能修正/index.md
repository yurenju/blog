---
title: XOOPS 行事曆匯出功能修正
date: '2005-03-20'
tags:
  - linux
categories:
  - tech
---
當我把 evolution 跟其他軟體做整合後，就希望也把研究室的行事曆也給匯出自 evolution。沒想到當我這樣做的時候，卻得到一堆亂碼 :-(  
  
看了一下源碼，原來是 piCal 他把編碼又再轉成一次 UTF-8 ，所以只要把以下的源碼修改過，就可以把 XOOPS 的行事曆匯入到 evolution 囉。  
  
modules/piCal/class/piCal.php:  

> $ical\_data = mb\_convert\_encoding( $ical\_data , "UTF-8" ) ; // 注解這行