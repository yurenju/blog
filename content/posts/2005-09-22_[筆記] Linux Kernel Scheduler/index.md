---
title: '[筆記] Linux Kernel Scheduler'
date: '2005-09-22'
tags:
  - linux
categories:
  - tech
---
**閱讀：**  

  
*   [Linux Kernel 2.4 Internals](http://www.moses.uklinux.net/patches/lki.html)
  
*   Linux 驅動程式, 2nd
  
*   [博碩士論文etd-1012101-091101 詳細資訊](http://etd.lib.nsysu.edu.tw/ETD-db/ETD-search-c/view_etd?URN=etd-1012101-091101)
  
*   [Kernel : likely/unlikely macros](http://kerneltrap.org/node/4705)
  

  
  
**atomic operation**  
核心提供了一組可執行連動運算(atomic operaion)的函式，也就是說，整個運算程序是一氣呵成，不會被中斷的。(reference from Linux 驅動程式)  
  
  
**likely/unlikely**  
在 Kernel 中用來優化分支指令的巨集 (Macro)。考慮以下程式碼：  
`    if( likely(blah) ) {   blah blah blah...   }   else {   blah blah blah...   }    `  
此段程式碼代表 if 區段比較有可能發生，所以在轉換成組合語言時就會針對 if 條件最佳化。詳情請見 [Kernel : likely/unlikely macros](http://kerneltrap.org/node/4705)  
  
  
果然核心是很難懂的 = =  
不過至少有往前一點了。今天主要看的部份是書上提到的 Schedulers，也就是 Linux 核心中的 kernel/sched.c 這部份。而目前我能把理論對應的實作的部分還很少，不過至少在 run queue, context switch 多少知道怎麼處理了。不過看了之後大致上有快要摸到邊的感覺，或許還會把閱讀核心的時間再增多一點吧 :)  
  
不過瀏覽過主要的排程函式 schedule()，卻都沒有看到恐龍書上提到的 long-term scheduler, short-term scheduler 跟 medium-term scheduler, 不知道這些程式碼藏在哪裡呢...再找時間多看看吧。