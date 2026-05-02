---
title: 'travis + jsdom: Javascript unit test 的最後一塊拼圖'
date: '2013-01-02'
tags:
  - unit test
  - javascript
  - jenkins
  - travis
categories:
  - tech
---
在昨天晚上出去跨年前，我把自己之前練習寫的 [weather app](http://yurinfore.blogspot.tw/2012/09/html5-mobile-app.html) 重新整理過了一次，主要是把存取 DOM 的部分聚集起來然後寫 unit test 以及開始用 travis 測試。  
  
travis 是好幾個朋友跟我提過但是我都沒認真看怎麼玩，終於在上次的 [Hacking Thursday](http://www.hackingthursday.org/) 聽 [kanru](http://kanru.info/blog/) 跟 [czchen](http://www.linkedin.com/in/changzhuo) 討論了幾番之後決定還是自己來試試看比較有感覺。  
  
[travis](http://travis-ci.org/) 提供的服務就如 [Jenkins](http://jenkins-ci.org/) 一樣，是一個 CI (continuous integration) 的服務 -- 但是不用自己架 Jenkins 對我來講實在太棒了，我是真的很怕麻煩還要自己維護 CI service。Travis 是直接跟 github 整合的 CI service，所有在 github 的專案都可以很簡單地用 travis hook 透過一個 .travis.yml 來指定 build 以及測試的方式。  
  
[jsdom](https://github.com/tmpvar/jsdom) 則是一個在 node.js 上面的 DOM 實作，意思就是說可以利用它在 node.js 裡面操作 window, document 等元件。這個對我來說真是大大的福音。因為 mobile-weather 大多數的邏輯操作都是跟 DOM 相關的，如果剔除這些其實也沒什麼邏輯好測試的。jsdom 讓我可以在 node.js 裡面操作 DOM 等於我就可以驗證一些跟 DOM 相關的邏輯。  
  
jsdom 真的是 javascript unit test 的最後一塊拼圖，有他之後我們就可以測試跟 DOM相關的部分了 :D  
  
最後我在 unit test 採用的是 [mocha](http://visionmedia.github.com/mocha/), [chai](http://chaijs.com/)，前者是 node.js 上面的 unit test framework，後者是 assertion library。  
  
首先第一個步驟是寫 package.json。因為我們的 unit test 會跑在 node.js 裡面，所以我們要先寫 package.json 來交代要用到哪些 library，並且我們可以在裡面指定當執行 "npm test" 的時候要如何執行測試。  
  
  
  
4 - 8 行的部分是指定 devDependencies 要使用 mocha, chai 跟 jsdom。9 - 11 行做的是執行 npm test 的時候事實上會執行 node\_modules/.bin/mocha -u tdd test/weather\_test.js。這之後如果換了 unit test framework 也可以很輕易地從這邊換掉測試方式 :-)  
  
至於 mocha -u tdd 是 mocha 同時有提供 BDD 跟 TDD 的 interface 可以置換，我這邊是採用 TDD。  
  
接下來就可以開始來寫 unit test 了。  
  
目前的 unit test 測試的項目還不多，先把架構弄好之後再慢慢補上。第三行是把 index.html 轉成字串儲存下來。在 7 - 12 行的地方利用 jsdom 生成 window 跟 document，並且每次都重新生成 Weather object 跟重新初始化，主要的目的是讓每個 test case 不會互相影響。test case 我們挑在 20-25 行的 'updateWeekday' 來看。我們知道 2013/1/1 是禮拜二，而 updateWeekday 裡面就會把 day0.textContent 設定為 'T' (Tuesday)，接下來依序設定。  
  

[![](http://2.bp.blogspot.com/--Xl-QfntGx4/UOJyyJodysI/AAAAAAAAXhE/8PV_v3YW4Qk/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7+2013-01-01+%E4%B8%8B%E5%8D%881.22.39.png)](images/0.png)

  
所以我們就可以假定 day0.textContent 是 T, day4.textContent 是 S 這樣的方式來測試。寫完 test cast，下達 npm test 就可以進行測試囉。  
  

[![](http://2.bp.blogspot.com/-DbPABUTxapU/UOJzgCWiRVI/AAAAAAAAXhM/ZzTAp0JNDcM/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7+2013-01-01+%E4%B8%8B%E5%8D%881.26.07.png)](images/1.png)

這樣 unit test 就告一個段落，最後就是把它移到 travis 上面就大功告成了！先在根目錄開個 .travis.yml，內容是你的 travis 組態：  
  
這邊我們指定採用 node.js，並且只測 0.8 這個版本。其實我們只有在 unit test 的時候會用到 node.js，基本上他還是一個一般的 browser app。所以不需要測試多個 node.js 版本。把這邊全部都 push 上 github 後，用你的 github 帳號登入 travis。然後在 [account](https://travis-ci.org/profile) 的頁面找到你的 project 把右邊的 switch 推到 on。  
  
當下次你 commit & push 的時候，就會看到 travis 開始測試你的 project 囉！  
  

[![](images/2.png)](http://2.bp.blogspot.com/-GpG9V7SuI6g/UOJ1gksTpDI/AAAAAAAAXhY/5oxR1h5ElX4/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7+2013-01-01+%E4%B8%8B%E5%8D%881.30.23.png)

並且有每一次的 build log:  
  

[![](http://1.bp.blogspot.com/-Wp-5qsGDLc4/UOJ1zdeOBiI/AAAAAAAAXhg/YlArEgmhUxA/s1600/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7+2013-01-01+%E4%B8%8B%E5%8D%881.35.39.png)](images/3.png)

  
超棒的吧，不用在自己架 Jenkins 囉！新年快樂！  
  
目前的計劃是如果我們 fork jsdom 然後把 Firefox OS 有用到的 API 加進去，我們就可以開心的丟掉 Browser 測試 Firefox OS app 了 :D