---
title: Ubuntu 9.10 變更 acpi hotkey 存取方式
date: '2009-08-14'
tags:
  - ubuntu 9.10
  - hotkey
  - acpi
categories:
  - tech
---
今天在研究 Ubuntu 9.10 時，發現了 Ubuntu 9.10 對 acpi hotkey 存取的部份使用不同的方式存取。  
  
[![Screenshot-Hotkeys-Architecture - Ubuntu Wiki - Google 瀏覽器](images/0.png)](http://www.flickr.com/photos/yurenju/3818692833/ "Flickr 上 yurenju 的 Screenshot-Hotkeys-Architecture - Ubuntu Wiki - Google 瀏覽器")  
  
這樣的架構看起來，以後掛上 hal-addon-acpi 後就可以直接從 hal 獲得 acpi hotkey 的訊息，而不需要像以前一樣存取 /proc/acpi/event 或 acpid 的 socket。另外我想 9.10 之後就會改用 DeviceKit 取代原本的 hal 吧？  
  
參考資料：  
  

*   https://wiki.ubuntu.com/HotkeyArchitectureSpec
*   https://wiki.ubuntu.com/Hotkeys/Architecture
*   ["HAL is dead, long live DeviceKit"](http://ubuntuforums.org/showthread.php?t=786191)