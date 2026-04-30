---
title: ssh vpn 之一發不可收拾
date: '2007-12-29'
tags:
  - ssh
  - tunnel
  - vpn
categories:
  - tech
---
今天在咖啡館心血來潮，想把 ssh vpn tunnel 搞定，無奈不得要領常常搞到 ssh 斷線。後來回到研究室後，終於是把 SSH VPN 搞定了。心滿意足的感到自己在無線網路中終於不受監控，想說來寫的簡單的 VPN GUI 好了。沒事幹嘛把 SSH VPN 搞得這麼複雜…。  
  
那怎麼拿 interface list 勒？回想一下 GNOME 有哪些地方拿到網路列表…想起了無線網路偵測的 nm-applet。後來想說應該看 network-admin，接著發現這是 gnome-system-tools 的工具，再追下去，原來是 call liboobs 這個函式庫。  
  
追到這裡，一天就過了…，浪費了一天都沒幹到正經事，!\*&#^\*&@!^%$…。