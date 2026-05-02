---
title: OSDC.TW 2007
date: '2007-04-19'
tags:
  - open source
  - osdc.tw
  - linux
  - osdc
categories:
  - tech
---
以下的內容，有錯請幫忙指正  
  
今年的 [OSDC.TW](http://osdc.tw/) 去看的場大部分都是自己比較有興趣的領域，不過還是得取捨，像是唐鳳前輩的我就沒有聽到。這次會介紹的演講如下：  

*   Jserv：RT Nanokernel for Embedded Linux
*   clkao: svk: version control without the headaches then pushmi
*   Joseph：Yahoo! UI API  
    
*   hlb：Microformats
*   Hung-ying Tyan：Google Calendar API
*   Mat Lee：Unicode Console InputMethod Framework
*   Lightening talk

*   Jeff
*   zonble
*   jserv
*   miyagawa
*   takahashi
*   ihower
*   Jeff
*   mgdesigner

RT Nanokernel for Embedded Linux  
這場由 jserv 主講的 [RT Nanokernel for Embedded Linux](http://blog.linux.org.tw/%7Ejserv/archives/001897.html) 前面介紹 [OrzLab](http://orzlab.blogspot.com/)，強調要快快樂樂 Programming (XD)，所以創立了OrzLab，希望大家可以利用 Open Source 社群的力量，大家一起來作快樂的 coding。之前我有看過 [Ajax Embedded](http://orzlab.blogspot.com/2007/03/ajaxembedded.html) 的 DEMO 還蠻炫的，它裡面有一套 compiler 可以將 C 語言的 code 編譯成AJAX 的 HTML/Javascript 與後端的 CGI，跟其他動態語言不一樣的地方，就是可以用 gdb 除錯 XD。  
  
OrzLab 工商服務時間結束後，接著花蠻多時間先簡介 Realtime OS 的需求，還有 Linux Kernel 主要不足的部分，聽 jserv 講下來，好像大部分 Linux 都不符合，就算是新的 2.6 kernel 也有很多不足之處。不過挾著 Open Source，完整的 TCP/IP 實作，與大量的驅動程式，使用 Linux 當作 Realtime OS 還是有許多的優勢。這邊附注一下，Linux Driver 方面因為是由許多人貢獻的，所以品質良莠不齊。  
  
介紹了許多解決方案如 PREEMPT\_RT, RTLinux, RTAI, Xenomai 之後 (附注：RTAI 的架構圖超像 Virtualization 架構的)，開始進入 OrzLab 所實作的 Realtime OS。此 OS 主要的特性是建立在 ARM 架構上，並且重寫部分太糟的 Device Driver，提供模擬器與較為寬鬆的 BSD 授權。  
  
svk: version control without the headaches then pushmi  
這是由 [clkao](http://www.clkao.org/) 前輩所演講的 svk。前面先講以往的各種版本控制方式如最原始的 cp/rm，rcs，cvs 到最近的 subversion，版本控制系統還是有許多缺點，而且 CVS 的源碼中竟然有這行，看來怨念真的很深：  
  
[![Screenshot-  ♨ SVK  OSDCTW MMVII  - Mozilla Firefox](images/0.jpg)](http://www.flickr.com/photos/yurenju/463838364/)  
  
svk 最好的地方就是可以支援離線 commit, 離線 diff，倚靠的是在本地有多做一分備份，所以達到這樣的功能。另外最後面還講了 pushmi 這個系統。這是可以在龐大的企業中，將讀取的部分使用本地端作 cache，如此一來若斷線時依然可以進行許多動作，速度上也快很多。  
  
題外話，高嘉良真的很幽默，講到 1980 年的王道版本控制，大家都笑了。  
  
Yahoo! UI API  
這是一個收穫算蠻多的主題，可能是還算自己有真正在接觸的主題吧。YUI 是一個 Ajax Framework，比起 Google Web Toolkits (GWT) 與 ZK 來說，它不需要撰寫別的程式語言，還是原本的 Javascript (話說回來大多的 Framework 不都這樣？)，而且程式碼真的相當乾淨，[Joseph](http://www.josephjiang.com/) 在台上 DEMO 了幾段程式，感覺起來 YUI 把 Javascript 跟 HTML 本體抽離的很乾淨 (或者是說 Joseph 的習慣很好 XD)，程式碼清楚明瞭，功能也很足。我蠻喜歡 YUI 內附的一個 CSS Layout 功能，可以幫忙使用者建立 CSS 多欄式框架，連設計都免了。  
  
直覺的寫法，真的讓人很心動。不過話說回來 Prototype 跟 script.aculo.us 我都還沒看過，有機會應該都作一下功課，瞭解一下各個的優缺點。  
  
Microformats  
hlb 的微格。這場收穫也蠻多的，微格主要的概念就是利用既有的格式，在網站上創造一些可以讓瀏覽器或者是機器可以輕易解讀的格式。如在網站的個人簡介中，採用 hCard 標籤，或者是在行事曆上使用 hCalendar 等，目前 Firefox 已經有可以解讀的外掛，以後有可能瀏覽器就會內建解讀 Microformats 的功能。  
  
Google Data API  
這場我一定要講一下。其實我非常期待這場演講，因為我是個 Google Fans。但是這場的內容真的有些貧乏，感覺讓並沒有得到太多東西，大致上就講一下如何使用 Google Data API。如果可以拿出更有趣的例子，或者用一些比較讓人印象深刻的整合方案會更好。  
  
Unicode Console InputMethod Framework  
Mat! 之前參加過幾次 KaLUG 聚會的 Mat，這次又在台北見面了。Mat 是個親切又熱血的傢伙，這次的主題還是跟以往一樣 - Console 輸入法，但是又更強了！這次可以像一般的輸入法一樣有選字窗、緩衝區等等，幾乎就跟夢想中的 Console 輸入法一樣了 :)  
  
更好的是這次又支援了 OpenVanilla 架構，而且要讓一個 Framebuffer Terminal 支援 UCIMF，僅需要做些微的修改就可以達到，所以目前已經相當完整了。而 Mat 也說自己的下一步，可能會再實作一些 Console 的 Widget，這樣就可以把這些 Widget 拿來做其他的用途，而不僅限制在輸入法上了 :)  
  
[![ucimf_007](images/1.jpg)](http://www.flickr.com/photos/yurenju/464023330/ "Photo Sharing")  
  
Lightening talk  
呃，因為 Lightening Talk 人真的很多，所以我就只提我記得住的，因為實在太多人了…。  
  
zonble 以神速快速講過 Vanilla Journal 這套線上期刊系統，介面做的蠻漂亮的，Zonble 真有一套，程式寫的好，簡報也很搞笑！  
  
jserv 原本要 DEMO 手機上跑 Ajax Embedded，不過 OpenMoko 臨時不聽話，就沒 DEMO 了。不過還是看了一下很神奇的可以使用 gdb 對 Ajax + cgi 的除錯，jserv，這真是太神奇了！  
  
miyagawa 是個日本人，帶了一隻可以用 USB 接上電腦，並且控制方向、彈射的玩具。大概就像 [Elsie 介紹](http://lightstarslin.blogspot.com/2006/01/blog-post_11.html)的那種。miyagawa 用 ThinkPad 筆記型電腦內建的平衡器 (應該是硬碟防震用的) 的感應器，配上 Perl 撰寫控制程式，只要把電腦左右傾斜就可以控制彈射方向，用力搖一下就可以發射。更神奇的是還可以用電腦左右傾斜的方式來控制 Google Maps 的移動喔，題外話，Perl 如何用在網頁上？miyagawa 是用 ActiveX 達成的，講到這個地方，大家都笑了。  
  
takahashi! 大名鼎鼎的高橋征義就是他了。當然不負眾望的，當然是用高橋流簡報法囉。至於 Takahashi 講了什麼，就留給看倌自己看囉。  
  
  
  
最後附注，如果想知道我這兩天怎麼在台北渡過的朋友(無技術內容)，請看 Yuren's 文舖。  

*   [OSDC.TW 2007 Day 1](http://yurenju.blogspot.com/2007/04/osdc.html)
*   [OSDC.TW 2007 Day 2](http://yurenju.blogspot.com/2007/04/osdctw-2007-day-2.html)