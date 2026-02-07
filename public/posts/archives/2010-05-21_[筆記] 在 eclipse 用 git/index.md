---
title: '[筆記] 在 eclipse 用 git'
date: '2010-05-21'
tags: []
categories:
  - tech
---
我這個人還蠻無聊的。自己是用 vim 開發，不過還是想試試看用 eclipse 設置開發環境。我之前的開發環境是 vim editor 配合指令介面的 git，就這樣。設定開發環境的目標是把整個開發過程都可以在 eclipse 內完成。  
  
首先在你的 git repository 建立一個 .project 檔案，這是 eclipse 的 project, 匯入 project 時會用到  
```
<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
    <name>entegomode</name>
    <comment></comment>
    <projects></projects>
    <buildSpec></buildSpec>
    <natures></natures>
</projectDescription>

```  
\[eclipse\]  
eclipse 裡面可以用 [EGit](http://www.eclipse.org/egit/) 操作 git，EGit 包含了一個用 java implement git 的套件 jgit。不過簡單的說用 egit 就是了。在 eclipse 的 \[help\] → \[Install New Software\], work with 填入 http://download.eclipse.org/egit/updates ，安裝 egit 與 jgit 重新啟動即可。  
  
重新啟動後按 file → import，選擇從 git repository 匯入，接下來的東西你用過 git 就知道該怎麼做了。不過要注意一點，如果你沒建立 .project 檔案時，到最後會沒有 project 可以匯入，切記。  
  
還有一件事也很麻煩，就是 egit/jgit 還不支援 ssh key 。