---
title: ibus 無調注音支援空白鍵作為一聲
date: '2010-10-28'
tags:
  - ibus
  - ibus-pinyin-bopomofo
  - ibus-pinyin
categories:
  - tech
---
最近都在修改 ibus 的注音輸入法，這次新增的功能是把原本空白鍵的導引鍵功能，改成支援陰平聲調（也就是注音聲調中的一聲）。之前的無調注音雖然好用，不過許多人還是習慣在輸入的時候鍵入聲調。而 ibus 注音輸入法遇到聲調目前會自動忽略，所以就算你輸入聲調也不會有什麼問題，不過令人困擾的是平常繁體中文使用者使用空白鍵作為聲調中的一聲，正巧跟 ibus 注音輸入法的導引鍵衝突。所以我花了一些時間加入空白鍵作為一聲的支援。  
  
相同的源碼我都放在 [github](http://github.com/yurenju/ibus-pinyin) 上，現在要使用新增的功能都需要編譯源碼。晚點我測試的差不多後就會推到官方 ibus 的 repository 中。  
  
新的 ibus 注音輸入法在設定的地方會多一個空白鍵功能的選項。  
  

[![](http://1.bp.blogspot.com/_iOO0fC4NKLE/TMjvqu-2-ZI/AAAAAAAAI84/Cy-NNMXCphg/s1600/Screenshot-%E5%81%8F%E5%A5%BD%E8%A8%AD%E5%AE%9A-1.png)](images/0.png)

  
  
現在預設會使用陰平聲調，所以新的使用者不需要調整。之前有使用 ibus 注音輸入法的使用者只需要切換這個選項就可以讓空白鍵變成陰平聲調。  
  

[![](http://1.bp.blogspot.com/_iOO0fC4NKLE/TMjwp_fa8sI/AAAAAAAAI88/dmtnBRKsLPM/s1600/chinese-input-method.png)](images/1.png)