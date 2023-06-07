---
title: "使用 Web MIDI 顯示實體鋼琴訊號"
author: "Yuren Ju"
date: 2020-08-08T07:23:59.203Z
lastmod: 2023-06-06T13:43:46+08:00
categories: [tech]

description: ""

subtitle: "最近看了好和弦的《我寫了一個「鋼琴鍵盤顯示app」，免費送給大家 + 使用教學！》，作了一個可以把實體鋼琴鍵盤顯示在電腦螢幕上的工具，我評估一下後覺得也可以用 Web MIDI 直接在網站上完成，就開始進行了這個小專案。"

images:
  - "/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/1.png"
  - "/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/2.gif"
  - "/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/3.png"
  - "/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/4.png"
  - "/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/5.png"
  - "/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/6.png"
---

![image](/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/1.png#layoutTextWidth)
最近看了好和弦的《我寫了一個「鋼琴鍵盤顯示 app」，免費送給大家 + 使用教學！》覺得滿有趣的，主要是製作影片的時候可以把實體鋼琴鍵盤彈的按鍵顯示在螢幕，之後可以後製讓觀眾知道彈鋼琴鍵盤的時候按下了什麼按鍵。

之前大約七年前的黑客松（天阿好久了）有做過 [Mozart 專案](https://tech.mozilla.com.tw/?p=3664) 透過 Web Audio 標準來製作音樂指揮家的遊戲。

看了這個影片之後就想說目前網頁的 Web MIDI 標準應該也可以作出類似的東西。在好和弦的影片當中他是透過 processing 這套軟體與相對應的外掛來達成這樣的功能，會需要安裝一些額外的軟體。不過如果透過 Web MIDI 標準來做就只要打開網站就可以達成了，後來試了果然沒問題。

不過最近很久沒寫 CSS 了，學到比較多的反而是 CSS 🤣

先看一下 DEMO，直接打開 [https://yurenju.github.io/piano/](https://yurenju.github.io/piano/) 網頁就行了，不過我先透過 Edge browser 的功能可以讓任何網頁獨立在一個視窗的功能讓他看起來像是一個獨立的 app。

![image](/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/2.gif#layoutTextWidth)

接下來透過一個 Android app MIDI Controller 讓手機模擬 MIDI input，這樣就可以測試了，跑起來的效果如下。當我在手機的鋼琴鍵盤按下按鍵的時候，電腦螢幕上面也會顯示那些按鍵已經被按下。

雖然這邊是用手機測試，不過根據 MIDI 的規格，實體的鋼琴鍵盤透過 USB 接上後理論上也可以達到相同的效果。

### 實作

Web MIDI 用於接收 MIDI input 設備信號可以透過 `navigator.requestMIDIAccess()` 這個函式來取得 midi 的存取權限。取得之後可以透過 `access.inputs` 取得所有 midi input 的列表，而只要分配一個函式給 `input.onmidimessage` 就可以在發出訊號時收到事件。
![image](/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/3.png#layoutTextWidth)
至於 onMessage 收到事件後所拿到的 event.data 會是個三個數值陣列，根據 MIDI 規格分別是 channel, number, value，這時候我們透過這三個數據就可以知道是壓下琴鍵、放開琴鍵或是採下踏板等事件。

不過因為我的 Android app 沒有踏板，所以這部份雖然有寫邏輯但沒有真的跑過就是了。

![image](/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/4.png#layoutTextWidth)

接下來只要透過這些事件改變按鍵顏色就完成了。不過這次收穫最多的反倒是在 CSS 的寫法。這次用了好幾個寫法以前都沒什麼用過。因為鋼琴鍵盤格局的關係，黑鍵的部分隔幾個會需要一格空白。
![image](/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/5.png#layoutTextWidth)
這時候可以用 nth-child 來控制，像下面的 5n + 2 意思是從第二個黑鍵開始，每五個黑鍵就要留一格大一點的 margin-left。然後 5n + 4 的意思是第四格開始也要留一格。這樣就可以作出鋼琴鍵盤黑鍵的正確布局。

同時 CSS variable 我也是第一次用，看起來沒什麼太大的問題。
![image](/posts/2020-08-08_使用-web-midi-顯示實體鋼琴訊號/images/6.png#layoutTextWidth)
這次這樣玩下來感覺 Web MIDI 可以作出很多有趣的東西，像是 Youtube 上經常有人的鋼琴影片是有[很多色塊掉下來搭配實際彈奏](https://youtu.be/-8X_aMT5z0A)的影片。這看起來 Web MIDI 大概也可以作得到。

雖然沒用過不過看起來好像也可以把訊號送給其他也採用 MIDI 標準的設備。之後如果有機會的話可以再探索一下可以做到那些事情。

有興趣深入了解的我把源碼放在下面的 github repo 可以研究研究。

[yurenju/piano](https://github.com/yurenju/piano)
