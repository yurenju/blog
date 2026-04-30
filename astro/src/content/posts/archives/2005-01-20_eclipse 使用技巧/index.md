---
title: eclipse 使用技巧
date: '2005-01-20'
tags:
  - development
categories:
  - tech
---
以下這些功能都可以在 eclipse 說明的『技巧與訣竅』這個章節找到。eclipse 是可會讓程式設計師變笨，但是又好用到愛不釋手的開發工具 :-)  
  

程式碼輔助
=====

  
當然，程式設計師是懶惰的。當你常鍵入 "JTextField" 這種冗常的物件時，你會希望有程式碼輔助。在 eclipse 底下，你可以先輸入前面幾個字母，如下：  
![先鍵入幾個字母](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e1.png)  
  
接下來按下 \[alt\] + \[/\] 便可以選擇物件：  
![選擇物件](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e2.png)  
  
而當選擇後，你還會發現eclipse幫你把缺少的類別庫幫你引入了：  
![引入缺少的類別庫](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e3.png)  
  
  

快速注解
====

  
注解/取消注解 這檔事在撰寫程式的時候常用到，有個快速鍵幫忙作這件事情是很愉快的。首先選擇要注解的行：  
![選取要注解的行](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e4.png)  
  
按下 \[ctrl\] + \[/\] ：  
![注解！](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e5.png)  
  
而再按一次就可以取消注解。  
  
  

錯誤修正
====

  
eclipse 會即時除錯，而程式有錯誤的地方會顯示紅色底線。該如何修正錯誤呢？按下 \[ctrl\] + \[1\] 就行了。  
  
假設狀況如下：你為一個物件加上 Runnable 介面，當然 eclipse 會警告你必須實作 run method：  
![警告](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e6.png)  
  
這時候你只要按下 \[ctrl\] + \[1\] ，eclipse 就會建議你該作些什麼事，甚至幫你自動完成 :-)  
![建議](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/e7.png)  
  
eclipse 也是個怪物級的程式，光是打開就要吃掉一堆記憶體。但是好用的功能也是相當的多，若在加上 Plugin ，幾乎是一個全能的開發工具。或許有其他程式也作的到，但是，我已經迷上它了 :-)