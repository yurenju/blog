---
title: postgresql 備份/還原問題
date: '2008-01-30'
tags:
  - postgresql
categories:
  - tech
---
今天在把 postgresql 7 的資料庫移到 postgresql 8 的時候出現詭異的問題：  

> `value too long for type character varying`

  
這個問題詭異的地方是我之前已經拿一台機器測過，上面跑的也是 postgresql 8，沒出問題，換台機器就有問題，明明都一樣用 debian etch。如果有這種問題的，指定編碼就可以順利通過了，不過會遇到這種問題還蠻奇怪的。  

> createdb -E UNICODE ncyugamedb