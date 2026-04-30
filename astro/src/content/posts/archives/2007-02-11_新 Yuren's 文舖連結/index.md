---
title: 新 Yuren's 文舖連結
date: '2007-02-11'
tags:
  - css
  - web design
  - html
categories:
  - tech
---
最近在 Yuren's 文舖做了一個新連結，長這樣：  
[![yuren blog screenshot](images/0.gif)](http://www.flickr.com/photos/yurenju/385270768/ "Photo Sharing")  
細心的朋友應該有注意到 HTML Code 長這樣：  
[![Yuren's 文舖的 HTML code](images/1.gif)](http://www.flickr.com/photos/yurenju/386356659/ "Photo Sharing")  
通常如果這樣的 HTML 結構應該會做出下面這樣的結果：  

*   [留言板](https://www2.blogger.com/comment.g?blogID=6487608&postID=1453298338395039651)
*   [我的書櫃](http://www.anobii.com/people/yurenju/)
*   [Picasa 相簿](http://picasaweb.google.com/yurenju)
*   [Yuren's Info Area](http://yurinfore.blogspot.com/)

但是利用一點 CSS 的小技巧，可以把文字替換成圖。這個用法是我在 [Mono](http://www.mono-project.com/Main_Page) 的網站上看到的，我發現他右上角的連結很妙，所以就拿來用。步驟大概是這樣：  

1.  把 ul li 的 list-stlye 改成 none
2.  把 a 的 display 設定成 block  
    
3.  讓文字跑到最左邊去：text-indent: -1000em;
4.  接著連結移到上面去的變化是用 a:hover 加上 border 做的

詳細的 CSS Code 就這樣：  
[![css-code](images/2.gif)](http://www.flickr.com/photos/yurenju/386361353/ "Photo Sharing")  
大致就是這樣囉。