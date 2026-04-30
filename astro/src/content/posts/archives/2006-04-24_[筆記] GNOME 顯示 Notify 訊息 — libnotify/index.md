---
title: '[筆記] GNOME 顯示 Notify 訊息 — libnotify'
date: '2006-04-24'
tags:
  - software
  - development
categories:
  - tech
---
[![libnotify.png](images/0.png)](http://www.flickr.com/photos/yurenju/134059341/ "Photo Sharing")  
  
最近為了想做出跟 rhythmbox 一樣的 notify 訊息，研究了一下 code。後來發現只要使用 [libnotify](http://galago.sf.net/) 這個函式庫就可以做出這樣的效果。  
  
源碼也很短，就下面這些：  
```
**#include<libnotify/notify.h>**  
**#include<gdk-pixbuf/gdk-pixbuf.h>**  
  
int **main**() {  
	NotifyNotification \*not;  
	GdkPixbuf \*pixbuf;  
	_//GdkPixbufLoader \*loader;_  
  
	**notify\_init**('test');  
	_//loader = gdk\_pixbuf\_loader\_new\_with\_type('png', NULL);_  
	_//gdk\_pixbuf\_loader\_write(loader, 'icon.png'_  
	pixbuf \= **gdk\_pixbuf\_new\_from\_file**('logo.png', NULL);  
	not \= **notify\_notification\_new**('測試訊息', '這是一個測試訊息', NULL, NULL);  
	**notify\_notification\_set\_timeout**(not, 10000);  
	**notify\_notification\_set\_icon\_from\_pixbuf**(not, pixbuf);  
	**notify\_notification\_set\_hint\_int32** (not, 'x', 1000);  
	**notify\_notification\_set\_hint\_int32** (not, 'y', 50);  
	**notify\_notification\_show**(not, NULL);  
  
	**return** 0;  
}  

```  
  
  
  
相當的簡單。不過花了我好多天的時間 trace, 功力真是不足 :(