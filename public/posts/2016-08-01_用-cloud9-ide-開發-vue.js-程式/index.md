---
title: "用 Cloud9 IDE 開發 Vue.js 程式"
author: "Yuren Ju"
date: 2016-08-01T15:40:44.099Z
lastmod: 2023-06-06T13:38:35+08:00
categories: [tech]

description: ""

subtitle: "昨天因為要帶著 Chromebook 出門，不過又想說想要來弄一些小東西，就又想到了 Cloud9 這個線上編輯器。"

images:
  - "/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/1.png"
  - "/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/2.png"
  - "/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/3.png"
  - "/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/4.png"
---

![image](/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/1.png#layoutTextWidth)

昨天因為要帶著 Chromebook 出門，不過又想說想要來弄一些小東西，就又想到了 [Cloud9] (https://c9.io/)這個線上編輯器。

試了一下還蠻適合在 chromebook 上使用，而且因為不需要建置環境，其實在 Windows 也非常適合，我現在也在我的 Windows 桌上型電腦用 cloud9。

要使用 cloud9 開發 vue.js 這類型大量依賴 node.js 工具的前端框架也很簡單，開專案時先選擇 node.js 專案，進去之後由於 cloud9 給的 container 環境是 Ubuntu 並且也提供了終端機介面，只要在終端機輸入
`npm install vue-cli`

安裝 vue 命令列工具，再刪除所有原本內附的檔案：

![image](/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/2.png#layoutTextWidth)

再使用
`vue init webpack .`

就可以產生 vue.js webpack 的樣板，執行 npm install &amp;&amp; npm run dev 之後來啟動 vue.js 開發用的伺服器。

![image](/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/3.png#layoutTextWidth)

而且最貼心的是如果點了那個 localhost 的網址選 open，cloud9 內建的終端機則會偵測到 localhost，並且把網址改成正確的遠端網址，在我的例子中

[http://localhost:8080](http://localhost:8080)

就會改成開啟

[http://vue-sample-yurenju.c9users.io:8080/](http://vue-sample-yurenju.c9users.io:8080/)

超貼心。

![image](/posts/2016-08-01_用-cloud9-ide-開發-vue.js-程式/images/4.png#layoutTextWidth)

說到 cloud9 的缺點，大概就是使用沒有付費的版本時，如果一段時間沒有執行時會把你的 container 休眠，所以啟動會需要花一點時間。付費的版本會給你更快的機器，也可以指定讓你的機器一直開著。

因為我現在正好有一個小專案放在上面，最近很頻繁的在使用 cloud9 IDE, 感覺該做的功能都有做了，無論是搜尋或是 sublime text / ATOM 常用的 multiple selection 也都有做，用起來確實還蠻好用的。尤其是在 Windows 或 Chromebook 上更能體會到它的優點，畢竟這兩個作業系統要設定開發環境都要花上不少心力。

另外也蠻適合教室上課的，以前教學時光是設定環境就要花很多時間，每台機器環境還不一定一樣，但是讓學生直接使用 cloud9 不僅環境設定更簡單，他們也可以把做完的東西在家裡打開，不用擔心回家還要再建置一次環境。
