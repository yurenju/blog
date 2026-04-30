---
title: Open Street Map 擷取 gps 軌跡
date: '2009-01-17'
tags:
  - openstreetmap
categories:
  - tech
---
當你回到家後，你應該會帶著紀錄了軌跡的 GPS logger 跟一堆路牌的相片回來。那第一件事情就是先把軌跡存到電腦裡面。首先你要安裝 mtkbabel，這套軟體在 Debian, Ubuntu 底下都有，只要打 apt-get install mtkbabel 即可。  
  
這時請把你的 m-241 用 usb 連接電腦，下達以下指令：  

> mtkbabel -s 38400 -f \`date +'%F-%H%M%S'\` -t -w

  
另外我建議如果你的電腦有藍牙接收器，請先把他關閉。這時候你就會拿到三個檔案 <日期>\_trk.gpx 跟其他一些檔案。這樣你就有 gps 軌跡檔了！