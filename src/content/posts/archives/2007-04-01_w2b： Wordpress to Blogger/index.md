---
title: 'w2b: Wordpress to Blogger'
date: '2007-04-01'
tags:
  - wordpress
  - google
  - blogger
  - blog
  - java
categories:
  - tech
---
這一個禮拜花了些時間寫這套 blog 轉換程式，可以使用 Wordpress 匯出的 XML 備份檔轉換到 Blogger 系統，包括文章、迴響，但媒體檔案如圖片、影片、音樂檔則無法轉換。  
  
本程式採用 Apache 2.0 授權。執行前必須安裝 Java Runtime，如果您沒有 Java runtime 可以至 [Java.com](http://java.com/zh_TW/) 下載安裝。目前僅能在 Windows 下執行，不過只要有 SWT 的原生函式庫就可以在其他平台下執行。  
  
首先在您的 Wordpress 系統管理介面的 Manage → Export 點選 Download Export File。  
  
至 [w2b 專案首頁](http://code.google.com/p/w2b/) 下載，解壓縮後，直接滑鼠雙擊 w2b.jar，或者是使用命令提示字元在解壓縮的目錄中執行 java -jar w2b.jar 。  
  
[![Screenshot-w2b](images/0.png)](http://www.flickr.com/photos/yurenju/441659204/ "Photo Sharing")  
  
第一欄選擇剛剛匯出的 Wordpress 備份檔，第二欄填寫你 Blogger 的 blog 網址，記得最後面要有斜線 /，後面兩欄填寫 Blogger 的帳號密碼，別忘了 帳號是 xxx@gmail.com 而非 xxx。接著按下 Import 就會開始匯入了。下面那個 Progress bar 跟進度有點詭異，雖然匯入成功但是下面的狀態常常會漏掉很多筆。還有 Delete All 按鈕會『儘可能』的幫你刪除 Blogger 上的文章，但是也不會全刪。還有一件非常重要的事情，不要常常轉了又刪，不然後台系統會沒辦法用，大概是把我識別成機器人吧？ XD  
  
這個程式 Bug 非常多，我或許會繼續修改，或許不會，看心情吧 :)