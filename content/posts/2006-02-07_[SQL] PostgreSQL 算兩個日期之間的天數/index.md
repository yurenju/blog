---
title: '[SQL] PostgreSQL 算兩個日期之間的天數'
date: '2006-02-07'
tags:
  - development
categories:
  - tech
---
> Select  
> now()::date - "T"."trnDate"::date  
> From  
> public."Transaction" AS "T"  

  
trnDate 代表的是交易日期，而上面這個語法就可以算出現在(now())跟交易日期總共相差幾天。PostgreSQL 的 interval 型態有點難用，沒想到日期也可以直接利用 ::date 轉換成天數，進而相減得到整數值，就不用透過該死的 interval 啦。  
  
最近都用 PostgreSQL，才了解到 PostgreSQL 的功能還真是完整阿，不像 MySQL 有些功能不太完全。不過如果比較速度還是 MySQL 快 :P