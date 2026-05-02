---
title: vim + google code search!
date: '2008-11-02'
tags:
  - google code search
  - vim
categories:
  - tech
---
感謝 jserv 跟 chihchun 的文章介紹了 vim 跟 devhelp 的結合 \[[1](http://blog.linux.org.tw/%7Ejserv/archives/002055.html), [2](http://people.debian.org.tw/%7Echihchun/2003/07/27/gnome-developers-help-program/)\] 與 [gtk highlight 的方法](http://blog.linux.org.tw/%7Ejserv/archives/002053.html)，後來我又發現一個很好用的東西，也拿出來跟大家分享。  
  
如果常常在 linux 寫程式的朋友一定會遇到函式不知道怎麼使用的情節，這個時候除了翻翻 devhelp 以外，還有一個不錯的方法就是把那個函式丟到 [google code search](http://www.google.com/codesearch) 裡面。通常 google 都會找出一堆範例來讓你參考如何使用此函式。而超好用的 vim 當然也可以直接把 google code search 叫出來用。例如說你不知道 g\_ptr\_array\_foreach 怎麼用，這個時候你只要在 vim 裡把游標放在 g\_ptr\_array\_foreach 上，按下快速鍵就可以直接搜尋 google code search 了。參考 [google-codesearch from vim - Bart's Blog](http://www.jukie.net/%7Ebart/blog/20061007151802)，設定如下：  
  
  
  
配上 taglist, ctags, gtk highlight, google code search, devhelp，vim 真的就無敵了。