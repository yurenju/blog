---
title: lazybuntu 在 ubuntu 8.04 無法正常運作的暫時解法
date: '2008-04-05'
tags:
  - ubuntu
  - lazybuntu
categories:
  - tech
---
目前 lazybuntu 在 ubuntu 8.04 下有些功能無法正常運作。導致這個問題的原因在於 8.04 中 sudo 會將所有環境變數重新設定，而原本可以利用 gksudo --preverv-env 來保持環境變數的方法，目前起不了作用，已經回報臭蟲。而暫時的解決方法則是用以下指令編輯 /etc/sudoers:  

> sudo visudo

並且在 reset\_env 的前面加上冒號，變成：  

> Defaults !env\_reset

可暫時解決這個問題。不過如果臭蟲一直沒被修復，就得找些方法來繞過這個問題。