---
title: Fedora 16 下換 GNOME3 Theme
date: '2012-01-21'
tags:
  - gnome3
  - fedora
categories:
  - tech
---
一時無聊看到 [ICS GNOME3](http://tiheum.deviantart.com/art/Gnome-Shell-Ice-Crean-Sandwich-280076980) 的 Theme 覺得很有趣想換一下，沒想到還有點麻煩。主要在於 Fedora 上面的 GNOME3 Theme Selector extension 有相容性問題沒辦法安裝。  
  
解決的方法是只安裝 GNOME3 User Theme extension，然後再用 command line 修改 theme。  
  

1.  下載 GNOME3 的 Theme，並且放到 .themes 裡面，如果沒這個目錄就創建一個
2.  安裝 user theme extension:  
    \# yum install gnome-shell-extension-user-theme.noarch
3.  重開 gnome-shell，按下 alt + F2 輸入 r 按 enter
4.  使用指令指定要使用的 theme:  
    $ gsettings set org.gnome.shell.extensions.user-theme name "Ice Cream Sandwich"

  

這樣就可以切換到所指定的 theme 了。

  

[![](images/0.png)](http://2.bp.blogspot.com/-LslnZCfSZMI/TxqBU-dO_8I/AAAAAAAAMZY/_q-rIR1FfqM/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2588%25AA%25E5%259C%2596%25E5%25AD%2598%25E7%2582%25BA+2012-01-21+17%253A00%253A47.png)

  

這樣跟我的手機剛好搭成一套 :)

[![](images/1.png)](http://4.bp.blogspot.com/-eb4ygT4OC5o/TxqCRnqaYZI/AAAAAAAAMZg/TUpY-jzwWYc/s1600/Screenshot_2012-01-21-17-03-07.png)