---
title: vim 一次註解多行
date: '2010-07-14'
tags:
  - vim
categories:
  - tech
---
eclipse 有個蠻不錯的功能，就是框選多行之後，按下 ctrl + / 就可以註解所選的行。那 vim 呢？找了一下，[看到](http://hurley.wordpress.com/2007/06/13/vim-tip-comment-out-multiple-lines/)有類似的功能。  
  
首先按下 ctrl + v 區塊選取，選取你要標注最前面的一個字元。比如說  
  
```
var width = aWin.document.documentElement.scrollWidth;
var height = aWin.document.documentElement.scrollHeight;
if (effect.viewCanvas == null)
   effect.viewCanvas = this.createCanvas (width, height);

```  
就選取 v, v, i 和空白。按下大寫 I，輸入你正在寫得程式語言的註解，javascript 就是 //。最後按下 Esc 就完成了。  
  
不過如果要像 eclipse 按一次 ctrl + / 就註解，再按一次取消註解就要寫 vim script 了。