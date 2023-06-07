---
title: '[筆記] PostgreSQL 的 UNION 用法'
date: '2006-04-29'
tags:
  - development
categories:
  - tech
---
**情境**  
有兩個不同的表格，分別存放不同的交易資料，其中包含交易日期以及客戶編號  
  
**問題**  
欲取出兩個資料表中的交易日期，並且同時顯示在一個 column 中，並且交易日期不可重複、最新的日期排在前面、僅輸出十筆資料，並且只取其中一個客戶的資料。  
  
**語法**  
`SELECT DISTINCT t1."pubDate" FROM public."Table1" AS t1 WHERE t1.custId = {0} UNION (SELECT t2."pubDate" FROM public."Table2" AS t2 WHERE t2.custId = {0} ) ORDER BY "pubDate" LIMIT 10`  
  
**備註**  
用 PostgreSQL 的欄位名稱最好不要用大小寫如 CustId, 而應該採用 cust\_id 這種方式。否則使用大小寫的欄位名稱時，都必須加註雙引號。