---
title: "SVG Text 簡介與範例"
author: "Yuren Ju"
date: 2016-07-07T12:42:48.760Z
lastmod: 2023-06-06T13:38:21+08:00
categories: [tech]

description: ""

subtitle: "因為工作的關係今天讀了一下 SVG Text 1.1 的 Spec，看著看著也順便寫了一些範例可以分享（也把它們放在 CodePen 上），讓有興趣的人可以快速入門。"

images:
  - "/posts/2016-07-07_svg-text-簡介與範例/images/1.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/2.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/3.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/4.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/5.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/6.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/7.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/8.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/9.png"
  - "/posts/2016-07-07_svg-text-簡介與範例/images/10.png"
---

![image](/posts/2016-07-07_svg-text-簡介與範例/images/1.png#layoutTextWidth)
[http://codepen.io/yurenju/pen/AXoqQk](http://codepen.io/yurenju/pen/AXoqQk)

因為工作的關係今天讀了一下 [SVG Text 1.1 的 Spec](https://www.w3.org/TR/SVG/text.html)，看著看著也順便寫了一些範例可以分享（也把它們放在 [CodePen](http://codepen.io/yurenju/pen/AXoqQk) 上），讓有興趣的人可以快速入門。

#### x 與 y

最簡單的範例就是只有 x, y 屬性的文字，這就不介紹了。
`&lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50&#34; y=”50&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/2.png#layoutTextWidth)

#### x, y 陣列

有意思的是 x 跟 y 都可以給一個陣列，如此一來每個字元都可以指定位置。如果陣列沒給足夠的話，接下來每個字元的 y 都會跟前一個字元一樣，x 數值則會依照 kerning 與字元寬度變換（如果是直書就是反過來）。
`&lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50,60,70&#34; y=”50,60,70&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/3.png#layoutTextWidth)

#### dx, dy

除了 x, y 以外，也可以用 dx, dy 這個是對於前一個字元的相對位置，就不用每個字元都需要知道絕對座標
`&lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50&#34; y=”50&#34; dx=”0,10,20&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/4.png#layoutTextWidth)

#### rotate 旋轉字元

而每個字元也都可以指定旋轉的角度，可以指定一個角度，所有的字元都會套用相同的效果，或是指定多個，這樣每個字元的角度都會不一樣。如果要整個文字元素都旋轉的話可以用 transform 屬性。
` &lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50&#34; y=”50&#34; rotate=”30&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt;``&lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50&#34; y=”50&#34; rotate=”0,30,60,90,120&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt; `
![image](/posts/2016-07-07_svg-text-簡介與範例/images/5.png#layoutTextWidth)

#### textLength 與 lengthAdjust

一般來說 textLength 都是自動計算，但是如果指定數值後就可以實作類似分散對齊的效果。lengthAdjust=”spacingAndGlyphs” 則是除了字元間的空白會增加外，文字也會變寬。
` &lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50&#34; y=”50&#34; textLength=”200&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt;``&lt;svg height=”200&#34; width=”300&#34;&gt;
 &lt;text x=”50&#34; y=”50&#34; textLength=”200&#34; lengthAdjust=”spacingAndGlyphs”&gt;Hello World&lt;/text&gt;
&lt;/svg&gt; `
![image](/posts/2016-07-07_svg-text-簡介與範例/images/6.png#layoutTextWidth)

#### &lt;tspan&gt;

&lt;tspan&gt; 用法跟 HTML 裡面 &lt;span&gt; 的用法類似，不過每個 &lt;tspan&gt; 都可以指定 x, y 或 dx, dy，也可以指定 font-weight。
`&lt;svg height=&#34;200&#34; width=&#34;300&#34;&gt;
  &lt;text x=&#34;50&#34; y=&#34;50&#34;&gt;
    &lt;tspan&gt;Hello&lt;/tspan&gt;
    &lt;tspan dy=&#34;50&#34; font-weight=&#34;bold&#34; fill=&#34;red&#34;&gt;World&lt;/tspan&gt;
    &lt;tspan dy=&#34;-30&#34;&gt;3rd word&lt;/tspan&gt;
  &lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/7.png#layoutTextWidth)

#### 直書

直書可以將 writing-mode 指定成 tb (top-to-bottom) 達成，理論上還可以設定其他書寫方式，不過試不太出來，阿拉伯文對我來講有點難辨識，不清楚到底是設定成功還失敗。
`&lt;svg height=&#34;200&#34; width=&#34;300&#34;&gt;
  &lt;text writing-mode=&#34;tb&#34; x=&#34;50&#34; y=&#34;50&#34;&gt;漢字直行書寫&lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/8.png#layoutTextWidth)

#### text-anchor

text-anchor 是決定要從哪邊開始繪製。下面三個 &lt;text&gt; 的 x 數值都是一樣，但是畫出未來的位置不同，如果想要把文字畫在正中間這個屬性蠻好用的。綠色線是 x=100 的位置，如果是 start (預設) 就會從 x=100 的右邊開始畫起，如果是 middle 時 x=100 就會對準中間，end 就會是在最後。如果是直書模式 x 則改用 y 代替。
`&lt;svg height=&#34;200&#34; width=&#34;300&#34;&gt;
  &lt;text x=&#34;100&#34; y=&#34;50&#34;&gt;Hello World&lt;/text&gt;
  &lt;text text-anchor=&#34;middle&#34; x=&#34;100&#34; y=&#34;100&#34;&gt;Hello World&lt;/text&gt;
  &lt;text text-anchor=&#34;end&#34; x=&#34;100&#34; y=&#34;150&#34;&gt;Hello World&lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/9.png#layoutTextWidth)

#### Text on Path

&lt;textPath&gt; 是一個可以把文字畫在線段上的標籤，如果你想做出個笑臉男的標籤就可以用 &lt;textPath&gt; 完成。
`&lt;svg height=&#34;200&#34; width=&#34;300&#34;&gt;
  &lt;defs&gt;
    &lt;path id=&#34;MyPath&#34;
       d=&#34;M 50 50
          C 100 150 110 0 290 150&#34; /&gt;
  &lt;/defs&gt;
  &lt;use xlink:href=&#34;#MyPath&#34; fill=&#34;none&#34; stroke=&#34;red&#34;  /&gt;
  &lt;text&gt;
    &lt;textPath xlink:href=&#34;#MyPath&#34;&gt;
      Hello 中文 World
    &lt;/textPath&gt;
  &lt;/text&gt;
&lt;/svg&gt;`
![image](/posts/2016-07-07_svg-text-簡介與範例/images/10.png#layoutTextWidth)

另外 dominant-baseline 也是個非常重要的屬性，不過有另外一篇文章 [Dominant Baseline Style](http://bl.ocks.org/eweitnauer/7325338) 寫得很清楚，我這邊就不贅述了。

#### Put it together!

最後文字跟一般 SVG 圖形一樣，其他的效果都可以套用在上面，像是 &lt;filter&gt;, &lt;clipPath&gt;, fill 或 stroke 等等各式各樣的用法都可以使用，把他們都放在一起就可以做出很不錯的效果喔！
