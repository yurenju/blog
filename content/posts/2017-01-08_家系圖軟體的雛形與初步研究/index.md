---
title: "家系圖軟體的雛形與初步研究"
author: "Yuren Ju"
date: 2017-01-08T02:15:07.454Z
lastmod: 2023-06-06T13:39:29+08:00
categories: [tech]

description: ""

subtitle: "前幾週跟台北市社會局的朋友吃飯，又提到了上次吃飯提到社工常會用的家系圖 (Genogram) 想找個方法可以更方便的繪製。當時聽起來覺得應該蠻簡單的，因為自己這幾年都在做向量繪圖軟體，想說這題目蠻適合我，回來之後就開始研究了一下。"

images:
  - "/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/1.png"
  - "/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/2.png"
  - "/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/3.png"
  - "/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/4.jpeg"
  - "/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/5.png"
  - "/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/6.png"
---

![image](/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/1.png#layoutTextWidth)

前幾週跟台北市社會局的朋友吃飯，又提到了上次吃飯提到社工常會用的家系圖 (Genogram) 想找個方法可以更方便的繪製。當時聽起來覺得應該蠻簡單的，因為自己這幾年都在做向量繪圖軟體，想說這題目蠻適合我，回來之後就開始研究了一下。

家系圖 (Genogram) 是社工常用來圖形化與衡量一個家庭概況的圖形表達方式，比如說要評估這個家庭是否需要某些補助時就可以利用這個圖形快速了解這個家題的狀況。

### 現有軟體

畫家系圖的軟體並不是很多，反而倒是比較多話祖譜的軟體。雖然說也可以用通用製圖軟體如 visio, dia 等製作，不過方便程度也不是很夠。專用軟體在概略的搜尋後有幾套很快就可以找到。

[GenoPro](http://www.genopro.com/): 看起來是套很強大的家系圖繪製軟體，看起來用這套應該可以解決所有問題，有 Windows 與 Mac 版本，一套 49USD。

![image](/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/2.png#layoutTextWidth)

[smartdraw](https://www.smartdraw.com/): 是一套可以繪製非常多種圖形的製圖軟體，不過他也支援了家系圖，登入可以免費試用稍微用了一下雖然只能畫不是太複雜的家系圖，不過看起來也是可用，每個月 14.95USD，就畫家系圖而言或許買斷 GenoPro 會是比較好的選擇。

![image](/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/3.png#layoutTextWidth)

雖然看起來已經有現成的專案，不過我還是看了一下如果要實作該如何做，也研究了一些相關資料。

### 檔案格式

家系圖目前看來沒有專門特定的檔案格式，反而是族譜有的檔案格式倒是有幾個。比較了一下 [GEDCOM X](https://github.com/FamilySearch/gedcomx) 是比較適合的檔案格式，除了有還算清楚的文件規格外，也同時支援 [XML](https://github.com/FamilySearch/gedcomx/blob/master/specifications/xml-format-specification.md) 跟 [JSON](https://github.com/FamilySearch/gedcomx/blob/master/specifications/json-format-specification.md)。

不過因為他是族譜用的格式有一點點跟家系圖的使用情境對不太上來，比如說在雙胞胎（或多胞胎, multiple birth）的部分無法正確的標記到底哪幾個人是同一個多胞胎。

實驗的關係我參考 GEDCOM X 做了一個更簡單的 JSON 格式，並且新增一個多胞胎的類型來符合家系圖的需求。

[https://github.com/yurenju/genogram/blob/gh-pages/test.json](https://github.com/yurenju/genogram/blob/gh-pages/test.json)

### 雛形實作

當初我是想自幹 layout engine，所以直接找了操作 SVG 的函式庫，看起來不管 [SVG.js](http://svgjs.com/) 或 [snap.js](http://snapsvg.io/) 都可以勝任，後來我看了一下[這篇 stackoverflow](https://stackoverflow.com/questions/21796872/snap-svg-vs-svg-js) 決定用 svg.js。

不過好景不長，我當初原本覺得這是個 weekend project，做一做之後發現週末做不完，正好又看到朋友在 facebook 上提到了有人把 graphviz 用 emscripten 編譯成 js 的 [viz.js](https://mdaines.github.io/viz.js/)，就正好是我缺了 layout engine （順便連 svg 那部分都做了），後來就直接拿來用。

然後我就用一個最簡單的家系圖例子，試著用我自己定義的檔案格式看看有沒有辦法輸出。

![image](/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/4.jpeg#layoutTextWidth)

後來用 viz.js 輸出則是這樣：

![image](/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/5.png#layoutTextWidth)
[https://yurenju.github.io/genogram/](https://yurenju.github.io/genogram/)

後來採用 viz.js 發現其實使用 graphviz 是無法做到的，主因是所有 genogram 的圖形都是折線，但是表達雙胞胎時卻不是折線：

![image](/posts/2017-01-08_家系圖軟體的雛形與初步研究/images/6.png#layoutTextWidth)

而 graphviz 設定線段的型態只能針對整個圖形設定，所以不能指定部分的邊緣要使用非折線。後來覺得這個實驗已經超過了 weekend project 了，就先停下來，把自己已經研究過的東西寫一寫。

如果有興趣可以上 [https://yurenju.github.io/genogram/](https://yurenju.github.io/genogram/) 看一下繪製的成果，打開 console 可以看到輸出的 graphviz dot。

### 如果要實作一套家系圖需要什麼？

經過兩個週末的實驗，對時做這樣的東西也比較有了概念，如果需要實作家系圖軟體有三個大項需求要滿足：

1.  layout engine: 決定哪些節點要上哪些要下（親子關係），離婚、第二任與第三任要如何決定位置，繼父繼母與生父生母的圖形大小等，當然也要處理線段問題。Graphviz 沒辦法滿足這樣的 layout engine，所以還是得自己實作。
2.  檔案格式：目前雖然依照 GEDCOM X 實作了更簡單的格式，不過越做就會越思考族譜用的格式是否在家系圖也合用。
3.  UI: 選取圖形與線段用的 selection UI 同時也要做 highlight object 用的 UI，包含選取線段等，這個反而比較簡單，畢竟我都在做向量繪圖軟體了 XD

總之，比我想像的要複雜了些，先暫時寫在這邊，如果後來還是決定要實作再來想想到底要怎麼做吧。

### 相關連結

- [20160706 臺北市公共住宅特殊身分保障戶分配機制 第 2 場政策共識會議簡報](http://www.slideshare.net/ssuser89c166/20160706-2-63931141)，內有一些由台北市政府繪製的家系圖（不過他們平常都是用手畫的樣子）
- [genograms example](http://www.genogramanalytics.com/examples_genograms.html) —  複雜的家系圖範例
- [https://en.wikipedia.org/wiki/Genogram](https://en.wikipedia.org/wiki/Genogram)
- [How to created second marriage — GenoPro Help](http://www.genopro.com/tutorials/second-marriage/)
- [explaining_genograms.pdf](http://stanfield.pbworks.com/f/explaining_genograms.pdf)
