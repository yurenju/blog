---
title: 將 eclipse 的主程式與擴充套件分開
date: '2005-05-09'
tags:
  - software
categories:
  - tech
---
eclipse 是一套相當強大的開發軟體，不僅能夠開發 Java 程式語言，還可以利用擴充套件的方式為 eclipse 加上許多附加的功能。諸如設計 Java GUI 的 VE (Visual Editor), 還是使 eclipse 支援 Subversion (aka svn) 的 subclipse。不過在安裝擴充套件時通常是下載壓縮檔後，解壓縮並且直接複製、覆蓋過原本的 eclipse 主程式目錄。  
  
而像 Gentoo 把 eclipse 安裝在 /opt, /usr/lib 這些位置底下，要安裝擴充套件還需 root 權限這時候就很麻煩了。eclipse 提供了另外一個方式，可以將擴充套件放在其他的目錄而不用跟主程式混合放在一起，這樣也可以讓不同的使用者安裝自己所需的擴充套件 :-)  
  
首先先開個新目錄，裡面必須還要再包含 eclipse 目錄，你可以選擇在家目錄，我則喜歡開在 software/eclipse-extensions/  

> $ mkdir ~/software/eclipse-extensions/eclipse

  
  
接下來 eclipse-extensions/eclipse 新增隱藏檔 .eclipseextension  

> $ touch ~/software/eclipse-extensions/eclipse/.eclipseextension

  
  
最後到 elcipse 中的 help » Software Updates » Manage Configure... , 對 eclipse platform 按右鍵，選擇 New » Extension Location... , 選擇剛剛新增的 eclipse-extensions 目錄即可。  
  
下次要裝擴充套件時，直接把套件解壓縮到 eclipse-extensions/eclipse 就可以囉。  
  
PS. 如果你是用線上更新機制，在最後一個步驟的右邊會顯示可安裝的地方，如下圖：  
![eclipse](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/Screenshot_w.sized.png)