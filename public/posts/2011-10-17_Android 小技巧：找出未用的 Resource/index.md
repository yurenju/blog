---
title: Android 小技巧：找出未用的 Resource
date: '2011-10-17'
tags:
  - Android
categories:
  - tech
---
記得好像有其他 Android 內建的方法可以哪些 resource 沒有被使用。一時找不到，Google 一下發現另外一套：[Android Resource Tracker](http://code.google.com/p/androidresourcetracker/)。  
  
使用方法也很簡單，在 project 目錄底下執行：  
```
$ java -jar <PATH\_TO\_JAR>/AndroidUnusedResources1.4.jar

```  
接著就會列出未被使用的資源：  
  
```
Running in: /Users/yurenju/git/YOUR\_PROJECT
242 resources found

44 unused resources were found:
array     : upload\_photo\_options
    /Users/yurenju/git/YOUR\_PROJECT/res/values/arrays.xml
...

```