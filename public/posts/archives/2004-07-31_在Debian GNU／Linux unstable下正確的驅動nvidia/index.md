---
title: 在Debian GNU/Linux unstable下正確的驅動nvidia
date: '2004-07-31'
tags:
  - linux
categories:
  - tech
---
看來dunst兄已經順利的解決了x-window的問題，不過還是提供一下我的作法：  
  
首先，用uname 確定一下kernel版本  
\# uname -a  
Linux debian 2.4.26-1-k7 #2 Wed Apr 14 19:38:08 EST 2004 i686 GNU/Linux  
  
接下來利用apt搜尋跟自己kernel版本match的nvidia-kernel driver。  
\# apt-cache search nvidia-kernel  
nvidia-glx - NVIDIA binary XFree86 4.x driver  
nvidia-kernel-2.4.26-1-386 - NVIDIA binary kernel module for Linux 2.4.26-1-386  
nvidia-kernel-2.4.26-1-586tsc - NVIDIA binary kernel module for Linux 2.4.26-1-586tsc  
nvidia-kernel-2.4.26-1-686 - NVIDIA binary kernel module for Linux 2.4.26-1-686  
nvidia-kernel-2.4.26-1-686-smp - NVIDIA binary kernel module for Linux 2.4.26-1-686-smp  
nvidia-kernel-2.4.26-1-k6 - NVIDIA binary kernel module for Linux 2.4.26-1-k6  
nvidia-kernel-2.4.26-1-k7 - NVIDIA binary kernel module for Linux 2.4.26-1-k7  
nvidia-kernel-2.4.26-1-k7-smp - NVIDIA binary kernel module for Linux 2.4.26-1-k7-smp  
nvidia-kernel-source - NVIDIA binary kernel module source  
  
看來我們需要的是nvidia-kernel-2.4.26-1-k7這個套件，如果這個清單中沒有跟你kernel match的版本，或許你可以升級一下kernel。在debian下升級kernel是一件輕鬆愉快的事情。  
\# apt-get install nvidia-kernel-2.4.26-1-k7  
  
接下來再安裝nvidia-glx：  
\# apt-get install nvidia-glx  
  
修改 /etc/X11/XF86Config or XF86Config-4 中device這個section，把  
Driver "xxxxx"  
修改成  
Driver "nvidia"  
  
最後，把nvidia這個driver load入系統：  
\# modprobe nvidia  
或許你希望開機時都會自動載入，請修改/etc/modules，把nvidia加入這個檔案。  
另外，我發現了debian unstable提供了/etc/init.d/nvidia這個script，或許是可以初始化nvidia driver，這我沒試過，但是有興趣的人可以try一下。  
  
接下來，啟動X，通常可以看到nvidia的logo，或許你不喜歡看到它，那你也可以把他關掉。  
  
如果正常的話，就請享受你的Linux Desktop environment吧。