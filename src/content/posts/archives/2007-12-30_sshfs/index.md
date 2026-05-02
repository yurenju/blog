---
title: sshfs
date: '2007-12-30'
tags:
  - ssh
  - sshfs
categories:
  - tech
---
sshfs (SSH Filesystem) 這個使用方式更妙。可以透過 ssh 的方式掛載特定的目錄。比如說研究室有個伺服器專門放些分享檔案。原本是用 Samba 的方式，當然只要有開 ssh 就可以使用 sshfs，比起 Samba 更方便。安裝 sshfs 後，執行以下指令：  
  

> sshfs -omodules=iconv,from\_code=CP950 yurenju@140.130.120.111:/samba/ samba/

  
  
馬上就可以掛載原本 samba 的目錄，並且透過 CP950 的編碼轉換成 UTF-8。而我們研究室的 檔案伺服器原本只開放給內網使用，不過只要配和 SSH VPN 加上 sshfs，不論到哪個地方，都可以輕易的存取檔案伺服器的資源啦！