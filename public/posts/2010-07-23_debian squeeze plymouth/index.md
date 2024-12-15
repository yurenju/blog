---
title: debian squeeze plymouth
date: '2010-07-23'
tags:
  - plymouth
  - debian
  - squeeze
categories:
  - tech
---
這兩天裝了兩台 Debian Squeeze 之後，突然發現 plymouth 已經很簡單的可以使用了。如果你正巧用的是 Intel 的顯示晶片，請聽我娓娓道來…（飛踢）  
  
首先裝 plymouth 跟一些 theme：  
```
sudo aptitude install plymouth plymouth-themes-all plymouth-x11

```  
plymouth-x11 我猜測應該是 plymouth 跟 gdm 接合用的一些程序。  
  
裝好之後，請修改 /etc/default/grub，把下面這個參數加入 splash (原本應該是空的)：  
```
GRUB\_CMDLINE\_LINUX="splash"

```  
接著更新 grub 參數：  
```
sudo update-grub

```  
因為預設的佈景主題很遜，建議你用 solar：  
```
sudo plymouth-set-default-theme solar
sidp update-initramfs -u

```  
做完之後重開機就完成了。雖然最後噴了一些錯誤訊息出來