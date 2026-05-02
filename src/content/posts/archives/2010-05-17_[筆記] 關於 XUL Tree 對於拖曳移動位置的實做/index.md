---
title: '[筆記] 關於 XUL Tree 對於拖曳移動位置的實做'
date: '2010-05-17'
tags: []
categories:
  - tech
---
最近一直在看 XUL 裡面關於 Tree 拖曳的實做。不論哪種 UI framework 裡面的 Tree 都還真的挺複雜的。  
  
以下是自己實做 TreeView 需要 implement 的 method:  
[http://doxygen.db48x.net/mozilla-full/html/d1/dbc/interfacensITreeView.html](http://doxygen.db48x.net/mozilla-full/html/d1/dbc/interfacensITreeView.html)  
  
其中 canDrop () 跟 drop () 的參數 orientation 可以拿來判斷現在 drag 的 item 到底是在 target item 的正上方 (DROP\_ON), 前面或後面 (DROP\_BEFORE/DROP\_AFTER)。所以如果你正巧要實做把 item 移動到資料夾，又需要實做 ordering item 時，就可以利用 orientation 來判斷要執行這兩種動作的那一種。  
  
以下的程式就可以拿來印出 drag 的狀況：  
  
```
\_printDrop: function (aRow, aOrientation) {
    let targetFolder = mytreeview.\_map\[aRow\].\_folder;
    let aDropText = null;
    if (aOrientation == -1) 
        aDropText = "DROP\_BEFORE";
    else if (aOrientation == 0)
        aDropText = "DROP\_ON";
    else
        aDropText = "DROP\_AFTER"
    Application.console.log (aDropText + ": " + targetFolder.name);
  },

```