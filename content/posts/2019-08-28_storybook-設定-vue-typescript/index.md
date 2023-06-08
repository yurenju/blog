---
title: "storybook 設定 vue + TypeScript"
author: "Yuren Ju"
date: 2019-08-28T10:53:50.953Z
lastmod: 2023-06-06T13:42:38+08:00
categories: [tech]

description: ""

subtitle: "Storybook 是個好東西，可以讓你在製作 UI 元件的時候有個地方可以展示，這樣如果需要看元件要如何使用時就可以到 storybook 看。不過每個專案採用的框架都不一樣導致設定上也會有點麻煩。"

images:
  - "/posts/2019-08-28_storybook-設定-vue-typescript/images/1.png"
---

![image](/posts/2019-08-28_storybook-設定-vue-typescript/images/1.png#layoutTextWidth)

Storybook 是個好東西，可以讓你在製作 UI 元件的時候有個地方可以展示，這樣如果需要看元件要如何使用時就可以到 storybook 看。不過每個專案採用的框架都不一樣導致設定上也會有點麻煩。

以我遇到的狀況來說，我們是 vue + vuetify (material design for vue) + typescript。雖然網路上可以找到[幾篇](https://medium.com/@farcaller/vue-storybook-typescript-starting-a-new-project-with-best-practices-in-mind-3fc7b3ceae4e)設定類似環境的教學文章，不過因為專案框架的差異也沒辦法照著文章上面的步驟就可以完美的解決問題。

而其實問題的根源在於 storybook cli 與 vue cli 的預設 webpack 設定是不一樣的，又因為這些 cli 現在都希望做到 zero configuration 讓大家方便使用，層層包裝下就變成只要有點小變更就會變得不是那麼容易設定，更慘的是當啟用 plugin 後 webpack 會依照你啟用的 plugin 而有不同的 webpack 設定。

#### 解決方法

其實解決方法說起來也不難，其實只要把兩邊的 webpack 拿出來比較一下，把關鍵的部分加入 storybook 就可以解決問題了。

根據[官方文件](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-inspect)， vue 這邊用 `inspect` 來印出目前的設定：
```
$ vue-cli-service inspect
```

而 storybook 也一樣[官方文件](https://storybook.js.org/docs/configurations/custom-webpack-config/#debug-the-default-webpack-config)內有寫，新增 `.storybook/webpack.config.js` 後加入：
```
module.exports = **async** ({ config }) =&gt; console.dir(config.plugins, { depth: null }) || config;
```

接著用以下指令即可列出 webpack 設定組態：
```
$ yarn storybook --debug-webpack
```

剩下就是見招拆招了，以我的狀況我是搜尋 .ts 去找到 vue 那邊的設定，然後再自行簡化一下寫到 `.storybook/webpack.config.js` 裡面。以我的狀況來說，比較了兩邊之後，我發現 js, ts 跟 scss 的部分都要額外設定，找出來之後就再把下面這些東西加回 `.storybook/webpack.config.js`：

這樣就大功告成了。這設定每個人狀況應該多少會有所不同，不過沿著 vue cli 的設定走就對了。
