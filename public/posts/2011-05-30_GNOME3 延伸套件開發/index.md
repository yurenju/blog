---
title: GNOME3 延伸套件開發
date: '2011-05-30'
tags:
  - gjs
  - gnome3
  - javascript
  - GNOME
categories:
  - tech
---
這幾天到 KaLUG 講了一場『GNOME3 延伸套件開發教學』，其實也幫我自己上了一堂課。在這邊寫下一些心得讓大家參考一下。  
  
**3D 加速後的 GNOME3 桌面**  
  
在 GNOME3 裡面多了一個 gnome-shell 的軟體，主要負責提供 GNOME3 新一代的使用者體驗，包含更容易使用的 workspace，新的 application 管理機制等等。比如說下面的影片講解了 workspace 系統：  
  
  
  
而這些絢麗的使用者體驗歸功於新的 UI Toolkit - Clutter 以及 Shell-Toolkit (ST)。Clutter 是一套利用 OpenGL/OpenGL ES 加速的 UI Toolkit，可以簡單的創作出許多絢麗的特效。比如說我們要撰寫一個小程式，當使用者點擊圖像之後，做出淡出、放大並且位移的特效。若使用 GTK+ 或其他 UI Toolkit 亦然可撰寫出來，但採用 Clutter 撰寫時就會格外簡單許多。  
  
  
(因為使用桌面錄影的關係，感覺有些遲鈍，不過實際上跑的時候還蠻順暢的。)  
  
這個 Demo 程式源碼如下：  
```
const Clutter = imports.gi.Clutter;
const Tweener = imports.tweener.tweener;

function click(actor, ev) {
    let properties = {  time: 2.0,
                        x: texture.x+100,
                        y: texture.y+100,
                        scale\_x: 1.5,
                        scale\_y: 1.5,
                        opacity: 0
                    };
    Tweener.addTween(texture, properties);
    print('Clicked!');
    return true;
}

function quit(actor) {
    Clutter.main\_quit();
}

Clutter.init(0, null);
let stage = new Clutter.Stage();
let texture = new Clutter.Texture({ filename: 'test.jpg',
                                    reactive: true });
texture.connect('button-press-event', click);
stage.connect('destroy', quit);
stage.add\_actor(texture);
stage.show();

Clutter.main();

```  
上面這個範例可以在 Debian 安裝 gir1.0-clutter-1.0, gjs 之後即可執行。  
  
**GNOME3 extension 採用 Javascript 撰寫**  
  
其實在 gnome-shell 的 UI 部分幾乎都是採用 Javascript 撰寫而成。而理所當然的開發 extension 時當然也是採用 Javascript 開發。然而最好的地方在於開發 extension 的時候，就像是 firefox extension 一樣，你可以任意的存取原本 gnome-shell 的所有元件。比如說，你可以存取 panel 的日曆元件，並且加入或修改這些元件。  
  
**Looking glass - 幾近作弊的 console**  
  
在 GNOME3 extension 開發的時候有個非常好用的工具叫做 Looking glass，這個東西就像是雷神之錘按下 "~" 就可以叫出來的 console (然後可以在裡面輸入作弊指令)。在 GNOME3 的環境下，按 alt + F2 並且輸入 lg 你就會看到這個 console 緩緩地從上面降下來。  
  
這東西有什麼用途呢？最好用的工具是左上角那隻筆。它的作用是可以拿來點 GNOME3 桌面元件的任何東西，接着你就可以取得那個元件，然後做些什麼事情。  
  

[![](images/0.png)](http://3.bp.blogspot.com/-Y1_0fS-BC_s/TeNN1fa-n9I/AAAAAAAAJVg/eVSNmw4caj8/s1600/Screenshot-gnome3-ext-tutorial.pdf.png)

  
選取元件之後會跳回 looking glass，這個時候系統就會給他一個存取他的變數 r(NUM)，接下來你可以在 console 使用這個代號調用它。  
  

[![](http://4.bp.blogspot.com/-Ma9DKiLNcIU/TeNOun-Oz8I/AAAAAAAAJVo/Z_AIjVA7Wsw/s1600/method.png)](images/1.png)

  
當你點擊這個物件的時候，他就會把這個物件的 method 全部列出來，馬上就可以知道有什麼 method 可以調用。然後！這個東西當然不是只有看的，你甚至可以在 looking glass 裡面使用 r(NUM).method() 直接在 runtime 執行特定 method。比如說我執行了 r(13).set\_text("I don't care")  
  

[![](images/2.png)](http://2.bp.blogspot.com/-Uj9TgZvJqnE/TeNPkoSQ4yI/AAAAAAAAJVs/QNDV6CcJmok/s1600/idontcare.png)

  
  
系統的日期馬上就任性了起來！當然你也可以做些旋轉或什麼之類的事情，而且由於 clutter 的特性，作了修改後的元件依然可以操作。  
  

[![](images/3.png)](http://4.bp.blogspot.com/-q_ILQQxM53Q/TeNTxGI-aNI/AAAAAAAAJV0/1nDf13O7W2M/s1600/rotation.png)

  
  
最後附上 Tutorial 簡報，請多多指教 :)  
  

**[GNOME3 延伸套件教學](http://www.slideshare.net/yurenju/gnome3 "GNOME3 延伸套件教學")**

View more [presentations](http://www.slideshare.net/) from [Yuren Ju](http://www.slideshare.net/yurenju)