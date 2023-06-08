---
title: "Tape — 除了 Mocha 以外的另一個選擇"
author: "Yuren Ju"
date: 2017-02-20T14:30:09.807Z
lastmod: 2023-06-06T13:39:37+08:00
categories: [tech]

description: ""

subtitle: "前幾天看了 Why I use Tape Instead of Mocha & So Should You 這篇文章之後，覺得他說的幾點都有些道理。正好手邊有個專案需要寫測試，就拿 Tape 來試看看。"

images:
  - "/posts/2017-02-20_tape-除了-mocha-以外的另一個選擇/images/1.jpeg"
  - "/posts/2017-02-20_tape-除了-mocha-以外的另一個選擇/images/2.png"
  - "/posts/2017-02-20_tape-除了-mocha-以外的另一個選擇/images/3.png"
---

![image](/posts/2017-02-20_tape-除了-mocha-以外的另一個選擇/images/1.jpeg#layoutTextWidth)

[https://flic.kr/p/a22dKZ](https://flic.kr/p/a22dKZ)

前幾天看了 [Why I use Tape Instead of Mocha &amp; So Should You](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4) 這篇文章之後，覺得他說的幾點都有些道理。正好手邊有個專案需要寫測試，就拿 Tape 來試看看。

[GitHub - substack/tape: tap-producing test harness for node and browsers](https://github.com/substack/tape)

Tape 是一個功能相當精簡的 test runner，感覺他的設計哲學跟 UNIX 很像，感覺很精鍊。這個 runner 只要 `require(&#39;tape&#39;)` 就可以開始使用並且內附一個 assertion，執行的時候只需要用 node 去執行該 test 即可，
`node test/my-test.js`

如果有多個測試時，也可以用內附的指令來指定整個目錄執行。
`tape test/*.js`

舉個例子，我在寫的一個專案是一個可以存取 google spreadsheet 的小 library，其中一個 function 是 `auth()`，測試寫起來則是這樣：
` const test = require(&#39;tape&#39;);
const WorkshiftClient = require(&#39;../libs/workshift-client&#39;);
const EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const KEY = process.env.GOOGLE_PRIVATE_KEY;``test(&#39;auth&#39;, t =&gt; {
  const client = new WorkshiftClient(EMAIL, KEY);
  client.auth().then(() =&gt; {
    t.equal(client.isAuth, true,
           &#39;client.isAuth should be true if authenticated&#39;);
    t.end();
  });
}); `

`test()` 的第二個參數是一個 callback 而 `t` 則是用於 assertion 以及一些工具如明確標示測試結束的 `t.end()`。所有可用的 assertion function 都列在 [tape 的 github 頁面](https://github.com/substack/tape)，一下子就可以看完所有 function。

沒有 afterEach 與 beforeEach，如果需要的話就額外寫一個 function 執行所需的操作。在 Why I use Tape Instead of Mocha &amp; So Should You 也提到他認為 beforeEach / afterEach 很容易造成 shared state 會互相影響 test case，所以他也認為不需要這些東西。

執行測試後的輸出是這樣：

![image](/posts/2017-02-20_tape-除了-mocha-以外的另一個選擇/images/2.png#layoutTextWidth)

這是 [TAP (Test Anything Protocol)](https://en.wikipedia.org/wiki/Test_Anything_Protocol) 格式，一種人與機器都可以輕易看得懂的測試輸出格式，我之前只知道 junit report，還真的沒看過這種。不過基本上還蠻易讀的，如果要產生測試摘要也可以用另外一個 npm module `faucet` 接著 pipeline 就可以讀取：
`npm test | faucet`

輸出就會變得更簡潔好閱讀，透過不同的指令 pipeline 也可以達到輸出 markdown 甚至跳出測試成功/失敗的通知也都行。

測試了一下接上 istanbul 做 coverage 也沒任何問題。順帶一提現在 Istanbul 好厲害，我的測試是 `npm test` ，如果要上 coverage 只要前面加上 nyc 就可以了： `nyc npm test` 這是什麼神奇的巫術 ⋯⋯

![image](/posts/2017-02-20_tape-除了-mocha-以外的另一個選擇/images/3.png#layoutTextWidth)

### 結論

總之 tape 沒什麼學習曲線，看了 github 頁面就會用了。然而他說的也有些道理，我現在用 chaijs BDD style assertion 其實感覺也沒比較好懂。tape 目前用起來是覺得還蠻喜歡的，畢竟真的很簡單，我也喜歡他每個工具都做得很精簡，用 pipeline 串起來就好了。

不過目前測試的這個專案是個非常小的專案，也不知道如果用在比較大的專案會不會有什麼問題，更別說是像 react.js /vue.js 那樣比較複雜的工具要如何整合進來測試了。

但話說回來我之後還是會繼續在小專案試用，等用了一陣子之後再來看是不是要從 mocha 為主轉移到用 tape 為主。
