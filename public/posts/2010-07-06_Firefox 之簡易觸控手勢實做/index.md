---
title: Firefox 之簡易觸控手勢實做
date: '2010-07-06'
tags:
  - xul
  - javascript
  - gesture
categories:
  - tech
---
其實我不知道 Firefox 有沒有觸控手勢。不過寫了一陣子的延伸套件，依我看到的資料來說應該是還沒有。在 framework 還沒支援觸控手勢時，我們可以先用簡單的方式實做。觸控手勢跟一般滑鼠手勢不同，觸控沒有『右鍵』可以使用。所以就我的狀況而言，我需要使用拖曳的方式來實做。  
  
比如說我有個 richlistbox 上的 item 要作往右滑的觸控手勢，首先在 XUL 加上 Drag & Drop 的事件  
  
```
<richlistbox id="testList" 
                ondragstart="gesture.onDragStart (event);"
                ondragend="gesture.onDragEnd(event);">
    ...
    </richlistbox>

```  
接下來在 javascript 中簡單計算時間跟滑動距離來決定要不要觸發 gesture。  
  
```
var gesture = {
    gestureStartX: 0,
    gestureEndX: 0,
    gestureTimeStart: 0,
    gestureTimeEnd: 0,

    onDragStart: function (event) {
        event.dataTransfer.setData("text/plain", "Drag Gesture");
        gesture.gestureStartX = event.screenX;
        gesture.gestureTimeStart = (new Date()).getTime();
    },

    onDragEnd: function (event) {
        gesture.gestureEndX = event.screenX;
        gesture.gestureTimeEnd = (new Date()).getTime();
        let offsetX = gesture.gestureEndX - gesture.gestureStartX;
        let offsetTime = gesture.gestureTimeEnd - gesture.gestureTimeStart;

        if (offsetX < 500 && offsetX > 0 && offsetTime < 1000) {
            Application.console.log ("X offset: " + offsetX);
            Application.console.log ("time offset: " + offsetTime);
            Application.console.log ("Do gesture.");
        }
    },
};


```  
不過這跟 firefox 延伸套件的滑鼠手勢差距還很大，比較好的解法是 Firefox (或是說 Fennec/Firefox Mobile) 要提供觸控手勢 framework。