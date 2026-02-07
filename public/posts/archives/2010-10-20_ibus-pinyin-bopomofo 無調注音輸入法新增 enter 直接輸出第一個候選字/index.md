---
title: ibus-pinyin-bopomofo 無調注音輸入法新增 enter 直接輸出第一個候選字
date: '2010-10-20'
tags:
  - ibus
  - ibus-pinyin-bopomofo
  - ibus-pinyin
categories:
  - tech
---
最近正在參與 ibus 中的無調注音輸入法 (pinyin-bopomofo) 的開發。希望能夠讓這個輸入法更好用，並且也同時考慮到對岸以及台灣使用者的使用習慣。  
  
這次修改的是加入 enter 鍵的功能選項。原本的輸入法按下 enter 後會輸出原本的英文字串。比如說輸入 yurenju 雖然剛開始會變成好像是亂打的字如下圖：  
  

[![](http://1.bp.blogspot.com/_iOO0fC4NKLE/TL7Mj9INuoI/AAAAAAAAI8w/76zQ1IsUEvA/s1600/enter_eng.png)](images/0.png)

  
不過當你按下 Enter 之後就會變成 yurenju。不過台灣的中文使用者有些比較習慣按下 Enter 後輸出的是第一個候選詞。所以小弟新增了一個小功能，讓使用者可以在設定裡面調整 Enter 鍵的功能。源碼在 [github](http://github.com/yurenju/ibus-pinyin) 上，現在要使用必須直接編譯源碼。新的版本預設會讓按下 Enter 後輸出第一個候選字，不過也可以在設定裡面調整。  
  

[![](images/1.png)](http://1.bp.blogspot.com/_iOO0fC4NKLE/TL7OHc03jWI/AAAAAAAAI80/WYMdIzFAOQc/s1600/Screenshot-%E5%81%8F%E5%A5%BD%E8%A8%AD%E5%AE%9A.png)

  
另外在我 github 的版本也有把 shift + , 與 shift + . 重新 mapping 到全形的逗點跟句點了。接下來會看一些 issues 有哪些要幫忙解。