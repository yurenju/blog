---
title: '[筆記] android WebView 遇到網頁重導後開新視窗的問題'
date: '2010-09-28'
tags:
  - Android
categories:
  - tech
---
塞個 WebViewClient 給他。  
  
```
WebView web = (WebView)findViewById(R.id.WebPages);
web.setWebViewClient(new WebViewClient());

```  
最近會筆記些零碎的 android 問題。