---
title: "QT 的 QTextEdit 的小小研究"
author: "Yuren Ju"
date: 2016-03-25T09:39:16.898Z
lastmod: 2023-06-06T13:37:36+08:00
categories: [tech]

description: ""

subtitle: "其實我沒有真的寫一個 QT 的小程式來試試，單純是看程式碼的理解。"

images:
  - "/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/1.png"
  - "/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/2.png"
  - "/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/3.png"
  - "/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/4.png"
  - "/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/5.png"
---

其實我沒有真的寫一個 QT 的小程式來試試，單純是看程式碼的理解。

先請問大家，如果現在你的文字編輯器有這樣的內容，游標停在第一行「一聲」的後面，按了三次「下」鍵會發生什麼事情？

![image](/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/1.png#layoutTextWidth)

這問題其實也很簡單，只要隨便打開一個編輯器試試看就知道結果了。第一次會跳到「三國」的後面，第二次則會跳到空白行的第一行，第三次則會跳到「火說」的後面。但是這一切在程式裡面是怎麼發生的呢？

在每個 toolkit 的實作方法都不一樣，我這邊挑了我認為比較好讀的 QT 來研究一下這個行為是怎麼發生的。

![image](/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/2.png#layoutTextWidth)

自己邊看源碼一邊畫的心智圖

這張 MindMap 我也不能保證全部正確，不過大致上的關係是這樣。QTextDocument 是 QT 裡面來儲存文件的類別，而文件裡面可以有文字區塊 (QTextBlock)、另外一個 Container (QTextFrame)、表格與圖片。

當你想要修改文件的時候，就利用 QTextCursor 來移動游標位置、選取文字、插入修改文字，或是從中取得字元樣式 (QTextCharFormat) 或是區塊樣式 (QTextBlockFormat) 後修改樣式。

QTextEdit 則把 QTextDocument 與 QTextCursor 包在一起成為一個編輯元件。

QTextDocument 與 QTextCursor 用來儲存與操作修改資料，如果是要拿來繪製文字的則靠 QTextLayout 這個類別來達成。比如說你想要知道文字會被畫成幾行，每一行的寬度有多少則是透過 QTextLayout。

以上是概略的對 QT 文字相關的部分介紹，回到我們的主題，請問游標往下移動，會用到上述哪些類別呢？答案是會用到 QTextEdit, QTextCursor 與 QTextLayout，因為你得先知道 Cursor 在哪裡，按「下」鍵後，游標要停在下一行的哪個位置，則要透過 QTextLayout 來決定。

按下「下」鍵的時候，會觸動 QTextEdit 的 moveCursor()，透過 QTextControl 來觸動 QTextCursor 的 movePosition()。

movePosition() 中，首先會把目前游標所在位置的 QTextBlock 取出，並且一併取出這個 block 的 QTextLayout，並且利用 cursor 目前的位置 (position) 取出目前所在的那一行 (QTextLine)。

![image](/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/3.png#layoutTextWidth)

QTextCursor::movePosition()

接著將自己的行數 +1 後從 layout-&gt;lineCount() 檢查如果行數 +1 是否會超出這個 block 的範圍，如果沒有超出行數，就取出同 block 的下一行 lineAt(i)，並且用 xToCursor() 算出 cursor 應該要在的位置。

![image](/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/4.png#layoutTextWidth)

QTextCursor::movePosition()

如果超出行數就利用 block.next() 取出同份文件的下一個 block

![image](/posts/2016-03-25_qt-的-qtextedit-的小小研究/images/5.png#layoutTextWidth)

QTextCursor::movePosition()

然後再用 lineAt() 與 xToCursor() 來取的行數與正確的位置，最後游標就會到正確的地方囉。

所以第一次按「下」的時候，會跳到同一個 block 的下一行，游標保持在同樣的位置。再按一次下，因為下一行是空白，所以會跳到 block 的最前面。

再按一次下的時候，則又會跳回原本的位置。想必這個 x 參數雖然在空白行的時候跳到了第一個位置，但並沒有更新這個數字，所以下次遇到又有足夠的位置可以跳的時候，會再恢復的原本的位置。

以上就是你在一個編輯器中按了三個「下」在 QT 裡面到底發生了什麼事情 :D

推薦大家可以讀一下 QT 的 [Rich Text Processing](http://doc.qt.io/qt-4.8/richtext.html) 寫得很清楚，配合閱讀一下程式碼還蠻容易理解的！
