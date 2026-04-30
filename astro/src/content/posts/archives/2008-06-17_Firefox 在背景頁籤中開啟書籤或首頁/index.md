---
title: Firefox 在背景頁籤中開啟書籤或首頁
date: '2008-06-17'
tags:
  - tab
  - about:config
  - firefox
categories:
  - tech
---
不知道大家有沒有跟我一樣的問題：我喜歡在背景開啟連結。在網頁中的連結沒問題，只要按下滑鼠中鍵或ctrl+右鍵都可以在背景開啟分頁。  
  
但是書籤或是首頁按鈕就是沒辦法這樣做，Firefox 還是會開分頁後跳到那個分頁去。  
  
昨天我無聊在 about:config 裏面搜尋 tab，沒想到就看到了這個設定值：browser.tabs.loadBookmarksInBackground。只要把他改成 True 之後就可以在背景開啟書籤或首頁了。