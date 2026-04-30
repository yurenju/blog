---
title: '[筆記] 使用 sed 轉換 HTML tag'
date: '2010-05-21'
tags: []
categories:
  - tech
---
貼 blog 時常用到 html/xml tag 的時候，直接貼上去 blogger 都會很聰明的當成你要使用 html tag。有個轉換小工具可以處理這件事情總是好的。  
  
源自 [http://www.html-tags-guide.com/html-xmp-tag.html](http://www.html-tags-guide.com/html-xmp-tag.html)  
  
建立檔案 convert.sed:  
```
s/&/\\&amp;/g
s/"/\\&quot;/g
s/</\\&lt;/g
s/>/\\&gt;/g

```  
使用以下指令來轉換你的 XML/HTML  
```
sed -f convert.sed <your-xml-file>

```