---
title: printf debug 大法？改用 gdb 取代 printf debug 方式
date: '2010-10-12'
tags:
  - gdb
categories:
  - tech
---
這個東西 jserv 在好久以前的演講就提過，不過今天要用又找了一會才找到，筆記與此。  
  
很多時候在 debug 的時候只是要確定程式跑到那段時，大概有很大的機率會加入 printf 到程式碼裡面來進行這樣的 debug 動作。不過使用 printf 每次都要重新編譯源碼實在是有點麻煩，而使用 gdb print 資訊可以在不更動源碼也不會有每次都因為設定中斷點就停下來的問題。  
  
比如說有以下程式：  
```
switch (m\_punct\_mode) {
    case MODE\_DISABLE:
        {
            g\_assert (ch == IBUS\_grave);
            ...
            update ();
        }
        break;
    case MODE\_INIT:
        {
            m\_text.clear ();
            ...
            m\_cursor = 0;
        }
    case MODE\_NORMAL:
        {
            m\_text.insert (m\_cursor, ch);
            ...
            update ();
        }
        break;
    default:
        g\_assert\_not\_reached ();
    }

```  
我們想在程式運行時知道到底跑到那個 switch case, 就可以用 gdb 來 print。其中的原理是利用中斷之後執行一小段 gdb 命令來達成。gdb 有個指令叫做 commands 可以在中斷後自動執行一小段 gdb 指令，所以如果我們使用 command 指令再配合 print 以及 continue 就可以做出類似 printf 的除錯功能。比如說第一個中斷點的設定方式則為：  
  
```
b editor.cc:4
commands
print "MODE\_DISABLE"
continue
end

```  
這樣執行時就可以讓 gdb 印出資訊達到 printf 的效果，但卻不用重新編譯源碼。