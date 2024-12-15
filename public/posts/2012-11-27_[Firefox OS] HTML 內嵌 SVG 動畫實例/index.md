---
title: '[Firefox OS] HTML 內嵌 SVG 動畫實例'
date: '2012-11-27'
tags:
  - SVG
  - Firefox OS
  - gaia
categories:
  - tech
---
前言：這些實作都已經包含在最新的 Firefox OS 裡面，有興趣的可以 check 最新的 code 出來玩。  
  
最近接到了一個需要變更設計的 issue，我看到這個設計愣了一下，主要的原因是因為要做出這樣的設計用 HTML + CSS 還真的需要想一下如何實作。  
  
主要更改的地方是 Firefox OS 的兩個元件：Lockscreen 跟 Dialer。  
  
這兩個元件主要的設計概念都是希望有一條像是橡皮筋（或跳繩）的線上下的跳動，並且在往上跳動的時候露出下面的兩個按鈕，提示使用者可以把這條橡皮筋往上滑，接下來按下按鈕解鎖。我們這邊只討論如何實作，不討論視覺設計 :P  
  
![](images/0.png) ![](images/1.png)  
  
如上圖所示，上面的那條弧線是需要動態的上下彈動，如果用 HTML + CSS 的話有幾種方法可以嘗試做到跟缺點：  

1.  上一個 canvas，然後把這條線在 canvas 上面不斷的重繪（缺點：這樣要不停的計算跟重繪）
2.  用超級多張 png 不停的置換圖檔（缺點：要生出超級多圖）
3.  先畫一張弧線，接著用 CSS 的 Transform 更改他的 scale()（缺點，接近中間的時候整個圖形就會被壓得很扁）

考慮過 HTML + CSS 的解法之後，以上的解法似乎都不太好。這個時候我就開始考慮用 SVG 來做這件事情。但是用 SVG 來做這件事情其實是蠻冒險的，因為在這期間問了幾個同事他們都沒有測試過 SVG 在 Firefox OS 真正的手機上的詳細效能。所以收到這個設計的時候我先寫信問了個對於整個 platform 比較熟的同事，然後因為 deadline 非常的趕，但是我又不能不確定效能狀況就下手，所以就先決定做個獨立可以同時在電腦跟手機都可以驗證的小型 app。  
  
這個 app 要驗證的事情有兩件：  

1.  當用滑鼠（手指）按住拖曳，這個時候改變 SVG 的屬性讓他改變弧度的效能衝擊有多大
2.  使用 SVG animation (SMIL) 效能到底如何

然而做這個 DEMO 幾乎也可以搞清楚要怎麼用 SVG 實作這個解鎖畫面了。在弧線的部分，採用 SVG 的 Path 搭配上 c (curveto) 參數可以達成弧線，動畫的部分則是用 SMIL 的 animate tag 完成。下面這個網頁就是驗證效能用的網頁（我只用過 Firefox 打開過，其他瀏覽器不知道有沒有支援）：  
  
[http://yurenju.github.com/lockscreen-demo/wrapper.html](http://yurenju.github.com/lockscreen-demo/wrapper.html)  
  
這邊只是用來驗證的網頁，所以會有一些小 bug。主要的功能就是往上拉的時候用 javascript 去改變 SVG d (data) 裡面的 c (curveto) 的參數，放開滑鼠的時候用 SMIL animate 把 curve 滑回原位。而下面有個連結 install lockscreen demo 用途是如果你用 Firefox OS 的手機點了這個連結就可以把這個 demo app 安裝到手機裡面。  
  
很棒的是當我把這個 app 安裝到手機裡面，發現這樣實作的效能在手機上是完全可以接受的！既然可以接受那就大膽的把這樣的實作方式引入 Firefox OS。這邊有針對 [lockscreen 的 commit](https://github.com/yurenju/gaia/commit/ec82ff70d9bbd3dc50424422e8be07d393e13415)。  
  
  
在 SVG 方面，首先利用 path tag 來劃出最原始的弧線。在 attribute d (data) 裡面用了兩個參數：M (moveto) 跟 C (curveto)，moveto 用來指定 path 的起點，curveto 用來指定用來控制曲線的兩根桿子的弧度。[SVG 1.1 Path](http://www.w3.org/TR/SVG/paths.html) 裡面有張圖讓 curve 的控制點比較好理解一點：  
  

[![](http://www.w3.org/TR/SVG/images/paths/cubic02.png)](images/2.png)

  
  
C 後面接的兩組 (x, y) 分別是兩個控制點的坐標，我們需要的大概像是最左上角那張圖的效果。attribute 'd' 裡面的最後一個參數則是曲線的終點。整個 attribute 長這樣：  
  
M0,80 C100,150 220,150 320,80  
  
第一個是曲線起始坐標，最後一個是曲線結束坐標，中間兩個則是控制點的坐標。  
  
接下來說明 path 裡面的五個 animate tag。1 跟 3 是針對曲線的彎度變化，而 2 跟 4 則是針對透明度的變化。1-4 都是用於拖曳橡皮筋之後放開的動畫，而 (5) 則是當你不去碰橡皮筋時，他的彈跳提示動畫。請想像這一整組動畫：一條繩子彈上去後隨著重力掉下來，掉到地上之後會再彈跳幾下後靜止。下面講解比較複雜的第五組動畫：  
  
先看到 values。用分號切分開來的話總共有五組數據：  

1.  起始的曲線數據 (Y=150)
2.  第一次彈跳到最高的數據，兩個控制點的 Y 坐標都變少了讓整個圓弧的開口朝下 (Y=40)
3.  回到最地上 (Y=150)
4.  再次彈起來，但是幅度較低 (Y=100)
5.  回到原點 (Y=150)

至於 keySplines 則是指定彈跳的 timing function，如果你用過 CSS animation，就跟 ease-in/out 那種差不多的東西，只是要直接指定數據，下面這張圖是 keySplines 設定 0.5 0 0.5 1 會產生的 timing function：  
  

[![](http://www.w3.org/TR/SVG2/images/animate/keySplines02.svg)](images/3.svg)

  
keySplines 裡面有四組數據，分別就是 1-2, 2-3, 3-4, 4-5 這四段動畫的 timing function。每一組數據裡面都是兩個控制點的坐標。  
  
SVG 的部分大概就是這樣！這部分有很多需要細微調整的，有興趣的就留言一起討論吧。接下來是 Javascript 部分。這邊我就講一些 SVG + Javascript 要注意的小技巧  

*   fill=freeze 功能為讓動畫結束之後停留在最後一格，不過這樣的話如果你想要用 mousemove 去逐漸改變曲線的外形時，你會發現這個屬性會讓整個 path 卡死。如果拿掉 fill=freeze 的話，因為我執行完動畫之後還要把曲線固定在最後一格，所以拿掉的話就導致動畫有閃爍的現象。 解法就是平常不用，等到要播放補間動畫的時候再把 freeze 加上去。
*   用 beginElement(), endElement() 來播放、停止動畫
*   addEventListener endEvent 來處理動畫結束後的後續處理。

這邊的細節真的非常的多，如果你也想 HTML + SVG + Javascript 來實作的話，建議是要讀一下 SVG 跟 SMIL 的 spec，然後撿想要用的東西放在裡面，什麼不明白的事情就直接寫到 SVG 裡面看一下效果如何就是了。那個時候這個 commit 要上真是超級緊張的，因為這是我開始 contribute Firefox OS 以來最大的修改。結果上的時候還是有些小細節沒注意到，感謝同事的幫忙在 bug 還沒關之前就注意到這個[低級錯誤](https://bugzilla.mozilla.org/show_bug.cgi?id=813045)然後讓我可以及時的推入 repository 了。  
  
之後更複雜的是 Dialer 的部分。  
  

[![](http://2.bp.blogspot.com/-xwNmEo68J6U/ULRNb6eSofI/AAAAAAAAVeg/WbNU4GlGbjg/s1600/device-2012-11-25-103930-2.png)](images/4.png)

  
  
如上圖所見左右兩邊各有一個會隨著弧線移動的兩個 spotlight，而線段上的顏色還多了紅色跟綠色線段。線段不同顏色方面，看遍了 SVG 的資料後比較方便的方法還是用多重的漸層並且把[兩個漸層的 offset](https://github.com/yurenju/gaia/blob/issue-806989-part2/apps/communications/dialer/oncall.html#L71) 設定成一樣，這樣就可以讓曲線有不同的顏色。至於隨著 curve 的 spotlight 則是透過 clipPath 作修剪遮罩，讓漸層只在部分的地方露出來即可。做完這次的 commit 我的 SVG 功力真的大增啊... Orz  
  
  
  
這是在 Dialer 曲線用的漸層。2 跟 3 的 offset 都是一樣的，但是顏色卻用不一樣，這樣的技巧可以讓線段不會產生漸層。  
  
這段是如何產生 spotlight 的方法。首先 path 不一樣的地方是 d 除了原本的 M 跟 C 以外，又加了 H V Z 分別用來畫出橫線、直線跟關閉 path 用。fill style 則套用上面的 #gradient-red 的漸層紅色，最後用 clipPath 的方式作剪裁遮罩。對綠色的部分也用相同的方法，最後通通拿去做動畫，就完成啦！  
  
所以這是最後的結果：  
  
  
  
Dialer 最後實作的結果在這邊，很可惜速度上並不是很好，目前看起來撥電話進來之後整隻手機的效率會下降許多，目前我們也正在改進這個問題。  
  
  
  
這個 lockscreen 的 code 都在 github 上面，有興趣的可以抓下來玩玩 :-)  

*   [https://github.com/yurenju/gaia/tree/issue-806989-part1](https://github.com/yurenju/gaia/tree/issue-806989-part1)
*   [https://github.com/yurenju/gaia/tree/issue-806989-part2](https://github.com/yurenju/gaia/tree/issue-806989-part2)