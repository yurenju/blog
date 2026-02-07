---
title: '[tip] 解決 C# 連結 PostgreSQL 的中文問題'
date: '2005-11-28'
tags:
  - MS Windows
categories:
  - tech
---
在 PostgreSQL 選擇 UTF-8 之後，透過 npgsql 這個 .NET Data Provider 依然無法正確的顯示中文。這時後只要在連線參數中加上 Encoding=UNICODE 就可以解決。  
  

> NpgsqlConnection conn = new NpgsqlConnection("Server=localhost;Port=5432;**Encoding=UNICODE**");