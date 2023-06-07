---
title: "Node.js 6.0 支援的 es6 features"
author: "Yuren Ju"
date: 2016-04-27T04:02:34.530Z
lastmod: 2023-06-06T13:37:43+08:00
categories: [tech]

description: ""

subtitle: "剛剛的新聞 Node.js 6.0 釋出了，每次釋出其實 es6 的支援程度多半是關注的焦點之一，http://node.green 上面列有每次版本更新所新增的功能，來看看幾個 Node.js 6.0 支援的新 ES6 features:"
---

[Node v6.0.0 (Current)](https://nodejs.org/en/blog/release/v6.0.0/)

剛剛的新聞 Node.js 6.0 釋出了，每次釋出其實 es6 的支援程度多半是關注的焦點之一，[http://node.green](http://node.green) 上面列有每次版本更新所新增的功能，來看看幾個 Node.js 6.0 支援的新 ES6 features:

#### let 與 const 支援

let 是 es6 用來宣告變數的另一個方式，跟 var 不同的地方是 var 是 function scope 而不是 block scope，所以以下語法會讓你無法預期
` if (true) {
  var j = 1;
}``console.log(j); // 輸出會是 1 而不是 undefined `

而 let 跟 const 到 node.js 6.0 才正式支援，不需要再透過 babel 轉換了。

#### class 與 super 支援

es6 之後支援使用 class 語法，不過其實跟用 function 與 prototype 實作是一樣的，只是打的字會少一點。
` $ node --harmony``class Dog extends Animal {
  bark() {
    console.log(&#39;barking&#39;);
  }
} `

之前的版本都要透過 harmony 參數來使用 class，現在不用了。

#### rest parameters

這是可以用 … 來取代剩下來的參數，非常方便。
` function rest(name, ...args) {
  console.log(name); // foo
  console.log(args[0]); // bar
  console.log(args[1]); // baz
}``rest(&#39;foo&#39;, &#39;bar&#39;, &#39;baz&#39;); `

以前也是要用 harmony 打開，現在也不用了。

#### destructuring

可以用來方便的一次宣告或 assign 許多變數：
`var [a, b, c] = [1, 2, 3]
// a: 1, b: 2, c: 3`

這個真的很方便，而且在 object assignment 也可以使用一樣的方法，可以讓源碼簡潔。

#### 其他

其實看了一下新增的功能還蠻多的，不過有些我之前比較少用如 proxy 與 Reflect，剩下的可以到 node.green 上面看看。

[Node.js ES2015/ES6 support](http://node.green/)
