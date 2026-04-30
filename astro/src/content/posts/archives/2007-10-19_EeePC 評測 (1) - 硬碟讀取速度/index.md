---
title: EeePC 評測 (1) - 硬碟讀取速度
date: '2007-10-19'
tags:
  - eee-pc
categories:
  - tech
---
今天終於拿到 Eee PC 了。我想大家應該都已經看過不少的評測報告，所以這次評測系列會有一些比較不一樣的測試 :-)  
  
首先就是硬碟速度。由於 Eee PC 採用 SSD 硬碟，所以普遍的期待應該是要比一般硬碟快上一些。那實際上呢？我們拿 ThinkPad X31 (40 GB, 2MB cache, 5400 rpm) 以及一臺對照用的桌上型電腦來測試。測試的程式是 hdparm，參數如下：  

> hdparm -t /dev/sda  
> hdparm -T /dev/sda

一個是用來測試硬碟讀取速度，大寫 T 則是測試硬碟快取速度。那這隻程式 hdparm 怎麼來的？當然是 debian etch 直接加上去就可以用了 XDDD  
  
硬碟速度測試圖如下：  
[![hdparm 快取讀取速度](images/0.jpg)](http://www.flickr.com/photos/yurenju/1628376761/ "相片分享")  

*   EeePC 24.66 MB/sec
*   ThinkPad X31 26.79 MB/sec
*   Desktop 70.45 MB/sec

實際上我們要注意的是 EeePC 跟 ThinkPad 比較 (桌電是拿來亂的)。EeePC 稍微比 ThinkPad X31 硬碟速度慢一點。但換句話說，EeePC 與 ThinkPad 的硬碟速度跟 X31 差不多快！  
  
接下來是硬碟快取速度：  
[![hdparm 讀取速度](images/1.jpg)](http://www.flickr.com/photos/yurenju/1628377119/ "相片分享")  

*   EeePC 293.37 MB/sec
*   ThinkPad X31 372.88 MB/sec
*   Desktop 3653.03 MB/sec

在快取項目中也一樣，速度上與 ThinkPad 差不多，至於來亂的桌電我想應該是 8MB 快取的。XD  
  
剩下的會逐項測試 :D