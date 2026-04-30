---
title: Wordpress to Blogger
date: '2007-03-24'
tags:
  - wordpress
  - google
  - blogger
  - xmlrpc
  - java
categories:
  - tech
---
[![](images/0.png)](http://2.bp.blogspot.com/_iOO0fC4NKLE/RgUuBhxwrTI/AAAAAAAABD8/BrTrJEgP3sU/s1600-h/Screenshot-JFrame.png)  
朋友最近正為了要從 Wordpress 轉回 Blogger 苦惱。這幾天花了些時間寫轉換程式。這隻程式利用了 Apache 的 [ws-xmlrpc](http://ws.apache.org/xmlrpc/) 函式庫、[Google Data API](http://code.google.com/apis/gdata/index.html) 作成的。不過我實在搞不清楚 MetaWeblog 到底要怎麼讀 Comment，所以不支援 Comment 的轉換，Label 也沒有轉換。不過作為一個了解 XMLRPC 的小作業，感覺還蠻新奇的。  
  
[w2b.zip](http://yurenju.googlepages.com/w2b.zip)  
  
裏面包含了源檔與可執行的 jar 檔，如果你有 Java Runtime 點兩下就可以執行。如果你沒有 Java Runtime，可以到[這裡](http://java.com/zh_TW/)下載。  
  
有問題可以討論討論，不過我也不一定會再繼續修改就是。 :)  
  
注意，我沒有寫任何檢查機制，所以資料要輸入正確。  
  
\[update '07/3/26\]  
突然覺得很蠢，Wordpress 有提供 Export 成 XML 的功能，我幹嘛不拿來用？還傻傻的讀 XMLRPC 的資料。剛開始其實用 SWT 寫使用者介面多愉快阿，中間搞不定 JAR 的事情只好換成 Swing，沒想到了最後我還是學會怎麼搞定 Multi-JAR 的問題了，嘖嘖。