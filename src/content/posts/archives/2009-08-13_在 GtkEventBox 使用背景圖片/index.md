---
title: 在 GtkEventBox 使用背景圖片
date: '2009-08-13'
tags:
  - gtk
categories:
  - tech
---
沒想到在網頁程式裏面這麼簡單的事情，在 GTK 上弄還真麻煩 :P  
  
如果想在 GTK 的元件中使用自己的背景圖時，主要的方法有兩種  

1.  用 expose\_event 繪製
2.  至換元件的 style

我自己使用第一個方法時有點詭異，如果在 Container 加入其他元件時，這些子元件都無法正確顯示。所以就用了第2種方法。

  
  
參考資料  

*   [Sample Code 426: How to place a background image in GtkEventBox - Part 4 - tiled background image with transparencies?](http://www.kksou.com/php-gtk2/articles/place-a-background-image-in-GtkEventBox---Part-4---tiled-background-image-with-transparencies.php)  
    
*   [Sample Code 423: How to place a background image in GtkEventBox - Part 1 - tiled background image?](http://www.kksou.com/php-gtk2/articles/place-a-background-image-in-GtkEventBox---Part-1---tiled-background-image.php)  
    

參考資料都是用 PHP，我是參考他的方法用 C 重新實現