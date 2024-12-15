---
title: "Travis-CI 上設定 Headless Chrome"
author: "Yuren Ju"
date: 2017-06-24T12:41:19.968Z
lastmod: 2023-06-06T13:39:46+08:00
categories: [tech]

description: ""

subtitle: "今天在弄自己的小專案的時候發現現在 travis-ci 要設定 Headless Chrome 已經簡單很多了，這邊紀錄一下。"

images:
  - "/posts/2017-06-24_travisci-上設定-headless-chrome/images/1.png"
---

![image](/posts/2017-06-24_travisci-上設定-headless-chrome/images/1.png#layoutTextWidth)

今天在弄自己的小專案的時候發現現在 travis-ci 要設定 Headless Chrome 已經簡單很多了，這邊紀錄一下。

自從 Chrome 最近開始支援 headless 參數後，以前用 phantomjs 跑測試的地方慢慢地都可以換到 headless chrome，以往在 travis-ci 都要用 xfvb 跑一個 framebuffer 的 display server 現在也不需要了，往後 CI 上跑瀏覽器測試又更容易了。

### nightwatch 設定部分

這邊用 vue-cli 產生的 webpack 專案作為例子，當你用 `vue init webpack YOUR_PROJECT` 時，test 目錄內會有兩個目錄 e2e 與 unit 分別做不同測試項目，其中 e2e 的 [nightwatch 設定檔](https://github.com/vuejs-templates/webpack/blob/8563cdb8d8d1e4abaef64f7695697b70957b9490/template/test/e2e/nightwatch.conf.js#L30-L36)如下：
`    chrome: {
      desiredCapabilities: {
        browserName: &#39;chrome&#39;,
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },`

這時可以用 chromeOptions 加上 `--headless` 參數：
`    chrome: {
      desiredCapabilities: {
        browserName: &#39;chrome&#39;,
        javascriptEnabled: true,
        acceptSslCerts: true,
 **chromeOptions : {
          args: [&#39;headless&#39;, &#39;disable-gpu&#39;, ]
        }**
      }
    },`

這時使用 `npm run e2e` 時 chrome 的視窗就不會跳出來，改用 headless 執行了。

### Travis-CI 設定部分

既然 nightwatch 本身已經用 Headless Chrome，travis 的設定就只剩下把 Chrome 安裝上去就好了，以下是範例的 `.travis-yml`：
`dist: trusty
sudo: false
**addons:
chrome: stable**``language: node_js
node_js:

- &#34;6&#34;`

另外 travis-ci 預設的 Ubuntu 是 12.04 LTS, 加上 trusty 那行可以改用 14.04 LTS，問題會比較少，加上 `sudo: false` 則是可以開啟 container 模式加快開機速度。

現在的設定真是不可思議的簡單，想到以前還要啟動 xfvb, 指定 DISPLAY 還要在 sleep 個三秒，現在一切都是如此寫意，太爽了～
