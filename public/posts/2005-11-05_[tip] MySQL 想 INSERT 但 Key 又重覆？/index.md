---
title: '[tip] MySQL 想 INSERT 但 Key 又重覆？'
date: '2005-11-05'
tags:
  - development
categories:
  - tech
---
用 REPLACE 吧。Replace 語法跟 INSERT 用法一模一樣，差異在於遇到相同的 Primary Key 時，Replace 會將新資料直接覆蓋上去 :)